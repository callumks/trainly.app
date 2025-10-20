import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface GlassCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning';
  className?: string;
}

export function GlassCard({ title, icon: Icon, children, variant }: any){
  return (
    <div className="rounded-xl border bg-card/80 backdrop-blur p-4">
      <div className="text-sm font-medium mb-2">{title}</div>
      {children}
    </div>
  )
}
