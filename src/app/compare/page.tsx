import type { Metadata } from "next";
import { ComparePageClient } from "@/components/machines/ComparePageClient";
import { getAllMachines } from "@/lib/content";

export const metadata: Metadata = {
  title: "Compare Laser Engravers",
  description:
    "Side-by-side comparison of laser engravers — filter by type, price, power, and work area.",
};

export default function ComparePage() {
  const machines = getAllMachines();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-900">Compare laser engravers</h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        Filter by laser type and budget. Click any machine for the full profile
        with honest pros, cons, and material limits.
      </p>
      <div className="mt-10">
        <ComparePageClient machines={machines} />
      </div>
    </div>
  );
}
