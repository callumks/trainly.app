import { Calendar } from 'lucide-react';
import { Button } from '../ui/button';

export function PlanUpdatesWidget() {
  return (
    <div className="p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#f59e0b]/5 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Suggested change</h3>
          </div>
          <Calendar className="w-4 h-4 text-muted-foreground opacity-50" />
        </div>
        <div className="space-y-3">
          <div className="text-sm">
            <p className="text-foreground mb-1">Tomorrow's ride moved to 6pm</p>
            <p className="text-xs text-muted-foreground">Weather looks better in the evening ⛅️</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-[#10b981] hover:bg-[#059669]">
              Accept
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Ignore
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
