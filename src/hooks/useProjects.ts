import { useState, useCallback, useMemo } from 'react';
import { Project, ProjectMetrics } from '../types/project';
import { INITIAL_PROJECTS } from '../data/mockProjects';
import { Issue } from '../types/issue';
import { calculateProjectMetrics } from '../utils/projectAnalytics';

export interface UseProjectsResult {
  projects: Project[];
  activeProject: Project;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  createProject: (payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    success: boolean;
    project?: Project;
    errors?: string[];
  };
  updateProject: (
    id: string,
    updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
  ) => { success: boolean; project?: Project; errors?: string[] };
  deleteProject: (id: string) => boolean;
  getProjectMetrics: (projectId: string, issues: Issue[]) => ProjectMetrics;
}

export function useProjects(initialProjects: Project[] = INITIAL_PROJECTS): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(
    initialProjects[0]?.id || 'proj-core'
  );

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  const getProject = useCallback(
    (id: string) => {
      return projects.find((p) => p.id === id);
    },
    [projects]
  );

  const createProject = useCallback(
    (payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
      const errors: string[] = [];
      if (!payload.name || payload.name.trim().length < 3) {
        errors.push('Project name must be at least 3 characters.');
      }
      if (!payload.key || payload.key.trim().length < 2 || payload.key.trim().length > 6) {
        errors.push('Project key must be 2-6 alphanumeric characters.');
      }
      const upperKey = payload.key?.toUpperCase().trim();
      if (projects.some((p) => p.key.toUpperCase() === upperKey)) {
        errors.push(`A project with key "${upperKey}" already exists.`);
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }

      const now = new Date().toISOString();
      const newProj: Project = {
        ...payload,
        id: `proj-${Date.now()}`,
        key: upperKey,
        createdAt: now,
        updatedAt: now,
        settings: payload.settings || {
          defaultAssigneeId: null,
          allowSubtasks: true,
          enforceEstimates: true,
          defaultPriority: 'medium',
          targetVelocityPoints: 30,
        },
        members: payload.members || [],
      };

      setProjects((prev) => [...prev, newProj]);
      return { success: true, project: newProj };
    },
    [projects]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const existing = projects.find((p) => p.id === id);
      if (!existing) {
        return { success: false, errors: ['Project not found.'] };
      }

      const errors: string[] = [];
      if (updates.name !== undefined && updates.name.trim().length < 3) {
        errors.push('Project name must be at least 3 characters.');
      }
      if (updates.key !== undefined) {
        const upperKey = updates.key.toUpperCase().trim();
        if (projects.some((p) => p.id !== id && p.key.toUpperCase() === upperKey)) {
          errors.push(`Project key "${upperKey}" is already used by another project.`);
        }
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }

      let updatedProj: Project | undefined;
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          updatedProj = {
            ...p,
            ...updates,
            key: updates.key ? updates.key.toUpperCase().trim() : p.key,
            updatedAt: new Date().toISOString(),
          };
          return updatedProj;
        })
      );

      return { success: true, project: updatedProj };
    },
    [projects]
  );

  const deleteProject = useCallback(
    (id: string) => {
      if (projects.length <= 1) return false; // Prevent deleting last project
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id);
        if (remaining[0]) setActiveProjectId(remaining[0].id);
      }
      return true;
    },
    [projects, activeProjectId]
  );

  const getProjectMetrics = useCallback(
    (projectId: string, issues: Issue[]) => {
      const proj = getProject(projectId);
      if (!proj) {
        return {
          totalIssues: 0,
          openIssues: 0,
          completedIssues: 0,
          completionPercentage: 0,
          activeMilestonesCount: 0,
          teamVelocity: 0,
          healthScore: 'good' as const,
        };
      }
      return calculateProjectMetrics(proj, issues);
    },
    [getProject]
  );

  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectMetrics,
  };
}
