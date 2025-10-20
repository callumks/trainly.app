"use client";
import { motion } from 'motion/react';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';
import { ReactNode, useState, forwardRef } from 'react';
import { Button } from './ui/button';

interface WidgetProps {
  id: string;
  title?: string;
  children: ReactNode;
  onRemove?: () => void;
  isPinned?: boolean;
  isEditMode?: boolean;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  className?: string;
}

export const Widget = forwardRef<HTMLDivElement, WidgetProps>(({
  id,
  title,
  children,
  onRemove,
  isPinned = false,
  isEditMode = false,
  size = 'medium',
  className = ''
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        relative bg-card border border-border rounded-xl shadow-sm select-none
        ${isPinned ? 'ring-2 ring-info/20' : ''}
        ${isEditMode && !isPinned ? 'hover:ring-2 hover:ring-info/30' : ''}
        ${className}
      `}
      whileHover={isEditMode && !isPinned ? { scale: 1.01 } : {}}
    >
      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="absolute -top-2 -right-2 z-10 flex gap-1">
          {!isPinned && onRemove && (
            <Button
              size="icon"
              variant="destructive"
              className="h-6 w-6 rounded-full shadow-lg"
              onClick={onRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      {/* Drag Handle */}
      {isEditMode && !isPinned && (
        <div 
          className="absolute top-2 left-2 z-10 opacity-40 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded hover:bg-secondary/50"
          title="Drag to reorder (coming soon)"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Pinned Indicator */}
      {isPinned && (
        <div className="absolute top-3 left-3 z-10">
          <div className="px-2 py-0.5 bg-info/10 border border-info/20 rounded-md">
            <span className="text-[9px] uppercase tracking-wider font-medium text-info">Pinned</span>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className={isPinned ? 'pt-8' : ''}>
        {children}
      </div>
    </motion.div>
  );
});

Widget.displayName = 'Widget';
