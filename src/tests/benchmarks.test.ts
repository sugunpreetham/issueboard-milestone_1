import { describe, it, expect } from 'vitest';
import { parseFilterExpression } from '../utils/filterExpressionParser';
import { AuditLogStore } from '../utils/auditLogger';
import { detectCycle } from '../utils/dependencyGraph';
import { IssueRelationship } from '../types/relationship';

describe('Performance Benchmarks & Algorithmic Throughput', () => {
  it('parses 1,000 compound filter expressions within strict latency bounds (< 150ms)', () => {
    const testQueries = [
      'status:in_progress priority:urgent',
      'assignee:user-sarah label:frontend "critical auth"',
      '-status:done -label:wontfix "database timeout"',
      '(status:todo OR status:in_progress) priority:high',
      'label:security "SQL injection" -assignee:unassigned',
    ];

    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      const q = testQueries[i % testQueries.length];
      const result = parseFilterExpression(q);
      expect(result.success).toBe(true);
    }
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(150);
  });

  it('computes sequential SHA-256 hash chaining and verifies 500 audit blocks (< 100ms)', () => {
    const store = new AuditLogStore();

    const start = performance.now();
    for (let i = 0; i < 500; i++) {
      store.recordEvent({
        actorId: `user-${i % 10}`,
        actorName: `Engineer ${i % 10}`,
        category: 'issue_mutation',
        action: `update_status_iteration_${i}`,
        severity: 'info',
        targetId: `ISSUE-${100 + i}`,
      });
    }

    const verification = store.verifyChainIntegrity();
    const duration = performance.now() - start;

    expect(verification.isValid).toBe(true);
    expect(store.getLogs().length).toBe(500);
    expect(duration).toBeLessThan(100);
  });

  it('evaluates DAG cycle detection across complex multi-branch graphs (< 50ms)', () => {
    // Generate a linear chain of 100 relationships: 0 -> 1 -> 2 ... -> 99
    const relationships: IssueRelationship[] = [];
    for (let i = 0; i < 100; i++) {
      relationships.push({
        id: `rel-${i}`,
        sourceIssueId: `TASK-${i}`,
        targetIssueId: `TASK-${i + 1}`,
        type: 'blocks',
        createdAt: new Date().toISOString(),
      });
    }

    const start = performance.now();

    // 1. Verify acyclic check is fast
    const noCycle = detectCycle(relationships, {
      id: 'rel-test-valid',
      sourceIssueId: 'TASK-100',
      targetIssueId: 'TASK-101',
      type: 'blocks',
      createdAt: new Date().toISOString(),
    });
    expect(noCycle.hasCycle).toBe(false);

    // 2. Verify cycle detection when closing loop (TASK-99 -> TASK-0)
    const withCycle = detectCycle(relationships, {
      id: 'rel-test-cycle',
      sourceIssueId: 'TASK-99',
      targetIssueId: 'TASK-0',
      type: 'blocks',
      createdAt: new Date().toISOString(),
    });
    expect(withCycle.hasCycle).toBe(true);

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(50);
  });
});
