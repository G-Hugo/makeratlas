import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Maker Atlas",
  description:
    "Why Maker Atlas exists — honest, complete reference guides for makers and small artisans choosing laser engravers and maker machines.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
        About Maker Atlas
      </h1>
      <p className="mt-4 text-lg text-stone-600">
        The complete reference for maker machines — built because nothing else
        was.
      </p>

      <div className="prose prose-stone mt-10 max-w-none">
        <h2>Why we exist</h2>
        <p>
          Choosing a laser engraver should not require ten browser tabs, three
          YouTube rabbit holes, and a guess about whether &quot;40W&quot; means
          anything real.
        </p>
        <p>
          Maker Atlas started from a simple frustration: there was no single place
          with <strong>every machine type explained clearly</strong>,{" "}
          <strong>honest limits stated upfront</strong>, and{" "}
          <strong>actionable buying guidance</strong> for both beginners and
          pros.
        </p>
        <p>
          We are building that reference — starting with laser engravers, then
          expanding to 3D printers, CNC machines, and every tool small artisans
          rely on.
        </p>

        <h2>Our principles</h2>
        <ul>
          <li>
            <strong>Honest limits first.</strong> Every profile says what a
            machine cannot do — not just what the box claims.
          </li>
          <li>
            <strong>Plain language.</strong> TL;DR at the top. Deep specs when
            you need them.
          </li>
          <li>
            <strong>Complete coverage.</strong> The goal is every relevant
            machine, not just affiliate-friendly picks.
          </li>
          <li>
            <strong>Transparency.</strong> When we add affiliate links, we will
            say so clearly. Recommendations come from capability and value — not
            commission rates.
          </li>
        </ul>

        <h2>Who this is for</h2>
        <ul>
          <li>Hobbyists buying their first laser</li>
          <li>Etsy sellers and small shops scaling production</li>
          <li>Makers comparing diode vs CO₂ vs fiber before spending thousands</li>
          <li>Anyone tired of spec sheets written by marketing teams</li>
        </ul>

        <h2>What&apos;s on the site</h2>
        <ul>
          <li>
            <Link href="/lasers">Machine profiles</Link> — structured specs,
            materials, pros/cons, beginner and pro notes
          </li>
          <li>
            <Link href="/guides">Guides</Link> — laser types, buying advice,
            safety basics
          </li>
          <li>
            <Link href="/compare">Comparison tool</Link> — filter by type,
            price, and specs
          </li>
        </ul>

        <h2>Roadmap</h2>
        <p>We are actively expanding:</p>
        <ul>
          <li>More laser engravers — every major brand and model tier</li>
          <li>French translation (full site)</li>
          <li>3D printers, CNC, and other maker machines</li>
          <li>User-submitted settings and real-world test results</li>
        </ul>

        <h2>Contact & corrections</h2>
        <p>
          Found an error in a spec or disagree with a rating? We want to know.
          Accuracy is the product — corrections make the atlas better for
          everyone.
        </p>
        <p className="text-stone-500 text-sm">
          Contact: coming soon · makeratlas.com
        </p>
      </div>
    </div>
  );
}
