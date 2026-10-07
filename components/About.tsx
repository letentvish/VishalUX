"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Query } from "@lucasmarkes/hairline/react";
import { story, translations } from "@/lib/content";
import { Em, Station } from "./Station";

export function About() {
  return (
    <Station
      id="formula"
      n="01"
      name="formula"
      title={<>I think in <Em>variables.</Em></>}
      intro="Before any screen, I find the variables hiding in the question. That's the maths degree, applied to design."
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <div className="lean mb-8 w-48 sm:w-56">
            <Query data-live intensity={0.8} label="A question mark that turns toward the cursor" />
          </div>
          <div className="space-y-3 text-xl leading-relaxed sm:text-[26px]">
            {story.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0.12, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-30% 0px -40% 0px" }}
                transition={{ duration: 0.45 }}
                className={i < 2 ? "font-medium" : "text-ink-2"}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>
        <Translator />
      </div>
    </Station>
  );
}

function Translator() {
  const [i, setI] = useState(0);
  const [step, setStep] = useState(0);
  const t = translations[i];

  useEffect(() => {
    setStep(0);
    const id = setInterval(() => setStep((s) => (s < 3 ? s + 1 : s)), 700);
    return () => clearInterval(id);
  }, [i]);

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="lean">
      <div className="card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <span className="label">node · vague_to_flow</span>
          <span className="font-mono text-[11px] text-muted">my maths edge</span>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-line p-3">
          {translations.map((x, j) => (
            <button
              key={j}
              onClick={() => setI(j)}
              className={`rounded-lg border px-2.5 py-1 text-left text-xs transition-colors ${
                i === j ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink"
              }`}
            >
              {x.vague}
            </button>
          ))}
        </div>

        <div className="space-y-5 p-5">
          <Row n="01" label="vague">
            <p className="font-serif italic text-[26px] leading-tight text-ink-2">“{t.vague}”</p>
          </Row>

          <Row n="02" label="variables" on={step >= 1}>
            <div className="flex flex-wrap gap-1.5">
              {t.dims.map((d, k) => (
                <motion.span
                  key={`${i}-${d}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={step >= 1 ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: k * 0.08 }}
                  className="rounded-md border border-port/40 bg-port/10 px-2 py-0.5 font-mono text-xs text-port"
                >
                  {d}
                </motion.span>
              ))}
            </div>
          </Row>

          <Row n="03" label="formula" on={step >= 2}>
            <AnimatePresence mode="wait">
              {step >= 2 && (
                <motion.code
                  key={i}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 0.6 }}
                  className="block rounded-lg bg-paper-2 px-3 py-2 font-mono text-[13px] text-ink"
                >
                  {t.formula}
                </motion.code>
              )}
            </AnimatePresence>
          </Row>

          <Row n="04" label="flow" on={step >= 3}>
            <div className="flex flex-wrap items-center gap-1.5">
              {t.flow.map((f, k) => (
                <motion.span
                  key={`${i}-${f}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={step >= 3 ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: k * 0.1 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="rounded-md border border-line bg-card px-2 py-1 text-xs">{f}</span>
                  {k < t.flow.length - 1 && <span className="text-accent">→</span>}
                </motion.span>
              ))}
            </div>
          </Row>
        </div>
      </div>
      </div>
      <p className="mt-3 font-serif text-xl italic text-muted">↑ how I start every project. Pick a question.</p>
    </div>
  );
}

function Row({ n, label, on = true, children }: { n: string; label: string; on?: boolean; children: React.ReactNode }) {
  return (
    <div className={`grid grid-cols-[64px_1fr] gap-3 transition-opacity ${on ? "opacity-100" : "opacity-30"}`}>
      <div className="pt-1">
        <div className="font-mono text-[11px] text-accent">{n}</div>
        <div className="label">{label}</div>
      </div>
      <div className="min-h-[32px]">{children}</div>
    </div>
  );
}
