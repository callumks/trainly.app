import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'info' | 'warning';
  className?: string;
}

export function StatCard({ label, value, icon: Icon, variant = 'default', className = '' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    success: 'bg-card border-border',
    info: 'bg-card border-border',
    warning: 'bg-card border-border',
  };

  const iconColors = {
    default: 'text-muted-foreground',
    success: 'text-[#10b981]',
    info: 'text-[#3b82f6]',
    warning: 'text-[#f59e0b]',
  };

  const accentColors = {
    default: '',
    success: 'after:bg-gradient-to-r after:from-[#10b981] after:to-transparent',
    info: 'after:bg-gradient-to-r after:from-[#3b82f6] after:to-transparent',
    warning: 'after:bg-gradient-to-r after:from-[#f59e0b] after:to-transparent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-xl border p-5 shadow-sm hover:shadow-md transition-all overflow-hidden ${variantStyles[variant]} ${className}`}
    >
      {variant !== 'default' && (
        <div className={`absolute inset-x-0 top-0 h-[2px] ${accentColors[variant]} after:absolute after:inset-0 after:opacity-60`} />
      )}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-xs font-medium mb-1.5">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
        {Icon && (
          <div className={`${iconColors[variant]} opacity-40`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
