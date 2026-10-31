export type CustomFieldType = 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'url';

export interface CustomFieldDefinition {
  id: string;
  name: string;
  key: string;
  type: CustomFieldType;
  required?: boolean;
  defaultValue?: unknown;
  options?: string[]; // For select type
  min?: number;
  max?: number;
  pattern?: string; // Regex pattern for text/url
  description?: string;
}

export type CustomFieldValues = Record<string, unknown>;

export interface CustomFieldValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
