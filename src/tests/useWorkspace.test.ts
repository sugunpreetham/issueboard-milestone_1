import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWorkspace } from '../hooks/useWorkspace';

describe('useWorkspace Hook', () => {
  it('initializes with default workspace list', () => {
    const { result } = renderHook(() => useWorkspace());
    expect(result.current.workspaces.length).toBeGreaterThan(0);
    expect(result.current.activeWorkspace.slug).toBe('eng-workspace');
  });

  it('switches active workspace correctly', () => {
    const { result } = renderHook(() => useWorkspace());

    act(() => {
      result.current.setActiveWorkspaceId('ws-design');
    });

    expect(result.current.activeWorkspaceId).toBe('ws-design');
    expect(result.current.activeWorkspace.name).toBe('Product & Design Org');
  });

  it('calculates storage quota usage metrics', () => {
    const { result } = renderHook(() => useWorkspace());
    const metrics = result.current.getUsageMetrics('ws-sec');

    expect(metrics.storagePercentage).toBeGreaterThanOrEqual(80);
    expect(metrics.isStorageNearLimit).toBe(true);
  });

  it('creates new workspace with valid slug and limits', () => {
    const { result } = renderHook(() => useWorkspace());

    let createRes: any;
    act(() => {
      createRes = result.current.createWorkspace('Mobile Team', 'mobile-team', 'team');
    });

    expect(createRes.success).toBe(true);
    expect(result.current.workspaces.some((w) => w.slug === 'mobile-team')).toBe(true);
  });

  it('rejects duplicate workspace slug creation', () => {
    const { result } = renderHook(() => useWorkspace());

    let createRes: any;
    act(() => {
      createRes = result.current.createWorkspace('Duplicate Eng', 'eng-workspace', 'team');
    });

    expect(createRes.success).toBe(false);
    expect(createRes.error).toContain('already taken');
  });
});
