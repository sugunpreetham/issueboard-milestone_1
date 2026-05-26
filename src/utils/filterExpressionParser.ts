import { ASTNode, ASTFieldNode, ASTTextNode, ASTLogicalNode, ParseResult } from '../types/queryAST';
import { Issue } from '../types/issue';

/**
 * Tokenizes raw search query into tokens preserving quoted strings and parentheses.
 */
export function tokenizeQuery(query: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < query.length; i++) {
    const char = query[i];

    if (char === '"' || char === "'") {
      insideQuotes = !insideQuotes;
      current += char;
    } else if (insideQuotes) {
      current += char;
    } else if (char === '(' || char === ')') {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
      tokens.push(char);
    } else if (/\s/.test(char)) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens;
}

/**
 * Parses tokenized search query into an AST.
 */
export function parseFilterExpression(query: string): ParseResult {
  const tokens = tokenizeQuery(query.trim());
  if (tokens.length === 0) {
    return { success: true, errors: [] };
  }

  const errors: string[] = [];

  // Check balanced parentheses
  let parenDepth = 0;
  for (const token of tokens) {
    if (token === '(') parenDepth++;
    if (token === ')') parenDepth--;
    if (parenDepth < 0) {
      errors.push('Unexpected closing parenthesis ")"');
      break;
    }
  }
  if (parenDepth > 0) {
    errors.push('Unclosed opening parenthesis "("');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  try {
    const ast = buildAST(tokens);
    return { success: true, ast, errors: [] };
  } catch (err) {
    return { success: false, errors: [(err as Error).message] };
  }
}

function buildAST(tokens: string[]): ASTNode {
  // Split on top-level OR first (lowest precedence)
  const orGroups: string[][] = [];
  let currentGroup: string[] = [];
  let depth = 0;

  for (const token of tokens) {
    if (token === '(') depth++;
    if (token === ')') depth--;

    if (depth === 0 && token.toUpperCase() === 'OR') {
      orGroups.push(currentGroup);
      currentGroup = [];
    } else {
      currentGroup.push(token);
    }
  }
  orGroups.push(currentGroup);

  if (orGroups.length > 1) {
    return {
      type: 'OR',
      children: orGroups.filter((g) => g.length > 0).map(buildAST),
    };
  }

  // Split on top-level AND (medium precedence)
  const andGroups: string[][] = [];
  let currentAndGroup: string[] = [];
  depth = 0;

  for (const token of tokens) {
    if (token === '(') depth++;
    if (token === ')') depth--;

    if (depth === 0 && token.toUpperCase() === 'AND') {
      andGroups.push(currentAndGroup);
      currentAndGroup = [];
    } else {
      currentAndGroup.push(token);
    }
  }
  andGroups.push(currentAndGroup);

  if (andGroups.length > 1) {
    return {
      type: 'AND',
      children: andGroups.filter((g) => g.length > 0).map(buildAST),
    };
  }

  // Handle parenthesized expression
  if (tokens.length >= 2 && tokens[0] === '(' && tokens[tokens.length - 1] === ')') {
    return buildAST(tokens.slice(1, -1));
  }

  // Handle NOT prefix
  if (tokens.length >= 2 && tokens[0].toUpperCase() === 'NOT') {
    return {
      type: 'NOT',
      children: [buildAST(tokens.slice(1))],
    };
  }

  // Leaf nodes: parse individual tokens as text search or field:value
  const leafNodes: ASTNode[] = tokens.map((token) => {
    const isNegated = token.startsWith('-');
    const cleanToken = isNegated ? token.slice(1) : token;

    if (cleanToken.includes(':')) {
      const [field, ...valParts] = cleanToken.split(':');
      let value = valParts.join(':');
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      const node: ASTFieldNode = {
        type: 'FIELD_EQUALS',
        field: field.toLowerCase(),
        value,
        negated: isNegated,
      };
      return node;
    }

    let textVal = cleanToken;
    if (
      (textVal.startsWith('"') && textVal.endsWith('"')) ||
      (textVal.startsWith("'") && textVal.endsWith("'"))
    ) {
      textVal = textVal.slice(1, -1);
    }

    const textNode: ASTTextNode = {
      type: 'TEXT_SEARCH',
      value: textVal,
      negated: isNegated,
    };
    return textNode;
  });

  if (leafNodes.length === 1) {
    return leafNodes[0];
  }

  return {
    type: 'AND',
    children: leafNodes,
  };
}

/**
 * Evaluates an AST against an Issue object.
 */
export function evaluateAST(ast: ASTNode, issue: Issue): boolean {
  switch (ast.type) {
    case 'AND':
      return (ast as ASTLogicalNode).children.every((child) => evaluateAST(child, issue));

    case 'OR':
      return (ast as ASTLogicalNode).children.some((child) => evaluateAST(child, issue));

    case 'NOT':
      return !(ast as ASTLogicalNode).children.some((child) => evaluateAST(child, issue));

    case 'FIELD_EQUALS':
    case 'FIELD_CONTAINS': {
      const fieldNode = ast as ASTFieldNode;
      const targetField = fieldNode.field.toLowerCase();
      const expectedVal = fieldNode.value.toLowerCase();
      let match = false;

      if (targetField === 'status') {
        match = issue.status.toLowerCase() === expectedVal;
      } else if (targetField === 'priority') {
        match = issue.priority.toLowerCase() === expectedVal;
      } else if (targetField === 'id') {
        match = issue.id.toLowerCase().includes(expectedVal);
      } else if (targetField === 'assignee') {
        match = Boolean(issue.assignee && issue.assignee.name.toLowerCase().includes(expectedVal));
      } else if (targetField === 'label' || targetField === 'tag') {
        match = issue.labels.some((l) => l.toLowerCase().includes(expectedVal));
      } else {
        match =
          issue.title.toLowerCase().includes(expectedVal) ||
          issue.description.toLowerCase().includes(expectedVal);
      }

      return fieldNode.negated ? !match : match;
    }

    case 'TEXT_SEARCH': {
      const textNode = ast as ASTTextNode;
      const val = textNode.value.toLowerCase();
      const match =
        issue.title.toLowerCase().includes(val) ||
        issue.description.toLowerCase().includes(val) ||
        issue.id.toLowerCase().includes(val);

      return textNode.negated ? !match : match;
    }

    default:
      return true;
  }
}
