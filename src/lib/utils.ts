export function formatPrice(min: number, max: number, currency = "USD"): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min === max) return formatter.format(min);
  return `${formatter.format(min)} – ${formatter.format(max)}`;
}

export function laserTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    diode: "Diode",
    co2: "CO₂",
    fiber: "Fiber",
    uv: "UV",
    hybrid: "Hybrid",
  };
  return labels[type] ?? type;
}

export function laserTypeSlug(type: string): string {
  return type;
}

export function ratingColor(score: number): string {
  if (score >= 8.5) return "text-emerald-600";
  if (score >= 7) return "text-amber-600";
  return "text-orange-600";
}
