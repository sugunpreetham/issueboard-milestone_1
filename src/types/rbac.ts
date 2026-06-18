export type UserRole = 'owner' | 'admin' | 'maintainer' | 'contributor' | 'viewer';

export type Permission =
  | 'issue:create'
  | 'issue:edit'
  | 'issue:delete'
  | 'issue:bulk_action'
  | 'comment:create'
  | 'comment:delete_any'
  | 'project:create'
  | 'project:settings'
  | 'workflow:configure'
  | 'data:export'
  | 'audit:view';

export interface RoleDefinition {
  role: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
}
