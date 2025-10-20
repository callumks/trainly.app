import { Flame } from 'lucide-react';
import { motion } from 'motion/react';

export function CaloriesWidget() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Calories this week</h3>
        <Flame className="w-4 h-4 text-[#f59e0b] opacity-50" />
      </div>
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-3xl font-semibold text-foreground"
          >
            3,847
          </motion.span>
          <span className="text-sm text-muted-foreground">kcal</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Daily average</span>
            <span className="text-foreground font-medium">549 kcal</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '73%' }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] rounded-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="p-2 bg-secondary/50 rounded-lg">
            <p className="text-[10px] text-muted-foreground mb-0.5">Most active</p>
            <p className="text-xs font-medium text-foreground">Thursday</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded-lg">
            <p className="text-[10px] text-muted-foreground mb-0.5">Peak burn</p>
            <p className="text-xs font-medium text-foreground">892 kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
