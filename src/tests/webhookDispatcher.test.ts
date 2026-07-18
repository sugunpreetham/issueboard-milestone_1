import { describe, it, expect } from 'vitest';
import { WebhookDispatcher, generateWebhookSignature } from '../utils/webhookDispatcher';

describe('Webhook Event Dispatcher Simulator', () => {
  it('generates consistent HMAC-style signatures', () => {
    const sig1 = generateWebhookSignature('secret123', '{"event":"issue.created"}');
    const sig2 = generateWebhookSignature('secret123', '{"event":"issue.created"}');
    expect(sig1).toBe(sig2);
    expect(sig1).toContain('sha256=');
  });

  it('registers valid endpoints and rejects invalid URLs', () => {
    const dispatcher = new WebhookDispatcher();

    const validRes = dispatcher.registerEndpoint({
      url: 'https://hooks.slack.com/services/123',
      events: ['issue.created'],
    });
    expect(validRes.success).toBe(true);
    expect(validRes.endpoint).toBeDefined();

    const invalidRes = dispatcher.registerEndpoint({
      url: 'not-a-url',
      events: ['issue.created'],
    });
    expect(invalidRes.success).toBe(false);
  });

  it('dispatches events only to subscribed endpoints with valid signatures', () => {
    const dispatcher = new WebhookDispatcher();

    dispatcher.registerEndpoint({
      url: 'https://ci.example.com/webhook',
      events: ['issue.created', 'milestone.completed'],
    });

    dispatcher.registerEndpoint({
      url: 'https://analytics.example.com/webhook',
      events: ['comment.added'],
    });

    const logs = dispatcher.dispatchEvent('issue.created', { id: 'ISSUE-1', title: 'Bug' });
    expect(logs).toHaveLength(1);
    expect(logs[0].success).toBe(true);
    expect(logs[0].event).toBe('issue.created');
    expect(logs[0].signature).toBeDefined();
  });
});
