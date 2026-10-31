import React from 'react';
import { CustomFieldDefinition, CustomFieldValues } from '../../types/customFields';

export interface CustomFieldsEditorProps {
  definitions: CustomFieldDefinition[];
  values: CustomFieldValues;
  errors?: Record<string, string>;
  onChange: (key: string, value: unknown) => void;
  disabled?: boolean;
}

export const CustomFieldsEditor: React.FC<CustomFieldsEditorProps> = ({
  definitions,
  values,
  errors = {},
  onChange,
  disabled = false,
}) => {
  if (!definitions || definitions.length === 0) return null;

  const renderFieldInput = (def: CustomFieldDefinition) => {
    const value = (values[def.key] ?? def.defaultValue ?? '') as string | number;
    const fieldError = errors[def.key];

    switch (def.type) {
      case 'checkbox':
        return (
          <label className="checkbox-label text-xs">
            <input
              type="checkbox"
              checked={Boolean(value)}
              disabled={disabled}
              onChange={(e) => onChange(def.key, e.target.checked)}
            />
            <span>{def.name}</span>
          </label>
        );

      case 'select':
        return (
          <select
            className={`form-select text-xs ${fieldError ? 'input-error' : ''}`}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(def.key, e.target.value)}
            aria-label={def.name}
          >
            <option value="">Select an option...</option>
            {def.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            className={`form-input text-xs ${fieldError ? 'input-error' : ''}`}
            value={value}
            min={def.min}
            max={def.max}
            disabled={disabled}
            onChange={(e) => onChange(def.key, e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={def.description || `Enter ${def.name.toLowerCase()}...`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className={`form-input text-xs ${fieldError ? 'input-error' : ''}`}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(def.key, e.target.value)}
          />
        );

      case 'url':
      case 'text':
      default:
        return (
          <input
            type={def.type === 'url' ? 'url' : 'text'}
            className={`form-input text-xs ${fieldError ? 'input-error' : ''}`}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(def.key, e.target.value)}
            placeholder={def.description || `Enter ${def.name.toLowerCase()}...`}
          />
        );
    }
  };

  return (
    <div className="custom-fields-container" role="region" aria-label="Custom Fields">
      <h3 className="section-title text-xs font-bold uppercase tracking-wider text-muted mb-2">
        Custom Attributes
      </h3>

      <div className="custom-fields-grid">
        {definitions.map((def) => {
          const fieldError = errors[def.key];
          return (
            <div key={def.id} className="custom-field-item">
              {def.type !== 'checkbox' && (
                <label className="field-label text-xs font-semibold">
                  {def.name}
                  {def.required && <span className="text-danger ml-1">*</span>}
                </label>
              )}

              {renderFieldInput(def)}

              {fieldError && <span className="field-error-text text-xs text-danger">{fieldError}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
