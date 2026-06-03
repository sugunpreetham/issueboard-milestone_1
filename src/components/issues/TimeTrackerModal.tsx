import React, { useState } from 'react';
import { WorklogEntry } from '../../types/timeTracking';
import {
  parseTimeStringToMinutes,
  formatMinutesToDuration,
  calculateTimeTrackingSummary,
} from '../../utils/timeTrackingEngine';
import { Icon } from '../common/Icon';

export interface TimeTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
  issueTitle: string;
  estimateHours: number;
  worklogs: WorklogEntry[];
  onAddWorklog: (entry: Omit<WorklogEntry, 'id' | 'loggedAt'>) => void;
}

export const TimeTrackerModal: React.FC<TimeTrackerModalProps> = ({
  isOpen,
  onClose,
  issueId,
  issueTitle,
  estimateHours,
  worklogs,
  onAddWorklog,
}) => {
  const [timeSpentInput, setTimeSpentInput] = useState('');
  const [description, setDescription] = useState('');
  const [billable, setBillable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const summary = calculateTimeTrackingSummary(estimateHours, worklogs);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseTimeStringToMinutes(timeSpentInput);
    if (minutes <= 0) {
      setErrorMessage('Please enter a valid duration (e.g. 2h 30m, 1d, 45m).');
      return;
    }

    onAddWorklog({
      issueId,
      authorId: 'current-user',
      authorName: 'Current User',
      timeSpentMinutes: minutes,
      description: description.trim() || 'Work logged',
      billable,
    });

    setTimeSpentInput('');
    setDescription('');
    setErrorMessage('');
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="time-tracker-title">
      <div className="modal-content modal-time-tracker">
        <div className="modal-header">
          <div>
            <h2 id="time-tracker-title" className="modal-title">Time Tracking & Worklog</h2>
            <p className="text-xs text-muted">{issueId} - {issueTitle}</p>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="time-summary-banner">
          <div className="metric-pill">
            <span className="text-xs text-muted">Estimated:</span>
            <strong>{formatMinutesToDuration(summary.originalEstimateMinutes)}</strong>
          </div>
          <div className="metric-pill">
            <span className="text-xs text-muted">Logged:</span>
            <strong className={summary.isOverBudget ? 'text-danger' : 'text-success'}>
              {formatMinutesToDuration(summary.totalSpentMinutes)} ({summary.percentSpent}%)
            </strong>
          </div>
          <div className="metric-pill">
            <span className="text-xs text-muted">Remaining:</span>
            <strong>{formatMinutesToDuration(summary.remainingMinutes)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="worklog-form">
          {errorMessage && <div className="error-banner text-sm" role="alert">{errorMessage}</div>}

          <div className="form-group">
            <label htmlFor="time-spent-input">Time Spent (e.g., 1d 4h, 45m)</label>
            <input
              id="time-spent-input"
              type="text"
              className="form-input"
              value={timeSpentInput}
              onChange={(e) => setTimeSpentInput(e.target.value)}
              placeholder="e.g. 2h 30m"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="worklog-desc">Work Description</label>
            <textarea
              id="worklog-desc"
              className="form-textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of work performed..."
            />
          </div>

          <div className="form-checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={billable}
                onChange={(e) => setBillable(e.target.checked)}
              />
              <span>Billable hours</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Log Time
            </button>
          </div>
        </form>

        <div className="worklog-history">
          <h3 className="section-title text-sm">Worklog History ({worklogs.length})</h3>
          {worklogs.length === 0 ? (
            <p className="text-xs text-muted">No time logged for this issue yet.</p>
          ) : (
            <ul className="worklog-list">
              {worklogs.map((log) => (
                <li key={log.id} className="worklog-item text-xs">
                  <div className="worklog-item-header">
                    <strong>{log.authorName}</strong>
                    <span>{formatMinutesToDuration(log.timeSpentMinutes)}</span>
                  </div>
                  <p className="worklog-item-desc text-muted">{log.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
