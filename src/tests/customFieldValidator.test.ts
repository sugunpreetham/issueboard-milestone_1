import { describe, it, expect } from 'vitest';
import { validateCustomFields } from '../utils/customFieldValidator';
import { CustomFieldDefinition } from '../types/customFields';

describe('Custom Field Schema Validator', () => {
  const schema: CustomFieldDefinition[] = [
    {
      id: 'cf-1',
      name: 'Customer Tier',
      key: 'customerTier',
      type: 'select',
      required: true,
      options: ['Tier 1', 'Tier 2', 'Enterprise'],
    },
    {
      id: 'cf-2',
      name: 'Impact Score',
      key: 'impactScore',
      type: 'number',
      min: 1,
      max: 10,
    },
    {
      id: 'cf-3',
      name: 'Documentation Link',
      key: 'docUrl',
      type: 'url',
    },
  ];

  it('approves valid custom field values', () => {
    const values = {
      customerTier: 'Enterprise',
      impactScore: 8,
      docUrl: 'https://docs.example.com/api',
    };

    const res = validateCustomFields(schema, values);
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors)).toHaveLength(0);
  });

  it('flags missing required custom fields', () => {
    const values = {
      impactScore: 5,
    };

    const res = validateCustomFields(schema, values);
    expect(res.isValid).toBe(false);
    expect(res.errors.customerTier).toContain('is required');
  });

  it('validates number bounds and invalid URLs', () => {
    const values = {
      customerTier: 'Tier 1',
      impactScore: 15, // Max is 10
      docUrl: 'not-a-valid-url',
    };

    const res = validateCustomFields(schema, values);
    expect(res.isValid).toBe(false);
    expect(res.errors.impactScore).toContain('must not exceed 10');
    expect(res.errors.docUrl).toContain('valid absolute URL');
  });
});
