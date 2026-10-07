"use client";

import { Branches, Cabinet, Exploded, Patch, Query, Sieve, Terminal } from "@lucasmarkes/hairline/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Board = {
  id: string;
  x: number;
  y: number;
  w: number;
  title: string;
  from?: { label: string; href: string };
  Fig: typeof Patch;
  steps: string[];
  note: string;
};

const WORLD = { w: 2200, h: 1400 };

const BOARDS: Board[] = [
  {
    id: "stack",
    x: 80,
    y: 80,
    w: 460,
    title: "The 6-layer intelligence stack",
    from: { label: "AstroDash", href: "/work/astrodash" },
    Fig: Exploded,
    steps: ["Reception: validate + guard input", "Router: cloud or local model", "Skills: task prompt + output schema", "Retrieval: hybrid search over sources", "Memory: carry context between views", "Auditor: check before it reaches the UI"],
    note: "Every agentic product I build sits on these six layers. The UI only ever sees layer six.",
  },
  {
    id: "loop",
    x: 620,
    y: 140,
    w: 420,
    title: "Evaluator–optimizer loop",
    from: { label: "AstroDash", href: "/work/astrodash" },
    Fig: Terminal,
    steps: ["Model drafts an answer", "Auditor checks it against computed facts", "Schema validator checks the shape", "Fail → retry with the reason", "Still failing → fallback, never a broken screen"],
    note: "How you stop an LLM from contradicting the maths underneath it.",
  },
  {
    id: "fit",
    x: 1120,
    y: 80,
    w: 440,
    title: "4-layer fit diagnostic",
    from: { label: "Assessment Framework", href: "/work/assessment-framework" },
    Fig: Sieve,
    steps: ["Thinking style alignment", "Behavioural stress load", "Values concordance", "Execution readiness"],
    note: "A fuzzy “am I suited?” split into four questions that can each be answered and acted on. Weights stay private.",
  },
  {
    id: "vague",
    x: 1640,
    y: 160,
    w: 420,
    title: "Vague → Formula → Flow",
    Fig: Query,
    steps: ["Write down the vague question as asked", "Name the variables hiding in it", "Weight them into a model", "Map the flow between people and agents", "Design the interface last"],
    note: "My starting move on every project. Maths degree, applied.",
  },
  {
    id: "handoffs",
    x: 200,
    y: 780,
    w: 460,
    title: "Enterprise workflow pattern",
    Fig: Branches,
    steps: ["Model access first: roles, scopes, permissions", "Map hand-offs between people", "Every action: validate → change state → notify → audit", "One inbox for everything waiting on you"],
    note: "From ERP and HRMS work (details under NDA). The hard part is never the screen.",
  },
  {
    id: "trust",
    x: 760,
    y: 820,
    w: 440,
    title: "Trust patterns for AI output",
    from: { label: "WatchMatch", href: "/work/watchmatch" },
    Fig: Cabinet,
    steps: ["Show the reasoning next to the answer", "Show the risk: “possible mismatch”", "Show the source", "Work when the model doesn't"],
    note: "People trust an AI that admits what it might get wrong.",
  },
  {
    id: "uniquely",
    x: 1300,
    y: 800,
    w: 400,
    title: "Uniquely: agentic project management",
    Fig: Patch,
    steps: ["In progress"],
    note: "The next board on this map. Coming soon.",
  },
];

const EDGES: [string, string][] = [
  ["stack", "loop"],
  ["loop", "fit"],
  ["fit", "vague"],
  ["stack", "handoffs"],
  ["handoffs", "trust"],
  ["trust", "uniquely"],
  ["loop", "trust"],
];

export function SystemMap() {
  const box = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 0.5 });
  const pan = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  const fit = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const k = Math.min(width / WORLD.w, (height - 80) / WORLD.h, 1);
    setView({ k, x: (width - WORLD.w * k) / 2, y: 70 + (height - 80 - WORLD.h * k) / 2 });
  }, []);

  useEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      if (e.ctrlKey || e.metaKey) {
        setView((v) => {
          const k = Math.min(2, Math.max(0.2, v.k * Math.exp(-e.deltaY * 0.01)));
          return { k, x: mx - ((mx - v.x) * k) / v.k, y: my - ((my - v.y) * k) / v.k };
        });
      } else {
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const zoom = (f: number) => {
    const el = box.current!;
    const { width, height } = el.getBoundingClientRect();
    setView((v) => {
      const k = Math.min(2, Math.max(0.2, v.k * f));
      return { k, x: width / 2 - ((width / 2 - v.x) * k) / v.k, y: height / 2 - ((height / 2 - v.y) * k) / v.k };
    });
  };

  const centre = (id: string) => {
    const b = BOARDS.find((x) => x.id === id)!;
    return { x: b.x + b.w / 2, y: b.y + 260 };
  };

  return (
    <main
      ref={box}
      className="dot-grid fixed inset-0 cursor-grab overflow-hidden active:cursor-grabbing"
      style={{ backgroundPosition: `${view.x}px ${view.y}px`, backgroundSize: `${24 * view.k}px ${24 * view.k}px`, touchAction: "none" }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("a,button")) return;
        pan.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const p = pan.current;
        if (p) setView((v) => ({ ...v, x: p.vx + e.clientX - p.x, y: p.vy + e.clientY - p.y }));
      }}
      onPointerUp={() => (pan.current = null)}
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: WORLD.w, height: WORLD.h, transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}>
        <svg className="pointer-events-none absolute inset-0" width={WORLD.w} height={WORLD.h} aria-hidden>
          {EDGES.map(([a, b]) => {
            const p = centre(a);
            const q = centre(b);
            const mx = (p.x + q.x) / 2;
            return (
              <path key={a + b} d={`M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`} stroke="var(--muted)" strokeWidth="1.5" fill="none" className="edge-flow" />
            );
          })}
        </svg>

        <div className="absolute left-[80px] top-[-10px]">
          <div className="label"># system map</div>
          <h1 className="mt-1 text-3xl font-semibold">
            The frameworks <span className="font-serif font-normal italic">behind</span> the work.
          </h1>
        </div>

        {BOARDS.map((b) => (
          <section key={b.id} className={`card absolute rounded-2xl ${b.id === "uniquely" ? "border-dashed" : ""}`} style={{ left: b.x, top: b.y + 60, width: b.w }}>
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <span className="label">board · {b.id}</span>
              {b.from && (
                <Link href={b.from.href} className="font-mono text-[11px] text-muted hover:text-ink">
                  from {b.from.label} ↗
                </Link>
              )}
            </div>
            <div className="mx-auto w-[220px] pt-2">
              <b.Fig intensity={0.6} label={b.title} />
            </div>
            <div className="px-5 pb-5">
              <h2 className="text-lg font-semibold">{b.title}</h2>
              <ol className="mt-3 space-y-1.5">
                {b.steps.map((s, i) => (
                  <li key={s} className="grid grid-cols-[24px_1fr] text-sm text-ink-2">
                    <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <p className="mt-4 font-serif text-[17px] italic leading-snug text-muted">{b.note}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="card absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-2xl p-1.5 text-sm">
        <button onClick={() => zoom(1 / 1.2)} className="rounded-lg px-2.5 py-1 hover:bg-paper-2" aria-label="Zoom out">−</button>
        <span className="w-12 text-center font-mono text-xs tabular-nums">{Math.round(view.k * 100)}%</span>
        <button onClick={() => zoom(1.2)} className="rounded-lg px-2.5 py-1 hover:bg-paper-2" aria-label="Zoom in">+</button>
        <span className="mx-1 h-5 w-px bg-line" />
        <button onClick={fit} className="rounded-lg px-2.5 py-1 hover:bg-paper-2">Fit all</button>
      </div>
      <p className="label absolute bottom-6 left-5 hidden md:block">drag to pan · ctrl + scroll to zoom</p>
    </main>
  );
}
