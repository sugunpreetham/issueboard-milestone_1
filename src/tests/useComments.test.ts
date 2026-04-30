import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useComments } from '../hooks/useComments';

describe('useComments Hook', () => {
  it('retrieves discussion comments for an issue', () => {
    const { result } = renderHook(() => useComments());
    const comments = result.current.getCommentsForIssue('ISSUE-101');
    expect(comments.length).toBeGreaterThan(0);
  });

  it('adds a new comment and parses user mentions', () => {
    const { result } = renderHook(() => useComments());

    let addRes: any;
    act(() => {
      addRes = result.current.addComment(
        'ISSUE-101',
        'Sarah Chen',
        'user-sarah',
        'Hey @alex.rivera check this fix!'
      );
    });

    expect(addRes.success).toBe(true);
    expect(addRes.comment.mentions).toEqual(['alex.rivera']);

    const issueComments = result.current.getCommentsForIssue('ISSUE-101');
    expect(issueComments.some((c) => c.content.includes('Hey @alex.rivera'))).toBe(true);
  });

  it('toggles emoji reactions on comments', () => {
    const { result } = renderHook(() => useComments());
    const initialComments = result.current.getCommentsForIssue('ISSUE-101');
    const targetCommentId = initialComments[0].id;

    act(() => {
      result.current.toggleReaction(targetCommentId, '🚀', 'user-test');
    });

    const updated = result.current.getCommentsForIssue('ISSUE-101');
    const comment = updated.find((c) => c.id === targetCommentId);
    const reaction = comment?.reactions.find((r) => r.emoji === '🚀');
    expect(reaction?.userIds).toContain('user-test');
  });
});
