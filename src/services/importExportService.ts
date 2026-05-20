import { Issue, Priority, Status, Assignee, Activity } from '../types/issue';

export interface ImportResult {
  success: boolean;
  importedIssues: Issue[];
  errors: string[];
  totalParsed: number;
}

/**
 * Escapes string for CSV output.
 */
function escapeCSVField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exports issue collection as standard RFC-4180 CSV string.
 */
export function exportIssuesToCSV(issues: Issue[]): string {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Status',
    'Priority',
    'Assignee',
    'Labels',
    'Estimate',
    'CreatedAt',
    'UpdatedAt',
  ];

  const rows = issues.map((issue) => [
    escapeCSVField(issue.id),
    escapeCSVField(issue.title),
    escapeCSVField(issue.description),
    escapeCSVField(issue.status),
    escapeCSVField(issue.priority),
    escapeCSVField(issue.assignee ? issue.assignee.name : ''),
    escapeCSVField(issue.labels.join(';')),
    escapeCSVField(issue.estimate),
    escapeCSVField(issue.createdAt),
    escapeCSVField(issue.updatedAt),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Parses RFC-4180 CSV string into records.
 */
export function parseCSV(csvContent: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n in CRLF
        }
        currentRow.push(currentField);
        if (currentRow.some((f) => f.trim().length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Imports issues from parsed CSV records with validation.
 */
export function importIssuesFromCSV(csvContent: string, currentIssueCount = 0): ImportResult {
  const rows = parseCSV(csvContent);
  if (rows.length < 2) {
    return {
      success: false,
      importedIssues: [],
      errors: ['CSV file is empty or missing data rows.'],
      totalParsed: 0,
    };
  }

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const titleIdx = headers.indexOf('title');
  if (titleIdx === -1) {
    return {
      success: false,
      importedIssues: [],
      errors: ['CSV is missing mandatory "Title" column.'],
      totalParsed: 0,
    };
  }

  const descIdx = headers.indexOf('description');
  const statusIdx = headers.indexOf('status');
  const priorityIdx = headers.indexOf('priority');
  const assigneeIdx = headers.indexOf('assignee');
  const labelsIdx = headers.indexOf('labels');
  const estimateIdx = headers.indexOf('estimate');

  const validStatuses: Status[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'canceled'];
  const validPriorities: Priority[] = ['urgent', 'high', 'medium', 'low'];

  const importedIssues: Issue[] = [];
  const errors: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const title = row[titleIdx]?.trim();
    if (!title || title.length < 3) {
      errors.push(`Row ${i + 1}: Invalid or missing title (must be at least 3 characters).`);
      continue;
    }

    const desc = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : '';
    const rawStatus = (statusIdx !== -1 && row[statusIdx] ? row[statusIdx].trim().toLowerCase() : 'todo') as Status;
    const status: Status = validStatuses.includes(rawStatus) ? rawStatus : 'todo';

    const rawPriority = (priorityIdx !== -1 && row[priorityIdx] ? row[priorityIdx].trim().toLowerCase() : 'medium') as Priority;
    const priority: Priority = validPriorities.includes(rawPriority) ? rawPriority : 'medium';

    const assigneeName = assigneeIdx !== -1 && row[assigneeIdx]?.trim() ? row[assigneeIdx].trim() : null;
    const assignee: Assignee | null = assigneeName
      ? {
          id: `user-${assigneeName.toLowerCase().replace(/\s+/g, '-')}`,
          name: assigneeName,
          email: `${assigneeName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          avatarColor: '#3b82f6',
        }
      : null;

    const labels = labelsIdx !== -1 && row[labelsIdx] ? row[labelsIdx].split(';').map((l) => l.trim()).filter(Boolean) : [];
    const estimate = estimateIdx !== -1 && row[estimateIdx] ? parseInt(row[estimateIdx], 10) || 0 : 0;

    const issueId = `ISSUE-${100 + currentIssueCount + importedIssues.length + 1}`;
    const now = new Date().toISOString();

    const activity: Activity = {
      id: `act-import-${issueId}`,
      type: 'created',
      timestamp: now,
      author: 'Import Service',
      details: 'Imported via CSV',
    };

    importedIssues.push({
      id: issueId,
      title,
      description: desc,
      status,
      priority,
      assignee,
      labels,
      estimate,
      createdAt: now,
      updatedAt: now,
      activities: [activity],
    });
  }

  return {
    success: importedIssues.length > 0,
    importedIssues,
    errors,
    totalParsed: rows.length - 1,
  };
}

/**
 * Serializes issue collection to JSON export string.
 */
export function exportIssuesToJSON(issues: Issue[]): string {
  return JSON.stringify(
    {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      issuesCount: issues.length,
      issues,
    },
    null,
    2
  );
}

/**
 * Validates and imports issues from JSON string.
 */
export function importIssuesFromJSON(jsonString: string): ImportResult {
  try {
    const data = JSON.parse(jsonString);
    const rawList = Array.isArray(data) ? data : data.issues;
    if (!Array.isArray(rawList)) {
      return {
        success: false,
        importedIssues: [],
        errors: ['Invalid JSON format: Expected an array of issues or { issues: [...] } object.'],
        totalParsed: 0,
      };
    }

    const importedIssues: Issue[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i];
      if (!item.title || typeof item.title !== 'string' || item.title.trim().length < 3) {
        errors.push(`Item ${i + 1}: Missing or invalid title.`);
        continue;
      }

      const rawAssignee = item.assignee;
      let assignee: Assignee | null = null;
      if (rawAssignee && typeof rawAssignee === 'object') {
        assignee = rawAssignee;
      } else if (typeof rawAssignee === 'string' && rawAssignee.trim()) {
        assignee = {
          id: `user-${rawAssignee.toLowerCase().replace(/\s+/g, '-')}`,
          name: rawAssignee,
          email: `${rawAssignee.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          avatarColor: '#3b82f6',
        };
      }

      importedIssues.push({
        id: item.id || `ISSUE-${100 + importedIssues.length + 1}`,
        title: item.title.trim(),
        description: item.description || '',
        status: item.status || 'todo',
        priority: item.priority || 'medium',
        assignee,
        labels: Array.isArray(item.labels) ? item.labels : [],
        estimate: typeof item.estimate === 'number' ? item.estimate : 0,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        activities: Array.isArray(item.activities) ? item.activities : [],
      });
    }

    return {
      success: importedIssues.length > 0,
      importedIssues,
      errors,
      totalParsed: rawList.length,
    };
  } catch (err) {
    return {
      success: false,
      importedIssues: [],
      errors: [(err as Error).message || 'Failed to parse JSON content.'],
      totalParsed: 0,
    };
  }
}
