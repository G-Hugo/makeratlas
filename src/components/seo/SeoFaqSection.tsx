import { faqJsonLd, JsonLd } from "@/components/seo/JsonLd";

export interface FaqItem {
  question: string;
  answer: string;
}

interface SeoFaqSectionProps {
  title: string;
  items: FaqItem[];
}

/** Visible FAQ accordion + FAQPage JSON-LD for rich snippets. */
export function SeoFaqSection({ title, items }: SeoFaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <JsonLd data={faqJsonLd(items)} />
      <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-stone-900 marker:content-none dark:text-stone-100 [&::-webkit-details-marker]:hidden">
              {item.question}
            </summary>
            <p className="border-t border-stone-100 px-4 pb-4 pt-3 text-sm leading-relaxed text-stone-700 dark:border-stone-800 dark:text-stone-300">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
