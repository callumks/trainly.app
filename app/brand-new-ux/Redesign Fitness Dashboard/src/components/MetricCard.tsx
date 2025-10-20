interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  sublabel?: string;
  variant?: 'default' | 'success' | 'info';
}

export function MetricCard({ label, value, unit, sublabel, variant = 'default' }: MetricCardProps) {
  const borderColors = {
    default: 'border-border/50',
    success: 'border-[#10b981]/30',
    info: 'border-[#3b82f6]/30',
  };

  const textColors = {
    default: 'text-foreground',
    success: 'text-[#10b981]',
    info: 'text-[#3b82f6]',
  };

  return (
    <div className={`rounded-xl border ${borderColors[variant]} bg-card/50 backdrop-blur-sm p-6 shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-black/30`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold ${textColors[variant]}`}>{value}</span>
        {unit && <span className="text-xl text-muted-foreground">{unit}</span>}
      </div>
      {sublabel && <p className="text-sm text-muted-foreground mt-2">{sublabel}</p>}
    </div>
  );
}
