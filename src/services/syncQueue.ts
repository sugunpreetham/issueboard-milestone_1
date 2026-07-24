import { StorageService, globalStorage } from './storageService';

export interface QueuedMutation {
  id: string;
  type: 'create_issue' | 'update_status' | 'add_comment' | 'assign_issue';
  payload: Record<string, any>;
  createdAt: string;
  retryCount: number;
  maxRetries: number;
  lastAttemptAt?: string;
  lastError?: string;
}

export class OfflineSyncQueue {
  private queue: QueuedMutation[] = [];
  private storage: StorageService;
  private storageKey: string = 'sync_mutation_queue';

  constructor(storage: StorageService = globalStorage) {
    this.storage = storage;
    this.queue = this.storage.getItem<QueuedMutation[]>(this.storageKey, []);
  }

  public enqueue(
    type: QueuedMutation['type'],
    payload: Record<string, any>,
    maxRetries: number = 3
  ): QueuedMutation {
    const mutation: QueuedMutation = {
      id: `mut-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries,
    };

    this.queue.push(mutation);
    this.persist();
    return mutation;
  }

  public async processQueue(
    handler: (mutation: QueuedMutation) => Promise<boolean>
  ): Promise<{ processed: number; failed: number }> {
    let processed = 0;
    let failed = 0;
    const remaining: QueuedMutation[] = [];

    for (const item of this.queue) {
      item.lastAttemptAt = new Date().toISOString();
      try {
        const success = await handler(item);
        if (success) {
          processed++;
        } else {
          item.retryCount++;
          if (item.retryCount < item.maxRetries) {
            remaining.push(item);
          } else {
            failed++;
          }
        }
      } catch (err) {
        item.retryCount++;
        item.lastError = (err as Error).message;
        if (item.retryCount < item.maxRetries) {
          remaining.push(item);
        } else {
          failed++;
        }
      }
    }

    this.queue = remaining;
    this.persist();
    return { processed, failed };
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public getPendingMutations(): QueuedMutation[] {
    return [...this.queue];
  }

  public clearQueue(): void {
    this.queue = [];
    this.persist();
  }

  private persist(): void {
    this.storage.setItem(this.storageKey, this.queue);
  }
}
