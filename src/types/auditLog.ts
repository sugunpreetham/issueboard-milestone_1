export type AuditSeverity = 'info' | 'warning' | 'security_alert' | 'critical';
export type AuditCategory =
  | 'auth'
  | 'issue_mutation'
  | 'project_config'
  | 'workflow_transition'
  | 'data_export'
  | 'permission_change';

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  category: AuditCategory;
  action: string;
  severity: AuditSeverity;
  targetId?: string;
  targetType?: string;
  ipAddress?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  previousHash?: string;
  hash: string;
}

export interface AuditQueryFilter {
  category?: AuditCategory | 'all';
  severity?: AuditSeverity | 'all';
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}
