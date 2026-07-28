import React, { useState } from 'react';
import { MacroDefinition } from '../../types/macro';
import { PRESET_MACROS } from '../../utils/macroRunner';
import { Icon } from '../common/Icon';

export interface MacroRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onApplyMacro: (macro: MacroDefinition) => void;
  macros?: MacroDefinition[];
}

export const MacroRunnerModal: React.FC<MacroRunnerModalProps> = ({
  isOpen,
  onClose,
  selectedCount,
  onApplyMacro,
  macros = PRESET_MACROS,
}) => {
  const [selectedMacroId, setSelectedMacroId] = useState<string>(macros[0]?.id || '');

  if (!isOpen) return null;

  const activeMacro = macros.find((m) => m.id === selectedMacroId) || macros[0];

  const handleExecute = () => {
    if (activeMacro) {
      onApplyMacro(activeMacro);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="macro-modal-title">
      <div className="modal-content modal-macro-runner">
        <div className="modal-header">
          <div>
            <h2 id="macro-modal-title" className="modal-title">Run Automated Macro</h2>
            <p className="text-xs text-muted">
              Apply multiple actions in batch to {selectedCount} selected issue{selectedCount === 1 ? '' : 's'}
            </p>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="macro-picker-list">
          {macros.map((m) => (
            <div
              key={m.id}
              className={`macro-option-card ${m.id === selectedMacroId ? 'selected' : ''}`}
              onClick={() => setSelectedMacroId(m.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedMacroId(m.id);
                }
              }}
            >
              <div className="macro-card-title flex justify-between">
                <strong>{m.name}</strong>
                <span className="text-xs text-muted">{m.actions.length} actions</span>
              </div>
              <p className="text-xs text-muted mt-1">{m.description}</p>
            </div>
          ))}
        </div>

        <div className="modal-actions mt-4">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!activeMacro || selectedCount === 0}
            onClick={handleExecute}
          >
            Apply "{activeMacro?.name}" to {selectedCount} Issues
          </button>
        </div>
      </div>
    </div>
  );
};
