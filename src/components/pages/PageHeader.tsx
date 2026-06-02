import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, eyebrow, children }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">{eyebrow}</p>
      )}
      <h1
        className={`font-bold tracking-tight text-stone-900 ${eyebrow ? "mt-2" : ""} text-3xl sm:text-4xl`}
      >
        {title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">{description}</p>
      {children}
    </header>
  );
}
