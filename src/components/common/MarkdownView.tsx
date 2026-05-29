import React from 'react';
import { parseMarkdownTokens, MarkdownToken } from '../../utils/markdownRenderer';

export interface MarkdownViewProps {
  content: string;
  className?: string;
  onIssueClick?: (issueId: string) => void;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  content,
  className = '',
  onIssueClick,
}) => {
  const tokens = parseMarkdownTokens(content);

  const renderInline = (text: string) => {
    // Regex for bold **text**, code `text`, and issue references ISSUE-101
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\bISSUE-\d+\b)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="inline-code">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      if (/^ISSUE-\d+$/.test(part)) {
        return (
          <button
            key={idx}
            type="button"
            className="issue-inline-link"
            onClick={() => onIssueClick && onIssueClick(part)}
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  const renderToken = (token: MarkdownToken, idx: number) => {
    switch (token.type) {
      case 'heading': {
        const Tag = (`h${token.level || 3}` as keyof JSX.IntrinsicElements);
        return <Tag key={idx} className="markdown-heading">{token.content}</Tag>;
      }
      case 'blockquote':
        return (
          <blockquote key={idx} className="markdown-quote">
            {renderInline(token.content)}
          </blockquote>
        );
      case 'codeblock':
        return (
          <pre key={idx} className="markdown-codeblock">
            <code>{token.content}</code>
          </pre>
        );
      case 'task_item':
        return (
          <div key={idx} className="markdown-task-item">
            <input
              type="checkbox"
              readOnly
              checked={token.checked || false}
              className="task-checkbox"
            />
            <span className={token.checked ? 'task-done' : ''}>
              {renderInline(token.content)}
            </span>
          </div>
        );
      case 'text':
      default:
        return <p key={idx} className="markdown-p">{renderInline(token.content)}</p>;
    }
  };

  return (
    <div className={`markdown-view ${className}`} role="region" aria-label="Formatted description">
      {tokens.map(renderToken)}
    </div>
  );
};
