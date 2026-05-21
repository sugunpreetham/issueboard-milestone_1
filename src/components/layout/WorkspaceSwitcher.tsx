import React from 'react';
import { Workspace } from '../../types/workspace';
import { Icon } from '../common/Icon';

export interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  storagePercentage?: number;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  storagePercentage,
}) => {
  const activeWs = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  return (
    <div className="workspace-switcher" role="region" aria-label="Workspace selection">
      <div className="workspace-badge-icon" aria-hidden="true">
        <Icon name="box" size={16} />
      </div>

      <div className="workspace-info-group">
        <select
          className="workspace-select-input"
          value={activeWorkspaceId}
          onChange={(e) => onSelectWorkspace(e.target.value)}
          aria-label="Active workspace"
        >
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name} ({ws.tier.toUpperCase()})
            </option>
          ))}
        </select>

        {storagePercentage !== undefined && (
          <div
            className={`workspace-storage-indicator ${storagePercentage >= 80 ? 'warning' : ''}`}
            title={`Storage: ${storagePercentage}% used`}
          >
            <div
              className="storage-fill"
              style={{ width: `${Math.min(100, storagePercentage)}%` }}
            />
          </div>
        )}
      </div>

      <span className={`badge tier-badge tier-${activeWs?.tier || 'free'}`}>
        {activeWs?.tier || 'free'}
      </span>
    </div>
  );
};
