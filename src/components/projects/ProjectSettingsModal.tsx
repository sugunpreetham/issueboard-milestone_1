import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Icon } from '../common/Icon';

export interface ProjectSettingsModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onSave: (updates: Partial<Project>) => void;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [targetVelocity, setTargetVelocity] = useState(
    project.settings.targetVelocityPoints || 30
  );
  const [allowSubtasks, setAllowSubtasks] = useState(project.settings.allowSubtasks);
  const [enforceEstimates, setEnforceEstimates] = useState(
    project.settings.enforceEstimates
  );
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      setError('Project name must be at least 3 characters.');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      settings: {
        ...project.settings,
        targetVelocityPoints: Number(targetVelocity) || 30,
        allowSubtasks,
        enforceEstimates,
      },
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-content project-settings-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-settings-title"
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <Icon name="shield" size={20} className="modal-icon" />
            <h2 id="project-settings-title">Project Settings: [{project.key}]</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            aria-label="Close project settings"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-grid">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="proj-name-input">Project Name</label>
            <input
              id="proj-name-input"
              type="text"
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="proj-desc-input">Description</label>
            <textarea
              id="proj-desc-input"
              className="text-input textarea-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proj-velocity-input">Target Velocity (Story Points / Sprint)</label>
              <input
                id="proj-velocity-input"
                type="number"
                min="1"
                max="200"
                className="text-input"
                value={targetVelocity}
                onChange={(e) => setTargetVelocity(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allowSubtasks}
                onChange={(e) => setAllowSubtasks(e.target.checked)}
              />
              <span>Allow nested subtasks and parent-child issue relationships</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={enforceEstimates}
                onChange={(e) => setEnforceEstimates(e.target.checked)}
              />
              <span>Require story point estimates before moving to In Progress</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Project Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
