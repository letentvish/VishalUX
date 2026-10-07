"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { profile } from "@/lib/content";
import { CustomFigure } from "./CustomFigure";

export function Hero() {
  const [read, setRead] = useState("rest");

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-8 md:min-h-[100svh] md:pt-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {profile.role} · {profile.location}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-5 text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[64px] xl:text-[84px]"
          >
            I weave <span className="font-serif font-normal italic tracking-normal">loose ideas</span> into systems people can trust.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            Maths (Hons) graduate, self-taught designer. 3+ years in UX, the last one designing agentic AI. I build the frameworks,
            workflows and interfaces behind AI products, then ship them in code.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#formula" className="iso-btn rounded-lg border border-ink bg-ink px-4 py-2.5 text-sm font-medium text-paper">
              Follow the thread ↓
            </a>
            <button onClick={() => dispatchEvent(new Event("open-agent"))} className="iso-btn rounded-lg border border-line bg-card px-4 py-2.5 text-sm font-medium">
              Ask my agent
            </button>
            <span className="ml-1 flex items-center gap-2 text-sm text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
              </span>
              open to freelance & full-time
            </span>
          </motion.div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 border-t border-line pt-5">
            {profile.facts.map((f) => (
              <div key={f.k}>
                <dt className="label">{f.k}</dt>
                <dd className="mt-1 font-mono text-lg">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The loom: loose warp in, woven cloth out. The shuttle follows the cursor anywhere on the page. */}
        <motion.figure initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative order-first mx-auto w-full max-w-[640px] lg:order-none">
          <figcaption className="relative z-10 mb-6 flex items-center justify-between border-b border-line pb-3 font-mono text-[11px] text-muted">
            <span>fig. 01 · loom<span className="hidden sm:inline">: move your cursor, the shuttle follows</span></span>
            <span className="tabular-nums text-ink">{read}</span>
          </figcaption>
          <div className="lean relative scale-[1.22] sm:scale-[1.3]">
            <CustomFigure name="loom" intensity={0.55} onRead={setRead} label="A table loom: the shuttle follows your cursor across the warp, and the threads part to let it through." />
            {/* the site's thread leaves from under the front beam, where the cloth winds on */}
            <span data-anchor="via" className="absolute left-[55%] top-[80%] hidden h-1 w-1 lg:block" />
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
