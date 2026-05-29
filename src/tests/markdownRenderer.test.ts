import { describe, it, expect } from 'vitest';
import {
  parseMarkdownTokens,
  sanitizeText,
  linkifyIssueKeys,
} from '../utils/markdownRenderer';

describe('Markdown Renderer & Linkifier', () => {
  it('sanitizes unsafe HTML characters', () => {
    const raw = '<script>alert("xss")</script>';
    const sanitized = sanitizeText(raw);
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('parses headings with correct hierarchy levels', () => {
    const md = '# Title\n## Subtitle\n### Section';
    const tokens = parseMarkdownTokens(md);

    expect(tokens).toEqual([
      { type: 'heading', level: 1, content: 'Title' },
      { type: 'heading', level: 2, content: 'Subtitle' },
      { type: 'heading', level: 3, content: 'Section' },
    ]);
  });

  it('parses fenced code blocks with language specification', () => {
    const md = '```typescript\nconst x: number = 42;\n```';
    const tokens = parseMarkdownTokens(md);

    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('codeblock');
    expect(tokens[0].language).toBe('typescript');
    expect(tokens[0].content).toBe('const x: number = 42;');
  });

  it('parses task list checklist items', () => {
    const md = '- [x] Write unit tests\n- [ ] Deploy to staging';
    const tokens = parseMarkdownTokens(md);

    expect(tokens).toEqual([
      { type: 'task_item', checked: true, content: 'Write unit tests' },
      { type: 'task_item', checked: false, content: 'Deploy to staging' },
    ]);
  });

  it('linkifies issue keys into clickable spans', () => {
    const text = 'Related to ISSUE-101 and blocked by ISSUE-205.';
    const output = linkifyIssueKeys(text);

    expect(output).toContain('data-issue-id="ISSUE-101"');
    expect(output).toContain('data-issue-id="ISSUE-205"');
  });
});
