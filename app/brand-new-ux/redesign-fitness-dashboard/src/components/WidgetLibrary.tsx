import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Activity, TrendingUp, Zap, Target, Calendar, Apple, Bike, Heart, Flame } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { WidgetLibraryItem } from '../types/widgets';

interface WidgetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widgetType: string) => void;
  activeWidgets: string[];
}

const widgetLibrary: WidgetLibraryItem[] = [
  {
    type: 'recent-activities',
    title: 'Recent Activities',
    description: 'View your latest workouts and sync from Strava',
    icon: 'Activity',
    category: 'core',
    size: 'tall'
  },
  {
    type: 'weekly-stats',
    title: 'Weekly Stats',
    description: 'Track training days, compliance, load and streak',
    icon: 'TrendingUp',
    category: 'core',
    size: 'medium'
  },
  {
    type: 'readiness',
    title: 'Readiness Score',
    description: 'Monitor how ready you are for training',
    icon: 'Zap',
    category: 'metrics',
    size: 'medium'
  },
  {
    type: 'goal-tracker',
    title: 'Goal Tracker',
    description: 'Track progress towards your next big goal',
    icon: 'Target',
    category: 'planning',
    size: 'medium'
  },
  {
    type: 'quick-tips',
    title: 'Quick Tips',
    description: 'Get personalized training and nutrition tips',
    icon: 'Apple',
    category: 'insights',
    size: 'small'
  },
  {
    type: 'sports-block',
    title: 'Sports Overview',
    description: 'See your activity breakdown by sport type',
    icon: 'Bike',
    category: 'core',
    size: 'medium'
  },
  {
    type: 'plan-updates',
    title: 'Plan Updates',
    description: 'Review and accept AI-suggested plan changes',
    icon: 'Calendar',
    category: 'planning',
    size: 'small'
  },
  {
    type: 'ftp-calculator',
    title: 'FTP Zones',
    description: 'View your power zones and track FTP progress',
    icon: 'Activity',
    category: 'metrics',
    size: 'medium'
  },
  {
    type: 'vo2-max',
    title: 'VO₂ Max',
    description: 'Monitor your aerobic capacity over time',
    icon: 'Heart',
    category: 'metrics',
    size: 'small'
  },
  {
    type: 'calories',
    title: 'Calories Burned',
    description: 'Track weekly calorie expenditure',
    icon: 'Flame',
    category: 'metrics',
    size: 'medium'
  },
  {
    type: 'event-countdown',
    title: 'Event Countdown',
    description: 'Count down to your next race or event',
    icon: 'Calendar',
    category: 'planning',
    size: 'medium'
  }
];

const iconMap: Record<string, any> = {
  Activity,
  TrendingUp,
  Zap,
  Target,
  Apple,
  Bike,
  Calendar,
  Heart,
  Flame
};

export function WidgetLibrary(props: any){
  return null
}
