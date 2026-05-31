import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/guides/MarkdownContent";
import { guideJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { getAllGuidesMeta, getGuideBySlug } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuidesMeta().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Not found" };

  return {
    title: guide.title,
    description: guide.description,
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <>
      <JsonLd data={guideJsonLd(guide)} />
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/guides" className="hover:text-amber-700">
          Guides
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{guide.title}</span>
      </nav>

      <p className="text-sm font-medium uppercase tracking-wide text-amber-700">
        {guide.readTime} read · Updated {guide.lastUpdated}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-4 text-lg text-stone-600">{guide.description}</p>

      <div className="mt-10">
        <MarkdownContent content={guide.content} />
      </div>
    </div>
    </>
  );
}
