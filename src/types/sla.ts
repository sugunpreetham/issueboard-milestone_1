import { Priority } from './issue';

export type SlaStatus = 'within_target' | 'warning' | 'breached' | 'completed';

export interface SlaPolicy {
  priority: Priority;
  targetResponseHours: number;
  targetResolutionHours: number;
  warningThresholdPercentage: number; // e.g. 75%
}

export interface SlaCalculationResult {
  status: SlaStatus;
  hoursElapsed: number;
  targetHours: number;
  hoursRemaining: number;
  percentElapsed: number;
  isBreached: boolean;
}
