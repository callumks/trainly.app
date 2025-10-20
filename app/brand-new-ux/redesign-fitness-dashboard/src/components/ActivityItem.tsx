import { motion } from 'motion/react';
import { Bike, ExternalLink, Footprints, Dumbbell, Mountain } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  type: string;
  duration: string;
  distance?: string;
  date: string;
  time: string;
}

const sportIcons = {
  Bike: { icon: Bike, color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/8' },
  Run: { icon: Footprints, color: 'text-[#10b981]', bg: 'bg-[#10b981]/8' },
  Strength: { icon: Dumbbell, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/8' },
  Climbing: { icon: Mountain, color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/8' },
};

export function ActivityItem({ title, type, duration, distance, date, time }: ActivityItemProps) {
  const sport = sportIcons[type as keyof typeof sportIcons] || sportIcons.Bike;
  const Icon = sport.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
      className="group p-3.5 rounded-lg bg-card border border-border hover:border-border-bright hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start gap-2.5">
        <div className={`w-9 h-9 rounded-lg ${sport.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon className={`w-4 h-4 ${sport.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground truncate mb-1">{title}</h4>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-foreground font-medium">{duration}</span>
            {distance && (
              <>
                <span className="text-xs text-muted-foreground/40">•</span>
                <span className="text-xs text-muted-foreground">{distance}</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{date}</p>
        </div>
      </div>
    </motion.div>
  );
}
