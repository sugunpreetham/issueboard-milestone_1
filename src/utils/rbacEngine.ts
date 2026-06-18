import { UserRole, Permission, RoleDefinition } from '../types/rbac';

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  owner: {
    role: 'owner',
    name: 'Organization Owner',
    description: 'Full unrestricted system administration rights',
    permissions: [
      'issue:create',
      'issue:edit',
      'issue:delete',
      'issue:bulk_action',
      'comment:create',
      'comment:delete_any',
      'project:create',
      'project:settings',
      'workflow:configure',
      'data:export',
      'audit:view',
    ],
  },
  admin: {
    role: 'admin',
    name: 'Workspace Admin',
    description: 'Project configuration and member management',
    permissions: [
      'issue:create',
      'issue:edit',
      'issue:delete',
      'issue:bulk_action',
      'comment:create',
      'comment:delete_any',
      'project:create',
      'project:settings',
      'workflow:configure',
      'data:export',
      'audit:view',
    ],
  },
  maintainer: {
    role: 'maintainer',
    name: 'Project Maintainer',
    description: 'Can manage issues, workflows, and exports',
    permissions: [
      'issue:create',
      'issue:edit',
      'issue:delete',
      'issue:bulk_action',
      'comment:create',
      'workflow:configure',
      'data:export',
    ],
  },
  contributor: {
    role: 'contributor',
    name: 'Team Contributor',
    description: 'Standard issue creation, comments, and status updates',
    permissions: ['issue:create', 'issue:edit', 'comment:create'],
  },
  viewer: {
    role: 'viewer',
    name: 'Read-Only Viewer',
    description: 'Can only view issues and activity stream',
    permissions: [],
  },
};

/**
 * Evaluates whether a role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const def = ROLE_DEFINITIONS[role];
  if (!def) return false;
  return def.permissions.includes(permission);
}

/**
 * Checks if a user has all required permissions.
 */
export function hasAllPermissions(role: UserRole, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every((perm) => hasPermission(role, perm));
}

/**
 * Checks if a user has at least one of the listed permissions.
 */
export function hasAnyPermission(role: UserRole, requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some((perm) => hasPermission(role, perm));
}
