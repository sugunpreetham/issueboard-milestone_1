import React, { useState } from 'react';
import { Icon } from '../common/Icon';

export interface CommentEditorProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  initialValue?: string;
  onCancel?: () => void;
  submitLabel?: string;
}

export const CommentEditor: React.FC<CommentEditorProps> = ({
  onSubmit,
  placeholder = 'Add a comment... (supports Markdown and @mentions)',
  initialValue = '',
  onCancel,
  submitLabel = 'Comment',
}) => {
  const [content, setContent] = useState(initialValue);
  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
    setIsPreview(false);
  };

  return (
    <form className="comment-editor" onSubmit={handleSubmit}>
      <div className="comment-editor-tabs">
        <button
          type="button"
          className={`tab-btn ${!isPreview ? 'active' : ''}`}
          onClick={() => setIsPreview(false)}
        >
          Write
        </button>
        <button
          type="button"
          className={`tab-btn ${isPreview ? 'active' : ''}`}
          onClick={() => setIsPreview(true)}
        >
          Preview
        </button>
      </div>

      <div className="comment-editor-body">
        {isPreview ? (
          <div className="comment-preview-area">
            {content ? (
              <p className="preview-text">{content}</p>
            ) : (
              <span className="text-muted">Nothing to preview.</span>
            )}
          </div>
        ) : (
          <textarea
            className="comment-textarea"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            aria-label="Comment text"
          />
        )}
      </div>

      <div className="comment-editor-actions">
        <div className="editor-shortcuts-hint text-xs text-muted">
          <Icon name="tag" size={12} /> Markdown and @mentions supported
        </div>

        <div className="editor-buttons-right">
          {onCancel && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={!content.trim()}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
};
