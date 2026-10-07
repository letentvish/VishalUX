"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogoMark } from "./LogoMark";

const TRACE = [
  ["spawn", "orchestrator"],
  ["load", "research_agent"],
  ["load", "framework_engine"],
  ["wire", "4 case studies"],
  ["check", "honesty_auditor"],
] as const;

// Shown once per browser session, as an agent "boot" trace.
export function Loader() {
  const [phase, setPhase] = useState<"ssr" | "on" | "off">("ssr");
  const show = phase === "on";
  const setShow = (v: boolean) => setPhase(v ? "on" : "off");
  const [step, setStep] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("booted") === "1";
    } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.removeAttribute("data-boot");
      setPhase("off");
      return;
    }
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setInterval(() => setStep((s) => (s < TRACE.length ? s + 1 : s)), 330);
    return () => {
      clearInterval(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  function enter() {
    setShow(false);
    document.documentElement.removeAttribute("data-boot");
    document.documentElement.style.overflow = "";
    try {
      sessionStorage.setItem("booted", "1");
    } catch {}
  }

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Enter" && step >= TRACE.length && enter();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, step]);

  const done = step >= TRACE.length;

  // Before hydration: a plain cover, made visible pre-paint only for first-time visitors.
  if (phase === "ssr") return <div className="boot-cover fixed inset-0 z-50 bg-[#08090a]" aria-hidden />;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090a] px-6 text-[#eeece6]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="w-full max-w-xl">
            <div className="mb-8 text-[#fafafa]" style={{ ["--ink" as string]: "#fafafa", ["--card" as string]: "#08090a" }}>
              <LogoMark size={56} playing={!done} />
            </div>
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8f8d86]">
              Vishal Singh · agentic UX & systems
            </div>
            <div className="space-y-1.5 font-mono text-sm">
              {TRACE.slice(0, step).map(([verb, what]) => (
                <motion.div key={what} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                  <span className="text-[#8f8d86]">›</span>
                  <span className="w-12 text-[#8f8d86]">{verb}</span>
                  <span className="flex-1">{what}</span>
                  <span className="text-[#3ccf7a]">ok</span>
                </motion.div>
              ))}
              {!done && <div className="caret text-[#8f8d86]">› </div>}
            </div>
            <AnimatePresence>
              {done && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
                  <p className="text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
                    Vague ideas in.
                    <br />
                    <span className="font-serif italic font-normal">Systems people trust</span> out.
                  </p>
                  <button
                    onClick={enter}
                    autoFocus
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#eeece6] px-4 py-2.5 text-sm font-medium text-[#0f0f0e] shadow-[0_3px_0_#52525b] transition-transform hover:-translate-y-0.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M6 4l14 8-14 8z" />
                    </svg>
                    Run portfolio
                    <kbd className="ml-1 font-mono text-[10px] opacity-60">↵</kbd>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
