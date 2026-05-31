import Link from "next/link";
import { MachineCard } from "@/components/machines/MachineCard";
import { getAllGuidesMeta, getAllMachines } from "@/lib/content";

export default function HomePage() {
  const machines = getAllMachines();
  const featured = machines.slice(0, 6);
  const guides = getAllGuidesMeta();

  return (
    <div>
      <section className="border-b border-stone-200 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-700">
            makeratlas.com
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            The complete reference for maker machines
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-stone-600">
            Choosing a laser engraver is confusing. Spec sheets lie, reviews
            oversell, and nobody puts everything in one place. Maker Atlas does —
            honest specs, clear explanations, and buying guides written for real
            people.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/guides/laser-buying-guide-2026"
              className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
            >
              Laser buying guide 2026
            </Link>
            <Link
              href="/guides/understanding-laser-types"
              className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-400"
            >
              Understand laser types
            </Link>
            <Link
              href="/guides/laser-safety-basics"
              className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800 transition hover:border-red-300"
            >
              Safety basics
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              Top laser engravers
            </h2>
            <p className="mt-2 text-stone-600">
              {machines.length} machines profiled — honest specs, not marketing copy.
            </p>
          </div>
          <Link
            href="/lasers"
            className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900">Start here</h2>
          <p className="mt-2 max-w-2xl text-stone-600">
            New to lasers? Read these first. They explain what actually matters
            when you buy.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="rounded-xl border border-stone-200 p-6 transition hover:border-amber-300 hover:shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                  {guide.category.replace("-", " ")} · {guide.readTime}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-stone-900">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-stone-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold">Our promise</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-amber-400">Honest limits</h3>
              <p className="mt-2 text-sm text-stone-300">
                We tell you what machines cannot do. A 10W diode will not cut
                thick hardwood like a CO₂ laser — and we say so clearly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400">Plain language</h3>
              <p className="mt-2 text-sm text-stone-300">
                Every page starts simple. Dig deeper when you need pro-level
                detail — specs, materials, and real-world tips.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400">Everything in one place</h3>
              <p className="mt-2 text-sm text-stone-300">
                Types, buying guides, full machine profiles, and side-by-side
                comparisons. The reference we wished existed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
