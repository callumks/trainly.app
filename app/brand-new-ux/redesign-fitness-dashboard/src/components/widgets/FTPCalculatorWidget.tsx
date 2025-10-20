import { Activity, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';

export function FTPCalculatorWidget() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">FTP Zones</h3>
        <Activity className="w-4 h-4 text-[#3b82f6] opacity-50" />
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-semibold text-foreground">285</span>
            <span className="text-sm text-muted-foreground">watts</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#10b981]">
            <TrendingUp className="w-3 h-3" />
            <span>+12W from last month</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />
            <span className="text-xs text-muted-foreground flex-1">Z5 (VO2 Max)</span>
            <span className="text-xs text-foreground font-medium">314+ W</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
            <span className="text-xs text-muted-foreground flex-1">Z4 (Threshold)</span>
            <span className="text-xs text-foreground font-medium">257-313 W</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#10b981]" />
            <span className="text-xs text-muted-foreground flex-1">Z3 (Tempo)</span>
            <span className="text-xs text-foreground font-medium">228-256 W</span>
          </div>
        </div>
        <Button size="sm" variant="outline" className="w-full">
          Recalculate FTP
        </Button>
      </div>
    </div>
  );
}
