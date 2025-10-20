import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="relative hover:bg-secondary/50"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: isDark ? 0 : 1, 
          rotate: isDark ? -180 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-foreground" />
      </motion.div>
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ 
          scale: isDark ? 1 : 0, 
          rotate: isDark ? 0 : 180 
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-foreground" />
      </motion.div>
    </Button>
  );
}
