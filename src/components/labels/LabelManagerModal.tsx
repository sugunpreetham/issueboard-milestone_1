import React, { useState } from 'react';
import { LabelDefinition, LabelPayload } from '../../types/label';
import { Icon } from '../common/Icon';
import { ColorPicker } from './ColorPicker';

export interface LabelManagerModalProps {
  isOpen: boolean;
  labels: LabelDefinition[];
  onClose: () => void;
  onCreateLabel: (payload: LabelPayload) => { success: boolean; error?: string };
  onDeleteLabel: (id: string) => boolean;
}

export const LabelManagerModal: React.FC<LabelManagerModalProps> = ({
  isOpen,
  labels,
  onClose,
  onCreateLabel,
  onDeleteLabel,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'type' | 'area' | 'priority' | 'custom'>('area');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = onCreateLabel({
      name: name.trim(),
      color,
      description: description.trim(),
      category,
    });

    if (!res.success) {
      setError(res.error || 'Failed to create label.');
      return;
    }

    setName('');
    setDescription('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-content label-manager-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="label-manager-title"
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <Icon name="tag" size={20} className="modal-icon" />
            <h2 id="label-manager-title">Manage Labels & Taxonomy</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            aria-label="Close label manager"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleCreate} className="create-label-form">
            <h3>Create New Label</h3>
            {error && <div className="error-banner">{error}</div>}

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="new-label-name">Label Name</label>
                <input
                  id="new-label-name"
                  type="text"
                  className="text-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. documentation, billing"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-label-cat">Category</label>
                <select
                  id="new-label-cat"
                  className="select-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'type' | 'area' | 'priority' | 'custom')}
                >
                  <option value="type">Type</option>
                  <option value="area">Area</option>
                  <option value="priority">Priority</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Color</label>
              <ColorPicker selectedColor={color} onChange={setColor} />
            </div>

            <div className="form-group">
              <label htmlFor="new-label-desc">Description</label>
              <input
                id="new-label-desc"
                type="text"
                className="text-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of this label"
              />
            </div>

            <div className="form-actions-right">
              <button type="submit" className="btn btn-primary btn-sm">
                Add Label
              </button>
            </div>
          </form>

          <div className="existing-labels-section">
            <h3>Existing Labels ({labels.length})</h3>
            <div className="labels-table-wrapper">
              <table className="labels-table">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((lbl) => (
                    <tr key={lbl.id}>
                      <td>
                        <span
                          className="label-pill-preview"
                          style={{
                            backgroundColor: `${lbl.color}20`,
                            color: lbl.color,
                            borderColor: `${lbl.color}40`,
                          }}
                        >
                          <span
                            className="label-dot"
                            style={{ backgroundColor: lbl.color }}
                          />
                          {lbl.name}
                        </span>
                      </td>
                      <td>
                        <span className="category-tag">[{lbl.category}]</span>
                      </td>
                      <td className="text-muted text-sm">{lbl.description || '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-icon btn-delete-label"
                          onClick={() => onDeleteLabel(lbl.id)}
                          aria-label={`Delete label ${lbl.name}`}
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
