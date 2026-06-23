import {
  CustomFieldDefinition,
  CustomFieldValues,
  CustomFieldValidationResult,
} from '../types/customFields';

/**
 * Validates a map of custom field values against field schema definitions.
 */
export function validateCustomFields(
  definitions: CustomFieldDefinition[],
  values: CustomFieldValues
): CustomFieldValidationResult {
  const errors: Record<string, string> = {};

  for (const def of definitions) {
    const val = values[def.key];

    // Check required constraint
    if (def.required) {
      if (val === undefined || val === null || val === '') {
        errors[def.key] = `${def.name} is required.`;
        continue;
      }
    }

    if (val === undefined || val === null || val === '') {
      continue;
    }

    // Type-specific validations
    if (def.type === 'number') {
      const num = Number(val);
      if (isNaN(num)) {
        errors[def.key] = `${def.name} must be a valid number.`;
      } else {
        if (def.min !== undefined && num < def.min) {
          errors[def.key] = `${def.name} must be at least ${def.min}.`;
        }
        if (def.max !== undefined && num > def.max) {
          errors[def.key] = `${def.name} must not exceed ${def.max}.`;
        }
      }
    } else if (def.type === 'select') {
      if (def.options && def.options.length > 0) {
        if (!def.options.includes(String(val))) {
          errors[def.key] = `${def.name} must be one of: ${def.options.join(', ')}.`;
        }
      }
    } else if (def.type === 'url') {
      try {
        new URL(String(val));
      } catch {
        errors[def.key] = `${def.name} must be a valid absolute URL.`;
      }
    } else if (def.type === 'date') {
      const d = new Date(String(val));
      if (isNaN(d.getTime())) {
        errors[def.key] = `${def.name} must be a valid date.`;
      }
    }

    // Custom regex pattern validation for text
    if (def.pattern && (def.type === 'text' || def.type === 'url')) {
      try {
        const regex = new RegExp(def.pattern);
        if (!regex.test(String(val))) {
          errors[def.key] = `${def.name} format is invalid.`;
        }
      } catch {
        // Ignore invalid regex patterns
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
