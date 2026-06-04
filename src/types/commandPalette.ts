export type CommandCategory = 'navigation' | 'actions' | 'filters' | 'views' | 'theme';

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: CommandCategory;
  shortcut?: string;
  icon?: string;
  handler: () => void;
}
