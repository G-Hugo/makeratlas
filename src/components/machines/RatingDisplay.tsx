import type { Dictionary } from "@/i18n/get-dictionary";
import type { MachineRating } from "@/types/machine";
import { ratingBarColor, ratingColor } from "@/lib/utils";

interface RatingDisplayProps {
  rating: MachineRating;
  labels: Dictionary["ratings"];
  /** Hide overall when the hero already shows the headline score */
  excludeOverall?: boolean;
}

const CRITERIA_KEYS = [
  "overall",
  "value",
  "easeOfUse",
  "capability",
  "buildQuality",
] as const satisfies readonly (keyof MachineRating)[];

export function RatingDisplay({ rating, labels, excludeOverall }: RatingDisplayProps) {
  const keys = excludeOverall
    ? CRITERIA_KEYS.filter((k) => k !== "overall")
    : CRITERIA_KEYS;

  return (
    <div className="space-y-3">
      {keys.map((key) => (
        <div key={key}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-stone-600 dark:text-stone-300">{labels[key]}</span>
            <span className={`font-semibold ${ratingColor(rating[key])}`}>
              {rating[key].toFixed(1)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
            <div
              className={`h-full rounded-full ${ratingBarColor(rating[key])}`}
              style={{ width: `${rating[key] * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
