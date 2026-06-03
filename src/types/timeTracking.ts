export interface WorklogEntry {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  timeSpentMinutes: number;
  description: string;
  loggedAt: string;
  billable: boolean;
}

export interface TimeTrackingSummary {
  originalEstimateMinutes: number;
  totalSpentMinutes: number;
  remainingMinutes: number;
  percentSpent: number;
  isOverBudget: boolean;
  entriesCount: number;
}
