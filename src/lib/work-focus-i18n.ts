import type { Dictionary } from "@/i18n/get-dictionary";
import type { MachineWorkFocus, WorkFocusMeta } from "@/lib/machine-work-focus";

export function getWorkFocusMetaLocalized(
  focus: MachineWorkFocus,
  dict: Dictionary["workFocus"],
): WorkFocusMeta {
  const map: Record<MachineWorkFocus, Omit<WorkFocusMeta, "focus">> = {
    engrave: {
      label: dict.engrave,
      shortLabel: dict.engraveShort,
      description: dict.engraveDesc,
    },
    cut: {
      label: dict.cut,
      shortLabel: dict.cutShort,
      description: dict.cutDesc,
    },
    both: {
      label: dict.both,
      shortLabel: dict.bothShort,
      description: dict.bothDesc,
    },
  };
  return { focus, ...map[focus] };
}
