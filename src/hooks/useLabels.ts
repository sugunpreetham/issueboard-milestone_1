import { useState, useCallback } from 'react';
import { LabelDefinition, LabelPayload } from '../types/label';
import { INITIAL_LABELS } from '../data/mockLabels';

export interface UseLabelsResult {
  labels: LabelDefinition[];
  getLabel: (name: string) => LabelDefinition | undefined;
  createLabel: (payload: LabelPayload) => {
    success: boolean;
    label?: LabelDefinition;
    error?: string;
  };
  updateLabel: (
    id: string,
    updates: Partial<LabelPayload>
  ) => { success: boolean; label?: LabelDefinition; error?: string };
  deleteLabel: (id: string) => boolean;
}

export function useLabels(initialLabels: LabelDefinition[] = INITIAL_LABELS): UseLabelsResult {
  const [labels, setLabels] = useState<LabelDefinition[]>(initialLabels);

  const getLabel = useCallback(
    (name: string) => {
      const lower = name.toLowerCase().trim();
      return labels.find((l) => l.name.toLowerCase() === lower);
    },
    [labels]
  );

  const createLabel = useCallback(
    (payload: LabelPayload) => {
      const trimmedName = payload.name.trim().toLowerCase();
      if (!trimmedName || trimmedName.length < 2) {
        return { success: false, error: 'Label name must be at least 2 characters.' };
      }
      if (labels.some((l) => l.name.toLowerCase() === trimmedName)) {
        return { success: false, error: `Label "${trimmedName}" already exists.` };
      }

      const newLabel: LabelDefinition = {
        id: `lbl-${Date.now()}`,
        name: trimmedName,
        category: payload.category || 'custom',
        color: payload.color || '#3b82f6',
        description: payload.description || '',
        usageCount: 0,
      };

      setLabels((prev) => [...prev, newLabel]);
      return { success: true, label: newLabel };
    },
    [labels]
  );

  const updateLabel = useCallback(
    (id: string, updates: Partial<LabelPayload>) => {
      const existing = labels.find((l) => l.id === id);
      if (!existing) {
        return { success: false, error: 'Label not found.' };
      }

      if (updates.name !== undefined) {
        const trimmed = updates.name.trim().toLowerCase();
        if (!trimmed || trimmed.length < 2) {
          return { success: false, error: 'Label name must be at least 2 characters.' };
        }
        if (labels.some((l) => l.id !== id && l.name.toLowerCase() === trimmed)) {
          return { success: false, error: `Label "${trimmed}" already exists.` };
        }
      }

      let updated: LabelDefinition | undefined;
      setLabels((prev) =>
        prev.map((l) => {
          if (l.id !== id) return l;
          updated = {
            ...l,
            ...updates,
            name: updates.name ? updates.name.trim().toLowerCase() : l.name,
          };
          return updated;
        })
      );

      return { success: true, label: updated };
    },
    [labels]
  );

  const deleteLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
    return true;
  }, []);

  return {
    labels,
    getLabel,
    createLabel,
    updateLabel,
    deleteLabel,
  };
}
