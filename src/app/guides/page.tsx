import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuidesMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Clear guides to understand laser types, choose the right machine, and avoid common buying mistakes.",
};

export default function GuidesPage() {
  const guides = getAllGuidesMeta();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-900">Guides</h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        Start here if you are new to laser engravers. Read the safety guide
        before your first job.
      </p>
      <Link
        href="/guides/laser-safety-basics"
        className="mt-4 inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:border-red-300"
      >
        ⚠ Laser safety basics — read first
      </Link>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              {guide.category.replace("-", " ")} · {guide.readTime}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-stone-900">
              {guide.title}
            </h2>
            <p className="mt-2 text-sm text-stone-600">{guide.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
