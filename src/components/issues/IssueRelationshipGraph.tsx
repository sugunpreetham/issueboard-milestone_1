import React from 'react';
import { Issue } from '../../types/issue';
import { IssueRelationship } from '../../types/relationship';
import { analyzeDependencyGraph, getDependencyNodes } from '../../utils/dependencyGraph';
import { Icon } from '../common/Icon';

export interface IssueRelationshipGraphProps {
  issues: Issue[];
  relationships: IssueRelationship[];
  onSelectIssue?: (issueId: string) => void;
}

export const IssueRelationshipGraph: React.FC<IssueRelationshipGraphProps> = ({
  issues,
  relationships,
  onSelectIssue,
}) => {
  const analysis = analyzeDependencyGraph(issues, relationships);
  const nodes = getDependencyNodes(issues, relationships);

  return (
    <div className="dependency-graph-container">
      <div className="dependency-header">
        <div className="dependency-title-group">
          <Icon name="layers" size={18} />
          <h3>Issue Relationship & Dependency Map</h3>
        </div>

        {analysis.hasCycle && (
          <div className="alert-badge alert-danger" role="alert">
            <Icon name="alert-triangle" size={14} />
            <span>
              Circular Dependency Detected: {analysis.cycleNodes.join(' ➔ ')}
            </span>
          </div>
        )}
      </div>

      {analysis.criticalPath.length > 0 && (
        <div className="critical-path-banner">
          <span className="critical-path-label">
            <Icon name="zap" size={14} /> Critical Path:
          </span>
          <div className="critical-path-steps">
            {analysis.criticalPath.map((id, index) => (
              <React.Fragment key={id}>
                <button
                  type="button"
                  className="btn-link issue-chip-btn"
                  onClick={() => onSelectIssue && onSelectIssue(id)}
                >
                  {id}
                </button>
                {index < analysis.criticalPath.length - 1 && (
                  <span className="step-arrow">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="dependency-nodes-grid">
        {nodes.map((node) => (
          <div
            key={node.issueId}
            className={`dependency-node-card ${node.isBlocked ? 'is-blocked' : ''}`}
            onClick={() => onSelectIssue && onSelectIssue(node.issueId)}
          >
            <div className="node-card-top">
              <span className="node-issue-id">{node.issueId}</span>
              <span className={`badge badge-status-${node.status}`}>{node.status}</span>
            </div>
            <h4 className="node-issue-title">{node.title}</h4>

            <div className="node-deps-footer">
              {node.blockedBy.length > 0 && (
                <div className="node-blocked-by-tag">
                  <Icon name="alert-circle" size={12} />
                  <span>Blocked by: {node.blockedBy.join(', ')}</span>
                </div>
              )}
              {node.blocks.length > 0 && (
                <div className="node-blocks-tag">
                  <Icon name="arrow-up" size={12} className="rotate-90" />
                  <span>Blocks: {node.blocks.join(', ')}</span>
                </div>
              )}
              {node.blockedBy.length === 0 && node.blocks.length === 0 && (
                <span className="text-muted text-xs">No dependencies</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
