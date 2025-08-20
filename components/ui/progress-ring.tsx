"use client";
import { useMemo } from "react";

export function ProgressRing({ size = 64, stroke = 6, value = 0 }: { size?: number; stroke?: number; value?: number }) {
  const radius = useMemo(() => (size - stroke) / 2, [size, stroke]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const offset = useMemo(() => circumference - (value / 100) * circumference, [value, circumference]);

  return (
    <svg width={size} height={size} className="text-brand/20">
      <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} r={radius} cx={size/2} cy={size/2}/>
      <circle
        stroke="hsl(var(--ring))"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset: offset, transition: "stroke-dashoffset .5s var(--ease, cubic-bezier(.22,1,.36,1))" }}
        r={radius} cx={size/2} cy={size/2}
      />
    </svg>
  );
}

