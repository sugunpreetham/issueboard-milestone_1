import { describe, it, expect } from 'vitest';
import { renderTemplateDescription, applyTemplateToPayload } from '../utils/templateEngine';
import { DEFAULT_TEMPLATES } from '../data/mockTemplates';

describe('Issue Template Engine', () => {
  it('renders description with markdown checklist items', () => {
    const bugTemplate = DEFAULT_TEMPLATES.find((t) => t.id === 'tpl-bug')!;
    const rendered = renderTemplateDescription(bugTemplate);

    expect(rendered).toContain('### Steps to Reproduce');
    expect(rendered).toContain('### Task Checklist');
    expect(rendered).toContain('- [ ] Verified in latest build');
  });

  it('applies template defaults with custom title prefixing', () => {
    const featureTemplate = DEFAULT_TEMPLATES.find((t) => t.id === 'tpl-feature')!;
    const payload = applyTemplateToPayload(featureTemplate, 'Export to PDF');

    expect(payload.title).toBe('[Feature]: Export to PDF');
    expect(payload.priority).toBe('medium');
    expect(payload.status).toBe('backlog');
    expect(payload.labels).toContain('feature');
  });

  it('avoids double-prefixing title when prefix is already present', () => {
    const bugTemplate = DEFAULT_TEMPLATES.find((t) => t.id === 'tpl-bug')!;
    const payload = applyTemplateToPayload(bugTemplate, '[Bug]: Crash on logout');

    expect(payload.title).toBe('[Bug]: Crash on logout');
  });
});
