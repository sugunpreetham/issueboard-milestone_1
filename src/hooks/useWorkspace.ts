import { useState, useCallback, useMemo } from 'react';
import { Workspace, WorkspaceUsageMetrics } from '../types/workspace';
import { INITIAL_WORKSPACES } from '../data/mockWorkspaces';

export interface UseWorkspaceResult {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  getUsageMetrics: (workspaceId?: string) => WorkspaceUsageMetrics;
  createWorkspace: (name: string, slug: string, tier?: Workspace['tier']) => {
    success: boolean;
    workspace?: Workspace;
    error?: string;
  };
}

export function useWorkspace(
  initialWorkspaces: Workspace[] = INITIAL_WORKSPACES
): UseWorkspaceResult {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(
    initialWorkspaces[0]?.id || 'ws-eng'
  );

  const activeWorkspace = useMemo(() => {
    return workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  }, [workspaces, activeWorkspaceId]);

  const getUsageMetrics = useCallback(
    (workspaceId?: string): WorkspaceUsageMetrics => {
      const target = workspaceId ? workspaces.find((w) => w.id === workspaceId) : activeWorkspace;
      if (!target) {
        return {
          storagePercentage: 0,
          isStorageNearLimit: false,
          memberCount: 0,
          projectCount: 0,
        };
      }

      const ratio = target.limits.storageUsedBytes / target.limits.storageQuotaBytes;
      const storagePercentage = Math.round(ratio * 100);

      return {
        storagePercentage,
        isStorageNearLimit: storagePercentage >= 80,
        memberCount: Math.round(target.limits.maxMembers * 0.4),
        projectCount: Math.round(target.limits.maxProjects * 0.5),
      };
    },
    [workspaces, activeWorkspace]
  );

  const createWorkspace = useCallback(
    (name: string, slug: string, tier: Workspace['tier'] = 'team') => {
      const trimmedName = name.trim();
      const trimmedSlug = slug.trim().toLowerCase();

      if (!trimmedName || trimmedName.length < 3) {
        return { success: false, error: 'Workspace name must be at least 3 characters.' };
      }
      if (!trimmedSlug || !/^[a-z0-9-]+$/.test(trimmedSlug)) {
        return { success: false, error: 'Slug must contain only lowercase alphanumeric characters and hyphens.' };
      }
      if (workspaces.some((w) => w.slug === trimmedSlug)) {
        return { success: false, error: `Workspace slug "${trimmedSlug}" is already taken.` };
      }

      const newWs: Workspace = {
        id: `ws-${Date.now()}`,
        name: trimmedName,
        slug: trimmedSlug,
        tier,
        ownerId: 'current-user',
        createdAt: new Date().toISOString(),
        limits: {
          maxMembers: tier === 'enterprise' ? 50 : 15,
          maxProjects: tier === 'enterprise' ? 20 : 5,
          storageQuotaBytes: (tier === 'enterprise' ? 10 : 2) * 1024 * 1024 * 1024,
          storageUsedBytes: 0,
          allowCustomWorkflows: tier === 'enterprise',
          allowAuditLogs: tier === 'enterprise',
        },
      };

      setWorkspaces((prev) => [...prev, newWs]);
      setActiveWorkspaceId(newWs.id);
      return { success: true, workspace: newWs };
    },
    [workspaces]
  );

  return {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspaceId,
    getUsageMetrics,
    createWorkspace,
  };
}
