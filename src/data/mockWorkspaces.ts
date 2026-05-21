import { Workspace } from '../types/workspace';

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-eng',
    name: 'Engineering Workspace',
    slug: 'eng-workspace',
    tier: 'enterprise',
    ownerId: 'user-sarah',
    createdAt: '2026-01-01T00:00:00Z',
    limits: {
      maxMembers: 50,
      maxProjects: 20,
      storageQuotaBytes: 10 * 1024 * 1024 * 1024, // 10 GB
      storageUsedBytes: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
      allowCustomWorkflows: true,
      allowAuditLogs: true,
    },
  },
  {
    id: 'ws-design',
    name: 'Product & Design Org',
    slug: 'product-design',
    tier: 'team',
    ownerId: 'user-elena',
    createdAt: '2026-02-01T00:00:00Z',
    limits: {
      maxMembers: 15,
      maxProjects: 5,
      storageQuotaBytes: 2 * 1024 * 1024 * 1024, // 2 GB
      storageUsedBytes: 0.8 * 1024 * 1024 * 1024, // 800 MB
      allowCustomWorkflows: false,
      allowAuditLogs: false,
    },
  },
  {
    id: 'ws-sec',
    name: 'Security & Compliance',
    slug: 'sec-compliance',
    tier: 'enterprise',
    ownerId: 'user-david',
    createdAt: '2026-03-01T00:00:00Z',
    limits: {
      maxMembers: 25,
      maxProjects: 10,
      storageQuotaBytes: 5 * 1024 * 1024 * 1024,
      storageUsedBytes: 4.1 * 1024 * 1024 * 1024, // 82% used
      allowCustomWorkflows: true,
      allowAuditLogs: true,
    },
  },
];
