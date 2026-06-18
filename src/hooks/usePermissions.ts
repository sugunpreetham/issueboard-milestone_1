import { useState, useCallback } from 'react';
import { UserRole, Permission } from '../types/rbac';
import { hasPermission, hasAllPermissions, hasAnyPermission, ROLE_DEFINITIONS } from '../utils/rbacEngine';

export interface UsePermissionsResult {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  can: (permission: Permission) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  roleDetails: typeof ROLE_DEFINITIONS[UserRole];
}

export function usePermissions(initialRole: UserRole = 'maintainer'): UsePermissionsResult {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);

  const can = useCallback((perm: Permission) => hasPermission(currentRole, perm), [currentRole]);
  const canAll = useCallback((perms: Permission[]) => hasAllPermissions(currentRole, perms), [currentRole]);
  const canAny = useCallback((perms: Permission[]) => hasAnyPermission(currentRole, perms), [currentRole]);

  return {
    currentRole,
    setCurrentRole,
    can,
    canAll,
    canAny,
    roleDetails: ROLE_DEFINITIONS[currentRole],
  };
}
