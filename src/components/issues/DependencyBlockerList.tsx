import React from 'react';
import { Issue } from '../../types/issue';
import { IssueRelationship } from '../../types/relationship';
import { Icon } from '../common/Icon';

export interface DependencyBlockerListProps {
  currentIssue: Issue;
  allIssues: Issue[];
  relationships: IssueRelationship[];
  onSelectIssue?: (issueId: string) => void;
  onAddRelationship?: (type: 'blocks' | 'blocked_by' | 'relates_to', targetId: string) => void;
  onRemoveRelationship?: (relId: string) => void;
}

export const DependencyBlockerList: React.FC<DependencyBlockerListProps> = ({
  currentIssue,
  allIssues,
  relationships,
  onSelectIssue,
  onRemoveRelationship,
}) => {
  const relatedRels = relationships.filter(
    (r) => r.sourceIssueId === currentIssue.id || r.targetIssueId === currentIssue.id
  );

  const issueMap = new Map<string, Issue>(allIssues.map((i) => [i.id, i]));

  return (
    <div className="issue-dependencies-section">
      <div className="section-header-row">
        <h4 className="section-subheading">
          <Icon name="layers" size={14} /> Relationships & Blockers
        </h4>
        <span className="badge badge-info">{relatedRels.length} linked</span>
      </div>

      {relatedRels.length === 0 ? (
        <p className="empty-subtext">No blockers or linked relationships defined for this issue.</p>
      ) : (
        <ul className="relationship-list" aria-label="Issue relationships">
          {relatedRels.map((rel) => {
            const isSource = rel.sourceIssueId === currentIssue.id;
            const targetId = isSource ? rel.targetIssueId : rel.sourceIssueId;
            const targetIssue = issueMap.get(targetId);

            let labelText = rel.type.replace('_', ' ');
            if (!isSource && rel.type === 'blocks') labelText = 'blocked by';
            if (!isSource && rel.type === 'blocked_by') labelText = 'blocks';

            const isDone = targetIssue?.status === 'done';

            return (
              <li key={rel.id} className={`relationship-item ${isDone ? 'resolved' : ''}`}>
                <span className="relationship-type-pill">{labelText}</span>

                <button
                  type="button"
                  className="btn-link relationship-target-id"
                  onClick={() => onSelectIssue && onSelectIssue(targetId)}
                >
                  {targetId}: {targetIssue?.title || 'Unknown Issue'}
                </button>

                {targetIssue && (
                  <span className={`badge badge-status-${targetIssue.status} text-xs`}>
                    {targetIssue.status}
                  </span>
                )}

                {onRemoveRelationship && (
                  <button
                    type="button"
                    className="btn btn-icon btn-remove-rel"
                    onClick={() => onRemoveRelationship(rel.id)}
                    aria-label={`Remove relationship with ${targetId}`}
                  >
                    <Icon name="x" size={12} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
