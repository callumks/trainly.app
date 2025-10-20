import { Apple } from 'lucide-react';

export function QuickTipsWidget() {
  return (
    <div className="p-5 bg-gradient-to-br from-[#3b82f6]/5 to-transparent border-0">
      <div className="flex items-center gap-2 mb-3">
        <Apple className="w-4 h-4 text-[#3b82f6]" />
        <h3 className="text-sm font-medium text-foreground">Quick tip</h3>
      </div>
      <p className="text-sm text-foreground mb-2">Don't forget to eat before tomorrow's long ride</p>
      <p className="text-xs text-muted-foreground">Your 90min session needs proper fuel. Try oatmeal or toast 2hrs before.</p>
    </div>
  );
}
