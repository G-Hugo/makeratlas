import type { MachineRating } from "@/types/machine";
import { ratingColor } from "@/lib/utils";

interface RatingDisplayProps {
  rating: MachineRating;
}

const criteria: { key: keyof MachineRating; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "value", label: "Value" },
  { key: "easeOfUse", label: "Ease of use" },
  { key: "capability", label: "Capability" },
  { key: "buildQuality", label: "Build quality" },
];

export function RatingDisplay({ rating }: RatingDisplayProps) {
  return (
    <div className="space-y-3">
      {criteria.map(({ key, label }) => (
        <div key={key}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-stone-600">{label}</span>
            <span className={`font-semibold ${ratingColor(rating[key])}`}>
              {rating[key].toFixed(1)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${rating[key] * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
