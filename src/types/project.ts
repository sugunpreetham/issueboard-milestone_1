export type ProjectStatus = 'active' | 'archived' | 'on_hold';

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'lead' | 'maintainer' | 'contributor' | 'viewer';
  avatarUrl?: string;
}

export interface ProjectSettings {
  defaultAssigneeId?: string | null;
  allowSubtasks: boolean;
  enforceEstimates: boolean;
  defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
  targetVelocityPoints: number;
}

export interface Project {
  id: string;
  key: string; // e.g. 'CORE', 'INFRA', 'UI', 'SEC'
  name: string;
  description: string;
  status: ProjectStatus;
  leadId: string;
  members: ProjectMember[];
  repositoryUrl?: string;
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
}

export interface ProjectMetrics {
  totalIssues: number;
  openIssues: number;
  completedIssues: number;
  completionPercentage: number;
  activeMilestonesCount: number;
  teamVelocity: number;
  healthScore: 'excellent' | 'good' | 'warning' | 'critical';
}
