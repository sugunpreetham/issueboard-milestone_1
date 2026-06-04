import { describe, it, expect } from 'vitest';
import { AuditLogStore, computeAuditHash } from '../utils/auditLogger';

describe('Audit Log & Tamper Verification Engine', () => {
  it('computes deterministic audit hashes', () => {
    const h1 = computeAuditHash('00000000', '2026-01-01T00:00:00Z', 'user-1', 'issue:create', 'ISSUE-101');
    const h2 = computeAuditHash('00000000', '2026-01-01T00:00:00Z', 'user-1', 'issue:create', 'ISSUE-101');
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(8);
  });

  it('records events and maintains cryptographically linked chain', () => {
    const store = new AuditLogStore();

    store.recordEvent({
      actorId: 'user-sarah',
      actorName: 'Sarah Chen',
      category: 'issue_mutation',
      action: 'Created issue ISSUE-101',
      targetId: 'ISSUE-101',
    });

    store.recordEvent({
      actorId: 'user-alex',
      actorName: 'Alex Rivera',
      category: 'workflow_transition',
      action: 'Moved ISSUE-101 to in_progress',
      targetId: 'ISSUE-101',
    });

    const logs = store.getLogs();
    expect(logs).toHaveLength(2);
    expect(logs[1].previousHash).toBe(logs[0].hash);
    expect(store.verifyChainIntegrity().isValid).toBe(true);
  });

  it('filters audit records by category and search keyword', () => {
    const store = new AuditLogStore();

    store.recordEvent({
      actorId: 'user-1',
      actorName: 'Sarah',
      category: 'data_export',
      action: 'Exported CSV records',
    });

    store.recordEvent({
      actorId: 'user-2',
      actorName: 'David',
      category: 'auth',
      action: 'User signed in',
    });

    const exportLogs = store.queryLogs({ category: 'data_export' });
    expect(exportLogs).toHaveLength(1);
    expect(exportLogs[0].action).toContain('Exported CSV');

    const searchLogs = store.queryLogs({ searchQuery: 'David' });
    expect(searchLogs).toHaveLength(1);
  });
});
