import { IssueComment } from '../types/comment';

export const INITIAL_COMMENTS: IssueComment[] = [
  {
    id: 'comm-1',
    issueId: 'ISSUE-101',
    authorId: 'user-sarah',
    authorName: 'Sarah Chen',
    content: 'Investigated the OAuth2 token refresh race condition. We need to implement a mutex lock around the refresh endpoint to prevent duplicate token invalidation when multiple requests fire simultaneously.',
    createdAt: '2026-08-20T10:15:00Z',
    mentions: ['alex.rivera'],
    reactions: [
      { emoji: '👍', count: 3, userIds: ['user-alex', 'user-david', 'user-elena'] },
      { emoji: '🚀', count: 1, userIds: ['user-alex'] },
    ],
  },
  {
    id: 'comm-2',
    issueId: 'ISSUE-101',
    authorId: 'user-alex',
    authorName: 'Alex Rivera',
    content: 'Agreed. @sarah.chen I have created a reproduction test case in the auth suite that triggers the 401 error consistently.',
    createdAt: '2026-08-20T11:45:00Z',
    mentions: ['sarah.chen'],
    reactions: [
      { emoji: '🎉', count: 2, userIds: ['user-sarah', 'user-david'] },
    ],
  },
  {
    id: 'comm-3',
    issueId: 'ISSUE-102',
    authorId: 'user-elena',
    authorName: 'Elena Rostova',
    content: 'For the CSV export functionality, let us ensure we stream the records in chunks of 500 so client memory stays flat even on 10,000+ issue exports.',
    createdAt: '2026-08-21T14:20:00Z',
    mentions: ['david.kim'],
    reactions: [
      { emoji: '👀', count: 2, userIds: ['user-david', 'user-sarah'] },
    ],
  },
  {
    id: 'comm-4',
    issueId: 'ISSUE-104',
    authorId: 'user-david',
    authorName: 'David Kim',
    content: 'Memory leak in real-time WebSocket connection listener has been traced to uncleaned event listeners during component unmount. PR is drafted.',
    createdAt: '2026-08-22T09:00:00Z',
    mentions: ['sarah.chen', 'alex.rivera'],
    reactions: [
      { emoji: '❤️', count: 4, userIds: ['user-sarah', 'user-alex', 'user-elena', 'user-david'] },
    ],
  },
];
