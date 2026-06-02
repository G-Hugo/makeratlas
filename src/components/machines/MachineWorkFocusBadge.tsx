import type { Dictionary } from "@/i18n/get-dictionary";
import type { MachineWorkFocus } from "@/lib/machine-work-focus";
import { getWorkFocusMeta } from "@/lib/machine-work-focus";
import { getWorkFocusMetaLocalized } from "@/lib/work-focus-i18n";

interface MachineWorkFocusBadgeProps {
  focus: MachineWorkFocus;
  workFocusDict?: Dictionary["workFocus"];
  className?: string;
  size?: "sm" | "md";
}

const TONE: Record<
  MachineWorkFocus,
  { chip: string; icon: string }
> = {
  engrave: {
    chip: "bg-violet-600/90 text-white shadow-sm",
    icon: "text-violet-100",
  },
  cut: {
    chip: "bg-emerald-600/90 text-white shadow-sm",
    icon: "text-emerald-100",
  },
  both: {
    chip: "bg-amber-600/90 text-white shadow-sm",
    icon: "text-amber-100",
  },
};

export function MachineWorkFocusBadge({
  focus,
  workFocusDict,
  className = "",
  size = "md",
}: MachineWorkFocusBadgeProps) {
  const meta = workFocusDict
    ? getWorkFocusMetaLocalized(focus, workFocusDict)
    : getWorkFocusMeta(focus);
  const tone = TONE[focus];
  const compact = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold backdrop-blur-sm ${tone.chip} ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      } ${className}`}
      title={meta.description}
    >
      <FocusIcon focus={focus} className={tone.icon} compact={compact} />
      {compact ? meta.shortLabel : meta.label}
    </span>
  );
}

function FocusIcon({
  focus,
  className,
  compact,
}: {
  focus: MachineWorkFocus;
  className: string;
  compact: boolean;
}) {
  const size = compact ? 12 : 14;

  if (focus === "engrave") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={className}
        aria-hidden
      >
        <path d="M12 3v18M8 7h8M7 12h10M8 17h8" />
      </svg>
    );
  }

  if (focus === "cut") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
      >
        <path d="M4 7h16M4 12h10M4 17h13" />
        <path d="M18 10l2 2-2 2" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M8 6h8M8 12h8M8 18h5" />
      <path d="M4 4v16M20 4v16" />
    </svg>
  );
}
