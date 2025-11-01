import React from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Button } from './Button';
import { Icon } from './Icon';

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const containerRef = useFocusTrap({ isOpen, onClose });

  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus global search input' },
    { key: 'Escape', description: 'Close modals or deselect active issues' },
    { key: 'Tab / Shift+Tab', description: 'Navigate through interactive elements' },
    { key: 'Enter / Space', description: 'Open issue details or toggle checkboxes' },
    { key: '?', description: 'Open keyboard shortcuts cheatsheet' },
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={containerRef}
        className="modal-container"
        style={{ maxWidth: '480px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dialog-title"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="shortcuts-dialog-title" className="modal-title" style={{ fontSize: '1.15rem' }}>
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close shortcuts dialog"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {shortcuts.map((s) => (
              <div
                key={s.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-app)',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {s.description}
                </span>
                <kbd
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--primary-700)',
                  }}
                >
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} aria-label="Close shortcuts modal">
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};
