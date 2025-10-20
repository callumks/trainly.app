import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselDayCard } from '../CarouselDayCard';
import { Button } from '../ui/button';

export function DailyPlanWidget() {
  const [focusedDayIndex, setFocusedDayIndex] = useState(3); // Thursday is today

  const weekDays = [
    { day: 'MON', date: 'Oct 14', workload: 250, duration: '1h 15m' },
    { day: 'TUE', date: 'Oct 15', workload: 180, duration: '45m' },
    { day: 'WED', date: 'Oct 16', workload: 0 },
    { day: 'THU', date: 'Oct 17', workload: 320, duration: '1h 30m', isToday: true },
    { day: 'FRI', date: 'Oct 18', workload: 200, duration: '1h' },
    { day: 'SAT', date: 'Oct 19', workload: 280, duration: '1h 20m' },
    { day: 'SUN', date: 'Oct 20', workload: 0 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold text-foreground">Your week</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Oct 14 - 20 • Week 42</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs -mt-1">
          Edit week
        </Button>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-secondary flex-shrink-0"
            onClick={() => setFocusedDayIndex(Math.max(0, focusedDayIndex - 1))}
            disabled={focusedDayIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </Button>

          <div className="flex items-center justify-center gap-3 flex-1 max-w-4xl overflow-hidden">
            {weekDays.map((day, index) => {
              const distance = Math.abs(index - focusedDayIndex);
              if (distance > 2) return null;

              return (
                <motion.div
                  key={index}
                  animate={{
                    width: index === focusedDayIndex ? '280px' : '180px',
                  }}
                  transition={{
                    type: "spring", 
                    stiffness: 350, 
                    damping: 30
                  }}
                  className="flex-shrink-0"
                >
                  <CarouselDayCard
                    day={day.day}
                    date={day.date}
                    workload={day.workload}
                    duration={day.duration}
                    isToday={day.isToday}
                    isFocused={index === focusedDayIndex}
                    onClick={() => setFocusedDayIndex(index)}
                  />
                </motion.div>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-secondary flex-shrink-0"
            onClick={() => setFocusedDayIndex(Math.min(weekDays.length - 1, focusedDayIndex + 1))}
            disabled={focusedDayIndex === weekDays.length - 1}
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </Button>
        </div>

        {/* Day indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {weekDays.map((_, index) => (
            <button
              key={index}
              onClick={() => setFocusedDayIndex(index)}
              className={`h-1 rounded-full transition-all ${
                index === focusedDayIndex
                  ? 'w-6 bg-[#3b82f6]'
                  : 'w-1 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick info for focused day */}
      <motion.div
        key={focusedDayIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-foreground mb-1">
              {weekDays[focusedDayIndex].workload
                ? `${weekDays[focusedDayIndex].day === 'THU' ? 'Today' : weekDays[focusedDayIndex].day}'s workout`
                : 'Rest day'}
            </p>
            <p className="text-xs text-muted-foreground">
              {weekDays[focusedDayIndex].workload
                ? `Endurance ride • ${weekDays[focusedDayIndex].duration}`
                : 'Take it easy, let your body recover'}
            </p>
          </div>
          {weekDays[focusedDayIndex].workload > 0 && (
            <Button size="sm" className="bg-[#3b82f6] hover:bg-[#2563eb] flex-shrink-0">
              View details
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
