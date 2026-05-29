export interface MarkdownToken {
  type: 'text' | 'bold' | 'italic' | 'code' | 'codeblock' | 'link' | 'issue_link' | 'task_item' | 'blockquote' | 'heading';
  content: string;
  href?: string;
  checked?: boolean;
  level?: number;
  language?: string;
}

/**
 * Escapes unsafe HTML characters to prevent XSS injection.
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Parses markdown text into structural tokens.
 */
export function parseMarkdownTokens(markdown: string): MarkdownToken[] {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const tokens: MarkdownToken[] = [];
  let insideCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.startsWith('```')) {
      if (insideCodeBlock) {
        tokens.push({
          type: 'codeblock',
          content: codeBlockBuffer.join('\n'),
          language: codeBlockLang || 'text',
        });
        insideCodeBlock = false;
        codeBlockBuffer = [];
        codeBlockLang = '';
      } else {
        insideCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
      }
      continue;
    }

    if (insideCodeBlock) {
      codeBlockBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    // Headings
    if (trimmed.startsWith('### ')) {
      tokens.push({ type: 'heading', level: 3, content: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      tokens.push({ type: 'heading', level: 2, content: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith('# ')) {
      tokens.push({ type: 'heading', level: 1, content: trimmed.slice(2) });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      tokens.push({ type: 'blockquote', content: trimmed.slice(2) });
      continue;
    }

    // Task list checkbox
    if (/^-\s*\[([ xX])\]\s+(.*)/.test(trimmed)) {
      const match = trimmed.match(/^-\s*\[([ xX])\]\s+(.*)/);
      if (match) {
        tokens.push({
          type: 'task_item',
          checked: match[1].toLowerCase() === 'x',
          content: match[2],
        });
        continue;
      }
    }

    // Standard paragraph with inline formatting
    tokens.push({ type: 'text', content: line });
  }

  return tokens;
}

/**
 * Replaces issue keys (e.g. ISSUE-101) with clickable references.
 */
export function linkifyIssueKeys(text: string): string {
  return text.replace(
    /\b(ISSUE-\d+)\b/g,
    '<span class="issue-ref-link" data-issue-id="$1">$1</span>'
  );
}
