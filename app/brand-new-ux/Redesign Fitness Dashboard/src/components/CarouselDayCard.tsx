import { motion } from 'motion/react';
import { Zap, Clock } from 'lucide-react';

interface CarouselDayCardProps {
  day: string;
  date: string;
  workload?: number;
  duration?: string;
  isToday?: boolean;
  isFocused?: boolean;
  onClick?: () => void;
}

export function CarouselDayCard({
  day,
  date,
  workload,
  duration,
  isToday,
  isFocused,
  onClick
}: CarouselDayCardProps) {
  return (
    <motion.div
      onClick={onClick}
      animate={{
        scale: isFocused ? 1 : 0.85,
        opacity: isFocused ? 1 : 0.4,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 350, 
        damping: 30
      }}
      className={`
        relative rounded-2xl p-6 cursor-pointer
        ${isFocused 
          ? 'bg-card border-2 border-border shadow-lg' 
          : 'bg-card/50 border border-border/50'
        }
        ${!isFocused && 'hover:opacity-60'}
      `}
      style={{
        minHeight: isFocused ? '200px' : '160px',
      }}
    >
      {isToday && isFocused && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#3b82f6] rounded-full">
          <span className="text-[10px] font-medium text-white uppercase tracking-wide">
            Today
          </span>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <p className={`uppercase tracking-wide font-medium mb-1 ${
            isFocused ? 'text-xs text-muted-foreground' : 'text-[10px] text-muted-foreground'
          }`}>
            {day}
          </p>
          <p className={`font-semibold text-foreground ${
            isFocused ? 'text-xl' : 'text-base'
          }`}>
            {date}
          </p>
        </div>

        {workload ? (
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className={`font-semibold text-foreground ${
                isFocused ? 'text-4xl' : 'text-2xl'
              }`}>
                {workload}
              </span>
              <span className={`text-muted-foreground ${
                isFocused ? 'text-sm' : 'text-xs'
              }`}>
                kJ
              </span>
            </div>
            {duration && isFocused && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-sm">{duration}</span>
              </div>
            )}
          </div>
        ) : (
          <div className={isFocused ? 'py-2' : 'py-1'}>
            <p className={`text-muted-foreground ${
              isFocused ? 'text-base' : 'text-sm'
            }`}>
              Rest {isFocused && '😌'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
