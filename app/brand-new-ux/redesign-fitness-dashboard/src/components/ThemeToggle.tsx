"use client";
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: any){
  return <button onClick={onToggle}>{isDark?'Dark':'Light'}</button>
}
