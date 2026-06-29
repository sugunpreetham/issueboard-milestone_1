import { IssueTemplate } from '../types/template';

/**
 * Generates formatted description text including markdown task checklist.
 */
export function renderTemplateDescription(template: IssueTemplate): string {
  let output = template.defaultDescription.trim();

  if (template.checklist && template.checklist.length > 0) {
    output += '\n\n### Task Checklist\n';
    output += template.checklist.map((item) => `- [ ] ${item}`).join('\n');
  }

  return output;
}

/**
 * Applies template defaults to an issue payload.
 */
export function applyTemplateToPayload(
  template: IssueTemplate,
  customTitle: string = ''
) {
  const finalTitle = customTitle.trim()
    ? customTitle.startsWith(template.defaultTitlePrefix)
      ? customTitle.trim()
      : `${template.defaultTitlePrefix}${customTitle.trim()}`
    : template.defaultTitlePrefix;

  return {
    title: finalTitle,
    description: renderTemplateDescription(template),
    priority: template.defaultPriority,
    status: template.defaultStatus,
    labels: [...template.defaultLabels],
  };
}
