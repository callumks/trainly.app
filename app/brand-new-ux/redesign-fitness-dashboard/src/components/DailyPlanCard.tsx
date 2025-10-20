import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

interface DailyPlanCardProps {
  day: string;
  date: string;
  isToday?: boolean;
  workload?: number;
  duration?: string;
}

export function DailyPlanCard(props: any){
  return <div className="rounded-lg border p-4" />
}
