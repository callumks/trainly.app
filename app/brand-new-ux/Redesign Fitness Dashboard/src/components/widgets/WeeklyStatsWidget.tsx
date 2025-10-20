import { Calendar, TrendingUp, Zap, Trophy } from 'lucide-react';
import { StatCard } from '../StatCard';

export function WeeklyStatsWidget() {
  return (
    <div className="p-5">
      <h3 className="font-semibold text-foreground mb-4">This week</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Training days" value="4" icon={Calendar} variant="default" />
        <StatCard label="Plan compliance" value="86%" icon={TrendingUp} variant="info" />
        <StatCard label="Weekly load" value="1,230 kJ" icon={Zap} variant="success" />
        <StatCard label="Current streak" value="12" icon={Trophy} variant="default" />
      </div>
    </div>
  );
}
