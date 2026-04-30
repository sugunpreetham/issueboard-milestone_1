import React from 'react';
import { Project, ProjectMetrics } from '../../types/project';
import { Icon } from '../common/Icon';
import { Avatar } from '../common/Avatar';

export interface ProjectOverviewCardProps {
  project: Project;
  metrics: ProjectMetrics;
}

export const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({
  project,
  metrics,
}) => {
  const healthBadgeClasses = {
    excellent: 'badge-success',
    good: 'badge-info',
    warning: 'badge-warning',
    critical: 'badge-danger',
  }[metrics.healthScore];

  return (
    <div className="project-overview-card">
      <div className="project-card-header">
        <div className="project-title-group">
          <span className="project-key-pill">{project.key}</span>
          <h3 className="project-heading">{project.name}</h3>
        </div>
        <span className={`badge ${healthBadgeClasses}`}>
          Health: {metrics.healthScore.toUpperCase()}
        </span>
      </div>

      <p className="project-description-text">{project.description}</p>

      <div className="project-metrics-grid">
        <div className="metric-box">
          <span className="metric-val">{metrics.totalIssues}</span>
          <span className="metric-lbl">Total Issues</span>
        </div>
        <div className="metric-box">
          <span className="metric-val">{metrics.openIssues}</span>
          <span className="metric-lbl">Open</span>
        </div>
        <div className="metric-box">
          <span className="metric-val">{metrics.completedIssues}</span>
          <span className="metric-lbl">Done</span>
        </div>
        <div className="metric-box">
          <span className="metric-val">{metrics.completionPercentage}%</span>
          <span className="metric-lbl">Completed</span>
        </div>
      </div>

      <div className="project-footer-row">
        <div className="project-team-members">
          <span className="members-label">Team:</span>
          <div className="avatar-stack">
            {project.members.map((m) => (
              <Avatar key={m.id} name={m.name} size="xs" />
            ))}
          </div>
        </div>

        {project.repositoryUrl && (
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="repo-link"
            title="Open Git Repository"
          >
            <Icon name="box" size={14} />
            <span>Repository</span>
          </a>
        )}
      </div>
    </div>
  );
};
