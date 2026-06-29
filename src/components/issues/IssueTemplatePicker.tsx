import React from 'react';
import { IssueTemplate } from '../../types/template';
import { DEFAULT_TEMPLATES } from '../../data/mockTemplates';
import { Icon } from '../common/Icon';

export interface IssueTemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: IssueTemplate) => void;
  templates?: IssueTemplate[];
}

export const IssueTemplatePicker: React.FC<IssueTemplatePickerProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  templates = DEFAULT_TEMPLATES,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="template-picker-title">
      <div className="modal-content modal-template-picker">
        <div className="modal-header">
          <div>
            <h2 id="template-picker-title" className="modal-title">Choose Issue Template</h2>
            <p className="text-xs text-muted">Start with pre-formatted checklists and standard labels</p>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="template-grid">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="template-card"
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectTemplate(tpl);
                  onClose();
                }
              }}
            >
              <div className="template-card-header">
                <strong className="template-title">{tpl.name}</strong>
                <span className={`badge badge-subtle badge-${tpl.category}`}>{tpl.category}</span>
              </div>
              <p className="template-desc text-xs text-muted">{tpl.description}</p>
              <div className="template-meta-tags">
                <span className="text-xs">Priority: <strong>{tpl.defaultPriority}</strong></span>
                <span className="text-xs">Checklist: <strong>{tpl.checklist.length} items</strong></span>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Blank Issue (No Template)
          </button>
        </div>
      </div>
    </div>
  );
};
