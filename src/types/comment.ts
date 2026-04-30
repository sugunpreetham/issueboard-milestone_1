export interface CommentReaction {
  emoji: string; // e.g. '👍', '❤️', '🚀', '👀', '🎉'
  count: number;
  userIds: string[];
}

export interface IssueComment {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string; // Markdown formatted text
  createdAt: string;
  updatedAt?: string;
  mentions: string[]; // List of @usernames mentioned
  reactions: CommentReaction[];
  isEdited?: boolean;
}

export interface CommentDraft {
  content: string;
}
