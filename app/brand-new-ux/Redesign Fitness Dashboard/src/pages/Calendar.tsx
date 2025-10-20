import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Bike, Footprints, Dumbbell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';

export function Calendar() {
  const [currentMonth] = useState(new Date(2025, 9)); // October 2025

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  // Mock workout data
  const workouts: Record<number, Array<{ type: 'bike' | 'run' | 'strength'; duration: string; color: string }>> = {
    14: [{ type: 'bike', duration: '1h 15m', color: '#3b82f6' }],
    15: [{ type: 'strength', duration: '45m', color: '#8b5cf6' }],
    16: [{ type: 'run', duration: '30m', color: '#10b981' }],
    17: [{ type: 'bike', duration: '1h 30m', color: '#3b82f6' }],
    18: [{ type: 'bike', duration: '1h 24m', color: '#3b82f6' }],
    19: [{ type: 'bike', duration: '1h 20m', color: '#3b82f6' }],
    21: [{ type: 'run', duration: '45m', color: '#10b981' }, { type: 'strength', duration: '30m', color: '#8b5cf6' }],
  };

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case 'bike':
        return Bike;
      case 'run':
        return Footprints;
      case 'strength':
        return Dumbbell;
      default:
        return Bike;
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-semibold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">Plan and track your training schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Sync calendar
          </Button>
          <Button size="sm" className="bg-[#3b82f6] hover:bg-[#2563eb]">
            Add workout
          </Button>
        </div>
      </motion.div>

      {/* Month Navigation */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-foreground">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center py-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {blanks.map((blank) => (
              <div key={`blank-${blank}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const isToday = day === 20;
              const hasWorkouts = workouts[day];

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: day * 0.005 }}
                  className={`
                    aspect-square rounded-lg border p-2 transition-all cursor-pointer
                    ${isToday 
                      ? 'bg-[#3b82f6]/10 border-[#3b82f6] ring-1 ring-[#3b82f6]/20' 
                      : 'bg-card border-border hover:border-info/30 hover:bg-secondary/50'
                    }
                  `}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[#3b82f6]' : 'text-foreground'}`}>
                      {day}
                    </div>
                    {hasWorkouts && (
                      <div className="flex-1 flex flex-col gap-1 min-h-0">
                        {hasWorkouts.slice(0, 2).map((workout, idx) => {
                          const Icon = getWorkoutIcon(workout.type);
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate"
                              style={{ backgroundColor: `${workout.color}15`, color: workout.color }}
                            >
                              <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="truncate">{workout.duration}</span>
                            </div>
                          );
                        })}
                        {hasWorkouts.length > 2 && (
                          <div className="text-[9px] text-muted-foreground px-1.5">
                            +{hasWorkouts.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">This month</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#3b82f6]" />
                <span className="text-sm text-foreground">Cycling</span>
              </div>
              <span className="text-sm font-medium text-foreground">12 workouts</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#10b981]" />
                <span className="text-sm text-foreground">Running</span>
              </div>
              <span className="text-sm font-medium text-foreground">6 workouts</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#8b5cf6]" />
                <span className="text-sm text-foreground">Strength</span>
              </div>
              <span className="text-sm font-medium text-foreground">4 workouts</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total time</p>
              <p className="text-xl font-semibold text-foreground">28h 45m</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total load</p>
              <p className="text-xl font-semibold text-foreground">5,840 kJ</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg per week</p>
              <p className="text-xl font-semibold text-foreground">7h 12m</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Workouts</p>
              <p className="text-xl font-semibold text-foreground">22</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
