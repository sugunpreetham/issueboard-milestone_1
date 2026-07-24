import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storageService';
import { OfflineSyncQueue } from '../services/syncQueue';

describe('StorageService & OfflineSyncQueue', () => {
  let storage: StorageService;
  let syncQueue: OfflineSyncQueue;

  beforeEach(() => {
    storage = new StorageService('test_prefix:');
    syncQueue = new OfflineSyncQueue(storage);
    syncQueue.clearQueue();
  });

  it('persists and retrieves items through storage abstraction', () => {
    storage.setItem('user_theme', { mode: 'dark', contrast: 'high' });
    const val = storage.getItem('user_theme', { mode: 'light' });

    expect(val).toEqual({ mode: 'dark', contrast: 'high' });
  });

  it('enqueues mutations and processes them successfully', async () => {
    syncQueue.enqueue('update_status', { issueId: 'ISSUE-101', nextStatus: 'done' });
    expect(syncQueue.getQueueLength()).toBe(1);

    const result = await syncQueue.processQueue(async (mutation) => {
      expect(mutation.type).toBe('update_status');
      return true;
    });

    expect(result.processed).toBe(1);
    expect(syncQueue.getQueueLength()).toBe(0);
  });

  it('retries failed mutations until maxRetries limit is reached', async () => {
    syncQueue.enqueue('create_issue', { title: 'Test' }, 2);

    // First attempt fails
    await syncQueue.processQueue(async () => false);
    expect(syncQueue.getQueueLength()).toBe(1);

    // Second attempt fails, exhausting maxRetries = 2
    const finalRes = await syncQueue.processQueue(async () => false);
    expect(finalRes.failed).toBe(1);
    expect(syncQueue.getQueueLength()).toBe(0);
  });
});
