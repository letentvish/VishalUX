"use client";

import { Branches, Cabinet, Exploded, Patch, Query, Sieve, Terminal } from "@lucasmarkes/hairline/react";
import Link from "next/link";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { Em } from "./Station";

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

// The system map: the 6-layer engine as an interactive 3D canvas, then the
// frameworks that sit on top of it.
export function SystemMap() {
  return (
    <main className="iso-grid">
      <WorkflowCanvas />
      <section className="px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-[1400px] border-t border-line pt-16">
          <div className="label"># frameworks on top of the engine</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            The thinking <Em>behind</Em> the work.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {BOARDS.filter((b) => b.id !== "stack").map((b) => (
              <section
                key={b.id}
                className={`group rounded-2xl border bg-card transition-transform duration-300 hover:-translate-y-1 ${b.id === "uniquely" ? "border-dashed border-line" : "border-line"}`}
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-2">
                  <span className="label">board · {b.id}</span>
                  {b.from && (
                    <Link href={b.from.href} className="font-mono text-[11px] text-muted hover:text-ink">
                      from {b.from.label} ↗
                    </Link>
                  )}
                </div>
                <div className="lean mx-auto w-[200px] pt-2">
                  <b.Fig data-live intensity={0.6} label={b.title} />
                </div>
                <div className="px-5 pb-5">
                  <h3 className="text-lg font-semibold">{b.title}</h3>
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
        </div>
      </section>
    </main>
  );
}
