import type { Metadata } from "next";
import Link from "next/link";
import { LasersBrowse } from "@/components/machines/LasersBrowse";
import { getAllMachines } from "@/lib/content";

export const metadata: Metadata = {
  title: "Laser Engravers",
  description:
    "Complete profiles of laser engravers — specs, materials, pros, cons, and who each machine is really for.",
};

export default function LasersPage() {
  const machines = getAllMachines();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <LasersBrowse
        machines={machines}
        description={`${machines.length} machines profiled with honest specs and real-world guidance. Browse by type, filter by budget, or compare side-by-side on the comparison page.`}
      />
      <p className="mt-8 text-sm text-stone-500">
        Need help choosing? Start with our{" "}
        <Link href="/guides/understanding-laser-types" className="text-amber-700 hover:underline">
          laser types guide
        </Link>{" "}
        or the{" "}
        <Link href="/guides/laser-buying-guide-2026" className="text-amber-700 hover:underline">
          2026 buying guide
        </Link>
        .
      </p>
    </div>
  );
}
