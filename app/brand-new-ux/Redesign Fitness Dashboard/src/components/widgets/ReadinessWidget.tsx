import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

export function ReadinessWidget() {
  return (
    <div className="p-5 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#10b981] to-transparent opacity-60" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">How you're doing</h3>
        <Zap className="w-4 h-4 text-[#10b981] opacity-50" />
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="text-4xl font-semibold text-[#10b981]"
        >
          84
        </motion.span>
        <span className="text-lg text-muted-foreground">/100</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '84%' }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="h-full bg-[#10b981] rounded-full"
        />
      </div>
      <p className="text-sm text-foreground">You're feeling good today 💪</p>
      <p className="text-xs text-muted-foreground mt-1">Fitness is up, fatigue is low</p>
    </div>
  );
}
