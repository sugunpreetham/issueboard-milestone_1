import React from 'react';
import { Project } from '../../types/project';
import { Icon } from '../common/Icon';

export interface ProjectSelectorProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenSettings?: () => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onOpenSettings,
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  return (
    <div className="project-selector-wrapper">
      <div className="project-selector-badge">
        <span className="project-key-tag">{activeProject?.key || 'PROJ'}</span>
      </div>

      <select
        className="project-selector-dropdown"
        value={activeProjectId}
        onChange={(e) => onSelectProject(e.target.value)}
        aria-label="Select active project workspace"
      >
        {projects.map((proj) => (
          <option key={proj.id} value={proj.id}>
            [{proj.key}] {proj.name}
          </option>
        ))}
      </select>

      {onOpenSettings && (
        <button
          type="button"
          className="btn btn-secondary btn-icon project-settings-btn"
          title="Project settings"
          aria-label="Open project settings"
          onClick={onOpenSettings}
        >
          <Icon name="shield" size={14} />
        </button>
      )}
    </div>
  );
};
