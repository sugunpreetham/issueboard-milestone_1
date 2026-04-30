import React from 'react';
import { WorkflowDefinition } from '../../types/workflow';
import { Icon } from '../common/Icon';

export interface WorkflowGraphModalProps {
  isOpen: boolean;
  workflow: WorkflowDefinition;
  onClose: () => void;
}

export const WorkflowGraphModal: React.FC<WorkflowGraphModalProps> = ({
  isOpen,
  workflow,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-content workflow-graph-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workflow-modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <Icon name="layers" size={20} className="modal-icon" />
            <div>
              <h2 id="workflow-modal-title">{workflow.name}</h2>
              <p className="modal-subtitle">{workflow.description}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            aria-label="Close workflow diagram"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="workflow-status-list">
            <h3>Workflow Stages</h3>
            <div className="workflow-nodes-grid">
              {workflow.statuses.map((status) => (
                <div
                  key={status.id}
                  className="workflow-node-card"
                  style={{ borderLeftColor: status.color }}
                >
                  <div className="workflow-node-header">
                    <span
                      className="status-color-dot"
                      style={{ backgroundColor: status.color }}
                    />
                    <strong className="status-label">{status.label}</strong>
                    <span className="category-tag">[{status.category}]</span>
                  </div>
                  <p className="status-desc">{status.description}</p>
                  {status.requireAssigneeOnEntry && (
                    <span className="badge badge-warning text-xs">Requires Assignee</span>
                  )}
                  {status.requireEstimateOnEntry && (
                    <span className="badge badge-info text-xs">Requires Estimate</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="workflow-transitions-table-wrapper">
            <h3>Permitted State Transitions</h3>
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>From Status</th>
                  <th>Action</th>
                  <th>To Status</th>
                </tr>
              </thead>
              <tbody>
                {workflow.transitions.map((t, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={`badge badge-status-${t.from}`}>{t.from}</span>
                    </td>
                    <td className="transition-name-cell">
                      <Icon name="arrow-up" size={12} className="rotate-90 text-muted" />
                      <span>{t.name}</span>
                    </td>
                    <td>
                      <span className={`badge badge-status-${t.to}`}>{t.to}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
