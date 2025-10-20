import { motion, AnimatePresence } from 'motion/react';
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

export function WidgetLibrary({ isOpen, onClose, onAddWidget, activeWidgets }: WidgetLibraryProps) {
  const categories = ['core', 'metrics', 'insights', 'planning'];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">Widget Library</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add widgets to customize your dashboard
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-secondary"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {categories.map((category) => {
                  const categoryWidgets = widgetLibrary.filter(w => w.category === category);
                  if (categoryWidgets.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {categoryWidgets.map((widget) => {
                          const Icon = iconMap[widget.icon];
                          const isActive = activeWidgets.includes(widget.type);

                          return (
                            <motion.div
                              key={widget.type}
                              whileHover={{ scale: 1.01 }}
                              className={`
                                p-4 rounded-xl border transition-all
                                ${isActive 
                                  ? 'bg-secondary/50 border-border cursor-not-allowed opacity-60' 
                                  : 'bg-card border-border hover:border-info/30 hover:bg-secondary/30 cursor-pointer'
                                }
                              `}
                              onClick={() => !isActive && onAddWidget(widget.type)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`
                                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                  ${isActive ? 'bg-muted' : 'bg-gradient-to-br from-info/10 to-info/5'}
                                `}>
                                  <Icon className={`w-5 h-5 ${isActive ? 'text-muted-foreground' : 'text-info'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <h4 className="text-sm font-medium text-foreground truncate">
                                      {widget.title}
                                    </h4>
                                    {isActive ? (
                                      <span className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground whitespace-nowrap">
                                        Active
                                      </span>
                                    ) : (
                                      <Plus className="w-4 h-4 text-info flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {widget.description}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-secondary/30">
              <p className="text-xs text-muted-foreground text-center">
                More widgets coming soon! 🚀
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
