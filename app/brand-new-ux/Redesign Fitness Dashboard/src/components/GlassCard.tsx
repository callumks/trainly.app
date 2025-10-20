import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface GlassCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning';
  className?: string;
}

export function GlassCard({ title, icon: Icon, children, variant = 'default', className = '' }: GlassCardProps) {
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
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-xl border p-5 shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {variant !== 'default' && (
        <div className={`absolute inset-x-0 top-0 h-[2px] ${accentColors[variant]} after:absolute after:inset-0 after:opacity-60`} />
      )}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</h3>
        {Icon && <Icon className={`w-4 h-4 ${iconColors[variant]} opacity-50`} />}
      </div>
      {children}
    </motion.div>
  );
}
