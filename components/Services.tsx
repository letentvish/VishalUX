"use client";

import { Branches, Exploded, Loupe, Plot, Router } from "@lucasmarkes/hairline/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { services } from "@/lib/content";
import { Em, Station } from "./Station";

const FIGS = [Router, Plot, Branches, Loupe, Exploded];

export function Services() {
  const [open, setOpen] = useState(0);

  return (
    <Station
      id="interface"
      n="03"
      name="interface"
      title={<>Where I <Em>plug in.</Em></>}
      intro="One method, five places to start. Hire me for one step or the whole line."
    >
      <div className="border-t border-line">
        {services.map((s, i) => {
          const Fig = FIGS[i];
          const isOpen = open === i;
          return (
            <div
              key={s.n}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
              className="group relative grid grid-cols-[1fr_96px] items-center gap-4 border-b border-line py-6 sm:grid-cols-[64px_1fr_200px] sm:gap-8"
            >
              <span className={`absolute left-0 top-0 h-px bg-ink transition-all duration-500 ${isOpen ? "w-full" : "w-0"}`} />
              <span className="hidden font-mono text-sm text-muted sm:block">{s.n}</span>
              <div>
                <button
                  onClick={() => setOpen(i)}
                  className="text-left text-2xl font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-[34px]"
                  aria-expanded={isOpen}
                >
                  {s.title}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 max-w-2xl text-lg text-ink-2">{s.body}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <span key={t} className="rounded-md border border-line bg-card px-2.5 py-1 font-mono text-[11px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className={`lean transition-[opacity,scale] duration-500 ${isOpen ? "scale-100 opacity-100" : "scale-[0.82] opacity-45"}`}>
                <Fig data-live intensity={0.7} label={s.title} />
              </div>
            </div>
          );
        })}
      </div>
    </Station>
  );
}
