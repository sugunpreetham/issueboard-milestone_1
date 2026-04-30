import { describe, it, expect } from 'vitest';
import {
  exportIssuesToCSV,
  parseCSV,
  importIssuesFromCSV,
  exportIssuesToJSON,
  importIssuesFromJSON,
} from '../services/importExportService';
import { Issue, Assignee } from '../types/issue';

const sarahAssignee: Assignee = {
  id: 'user-sarah',
  name: 'Sarah Chen',
  email: 'sarah@example.com',
  avatarColor: '#3b82f6',
};

describe('Import & Export Service', () => {
  const sampleIssues: Issue[] = [
    {
      id: 'ISSUE-101',
      title: 'Fix race condition in OAuth2',
      description: 'Occurs under concurrent refreshes',
      status: 'in_progress',
      priority: 'high',
      assignee: sarahAssignee,
      labels: ['auth', 'bug'],
      estimate: 5,
      createdAt: '2026-08-01T00:00:00Z',
      updatedAt: '2026-08-02T00:00:00Z',
      activities: [],
    },
  ];

  it('exports issues to CSV format correctly', () => {
    const csv = exportIssuesToCSV(sampleIssues);
    expect(csv).toContain('ID,Title,Description,Status,Priority,Assignee,Labels,Estimate');
    expect(csv).toContain('ISSUE-101');
    expect(csv).toContain('Fix race condition in OAuth2');
    expect(csv).toContain('auth;bug');
  });

  it('parses CSV records preserving quoted fields and commas', () => {
    const csvData = `ID,Title,Description\nISSUE-1,"Hello, World","A, B, and C"`;
    const rows = parseCSV(csvData);
    expect(rows.length).toBe(2);
    expect(rows[1][1]).toBe('Hello, World');
    expect(rows[1][2]).toBe('A, B, and C');
  });

  it('imports valid CSV data into typed issues', () => {
    const csv = `Title,Description,Status,Priority,Assignee\n"New Feature Request","Detailed spec","todo","high","Elena Rostova"`;
    const res = importIssuesFromCSV(csv);
    expect(res.success).toBe(true);
    expect(res.importedIssues.length).toBe(1);
    expect(res.importedIssues[0].title).toBe('New Feature Request');
    expect(res.importedIssues[0].priority).toBe('high');
  });

  it('exports and imports issues from JSON', () => {
    const jsonStr = exportIssuesToJSON(sampleIssues);
    const res = importIssuesFromJSON(jsonStr);
    expect(res.success).toBe(true);
    expect(res.importedIssues.length).toBe(1);
    expect(res.importedIssues[0].title).toBe('Fix race condition in OAuth2');
  });

  it('handles invalid JSON gracefully', () => {
    const res = importIssuesFromJSON('{ invalid json: string }');
    expect(res.success).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });
});
