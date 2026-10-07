"use client";

import { Plug } from "@lucasmarkes/hairline/react";
import { useState } from "react";
import { profile } from "@/lib/content";
import { Em } from "./Station";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <section id="out" className="relative scroll-mt-16 px-4 pb-10 pt-24 sm:px-8 md:pt-32">
      <div className="relative mx-auto max-w-[1400px]">
        <span data-anchor="via" className="absolute -top-14 left-1 h-2.5 w-2.5 md:left-6" />
        <div className="flex items-center gap-4 pl-1 md:pl-6">
          <span data-anchor className="h-2.5 w-2.5 shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">station 05 · out</span>
        </div>

        <div className="grid items-center gap-10 pl-7 md:pl-[120px] lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-7xl">
              Plug in a <Em>problem.</Em>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              A half-formed idea, a workflow that keeps breaking, an AI feature nobody trusts yet. Freelance or full-time, the
              line starts with a conversation.
            </p>

            <div className="mt-10 rounded-2xl border border-line bg-card p-6">
              <div className="label">email</div>
              <div className="mt-2 break-all font-mono text-xl sm:text-2xl">{profile.email}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`mailto:${profile.email}`} className="iso-btn rounded-lg border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper">
                  Write to me →
                </a>
                <button onClick={copy} className="iso-btn rounded-lg border border-line bg-card px-4 py-2 text-sm" aria-live="polite">
                  {copied ? "Copied ✓" : "Copy address"}
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {profile.links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="group bg-card px-5 py-4 transition-colors hover:bg-paper-2">
                  <div className="label">{l.label}</div>
                  <div className="mt-1 font-mono text-sm transition-transform group-hover:translate-x-1">{l.handle} ↗</div>
                </a>
              ))}
            </div>
          </div>

          <div className="relative lg:order-first">
            <div className="lean relative mx-auto w-full max-w-[460px]">
              <Plug data-live intensity={0.85} label="A plug drawn up toward its socket" />
              {/* the line ends here: it becomes the plug's cord */}
              <span data-anchor className="absolute left-[98%] top-[57%] h-1 w-1" />
            </div>
            <p className="text-center font-serif text-lg italic text-muted">scroll to the end and it nearly connects.</p>
          </div>
        </div>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 font-mono text-xs text-muted">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </span>
          <span>one line, drawn by me. figures by Hairline.</span>
        </footer>
      </div>
    </section>
  );
}
