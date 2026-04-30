import React from 'react';
import { VelocityDataPoint } from '../../types/analytics';

export interface VelocityChartProps {
  velocityHistory: VelocityDataPoint[];
}

export const VelocityChart: React.FC<VelocityChartProps> = ({ velocityHistory }) => {
  if (velocityHistory.length === 0) {
    return <div className="text-muted text-sm">No historical sprint data available.</div>;
  }

  const maxPoints = Math.max(
    ...velocityHistory.flatMap((v) => [v.committedPoints, v.completedPoints]),
    10
  );

  return (
    <div className="velocity-chart-card">
      <div className="chart-header">
        <h4>Sprint Velocity History</h4>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-box committed-box" /> Committed
          </span>
          <span className="legend-item">
            <span className="legend-box completed-box" /> Completed
          </span>
        </div>
      </div>

      <div className="velocity-bars-container">
        {velocityHistory.map((sprint) => {
          const committedHeight = Math.round((sprint.committedPoints / maxPoints) * 120);
          const completedHeight = Math.round((sprint.completedPoints / maxPoints) * 120);

          return (
            <div key={sprint.sprintId} className="velocity-sprint-column">
              <div className="bars-group">
                <div
                  className="bar bar-committed"
                  style={{ height: `${committedHeight}px` }}
                  title={`Committed: ${sprint.committedPoints} pts`}
                >
                  <span className="bar-val">{sprint.committedPoints}</span>
                </div>
                <div
                  className="bar bar-completed"
                  style={{ height: `${completedHeight}px` }}
                  title={`Completed: ${sprint.completedPoints} pts (${sprint.completionRate}%)`}
                >
                  <span className="bar-val">{sprint.completedPoints}</span>
                </div>
              </div>
              <span className="sprint-name-label">{sprint.sprintName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
