"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { line, prism } from "@/lib/iso";
import { Em, Station } from "./Station";

type Stroke = { d: string; strong?: boolean; dashed?: boolean; fill?: boolean };

const base = prism(-40, -40, 0, 80, 80, 14);
const card = prism(-36, -36, 26, 72, 72, 4);

const PRINCIPLES: { title: string; body: string; strokes: Stroke[] }[] = [
  {
    title: "Maths underneath, language on top",
    body: "Anything that can be computed is computed. The model only explains numbers it is handed, so it can't invent them.",
    strokes: [
      { d: base.outline, fill: true },
      { d: base.inner },
      { d: line([-30, -10, 34], [-10, -30, 44], [10, -10, 34], [30, -30, 44]), strong: true },
      { d: line([-30, 20, 34], [-10, 0, 44], [10, 20, 34], [30, 0, 44]), strong: true },
    ],
  },
  {
    title: "Show the reasoning",
    body: "Every answer carries its working: the formula, the source, the rule it applied. Trust comes from being able to check.",
    strokes: [
      { d: base.outline, fill: true },
      { d: base.inner },
      { d: card.outline, fill: true },
      { d: line([-24, -20, 30], [20, -20, 30]), strong: true },
      { d: line([-24, -4, 30], [8, -4, 30]) },
      { d: line([-24, 12, 30], [14, 12, 30]) },
    ],
  },
  {
    title: "Admit the mismatch",
    body: "A recommendation that names its own weak spot is more believable than one that doesn't. I design the warning in, not out.",
    strokes: [
      { d: base.outline, fill: true },
      { d: base.inner },
      { d: line([0, 0, 64], [-22, 22, 26], [22, -22, 26], [0, 0, 64]), strong: true },
      { d: line([0, 0, 54], [0, 0, 40]), strong: true },
    ],
  },
  {
    title: "Work when the model doesn't",
    body: "Rate limits, outages, bad JSON: there's always a fallback path, and the screen never breaks. The happy path is the easy part.",
    strokes: [
      { d: prism(-50, -14, 0, 28, 28, 18).outline, fill: true },
      { d: prism(22, -14, 0, 28, 28, 18).outline, fill: true },
      { d: line([-22, 0, 9], [-6, 0, 30], [6, 0, 30], [22, 0, 9]), strong: true },
      { d: line([-22, 0, 4], [-6, 0, -10], [6, 0, -10], [22, 0, 4]), dashed: true },
    ],
  },
];

export function Principles() {
  return (
    <Station
      id="evidence"
      n="04"
      name="evidence"
      title={<>How I keep AI <Em>honest.</Em></>}
      intro="Four rules that run through every project on this line, and the reason none of my case studies quote numbers I can't back up."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <div key={p.title} className="group relative bg-paper p-7 transition-colors duration-300 hover:bg-card sm:p-9">
            <div className="flex items-start justify-between gap-6">
              <span className="font-mono text-xs text-muted">R{i + 1}</span>
              <svg viewBox="-80 -80 160 130" className="lean h-28 w-36 overflow-visible transition-transform duration-500 group-hover:-translate-y-1.5" aria-hidden>
                {p.strokes.map((s, k) => (
                  <motion.path
                    key={k}
                    d={s.d}
                    fill={s.fill ? "var(--card)" : "none"}
                    stroke={s.strong ? "var(--ink)" : s.fill ? "var(--hairline-edge)" : "var(--hairline-mid)"}
                    strokeWidth={s.strong ? 1.3 : 1}
                    strokeDasharray={s.dashed ? "3 4" : undefined}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.9, delay: 0.15 * k, ease: "easeInOut" }}
                  />
                ))}
              </svg>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-2 max-w-md text-ink-2">{p.body}</p>
          </div>
        ))}
      </div>
      <Link href="/system-map" className="iso-btn mt-10 inline-flex items-center gap-2 rounded-lg border border-line bg-card px-4 py-2.5 text-sm font-medium">
        See every framework on the system map ↗
      </Link>
    </Station>
  );
}
