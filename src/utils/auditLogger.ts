import { AuditLogEntry, AuditCategory, AuditSeverity, AuditQueryFilter } from '../types/auditLog';

/**
 * Computes deterministic simple hash for audit log tamper verification.
 */
export function computeAuditHash(
  previousHash: string,
  timestamp: string,
  actorId: string,
  action: string,
  targetId: string = ''
): string {
  const payload = `${previousHash}|${timestamp}|${actorId}|${action}|${targetId}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export class AuditLogStore {
  private logs: AuditLogEntry[] = [];
  private lastHash: string = '00000000';

  constructor(initialLogs: AuditLogEntry[] = []) {
    if (initialLogs.length > 0) {
      this.logs = [...initialLogs];
      this.lastHash = initialLogs[initialLogs.length - 1].hash;
    }
  }

  public recordEvent(payload: {
    actorId: string;
    actorName: string;
    category: AuditCategory;
    action: string;
    severity?: AuditSeverity;
    targetId?: string;
    targetType?: string;
    metadata?: Record<string, any>;
  }): AuditLogEntry {
    const timestamp = new Date().toISOString();
    const hash = computeAuditHash(
      this.lastHash,
      timestamp,
      payload.actorId,
      payload.action,
      payload.targetId
    );

    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actorId: payload.actorId,
      actorName: payload.actorName,
      category: payload.category,
      action: payload.action,
      severity: payload.severity || 'info',
      targetId: payload.targetId,
      targetType: payload.targetType,
      timestamp,
      metadata: payload.metadata,
      previousHash: this.lastHash,
      hash,
    };

    this.logs.push(entry);
    this.lastHash = hash;
    return entry;
  }

  public verifyChainIntegrity(): { isValid: boolean; brokenAtIndex?: number } {
    let prev = '00000000';
    for (let i = 0; i < this.logs.length; i++) {
      const entry = this.logs[i];
      if (entry.previousHash !== prev) {
        return { isValid: false, brokenAtIndex: i };
      }
      const expected = computeAuditHash(
        prev,
        entry.timestamp,
        entry.actorId,
        entry.action,
        entry.targetId
      );
      if (entry.hash !== expected) {
        return { isValid: false, brokenAtIndex: i };
      }
      prev = entry.hash;
    }
    return { isValid: true };
  }

  public queryLogs(filter: AuditQueryFilter): AuditLogEntry[] {
    return this.logs.filter((log) => {
      if (filter.category && filter.category !== 'all' && log.category !== filter.category) {
        return false;
      }
      if (filter.severity && filter.severity !== 'all' && log.severity !== filter.severity) {
        return false;
      }
      if (filter.searchQuery && filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        const matches =
          log.action.toLowerCase().includes(q) ||
          log.actorName.toLowerCase().includes(q) ||
          (log.targetId && log.targetId.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }

  public getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }
}
