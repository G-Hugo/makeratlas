import type { Machine } from "@/types/machine";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function toIsoReleaseDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length === 1) return `${iso}-01-01`;
  if (parts.length === 2) return `${iso}-01`;
  return iso;
}

export function machineJsonLd(machine: Machine) {
  const url = `https://makeratlas.com/lasers/${machine.slug}`;
  const image = machine.image.startsWith("http")
    ? machine.image
    : `https://makeratlas.com${machine.image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: machine.name,
    sku: machine.slug,
    url,
    image,
    brand: { "@type": "Brand", name: machine.brand },
    description: machine.tldr,
    category: "Laser Engraver",
    ...(machine.releaseDate
      ? { releaseDate: toIsoReleaseDate(machine.releaseDate) }
      : {}),
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: machine.rating.overall,
        bestRating: 10,
        worstRating: 0,
      },
      author: { "@type": "Organization", name: "Maker Atlas" },
      reviewBody: machine.primaryUse,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://makeratlas.com${item.path}`,
    })),
  };
}

export function guideJsonLd(guide: {
  title: string;
  description: string;
  slug: string;
  lastUpdated: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `https://makeratlas.com/guides/${guide.slug}`,
    dateModified: guide.lastUpdated,
    publisher: {
      "@type": "Organization",
      name: "Maker Atlas",
      url: "https://makeratlas.com",
    },
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
