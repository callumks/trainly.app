import { motion } from 'motion/react';
import { Target } from 'lucide-react';

export function GoalTrackerWidget() {
  return (
    <div className="p-5 bg-gradient-to-br from-card to-[#8b5cf6]/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your goal</h3>
        <Target className="w-4 h-4 text-[#8b5cf6] opacity-50" />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground mb-1">🏔 Mountain bike race</p>
          <p className="text-xs text-muted-foreground">42 days to go • Nov 30, 2025</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Training progress</span>
            <span className="text-foreground font-medium">67%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '67%' }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">You're on track! Keep it up 💪</p>
        </div>
      </div>
    </div>
  );
}
