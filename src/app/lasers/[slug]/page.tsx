import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RatingDisplay } from "@/components/machines/RatingDisplay";
import { MachineImage } from "@/components/machines/MachineImage";
import { PerformanceHighlights, TechnicalSpecs } from "@/components/machines/PerformanceHighlights";
import { faqJsonLd, JsonLd, machineJsonLd } from "@/components/seo/JsonLd";
import { getAllMachines, getMachineBySlug } from "@/lib/content";
import { formatPrice, laserTypeLabel } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllMachines().map((machine) => ({ slug: machine.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const machine = getMachineBySlug(slug);
  if (!machine) return { title: "Not found" };

  return {
    title: `${machine.name} Review & Specs`,
    description: machine.tldr,
  };
}

export default async function MachinePage({ params }: PageProps) {
  const { slug } = await params;
  const machine = getMachineBySlug(slug);
  if (!machine) notFound();

  const similar = (machine.similarModels ?? [])
    .map((s) => getMachineBySlug(s))
    .filter(Boolean);

  return (
    <>
      <JsonLd data={machineJsonLd(machine)} />
      {machine.faq && machine.faq.length > 0 && (
        <JsonLd data={faqJsonLd(machine.faq)} />
      )}
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/lasers" className="hover:text-amber-700">
          Laser engravers
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/lasers/type/${machine.laserType}`}
          className="hover:text-amber-700"
        >
          {laserTypeLabel(machine.laserType)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{machine.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-stone-200">
            <MachineImage
              machine={machine}
              priority
              className="aspect-[16/9] w-full"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-wide text-amber-700">
            {machine.brand} · {laserTypeLabel(machine.laserType)}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            {machine.name}
          </h1>
          <p className="mt-2 text-lg text-stone-600">{machine.tagline}</p>

          <div className="mt-8">
            <PerformanceHighlights
              performance={machine.specs.performance}
              mainObjective={machine.mainObjective}
              variant="hero"
            />
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
              TL;DR
            </h2>
            <p className="mt-2 text-stone-800">{machine.tldr}</p>
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-stone-900">What this machine is for</h2>
            <p className="mt-3 text-stone-700">{machine.primaryUse}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-stone-900">Best for</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {machine.bestFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-stone-900">Materials</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-stone-200 p-4">
                <h3 className="text-sm font-semibold text-emerald-700">Engraves</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-700">
                  {machine.materials.engrave.map((m) => (
                    <li key={m}>· {m}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-stone-200 p-4">
                <h3 className="text-sm font-semibold text-blue-700">Cuts</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-700">
                  {machine.materials.cut.length > 0 ? (
                    machine.materials.cut.map((m) => <li key={m}>· {m}</li>)
                  ) : (
                    <li>· Limited cutting ability</li>
                  )}
                </ul>
              </div>
              <div className="rounded-lg border border-stone-200 p-4">
                <h3 className="text-sm font-semibold text-red-700">Cannot do</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-700">
                  {machine.materials.cannot.map((m) => (
                    <li key={m}>· {m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-emerald-800">Pros</h2>
              <ul className="mt-3 space-y-2 text-stone-700">
                {machine.pros.map((pro) => (
                  <li key={pro} className="flex gap-2 text-sm">
                    <span className="text-emerald-600">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-800">Cons</h2>
              <ul className="mt-3 space-y-2 text-stone-700">
                {machine.cons.map((con) => (
                  <li key={con} className="flex gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-10 rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-bold text-stone-900">Beginner notes</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {machine.beginnerNotes}
            </p>
          </section>

          <section className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-lg font-bold text-stone-900">Pro tips</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {machine.proTips}
            </p>
          </section>

          <TechnicalSpecs performance={machine.specs.performance} />

          {machine.faq && machine.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-stone-900">
                Common questions
              </h2>
              <div className="mt-4 space-y-4">
                {machine.faq.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-lg border border-stone-200 bg-white p-5"
                  >
                    <h3 className="font-semibold text-stone-900">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-700">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-amber-600">
              {machine.rating.overall.toFixed(1)}
              <span className="text-lg text-stone-400">/10</span>
            </p>
            <p className="mt-1 text-sm text-stone-500">Overall score</p>
            <div className="mt-6">
              <RatingDisplay rating={machine.rating} />
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="font-semibold text-stone-900">Specs</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Price</dt>
                <dd className="font-medium text-stone-900">
                  {formatPrice(machine.priceRange.min, machine.priceRange.max)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Power</dt>
                <dd className="font-medium text-stone-900">{machine.specs.power}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Precision</dt>
                <dd className="font-medium text-stone-900">
                  {machine.specs.performance.precision}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Work area</dt>
                <dd className="font-medium text-stone-900">{machine.specs.workArea}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Sample engrave</dt>
                <dd className="mt-1 font-medium text-stone-900">
                  {machine.specs.performance.engraveExample.time}
                </dd>
                <dd className="text-xs text-stone-500">
                  {machine.specs.performance.engraveExample.size}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Sample cut</dt>
                <dd className="mt-1 font-medium text-stone-900">
                  {machine.specs.performance.cutExample.time}
                </dd>
                <dd className="text-xs text-stone-500">
                  {machine.specs.performance.cutExample.size !== "—"
                    ? machine.specs.performance.cutExample.size
                    : machine.specs.performance.cutExample.time}
                </dd>
              </div>
              {machine.specs.software && (
                <div>
                  <dt className="text-stone-500">Software</dt>
                  <dd className="mt-1 font-medium text-stone-900">
                    {machine.specs.software.join(", ")}
                  </dd>
                </div>
              )}
            </dl>
            {machine.priceRange.note && (
              <p className="mt-4 text-xs text-stone-500">{machine.priceRange.note}</p>
            )}
          </div>

          {similar.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="font-semibold text-stone-900">Compare with</h2>
              <ul className="mt-3 space-y-2">
                {similar.map(
                  (m) =>
                    m && (
                      <li key={m.slug}>
                        <Link
                          href={`/lasers/${m.slug}`}
                          className="text-sm text-amber-700 hover:underline"
                        >
                          {m.name}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-stone-200 bg-amber-50 p-5">
            <p className="text-sm font-medium text-amber-900">New to lasers?</p>
            <p className="mt-1 text-xs text-stone-600">
              Read our safety basics before your first job.
            </p>
            <Link
              href="/guides/laser-safety-basics"
              className="mt-2 inline-block text-sm font-medium text-amber-700 hover:underline"
            >
              Laser safety guide →
            </Link>
          </div>

          <p className="text-xs text-stone-400">
            Last updated {machine.lastUpdated}. Prices are approximate.
          </p>
        </aside>
      </div>
    </div>
    </>
  );
}
