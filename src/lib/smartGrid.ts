// ============================================
// SMART GRID
// Card grids that adapt to how many cards they hold. For each breakpoint the
// column count is chosen so rows come out as even as possible (4 cards → 2×2,
// 5 → 3 + 2, 6 → 3 × 2, 7 → 4 + 3), and any short last row is centered by the
// `.smart-grid` rules in global.css instead of hugging the left edge.
//
// Usage:
//   <div class="smart-grid" style={smartGridStyle(cards.length, { md: 2, lg: 3 })}>
// ============================================

export type SmartGridBreakpoint = "base" | "sm" | "md" | "lg" | "xl";
export type SmartGridMax = Partial<Record<SmartGridBreakpoint, number>>;

/**
 * Most balanced column count for `count` items when at most `max` fit per row.
 * Prefers fewer rows, then a fuller last row; never leaves a last row that is
 * less than half full when a nearby column count avoids it.
 */
export function balancedColumns(count: number, max: number): number {
  if (count <= 1 || max <= 1) return 1;
  if (count <= max) return count;

  let best = max;
  let bestRows = Infinity;
  let bestEmpty = Infinity;
  for (let cols = max; cols >= Math.max(2, max - 1); cols--) {
    const rows = Math.ceil(count / cols);
    const lastRow = count - (rows - 1) * cols;
    if (lastRow < cols / 2) continue; // lonely last row, try another count
    const empty = cols - lastRow;
    if (rows < bestRows || (rows === bestRows && empty < bestEmpty)) {
      best = cols;
      bestRows = rows;
      bestEmpty = empty;
    }
  }
  return best;
}

/** Inline style setting the per-breakpoint column counts for a `.smart-grid`. */
export function smartGridStyle(count: number, max: SmartGridMax): string {
  return (Object.entries(max) as [SmartGridBreakpoint, number][])
    .map(([bp, m]) => `--sg-cols-${bp}: ${balancedColumns(count, m)}`)
    .join("; ");
}
