// Core training metrics utilities (pure functions)

export type ComputedMetrics = {
  if: number
  tss: number
}

// Simple IF/TSS for bike first; fallbacks are heuristic
// activity seconds should be moving time; ftpW optional
export function computeIfTss(params: {
  movingSec: number
  avgPower?: number | null
  ftpW?: number | null
  zoneSeconds?: { z1?: number; z2?: number; z3?: number; z4?: number; z5?: number }
}): ComputedMetrics {
  const movingHours = Math.max(0, params.movingSec || 0) / 3600
  if (movingHours === 0) return { if: 0, tss: 0 }

  let intensityFactor = 0

  // If power and FTP are available, use power proxy (avgPower)
  if (params.avgPower && params.ftpW && params.ftpW > 0) {
    intensityFactor = Math.max(0, Math.min(2, (params.avgPower as number) / (params.ftpW as number)))
  } else if (params.zoneSeconds) {
    // Heuristic from pace/HR zones
    const z = params.zoneSeconds
    const total = Object.values(z).reduce((s, v) => s + (v || 0), 0)
    if (total > 0) {
      const weights: Record<string, number> = { z1: 0.55, z2: 0.7, z3: 0.8, z4: 0.9, z5: 1.05 }
      const weighted = (['z1','z2','z3','z4','z5'] as const).reduce((s, k) => s + ((z[k] || 0) * (weights[k] || 0)), 0)
      intensityFactor = weighted / total
    }
  }

  // Clamp IF sensibly
  if (!isFinite(intensityFactor) || intensityFactor <= 0) intensityFactor = 0
  const tss = Math.pow(intensityFactor, 2) * movingHours * 100
  return { if: round2(intensityFactor), tss: round1(tss) }
}

export function updateLoad(prev: { ctl: number; atl: number }, todayTss: number) {
  // Impulse-response model
  const ctl = prev.ctl + (todayTss - prev.ctl) / 42
  const atl = prev.atl + (todayTss - prev.atl) / 7
  const tsb = ctl - atl
  return { ctl: round1(ctl), atl: round1(atl), tsb: round1(tsb) }
}

function round1(n: number) { return Math.round(n * 10) / 10 }
function round2(n: number) { return Math.round(n * 100) / 100 }

