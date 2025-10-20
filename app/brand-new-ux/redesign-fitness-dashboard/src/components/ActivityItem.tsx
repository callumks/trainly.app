import { motion } from 'framer-motion';
import { Bike, ExternalLink, Footprints, Dumbbell, Mountain } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  type: string;
  duration: string;
  distance?: string;
  date: string;
  time: string;
}

const sportIcons = {
  Bike: { icon: Bike, color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/8' },
  Run: { icon: Footprints, color: 'text-[#10b981]', bg: 'bg-[#10b981]/8' },
  Strength: { icon: Dumbbell, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/8' },
  Climbing: { icon: Mountain, color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/8' },
};

export function ActivityItem(props: any){
  return (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 bg-muted rounded" />
      <div className="text-sm">{props.title}</div>
    </div>
  )
}
