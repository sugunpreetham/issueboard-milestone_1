export type WebhookEvent =
  | 'issue.created'
  | 'issue.updated'
  | 'issue.deleted'
  | 'comment.added'
  | 'milestone.completed';

export interface WebhookEndpoint {
  id: string;
  url: string;
  description?: string;
  secret: string;
  events: WebhookEvent[];
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
}

export interface WebhookDeliveryLog {
  id: string;
  endpointId: string;
  event: WebhookEvent;
  payload: Record<string, any>;
  statusCode: number;
  success: boolean;
  durationMs: number;
  timestamp: string;
  signature: string;
}
