export type ASTNodeType = 'AND' | 'OR' | 'NOT' | 'FIELD_EQUALS' | 'FIELD_CONTAINS' | 'TEXT_SEARCH';

export interface ASTFieldNode {
  type: 'FIELD_EQUALS' | 'FIELD_CONTAINS';
  field: string;
  value: string;
  negated?: boolean;
}

export interface ASTTextNode {
  type: 'TEXT_SEARCH';
  value: string;
  negated?: boolean;
}

export interface ASTLogicalNode {
  type: 'AND' | 'OR' | 'NOT';
  children: ASTNode[];
}

export type ASTNode = ASTFieldNode | ASTTextNode | ASTLogicalNode;

export interface ParseResult {
  success: boolean;
  ast?: ASTNode;
  errors: string[];
}
