import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProjects } from '../hooks/useProjects';

describe('useProjects Hook', () => {
  it('initializes with default mock projects', () => {
    const { result } = renderHook(() => useProjects());
    expect(result.current.projects.length).toBeGreaterThan(0);
    expect(result.current.activeProject).toBeDefined();
  });

  it('switches active project workspace', () => {
    const { result } = renderHook(() => useProjects());
    const secondProj = result.current.projects[1];

    act(() => {
      result.current.setActiveProjectId(secondProj.id);
    });

    expect(result.current.activeProjectId).toBe(secondProj.id);
    expect(result.current.activeProject.id).toBe(secondProj.id);
  });

  it('creates new project with validation', () => {
    const { result } = renderHook(() => useProjects());

    let createRes!: ReturnType<typeof result.current.createProject>;
    act(() => {
      createRes = result.current.createProject({
        name: 'New Mobile App',
        key: 'MOBI',
        description: 'React Native mobile client',
        status: 'active',
        leadId: 'user-elena',
        members: [],
        settings: {
          allowSubtasks: true,
          enforceEstimates: true,
          defaultPriority: 'medium',
          targetVelocityPoints: 20,
        },
      });
    });

    expect(createRes.success).toBe(true);
    expect(result.current.projects.some((p) => p.key === 'MOBI')).toBe(true);
  });

  it('rejects duplicate project key creation', () => {
    const { result } = renderHook(() => useProjects());

    let createRes!: ReturnType<typeof result.current.createProject>;
    act(() => {
      createRes = result.current.createProject({
        name: 'Duplicate Core',
        key: 'CORE',
        description: 'Duplicate',
        status: 'active',
        leadId: 'user-sarah',
        members: [],
        settings: {
          allowSubtasks: true,
          enforceEstimates: true,
          defaultPriority: 'medium',
          targetVelocityPoints: 20,
        },
      });
    });

    expect(createRes.success).toBe(false);
    expect(createRes.errors![0]).toContain('already exists');
  });
});
