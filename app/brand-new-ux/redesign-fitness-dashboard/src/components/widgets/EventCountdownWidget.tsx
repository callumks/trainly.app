import { Calendar, MapPin } from 'lucide-react';

export function EventCountdownWidget() {
  return (
    <div className="p-5 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Next event</h3>
        <Calendar className="w-4 h-4 text-[#8b5cf6] opacity-50" />
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground mb-1">Spring Cycling Classic</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>Boulder, CO</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-card rounded-lg border border-border">
            <div className="text-xl font-semibold text-foreground">15</div>
            <div className="text-[9px] text-muted-foreground uppercase">Days</div>
          </div>
          <div className="text-center p-2 bg-card rounded-lg border border-border">
            <div className="text-xl font-semibold text-foreground">08</div>
            <div className="text-[9px] text-muted-foreground uppercase">Hours</div>
          </div>
          <div className="text-center p-2 bg-card rounded-lg border border-border">
            <div className="text-xl font-semibold text-foreground">32</div>
            <div className="text-[9px] text-muted-foreground uppercase">Mins</div>
          </div>
          <div className="text-center p-2 bg-card rounded-lg border border-border">
            <div className="text-xl font-semibold text-foreground">17</div>
            <div className="text-[9px] text-muted-foreground uppercase">Secs</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Race starts Nov 4, 2025 at 7:00 AM
        </p>
      </div>
    </div>
  );
}
