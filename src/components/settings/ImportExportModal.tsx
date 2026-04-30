import React, { useState } from 'react';
import { Issue } from '../../types/issue';
import {
  exportIssuesToCSV,
  exportIssuesToJSON,
  importIssuesFromCSV,
  importIssuesFromJSON,
} from '../../services/importExportService';
import { Icon } from '../common/Icon';

export interface ImportExportModalProps {
  isOpen: boolean;
  issues: Issue[];
  onClose: () => void;
  onImportIssues: (newIssues: Issue[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  issues,
  onClose,
  onImportIssues,
}) => {
  const [mode, setMode] = useState<'export' | 'import'>('export');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState<'csv' | 'json'>('csv');
  const [importResult, setImportResult] = useState<{
    success: boolean;
    count: number;
    errors: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    let content = '';
    let filename = '';
    let mime = '';

    if (exportFormat === 'csv') {
      content = exportIssuesToCSV(issues);
      filename = `issueboard-export-${new Date().toISOString().slice(0, 10)}.csv`;
      mime = 'text/csv;charset=utf-8;';
    } else {
      content = exportIssuesToJSON(issues);
      filename = `issueboard-export-${new Date().toISOString().slice(0, 10)}.json`;
      mime = 'application/json;charset=utf-8;';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    let res;
    if (importFormat === 'csv') {
      res = importIssuesFromCSV(importText, issues.length);
    } else {
      res = importIssuesFromJSON(importText);
    }

    setImportResult({
      success: res.success,
      count: res.importedIssues.length,
      errors: res.errors,
    });

    if (res.success && res.importedIssues.length > 0) {
      onImportIssues(res.importedIssues);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-content import-export-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-export-title"
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <Icon name="refresh" size={20} className="modal-icon" />
            <h2 id="import-export-title">Import & Export Data</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab-btn ${mode === 'export' ? 'active' : ''}`}
            onClick={() => setMode('export')}
          >
            Export Issues
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${mode === 'import' ? 'active' : ''}`}
            onClick={() => setMode('import')}
          >
            Import Issues
          </button>
        </div>

        <div className="modal-body">
          {mode === 'export' ? (
            <div className="export-panel">
              <p className="modal-subtitle">
                Download all <strong>{issues.length}</strong> issues from this workspace.
              </p>

              <div className="form-group">
                <label>File Format</label>
                <div className="radio-group-horizontal">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="export-fmt"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                    />
                    <span>CSV (Spreadsheets / Excel)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="export-fmt"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={() => setExportFormat('json')}
                    />
                    <span>JSON (Raw Structure)</span>
                  </label>
                </div>
              </div>

              <div className="form-actions-right">
                <button type="button" className="btn btn-primary" onClick={handleDownload}>
                  Download {exportFormat.toUpperCase()} File
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleImportSubmit} className="import-panel">
              <p className="modal-subtitle">
                Paste your CSV or JSON data below to import new issues into IssueBoard.
              </p>

              {importResult && (
                <div
                  className={`alert-banner ${
                    importResult.success ? 'alert-success' : 'alert-danger'
                  }`}
                >
                  {importResult.success ? (
                    <span>
                      Successfully imported <strong>{importResult.count}</strong> issues!
                    </span>
                  ) : (
                    <span>
                      Import failed: {importResult.errors.join(' ')}
                    </span>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Format</label>
                <div className="radio-group-horizontal">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="import-fmt"
                      value="csv"
                      checked={importFormat === 'csv'}
                      onChange={() => setImportFormat('csv')}
                    />
                    <span>CSV</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="import-fmt"
                      value="json"
                      checked={importFormat === 'json'}
                      onChange={() => setImportFormat('json')}
                    />
                    <span>JSON</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="import-data-text">Data Payload</label>
                <textarea
                  id="import-data-text"
                  className="text-input textarea-input font-mono text-xs"
                  rows={6}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={
                    importFormat === 'csv'
                      ? 'Title,Description,Status,Priority,Assignee\n"Fix login redirect","Auth bug","todo","high","Sarah Chen"'
                      : '[\n  {\n    "title": "New issue",\n    "status": "todo"\n  }\n]'
                  }
                  required
                />
              </div>

              <div className="form-actions-right">
                <button type="submit" className="btn btn-primary">
                  Parse & Import Issues
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
