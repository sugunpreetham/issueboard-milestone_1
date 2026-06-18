import { describe, it, expect } from 'vitest';
import { hasPermission, hasAllPermissions, hasAnyPermission } from '../utils/rbacEngine';

describe('RBAC & Permission Evaluator Engine', () => {
  it('allows owner and admin full administrative permissions', () => {
    expect(hasPermission('owner', 'project:settings')).toBe(true);
    expect(hasPermission('admin', 'audit:view')).toBe(true);
  });

  it('restricts viewer from mutating issues or creating comments', () => {
    expect(hasPermission('viewer', 'issue:create')).toBe(false);
    expect(hasPermission('viewer', 'comment:create')).toBe(false);
    expect(hasPermission('viewer', 'data:export')).toBe(false);
  });

  it('allows contributor standard creation but disallows project administration', () => {
    expect(hasPermission('contributor', 'issue:create')).toBe(true);
    expect(hasPermission('contributor', 'project:settings')).toBe(false);
    expect(hasPermission('contributor', 'audit:view')).toBe(false);
  });

  it('evaluates multi-permission checks correctly', () => {
    expect(hasAllPermissions('maintainer', ['issue:create', 'data:export'])).toBe(true);
    expect(hasAllPermissions('contributor', ['issue:create', 'data:export'])).toBe(false);
    expect(hasAnyPermission('contributor', ['project:settings', 'issue:create'])).toBe(true);
  });
});
