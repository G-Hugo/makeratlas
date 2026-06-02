import type { Dictionary } from "@/i18n/get-dictionary";
import type { MachineRating } from "@/types/machine";
import { ratingColor } from "@/lib/utils";

interface RatingDisplayProps {
  rating: MachineRating;
  labels: Dictionary["ratings"];
}

const CRITERIA_KEYS = [
  "overall",
  "value",
  "easeOfUse",
  "capability",
  "buildQuality",
] as const satisfies readonly (keyof MachineRating)[];

export function RatingDisplay({ rating, labels }: RatingDisplayProps) {
  return (
    <div className="space-y-3">
      {CRITERIA_KEYS.map((key) => (
        <div key={key}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-stone-600">{labels[key]}</span>
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
