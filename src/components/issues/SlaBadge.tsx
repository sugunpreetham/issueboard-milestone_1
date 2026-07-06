import React from 'react';
import { Issue } from '../../types/issue';
import { evaluateIssueSla } from '../../utils/slaCalculator';

export interface SlaBadgeProps {
  issue: Issue;
  referenceDate?: string;
}

export const SlaBadge: React.FC<SlaBadgeProps> = ({ issue, referenceDate }) => {
  const sla = evaluateIssueSla(issue, undefined, referenceDate);

  const getBadgeClass = () => {
    switch (sla.status) {
      case 'breached':
        return 'badge-danger font-bold animate-pulse';
      case 'warning':
        return 'badge-warning';
      case 'completed':
        return 'badge-subtle';
      case 'within_target':
      default:
        return 'badge-success';
    }
  };

  const getLabel = () => {
    if (sla.status === 'completed') {
      return sla.isBreached ? 'SLA Breached' : 'SLA Met';
    }
    if (sla.status === 'breached') {
      return `SLA Breached (+${Math.round(sla.hoursElapsed - sla.targetHours)}h)`;
    }
    return `${sla.hoursRemaining}h left (${sla.percentElapsed}%)`;
  };

  return (
    <span
      className={`badge sla-badge text-xs ${getBadgeClass()}`}
      title={`Target: ${sla.targetHours}h | Elapsed: ${sla.hoursElapsed}h`}
      aria-label={`SLA status: ${sla.status}`}
    >
      {getLabel()}
    </span>
  );
};
