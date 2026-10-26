"use client";

import { Lockers, Phosphor, Sieve } from "@lucasmarkes/hairline/react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { comingSoon, work, type CaseStudy } from "@/lib/content";
import { Em, Station } from "./Station";

export function Work() {
  return (
    <Station
      id="flow"
      n="02"
      name="flow"
      title={<>Four systems, <Em>one method.</Em></>}
      intro="Each project is a stack: the question at the bottom, the interface on top. Hover a stack (or just scroll past it) to pull it apart."
    >
      <div className="space-y-28 md:space-y-36">
        {work.map((p, i) => (
          <ProjectRow key={p.slug} p={p} flip={i % 2 === 1} />
        ))}
        <UniquelyRow />
      </div>
      <p className="mt-24 max-w-2xl border-l border-line pl-5 text-ink-2">
        Also on the line: I led product design for enterprise-level applications and complex operational workflows. Role-based access, approval chains, audit trails.
        That work is under NDA, so it lives in conversation, not here.
      </p>
    </Station>
  );
}

function ProjectRow({ p, flip }: { p: CaseStudy; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Stacks spread as they pass the middle of the screen, then settle.
  const spread = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [8, 34, 12]);
  const layers = p.screens.length ? p.screens.slice(0, 3) : [];

  return (
    <article ref={ref} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <Link href={`/work/${p.slug}`} className="group block" aria-label={`Open the ${p.name} case study`}>
        {p.slug === "assessment-framework" ? (
          // a framework has no screens: its figure is a stack of test sieves, one per scoring layer
          <div className="lean relative mx-auto aspect-[4/3] w-full max-w-[560px] rounded-2xl border border-line bg-card p-6">
            <Sieve data-live intensity={0.75} label="Stacked test sieves: each layer filters the answers further" />
            <span className="absolute bottom-4 left-5 font-mono text-[11px] text-muted">5 layers · 24 archetypes</span>
          </div>
        ) : (
        <IsoStack spread={spread} accent={p.accent}>
          {layers.length
            ? layers.map((s) => (
                <Image key={s.src} src={s.src} alt={`${p.name}: ${s.caption}`} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover object-top" />
              ))
            : [0, 1, 2].map((k) => (
                <div key={k} className="absolute inset-0 flex items-center justify-center bg-card">
                  {k === 2 ? (
                    <div className="w-1/2">
                      <Phosphor data-live intensity={0.6} label={`${p.name}: screens in preparation`} />
                    </div>
                  ) : null}
                </div>
              ))}
        </IsoStack>
        )}
      </Link>

      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs text-muted">02.{p.index.slice(-1)}</span>
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{p.status}</span>
        </div>
        <h3 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{p.name}</h3>
        <p className="mt-3 text-xl text-ink-2">{p.tagline}</p>

        {p.liveNote && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs text-ink-2 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent }} />
            <span className="font-mono text-[11px] font-medium tracking-tight">{p.liveNote}</span>
          </div>
        )}

        <div className="mt-7 space-y-3 border-l border-line pl-5">
          <p className="font-serif text-[22px] italic leading-snug text-ink-2">{p.vague.question}</p>
          <p className="font-mono text-[13px] text-ink">{p.vague.formula[0]}</p>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {p.flow.map((f, k) => (
              <span key={f} className="flex items-center gap-1.5 text-xs text-muted">
                <span className="rounded border border-line bg-card px-1.5 py-0.5">{f}</span>
                {k < p.flow.length - 1 && <span>→</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href={`/work/${p.slug}`} className="iso-btn rounded-lg border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper">
            Open the full trace →
          </Link>
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className="draw-link text-sm text-ink-2">
              {p.liveLabel ?? "Live app"} ↗
            </a>
          )}
          <span className="font-mono text-[11px] text-muted">{p.kind}</span>
        </div>
      </div>
    </article>
  );
}

function IsoStack({ children, spread, accent }: { children: React.ReactNode[]; spread: MotionValue<number>; accent: string }) {
  const items = children.slice(0, 3);
  return (
    <div className="lean relative mx-auto aspect-[4/3] w-full max-w-[560px] [perspective:1600px]">
      <div className="absolute inset-[6%] [transform-style:preserve-3d] [transform:rotateX(52deg)_rotateZ(-38deg)]">
        {items.map((child, i) => (
          <Layer key={i} i={i} spread={spread} accent={accent} top={i === items.length - 1}>
            {child}
          </Layer>
        ))}
      </div>
    </div>
  );
}

function Layer({
  i,
  spread,
  top,
  accent,
  children,
}: {
  i: number;
  spread: MotionValue<number>;
  top: boolean;
  accent: string;
  children: React.ReactNode;
}) {
  const z = useTransform(spread, (s: number) => `translateZ(${i * s}px)`);
  return (
    <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: z }}>
      <div
        className="absolute inset-0 overflow-hidden rounded-[10px] border border-[var(--hairline-edge)] bg-card transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:[transform:translateZ(var(--lift))]"
        style={{ ["--lift" as string]: `${i * 46}px`, boxShadow: top ? `0 0 0 1px ${accent}22` : undefined }}
      >
        {children}
        {!top && <div className="absolute inset-0 bg-card/55" />}
      </div>
    </motion.div>
  );
}

function UniquelyRow() {
  return (
    <article className="grid items-center gap-10 rounded-2xl border border-dashed border-line p-6 lg:grid-cols-[320px_1fr] lg:p-10">
      <div className="lean mx-auto w-full max-w-[300px]">
        <Lockers data-live intensity={0.7} label="A bank of lockers, one opening" />
      </div>
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">02.5 · under construction</span>
        <h3 className="mt-3 text-4xl font-semibold tracking-tight">{comingSoon.name}</h3>
        <p className="mt-3 text-xl text-ink-2">{comingSoon.tagline}</p>
        <p className="mt-4 font-serif text-xl italic text-muted">The next station on the line. Details soon.</p>
      </div>
    </article>
  );
}
