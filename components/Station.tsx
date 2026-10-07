import type { ReactNode } from "react";

// A stop on the line. The anchor dot is where the thread passes through.
export function Station({
  id,
  n,
  name,
  title,
  intro,
  children,
}: {
  id: string;
  n: string;
  name: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-16 px-4 py-24 sm:px-8 md:py-32">
      <div className="relative mx-auto max-w-[1400px]">
        {/* waypoint in the empty band above the heading: sideways runs turn here */}
        <span data-anchor="via" className="absolute -top-14 left-1 h-2.5 w-2.5 md:left-6" />
        <div className="flex items-center gap-4 pl-1 md:pl-6">
          <span data-anchor className="h-2.5 w-2.5 shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            station {n} · {name}
          </span>
        </div>
        <div className="pl-7 md:pl-[120px]">
          <h2 className="mt-6 max-w-4xl text-[38px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl">{title}</h2>
          {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</div>}
          <div className="mt-14">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return <span className="font-serif font-normal italic tracking-normal">{children}</span>;
}
