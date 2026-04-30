import React from 'react';
import { CumulativeFlowPoint } from '../../types/analytics';

export interface CumulativeFlowDiagramProps {
  dataPoints: CumulativeFlowPoint[];
}

export const CumulativeFlowDiagram: React.FC<CumulativeFlowDiagramProps> = ({
  dataPoints,
}) => {
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="text-muted text-sm">
        No CFD history recorded for the current time window.
      </div>
    );
  }

  const latest = dataPoints[dataPoints.length - 1];
  const total =
    latest.backlog + latest.todo + latest.inProgress + latest.inReview + latest.done;

  return (
    <div className="cfd-card">
      <div className="chart-header">
        <h4>Work In Progress (WIP) Distribution</h4>
        <span className="text-xs text-muted">Total: {total} issues</span>
      </div>

      <div className="cfd-stacked-bar">
        {latest.done > 0 && (
          <div
            className="cfd-segment status-done"
            style={{ width: `${(latest.done / total) * 100}%` }}
            title={`Done: ${latest.done}`}
          />
        )}
        {latest.inReview > 0 && (
          <div
            className="cfd-segment status-in_review"
            style={{ width: `${(latest.inReview / total) * 100}%` }}
            title={`In Review: ${latest.inReview}`}
          />
        )}
        {latest.inProgress > 0 && (
          <div
            className="cfd-segment status-in_progress"
            style={{ width: `${(latest.inProgress / total) * 100}%` }}
            title={`In Progress: ${latest.inProgress}`}
          />
        )}
        {latest.todo > 0 && (
          <div
            className="cfd-segment status-todo"
            style={{ width: `${(latest.todo / total) * 100}%` }}
            title={`Todo: ${latest.todo}`}
          />
        )}
        {latest.backlog > 0 && (
          <div
            className="cfd-segment status-backlog"
            style={{ width: `${(latest.backlog / total) * 100}%` }}
            title={`Backlog: ${latest.backlog}`}
          />
        )}
      </div>

      <div className="cfd-legend-grid">
        <div className="cfd-legend-item">
          <span className="dot dot-done" /> Done ({latest.done})
        </div>
        <div className="cfd-legend-item">
          <span className="dot dot-review" /> In Review ({latest.inReview})
        </div>
        <div className="cfd-legend-item">
          <span className="dot dot-progress" /> In Progress ({latest.inProgress})
        </div>
        <div className="cfd-legend-item">
          <span className="dot dot-todo" /> Todo ({latest.todo})
        </div>
        <div className="cfd-legend-item">
          <span className="dot dot-backlog" /> Backlog ({latest.backlog})
        </div>
      </div>
    </div>
  );
};
