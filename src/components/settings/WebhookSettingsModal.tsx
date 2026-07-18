import React, { useState } from 'react';
import { WebhookEndpoint, WebhookEvent } from '../../types/webhook';
import { Icon } from '../common/Icon';

export interface WebhookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoints: WebhookEndpoint[];
  onAddEndpoint: (payload: { url: string; description?: string; events: WebhookEvent[] }) => void;
}

const ALL_EVENTS: { event: WebhookEvent; label: string }[] = [
  { event: 'issue.created', label: 'Issue Created' },
  { event: 'issue.updated', label: 'Issue Updated' },
  { event: 'issue.deleted', label: 'Issue Deleted' },
  { event: 'comment.added', label: 'Comment Added' },
  { event: 'milestone.completed', label: 'Milestone Completed' },
];

export const WebhookSettingsModal: React.FC<WebhookSettingsModalProps> = ({
  isOpen,
  onClose,
  endpoints,
  onAddEndpoint,
}) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Set<WebhookEvent>>(new Set(['issue.created', 'issue.updated']));
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleEvent = (event: WebhookEvent) => {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(event)) {
        next.delete(event);
      } else {
        next.add(event);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Webhook URL is required.');
      return;
    }
    if (selectedEvents.size === 0) {
      setErrorMessage('Select at least one subscribed event.');
      return;
    }

    onAddEndpoint({
      url: url.trim(),
      description: description.trim() || undefined,
      events: Array.from(selectedEvents),
    });

    setUrl('');
    setDescription('');
    setErrorMessage('');
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="webhook-modal-title">
      <div className="modal-content modal-webhooks">
        <div className="modal-header">
          <div>
            <h2 id="webhook-modal-title" className="modal-title">Webhook Integrations</h2>
            <p className="text-xs text-muted">Dispatch HTTP JSON payloads on IssueBoard lifecycle events</p>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="webhook-form">
          {errorMessage && <div className="error-banner text-xs mb-2" role="alert">{errorMessage}</div>}

          <div className="form-group">
            <label htmlFor="webhook-url" className="text-xs font-semibold">Endpoint URL</label>
            <input
              id="webhook-url"
              type="url"
              className="form-input text-xs"
              placeholder="https://api.example.com/webhooks/issues"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="webhook-desc" className="text-xs font-semibold">Description</label>
            <input
              id="webhook-desc"
              type="text"
              className="form-input text-xs"
              placeholder="e.g. CI Slack Bot notifications"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="text-xs font-semibold mb-1 block">Subscribed Events</label>
            <div className="event-checkbox-grid">
              {ALL_EVENTS.map(({ event, label }) => (
                <label key={event} className="checkbox-label text-xs">
                  <input
                    type="checkbox"
                    checked={selectedEvents.has(event)}
                    onChange={() => toggleEvent(event)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm mt-2">
            Add Webhook Endpoint
          </button>
        </form>

        <div className="endpoint-list-section mt-4">
          <h3 className="section-title text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Active Endpoints ({endpoints.length})
          </h3>
          {endpoints.length === 0 ? (
            <p className="text-xs text-muted">No configured webhook endpoints.</p>
          ) : (
            <div className="endpoint-list">
              {endpoints.map((ep) => (
                <div key={ep.id} className="endpoint-card p-2 border rounded mb-2">
                  <div className="endpoint-card-header flex justify-between">
                    <strong className="text-xs">{ep.url}</strong>
                    <span className="badge badge-success text-xs">Active</span>
                  </div>
                  {ep.description && <p className="text-xs text-muted">{ep.description}</p>}
                  <div className="endpoint-events-badges mt-1">
                    {ep.events.map((ev) => (
                      <span key={ev} className="badge badge-subtle text-xs mr-1">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions mt-4">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
