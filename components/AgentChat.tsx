"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Source = { id: string; title: string; href?: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[]; mode?: string };

const SUGGESTIONS = ["What does Vishal do?", "How does maths help his UX?", "Tell me about AstroDash", "Is he available?"];

export function AgentChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  useEffect(() => {
    const openIt = () => setOpen(true);
    addEventListener("open-agent", openIt);
    return () => removeEventListener("open-agent", openIt);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function ask(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: question }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsgs((m) => [...m, { role: "assistant", content: data.reply, sources: data.sources, mode: data.mode }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Something went wrong on my side. Try again, or email Vishal directly." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="iso-btn fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-lg border border-line bg-card py-2 pl-2.5 pr-4 text-sm font-medium"
        aria-expanded={open}
        aria-controls="agent-panel"
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-ink text-paper">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="18" cy="18" r="3" />
            <path d="M9 11l6-4M9 13l6 4" />
          </svg>
          {!open && <span className="absolute inset-0 animate-ping rounded-md bg-ink opacity-20" />}
        </span>
        {open ? "Close agent" : "Ask my agent"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="agent-panel"
            role="dialog"
            aria-label="Ask Vishal's agent"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="card fixed bottom-20 right-3 z-40 flex h-[min(560px,calc(100svh-120px))] w-[calc(100vw-24px)] max-w-[400px] flex-col overflow-hidden rounded-2xl sm:right-5"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div>
                <div className="label">agent · ask_about_vishal</div>
                <div className="mt-0.5 text-sm font-medium">Ask anything about my work</div>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-ok">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" /> online
              </span>
            </div>

            <div ref={list} className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.length === 0 && (
                <div>
                  <p className="text-sm text-ink-2">
                    I&apos;m a small agent that answers from Vishal&apos;s notes and shows its sources. Try:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => ask(s)} className="rounded-lg border border-line px-2.5 py-1 text-xs hover:border-ink">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {msgs.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3 py-2 text-sm text-paper">
                    {m.content}
                  </div>
                ) : (
                  <div key={i} className="max-w-[92%]">
                    <div className="rounded-2xl rounded-bl-md bg-paper-2 px-3 py-2 text-sm leading-relaxed">{m.content}</div>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-1">
                        <span className="font-mono text-[10px] text-muted">sources</span>
                        {m.sources.map((s) =>
                          s.href ? (
                            <Link key={s.id} href={s.href} onClick={() => setOpen(false)} className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] hover:border-accent hover:text-accent">
                              {s.title} ↗
                            </Link>
                          ) : (
                            <span key={s.id} className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                              {s.title}
                            </span>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ),
              )}
              {busy && <div className="caret font-mono text-xs text-muted">retrieving </div>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex gap-2 border-t border-line p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, availability…"
                className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                maxLength={500}
                aria-label="Your question"
              />
              <button type="submit" disabled={busy || !input.trim()} className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-ink disabled:opacity-40">
                Ask
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
