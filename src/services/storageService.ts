/**
 * Typed LocalStorage persistence abstraction with memory fallback for SSR/testing.
 */
export class StorageService {
  private memoryStore: Map<string, string> = new Map();
  private prefix: string;

  constructor(prefix: string = 'issueboard_v1:') {
    this.prefix = prefix;
  }

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      const fullKey = `${this.prefix}${key}`;
      let raw: string | null = null;

      if (typeof window !== 'undefined' && window.localStorage) {
        raw = window.localStorage.getItem(fullKey);
      } else {
        raw = this.memoryStore.get(fullKey) || null;
      }

      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    try {
      const fullKey = `${this.prefix}${key}`;
      const serialized = JSON.stringify(value);

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(fullKey, serialized);
      }
      this.memoryStore.set(fullKey, serialized);
      return true;
    } catch {
      return false;
    }
  }

  public removeItem(key: string): boolean {
    try {
      const fullKey = `${this.prefix}${key}`;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(fullKey);
      }
      this.memoryStore.delete(fullKey);
      return true;
    } catch {
      return false;
    }
  }

  public clearAll(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(this.prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    }
    this.memoryStore.clear();
  }
}

export const globalStorage = new StorageService();
