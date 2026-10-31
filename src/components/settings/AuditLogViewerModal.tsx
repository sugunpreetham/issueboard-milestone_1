import React, { useState } from 'react';
import { AuditLogEntry, AuditCategory, AuditSeverity } from '../../types/auditLog';
import { Icon } from '../common/Icon';

export interface AuditLogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
  isChainValid?: boolean;
}

export const AuditLogViewerModal: React.FC<AuditLogViewerModalProps> = ({
  isOpen,
  onClose,
  logs,
  isChainValid = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<AuditSeverity | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (selectedCategory !== 'all' && log.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && log.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        log.action.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        (log.targetId && log.targetId.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="audit-modal-title">
      <div className="modal-content modal-audit-log">
        <div className="modal-header">
          <div>
            <h2 id="audit-modal-title" className="modal-title">Audit Log & Compliance Trail</h2>
            <p className="text-xs text-muted">
              Immutable tamper-evident event records
              {isChainValid ? (
                <span className="badge badge-success ml-2">Chain Verified</span>
              ) : (
                <span className="badge badge-danger ml-2">Integrity Error</span>
              )}
            </p>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="audit-filter-bar">
          <input
            type="text"
            className="form-input text-xs"
            placeholder="Search action, actor, target ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="form-select text-xs"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as AuditCategory | 'all')}
          >
            <option value="all">All Categories</option>
            <option value="auth">Authentication</option>
            <option value="issue_mutation">Issue Mutation</option>
            <option value="project_config">Project Config</option>
            <option value="workflow_transition">Workflow</option>
            <option value="data_export">Data Export</option>
            <option value="permission_change">Permissions</option>
          </select>

          <select
            className="form-select text-xs"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as AuditSeverity | 'all')}
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="security_alert">Security Alert</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="audit-table-wrapper">
          <table className="audit-table text-xs">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Category</th>
                <th>Action</th>
                <th>Target</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-muted">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td><strong>{log.actorName}</strong></td>
                    <td><span className="badge badge-subtle">{log.category}</span></td>
                    <td>{log.action}</td>
                    <td><code>{log.targetId || '-'}</code></td>
                    <td><code className="text-xs text-muted">{log.hash.slice(0, 8)}</code></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
