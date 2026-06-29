import { IssueTemplate } from '../types/template';

export const DEFAULT_TEMPLATES: IssueTemplate[] = [
  {
    id: 'tpl-bug',
    name: 'Bug Report',
    category: 'bug',
    description: 'Report a defect, error, or unexpected application behavior',
    defaultTitlePrefix: '[Bug]: ',
    defaultDescription: '### Steps to Reproduce\n1. Go to...\n2. Click on...\n\n### Expected Behavior\n\n### Actual Behavior\n\n### Environment\n- Browser / OS:\n- App Version:',
    defaultPriority: 'high',
    defaultStatus: 'todo',
    defaultLabels: ['bug', 'triage'],
    checklist: [
      'Verified in latest build',
      'Attached reproduction steps and screenshots',
      'Checked error console logs',
    ],
  },
  {
    id: 'tpl-feature',
    name: 'Feature Request',
    category: 'feature',
    description: 'Propose a new user capability or product enhancement',
    defaultTitlePrefix: '[Feature]: ',
    defaultDescription: '### Problem Statement\n\n### Proposed Solution\n\n### User Value\n\n### Acceptance Criteria\n- [ ] User can...',
    defaultPriority: 'medium',
    defaultStatus: 'backlog',
    defaultLabels: ['feature', 'needs-design'],
    checklist: [
      'Design review completed',
      'UX copy approved',
      'Technical specification documented',
    ],
  },
  {
    id: 'tpl-sec',
    name: 'Security Vulnerability',
    category: 'security',
    description: 'Report a security vulnerability or sensitive compliance defect',
    defaultTitlePrefix: '[Security]: ',
    defaultDescription: '### Vulnerability Summary\n\n### Severity & Impact\n\n### Mitigation Steps\n\n### References / CVE:',
    defaultPriority: 'urgent',
    defaultStatus: 'todo',
    defaultLabels: ['security', 'compliance'],
    checklist: [
      'Immediate mitigation applied',
      'Security team alerted',
      'Regression test added',
    ],
  },
];
