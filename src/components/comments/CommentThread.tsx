import React from 'react';
import { IssueComment } from '../../types/comment';
import { Avatar } from '../common/Avatar';
import { CommentEditor } from './CommentEditor';
import { Icon } from '../common/Icon';

export interface CommentThreadProps {
  comments: IssueComment[];
  currentUserId: string;
  onAddComment: (content: string) => void;
  onToggleReaction: (commentId: string, emoji: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '🚀', '👀', '🎉'];

export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  currentUserId,
  onAddComment,
  onToggleReaction,
  onDeleteComment,
}) => {
  return (
    <div className="comment-thread-wrapper">
      <h4 className="section-subheading">
        <Icon name="user" size={14} /> Discussion ({comments.length})
      </h4>

      <div className="comment-list" aria-label="Issue comments">
        {comments.map((comment) => {
          const isAuthor = comment.authorId === currentUserId;

          return (
            <div key={comment.id} className="comment-item" data-testid={`comment-${comment.id}`}>
              <div className="comment-avatar-col">
                <Avatar name={comment.authorName} size="sm" src={comment.authorAvatar} />
              </div>

              <div className="comment-content-box">
                <div className="comment-header-row">
                  <span className="comment-author-name">{comment.authorName}</span>
                  <span className="comment-timestamp text-xs text-muted">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {comment.isEdited && (
                    <span className="comment-edited-tag text-xs text-muted">(edited)</span>
                  )}

                  {isAuthor && onDeleteComment && (
                    <button
                      type="button"
                      className="btn-icon btn-delete-comment"
                      onClick={() => onDeleteComment(comment.id)}
                      title="Delete comment"
                      aria-label="Delete comment"
                    >
                      <Icon name="x" size={12} />
                    </button>
                  )}
                </div>

                <div className="comment-body-text">
                  <p>{comment.content}</p>
                </div>

                {comment.mentions.length > 0 && (
                  <div className="comment-mentions-row">
                    {comment.mentions.map((m) => (
                      <span key={m} className="mention-tag">
                        @{m}
                      </span>
                    ))}
                  </div>
                )}

                <div className="comment-reactions-row">
                  {comment.reactions.map((r) => {
                    const hasReacted = r.userIds.includes(currentUserId);
                    return (
                      <button
                        key={r.emoji}
                        type="button"
                        className={`reaction-pill ${hasReacted ? 'active' : ''}`}
                        onClick={() => onToggleReaction(comment.id, r.emoji)}
                      >
                        <span>{r.emoji}</span>
                        <span className="reaction-count">{r.count}</span>
                      </button>
                    );
                  })}

                  <div className="emoji-picker-inline">
                    {COMMON_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="btn-add-emoji"
                        onClick={() => onToggleReaction(comment.id, emoji)}
                        title={`React with ${emoji}`}
                        aria-label={`React with ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="new-comment-section">
        <CommentEditor onSubmit={onAddComment} />
      </div>
    </div>
  );
};
