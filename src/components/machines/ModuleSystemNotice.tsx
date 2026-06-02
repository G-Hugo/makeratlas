import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Locale } from "@/i18n/config";
import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Machine, ModuleSystem } from "@/types/machine";
import { laserTypeLabelLocalized } from "@/lib/i18n-helpers";

type MachineLabels = Dictionary["machine"];

interface ModuleSystemNoticeProps {
  machine: Machine;
  powerTierCount: number;
  locale: Locale;
  dict: Dictionary;
  labels: MachineLabels;
}

function kindLabel(
  kind: ModuleSystem["options"][0]["laserKind"],
  labels: MachineLabels,
  dict: Dictionary,
): string {
  if (kind === "infrared") return labels.infraredKind;
  return laserTypeLabelLocalized(kind, dict);
}

export function ModuleSystemNotice({
  machine,
  powerTierCount,
  locale,
  dict,
  labels,
}: ModuleSystemNoticeProps) {
  const config = machine.moduleSystem;
  if (!config) return null;

  const kind = (k: ModuleSystem["options"][0]["laserKind"]) =>
    kindLabel(k, labels, dict);

  if (config.style === "interchangeable") {
    return (
      <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
        <p className="text-sm font-semibold text-sky-900">{config.headline}</p>
        <p className="mt-2 text-sm text-sky-950/90">{config.description}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {config.options.map((opt) => (
            <li key={opt.label}>
              {opt.tierSlug ? (
                <LocaleLink
                  href={`/lasers/${opt.tierSlug}`}
                  locale={locale}
                  className="inline-flex items-center rounded-full border border-sky-300 bg-white px-3 py-1 text-xs font-medium text-sky-900 hover:border-sky-500"
                >
                  {opt.label}
                  <span className="ml-1.5 text-sky-600">({kind(opt.laserKind)})</span>
                </LocaleLink>
              ) : (
                <span className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium text-sky-900">
                  {opt.label}
                  <span className="ml-1.5 text-sky-600">({kind(opt.laserKind)})</span>
                </span>
              )}
            </li>
          ))}
        </ul>
        {powerTierCount > 1 && (
          <p className="mt-3 text-xs text-sky-800">{labels.moduleInterchangeableFootnote}</p>
        )}
      </div>
    );
  }

  if (config.style === "dual-laser") {
    return (
      <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-sm font-semibold text-violet-900">{config.headline}</p>
        <p className="mt-2 text-sm text-violet-950/90">{config.description}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-violet-950">
          {config.options.map((opt) => (
            <li key={opt.label} className="flex gap-2">
              <span className="font-medium text-violet-900">{opt.label}</span>
              <span className="text-violet-700"> · {kind(opt.laserKind)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-violet-800">{labels.moduleHybridFootnote}</p>
      </div>
    );
  }

  return null;
}
