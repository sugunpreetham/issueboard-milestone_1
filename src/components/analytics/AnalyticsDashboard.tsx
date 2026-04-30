import React from 'react';
import { Issue } from '../../types/issue';
import { VelocityChart } from './VelocityChart';
import { CumulativeFlowDiagram } from './CumulativeFlowDiagram';
import { computeAnalyticsSummary } from '../../utils/velocityEngine';
import { VelocityDataPoint, CumulativeFlowPoint } from '../../types/analytics';
import { Icon } from '../common/Icon';

export interface AnalyticsDashboardProps {
  issues: Issue[];
}

const SAMPLE_VELOCITY_HISTORY: VelocityDataPoint[] = [
  {
    sprintId: 'sp-21',
    sprintName: 'Sprint 21',
    committedPoints: 30,
    completedPoints: 28,
    completionRate: 93,
  },
  {
    sprintId: 'sp-22',
    sprintName: 'Sprint 22',
    committedPoints: 35,
    completedPoints: 32,
    completionRate: 91,
  },
  {
    sprintId: 'sp-23',
    sprintName: 'Sprint 23',
    committedPoints: 25,
    completedPoints: 24,
    completionRate: 96,
  },
  {
    sprintId: 'sp-24',
    sprintName: 'Sprint 24',
    committedPoints: 40,
    completedPoints: 34,
    completionRate: 85,
  },
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ issues }) => {
  const summary = computeAnalyticsSummary(issues, SAMPLE_VELOCITY_HISTORY);

  const cfdPoints: CumulativeFlowPoint[] = [
    {
      date: '2026-08-27',
      backlog: issues.filter((i) => i.status === 'backlog').length,
      todo: issues.filter((i) => i.status === 'todo').length,
      inProgress: issues.filter((i) => i.status === 'in_progress').length,
      inReview: issues.filter((i) => i.status === 'in_review').length,
      done: issues.filter((i) => i.status === 'done').length,
    },
  ];

  return (
    <div className="analytics-dashboard-panel">
      <div className="analytics-hero-row">
        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap">
            <Icon name="zap" size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{summary.averageVelocity} pts</span>
            <span className="kpi-label">Avg Velocity / Sprint</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap">
            <Icon name="clock" size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{summary.averageLeadTimeDays} days</span>
            <span className="kpi-label">Avg Lead Time</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap">
            <Icon name="check" size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{summary.throughputPerWeek}</span>
            <span className="kpi-label">Issues / Week Throughput</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrap">
            <Icon name="shield" size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{summary.velocityTrend.toUpperCase()}</span>
            <span className="kpi-label">Velocity Trend</span>
          </div>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <VelocityChart velocityHistory={SAMPLE_VELOCITY_HISTORY} />
        <CumulativeFlowDiagram dataPoints={cfdPoints} />
      </div>

      <div className="analytics-distributions-row">
        <div className="distribution-card">
          <h4>Priority Breakdown</h4>
          <div className="dist-items-list">
            {summary.priorityDistribution.map((p) => (
              <div key={p.priority} className="dist-row">
                <span className={`badge badge-priority-${p.priority}`}>{p.priority}</span>
                <div className="dist-bar-wrapper">
                  <div
                    className={`dist-bar-fill fill-${p.priority}`}
                    style={{ width: `${p.percentage}%` }}
                  />
                </div>
                <span className="dist-count">{p.count} ({p.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="distribution-card">
          <h4>Status Breakdown</h4>
          <div className="dist-items-list">
            {summary.statusDistribution.map((s) => (
              <div key={s.status} className="dist-row">
                <span className={`badge badge-status-${s.status}`}>{s.status}</span>
                <div className="dist-bar-wrapper">
                  <div
                    className={`dist-bar-fill fill-status-${s.status}`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <span className="dist-count">{s.count} ({s.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
