import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function VO2MaxWidget() {
  return (
    <div className="p-5 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#ef4444] to-transparent opacity-60" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">VO₂ Max</h3>
        <Heart className="w-4 h-4 text-[#ef4444] opacity-50" />
      </div>
      <div className="space-y-3">
        <div className="flex items-baseline gap-2 mb-2">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-4xl font-semibold text-foreground"
          >
            56
          </motion.span>
          <span className="text-sm text-muted-foreground">ml/kg/min</span>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Fitness level</p>
          <p className="text-sm font-medium text-foreground">Excellent 🎯</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Your aerobic capacity is in the top 10% for your age group
        </p>
      </div>
    </div>
  );
}
