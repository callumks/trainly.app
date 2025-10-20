import { motion } from 'motion/react';
import { Clock, Zap } from 'lucide-react';

interface DailyPlanCardProps {
  day: string;
  date: string;
  isToday?: boolean;
  workload?: number;
  duration?: string;
}

export function DailyPlanCard({ day, date, isToday, workload, duration }: DailyPlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all ${
        isToday
          ? 'bg-card border-[#3b82f6] shadow-sm ring-1 ring-[#3b82f6]/20'
          : 'bg-card border-border hover:border-border-bright hover:shadow-sm'
      }`}
    >
      {isToday && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#3b82f6] to-transparent" />
      )}
      
      <div className="relative">
        <div className="flex items-start justify-between mb-2.5">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">{day}</p>
            <p className="text-sm font-semibold text-foreground">{date}</p>
          </div>
          {isToday && (
            <span className="px-1.5 py-0.5 bg-[#3b82f6]/10 rounded text-[10px] font-medium text-[#3b82f6] uppercase tracking-wide">
              Today
            </span>
          )}
        </div>

        {workload ? (
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-foreground">{workload}</span>
              <span className="text-xs text-muted-foreground">kJ</span>
            </div>
            {duration && (
              <p className="text-xs text-muted-foreground">{duration}</p>
            )}
          </div>
        ) : (
          <div className="py-1">
            <p className="text-sm text-muted-foreground">Rest 😌</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
