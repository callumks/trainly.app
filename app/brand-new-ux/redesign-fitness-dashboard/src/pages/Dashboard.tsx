import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Activity } from 'lucide-react';
import { Widget } from '../components/Widget';
import { DailyPlanWidget } from '../components/widgets/DailyPlanWidget';
import { RecentActivitiesWidget } from '../components/widgets/RecentActivitiesWidget';
import { WeeklyStatsWidget } from '../components/widgets/WeeklyStatsWidget';
import { ReadinessWidget } from '../components/widgets/ReadinessWidget';
import { QuickTipsWidget } from '../components/widgets/QuickTipsWidget';
import { GoalTrackerWidget } from '../components/widgets/GoalTrackerWidget';
import { SportsBlockWidget } from '../components/widgets/SportsBlockWidget';
import { PlanUpdatesWidget } from '../components/widgets/PlanUpdatesWidget';
import { FTPCalculatorWidget } from '../components/widgets/FTPCalculatorWidget';
import { VO2MaxWidget } from '../components/widgets/VO2MaxWidget';
import { CaloriesWidget } from '../components/widgets/CaloriesWidget';
import { EventCountdownWidget } from '../components/widgets/EventCountdownWidget';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

interface DashboardProps {
  isEditMode: boolean;
  activeWidgets: string[];
  onRemoveWidget: (widgetId: string) => void;
}

export function Dashboard({ isEditMode, activeWidgets, onRemoveWidget }: DashboardProps) {
  const widgetComponents: Record<string, JSX.Element> = {
    'daily-plan': <DailyPlanWidget />,
    'recent-activities': <RecentActivitiesWidget />,
    'weekly-stats': <WeeklyStatsWidget />,
    'readiness': <ReadinessWidget />,
    'quick-tips': <QuickTipsWidget />,
    'goal-tracker': <GoalTrackerWidget />,
    'sports-block': <SportsBlockWidget />,
    'plan-updates': <PlanUpdatesWidget />,
    'ftp-calculator': <FTPCalculatorWidget />,
    'vo2-max': <VO2MaxWidget />,
    'calories': <CaloriesWidget />,
    'event-countdown': <EventCountdownWidget />
  };

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-14 h-14 ring-2 ring-border">
            <AvatarFallback className="bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white font-medium">CS</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-foreground">Hey Callum 👋</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Ready for today's workout?</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="hover:bg-secondary h-8 gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-xs">Goals</span>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-secondary h-8 gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-xs">Stats</span>
          </Button>
        </div>
      </motion.div>

      {/* Modular Widget Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 auto-rows-min">
        {/* Left Column - Tall widgets */}
        <div className="xl:col-span-3 space-y-6">
          <AnimatePresence mode="popLayout">
            {activeWidgets.includes('recent-activities') && (
              <Widget
                key="recent-activities"
                id="recent-activities"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('recent-activities')}
                className="min-h-[600px]"
              >
                {widgetComponents['recent-activities']}
              </Widget>
            )}
          </AnimatePresence>
        </div>

        {/* Center Column - Daily Plan (Pinned) + Supporting Widgets */}
        <div className="xl:col-span-6 space-y-6">
          {/* Daily Plan - Always Pinned */}
          <Widget
            id="daily-plan"
            isPinned={true}
            isEditMode={isEditMode}
          >
            {widgetComponents['daily-plan']}
          </Widget>

          {/* Weekly Stats */}
          <AnimatePresence mode="popLayout">
            {activeWidgets.includes('weekly-stats') && (
              <Widget
                key="weekly-stats"
                id="weekly-stats"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('weekly-stats')}
              >
                {widgetComponents['weekly-stats']}
              </Widget>
            )}

            {activeWidgets.includes('sports-block') && (
              <Widget
                key="sports-block"
                id="sports-block"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('sports-block')}
              >
                {widgetComponents['sports-block']}
              </Widget>
            )}

            {activeWidgets.includes('quick-tips') && (
              <Widget
                key="quick-tips"
                id="quick-tips"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('quick-tips')}
              >
                {widgetComponents['quick-tips']}
              </Widget>
            )}

            {activeWidgets.includes('event-countdown') && (
              <Widget
                key="event-countdown"
                id="event-countdown"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('event-countdown')}
              >
                {widgetComponents['event-countdown']}
              </Widget>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Metrics & Insights */}
        <div className="xl:col-span-3 space-y-4">
          <AnimatePresence mode="popLayout">
            {activeWidgets.includes('plan-updates') && (
              <Widget
                key="plan-updates"
                id="plan-updates"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('plan-updates')}
              >
                {widgetComponents['plan-updates']}
              </Widget>
            )}

            {activeWidgets.includes('readiness') && (
              <Widget
                key="readiness"
                id="readiness"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('readiness')}
              >
                {widgetComponents['readiness']}
              </Widget>
            )}

            {activeWidgets.includes('goal-tracker') && (
              <Widget
                key="goal-tracker"
                id="goal-tracker"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('goal-tracker')}
              >
                {widgetComponents['goal-tracker']}
              </Widget>
            )}

            {activeWidgets.includes('ftp-calculator') && (
              <Widget
                key="ftp-calculator"
                id="ftp-calculator"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('ftp-calculator')}
              >
                {widgetComponents['ftp-calculator']}
              </Widget>
            )}

            {activeWidgets.includes('vo2-max') && (
              <Widget
                key="vo2-max"
                id="vo2-max"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('vo2-max')}
              >
                {widgetComponents['vo2-max']}
              </Widget>
            )}

            {activeWidgets.includes('calories') && (
              <Widget
                key="calories"
                id="calories"
                isEditMode={isEditMode}
                onRemove={() => onRemoveWidget('calories')}
              >
                {widgetComponents['calories']}
              </Widget>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
