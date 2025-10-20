import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';

interface CarouselDayCardProps {
  day: string;
  date: string;
  workload?: number;
  duration?: string;
  isToday?: boolean;
  isFocused?: boolean;
  onClick?: () => void;
}

export function CarouselDayCard(props: any){
  return <div className="rounded-lg border p-4" />
}
