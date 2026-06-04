import React, { useEffect, useRef } from 'react';
import { CommandItem } from '../../types/commandPalette';
import { Icon } from './Icon';

export interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedIndex: number;
  onSelectIndex: (idx: number) => void;
  onExecute: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  commands,
  searchQuery,
  onSearchChange,
  selectedIndex,
  onSelectIndex,
  onExecute,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      onSelectIndex(commands.length > 0 ? (selectedIndex + 1) % commands.length : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onSelectIndex(commands.length > 0 ? (selectedIndex - 1 + commands.length) % commands.length : 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onExecute();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop command-palette-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onClick={onClose}
    >
      <div
        className="command-palette-container"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="command-palette-input-box">
          <div className="command-search-icon" aria-hidden="true">
            <Icon name="search" size={16} />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder="Type a command or search actions (e.g., 'view', 'dark', 'filter')..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Command search"
          />
          <kbd className="command-esc-badge" onClick={onClose}>
            ESC
          </kbd>
        </div>

        <div className="command-palette-results" role="listbox">
          {commands.length === 0 ? (
            <div className="command-empty-state text-sm text-muted">
              No matching commands or actions found.
            </div>
          ) : (
            commands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`command-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    cmd.handler();
                    onClose();
                  }}
                  onMouseEnter={() => onSelectIndex(idx)}
                >
                  <div className="command-item-main">
                    <span className="command-item-title">{cmd.title}</span>
                    {cmd.subtitle && (
                      <span className="command-item-subtitle text-xs text-muted">
                        {cmd.subtitle}
                      </span>
                    )}
                  </div>

                  <div className="command-item-meta">
                    <span className="command-category-tag text-xs">{cmd.category}</span>
                    {cmd.shortcut && <kbd className="command-shortcut-kbd">{cmd.shortcut}</kbd>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
