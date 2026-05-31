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

export function machineJsonLd(machine: Machine) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: machine.name,
    brand: { "@type": "Brand", name: machine.brand },
    description: machine.tldr,
    category: "Laser Engraver",
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
