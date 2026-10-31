import { WebhookEndpoint, WebhookDeliveryLog, WebhookEvent } from '../types/webhook';

/**
 * Computes payload signature using simple deterministic hash.
 */
export function generateWebhookSignature(secret: string, payloadStr: string): string {
  const combined = `${secret}:${payloadStr}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256=${Math.abs(hash).toString(16).padStart(12, '0')}`;
}

export class WebhookDispatcher {
  private endpoints: WebhookEndpoint[] = [];
  private deliveryHistory: WebhookDeliveryLog[] = [];

  constructor(initialEndpoints: WebhookEndpoint[] = []) {
    this.endpoints = [...initialEndpoints];
  }

  public registerEndpoint(payload: {
    url: string;
    description?: string;
    events: WebhookEvent[];
    secret?: string;
  }): { success: boolean; endpoint?: WebhookEndpoint; error?: string } {
    try {
      new URL(payload.url);
    } catch {
      return { success: false, error: 'Invalid webhook target URL.' };
    }

    if (!payload.events || payload.events.length === 0) {
      return { success: false, error: 'At least one event subscription is required.' };
    }

    const endpoint: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url: payload.url,
      description: payload.description,
      secret: payload.secret || `whsec_${Math.random().toString(36).slice(2, 10)}`,
      events: [...payload.events],
      isActive: true,
      createdAt: new Date().toISOString(),
      failureCount: 0,
    };

    this.endpoints.push(endpoint);
    return { success: true, endpoint };
  }

  public dispatchEvent(
    event: WebhookEvent,
    payloadData: Record<string, unknown>
  ): WebhookDeliveryLog[] {
    const subscribers = this.endpoints.filter(
      (ep) => ep.isActive && ep.events.includes(event)
    );

    const logs: WebhookDeliveryLog[] = [];
    const payloadStr = JSON.stringify(payloadData);

    for (const ep of subscribers) {
      const signature = generateWebhookSignature(ep.secret, payloadStr);
      const deliveryLog: WebhookDeliveryLog = {
        id: `del-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        endpointId: ep.id,
        event,
        payload: payloadData,
        statusCode: 200,
        success: true,
        durationMs: Math.floor(Math.random() * 40) + 10,
        timestamp: new Date().toISOString(),
        signature,
      };

      ep.lastTriggeredAt = deliveryLog.timestamp;
      this.deliveryHistory.push(deliveryLog);
      logs.push(deliveryLog);
    }

    return logs;
  }

  public getEndpoints(): WebhookEndpoint[] {
    return [...this.endpoints];
  }

  public getDeliveryLogs(endpointId?: string): WebhookDeliveryLog[] {
    if (endpointId) {
      return this.deliveryHistory.filter((l) => l.endpointId === endpointId);
    }
    return [...this.deliveryHistory];
  }
}
