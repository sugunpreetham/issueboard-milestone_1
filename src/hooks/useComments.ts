import { useState, useCallback } from 'react';
import { IssueComment } from '../types/comment';
import { INITIAL_COMMENTS } from '../data/mockComments';

export interface UseCommentsResult {
  comments: IssueComment[];
  getCommentsForIssue: (issueId: string) => IssueComment[];
  addComment: (
    issueId: string,
    authorName: string,
    authorId: string,
    content: string
  ) => { success: boolean; comment?: IssueComment; error?: string };
  updateComment: (
    id: string,
    content: string
  ) => { success: boolean; comment?: IssueComment; error?: string };
  deleteComment: (id: string) => boolean;
  toggleReaction: (commentId: string, emoji: string, userId: string) => void;
}

/**
 * Extracts @mentions from markdown content.
 */
function extractMentions(text: string): string[] {
  const matches = text.match(/@([a-zA-Z0-9._-]+)/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((m) => m.substring(1))));
}

export function useComments(initialComments: IssueComment[] = INITIAL_COMMENTS): UseCommentsResult {
  const [comments, setComments] = useState<IssueComment[]>(initialComments);

  const getCommentsForIssue = useCallback(
    (issueId: string) => {
      return comments
        .filter((c) => c.issueId === issueId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    },
    [comments]
  );

  const addComment = useCallback(
    (issueId: string, authorName: string, authorId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) {
        return { success: false, error: 'Comment content cannot be empty.' };
      }

      const mentions = extractMentions(trimmed);
      const now = new Date().toISOString();

      const newComment: IssueComment = {
        id: `comm-${Date.now()}`,
        issueId,
        authorId,
        authorName,
        content: trimmed,
        createdAt: now,
        mentions,
        reactions: [],
      };

      setComments((prev) => [...prev, newComment]);
      return { success: true, comment: newComment };
    },
    []
  );

  const updateComment = useCallback((id: string, content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return { success: false, error: 'Comment content cannot be empty.' };
    }

    const mentions = extractMentions(trimmed);
    let updated: IssueComment | undefined;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        updated = {
          ...c,
          content: trimmed,
          mentions,
          isEdited: true,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      })
    );

    if (!updated) return { success: false, error: 'Comment not found.' };
    return { success: true, comment: updated };
  }, []);

  const deleteComment = useCallback((id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    return true;
  }, []);

  const toggleReaction = useCallback((commentId: string, emoji: string, userId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;

        const existingReaction = c.reactions.find((r) => r.emoji === emoji);
        let nextReactions = [...c.reactions];

        if (existingReaction) {
          if (existingReaction.userIds.includes(userId)) {
            // Remove user reaction
            const newUserIds = existingReaction.userIds.filter((u) => u !== userId);
            if (newUserIds.length === 0) {
              nextReactions = nextReactions.filter((r) => r.emoji !== emoji);
            } else {
              nextReactions = nextReactions.map((r) =>
                r.emoji === emoji ? { ...r, count: newUserIds.length, userIds: newUserIds } : r
              );
            }
          } else {
            // Add user to reaction
            const newUserIds = [...existingReaction.userIds, userId];
            nextReactions = nextReactions.map((r) =>
              r.emoji === emoji ? { ...r, count: newUserIds.length, userIds: newUserIds } : r
            );
          }
        } else {
          // New reaction
          nextReactions.push({ emoji, count: 1, userIds: [userId] });
        }

        return { ...c, reactions: nextReactions };
      })
    );
  }, []);

  return {
    comments,
    getCommentsForIssue,
    addComment,
    updateComment,
    deleteComment,
    toggleReaction,
  };
}
