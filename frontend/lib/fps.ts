import type { ComponentResponse } from "@/shared/types/component"

// Simplified GPU performance tiers (rough relative scoring)
// Real benchmarks would be more granular; this is enough for a demo.
const GPU_TIER: Record<string, number> = {
  // Tier scale 0-100
  "RTX 4090": 100,
  "RTX 4080": 90,
  "RTX 4070": 75,
  "RTX 4060": 60,
  "RTX 3060": 50,
  "GTX 1660": 35,
  "GTX 1650": 25,
}

// Game weight: how demanding the game is (0-1, higher = harder)
const GAME_WEIGHT = {
  valorant: 0.15,
  gta5: 0.4,
  cyberpunk: 0.95,
} as const

export type FpsResult = {
  valorant: number
  gta5: number
  cyberpunk: number
}

function detectGpuTier(name: string): number {
  for (const [model, tier] of Object.entries(GPU_TIER)) {
    if (name.includes(model)) return tier
  }
  // Fallback for unknown GPUs — assume mid-tier
  return 40
}

/**
 * Predicts approximate FPS at 1080p based on GPU tier and game weight.
 * NOT a real benchmark — for educational demo purposes only.
 */
export function predictFps(gpu: ComponentResponse | undefined): FpsResult | null {
  if (!gpu) return null

  const tier = detectGpuTier(gpu.name)

  // FPS = base * (tier / weight^scale)
  // Tuned so RTX 4060 ≈ 240/85/55 FPS roughly
  const fps = (game: keyof typeof GAME_WEIGHT) => {
    const weight = GAME_WEIGHT[game]
    const raw = (tier / weight) * 0.35
    return Math.max(20, Math.min(360, Math.round(raw)))
  }

  return {
    valorant: fps("valorant"),
    gta5: fps("gta5"),
    cyberpunk: fps("cyberpunk"),
  }
}
