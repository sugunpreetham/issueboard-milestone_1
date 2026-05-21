export type WorkspaceTier = 'free' | 'team' | 'enterprise';

export interface WorkspaceLimits {
  maxMembers: number;
  maxProjects: number;
  storageQuotaBytes: number;
  storageUsedBytes: number;
  allowCustomWorkflows: boolean;
  allowAuditLogs: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  tier: WorkspaceTier;
  avatarUrl?: string;
  ownerId: string;
  createdAt: string;
  limits: WorkspaceLimits;
}

export interface WorkspaceUsageMetrics {
  storagePercentage: number;
  isStorageNearLimit: boolean;
  memberCount: number;
  projectCount: number;
}
