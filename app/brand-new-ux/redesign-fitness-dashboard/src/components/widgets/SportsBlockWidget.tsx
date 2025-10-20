import { Bike, Footprints, Mountain } from 'lucide-react';

export function SportsBlockWidget() {
  return (
    <div className="p-5">
      <h3 className="font-semibold text-foreground mb-4">Your sports</h3>
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-gradient-to-br from-[#3b82f6]/10 to-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-xl p-4 relative overflow-hidden group hover:from-[#3b82f6]/15 transition-colors">
          <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#3b82f6]/10 rounded-full blur-xl" />
          <div className="relative">
            <Bike className="w-5 h-5 text-[#3b82f6] mb-2" />
            <p className="text-sm font-medium text-foreground mb-0.5">Cycling</p>
            <p className="text-xs text-muted-foreground">28 activities</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5 border border-[#10b981]/20 rounded-xl p-4 relative overflow-hidden group hover:from-[#10b981]/15 transition-colors">
          <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#10b981]/10 rounded-full blur-xl" />
          <div className="relative">
            <Footprints className="w-5 h-5 text-[#10b981] mb-2" />
            <p className="text-sm font-medium text-foreground mb-0.5">Running</p>
            <p className="text-xs text-muted-foreground">15 activities</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#8b5cf6]/10 to-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-xl p-4 relative overflow-hidden group hover:from-[#8b5cf6]/15 transition-colors">
          <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#8b5cf6]/10 rounded-full blur-xl" />
          <div className="relative">
            <Mountain className="w-5 h-5 text-[#8b5cf6] mb-2" />
            <p className="text-sm font-medium text-foreground mb-0.5">Climbing</p>
            <p className="text-xs text-muted-foreground">7 activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
