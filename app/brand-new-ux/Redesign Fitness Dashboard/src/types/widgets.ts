export type WidgetType = 
  | 'daily-plan'
  | 'recent-activities'
  | 'weekly-stats'
  | 'readiness'
  | 'quick-tips'
  | 'goal-tracker'
  | 'sports-block'
  | 'plan-updates'
  | 'ftp-calculator'
  | 'vo2-max'
  | 'calories'
  | 'training-streak'
  | 'progress-graph'
  | 'event-countdown';

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  size: WidgetSize;
  category: 'core' | 'metrics' | 'insights' | 'planning';
  isPinned?: boolean;
}

export interface WidgetInstance extends WidgetConfig {
  position: { row: number; col: number };
  isVisible: boolean;
}

export interface WidgetLibraryItem {
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  category: 'core' | 'metrics' | 'insights' | 'planning';
  size: WidgetSize;
  preview?: string;
}
