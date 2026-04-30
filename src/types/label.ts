export type LabelCategory = 'type' | 'area' | 'priority' | 'status' | 'team' | 'custom';

export interface LabelDefinition {
  id: string;
  name: string;
  category: LabelCategory;
  color: string; // Hex color
  description: string;
  usageCount: number;
}

export interface LabelPayload {
  name: string;
  category?: LabelCategory;
  color: string;
  description?: string;
}
