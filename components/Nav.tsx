"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "./LogoMark";

export const STATIONS = [
  { id: "formula", n: "01", label: "Formula" },
  { id: "flow", n: "02", label: "Work" },
  { id: "interface", n: "03", label: "Services" },
  { id: "evidence", n: "04", label: "Principles" },
  { id: "out", n: "05", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme((document.documentElement.getAttribute("data-theme") as "light" | "dark") ?? "light");
    const onScroll = () => setScrolled(scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    if (pathname !== "/") {
      setActive(pathname.startsWith("/work") ? "flow" : "");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["top", ...STATIONS.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-paper/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/#top" className="group flex items-center gap-3" aria-label="Vishal Singh, home">
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-[15px] font-medium">Vishal Singh</span>
            <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">agentic ux · systems</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Sections">
          {STATIONS.map((s) => (
            <Link key={s.id} href={`/#${s.id}`} className="group relative flex items-baseline gap-1.5 py-1 text-sm">
              <span className={`font-mono text-[10px] transition-colors ${active === s.id ? "text-ink" : "text-muted"}`}>{s.n}</span>
              <span className={active === s.id ? "text-ink" : "text-ink-2 group-hover:text-ink"}>{s.label}</span>
              <span
                className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ${
                  active === s.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
          <Link href="/system-map" className="group relative py-1 text-sm text-ink-2 hover:text-ink">
            System map ↗
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="iso-btn rounded-lg border border-line bg-card p-2" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <Link href="/#out" className="iso-btn hidden rounded-lg border border-ink bg-ink px-3.5 py-1.5 text-sm font-medium text-paper sm:block">
            Plug in a problem
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="iso-btn rounded-lg border border-line bg-card px-3 py-1.5 text-sm lg:hidden" aria-expanded={open}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line lg:hidden"
            aria-label="Sections"
          >
            <div className="flex flex-col px-4 py-3">
              {STATIONS.map((s) => (
                <Link key={s.id} href={`/#${s.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-3 border-b border-line py-3 last:border-0">
                  <span className="font-mono text-[11px] text-muted">{s.n}</span>
                  <span className="text-lg">{s.label}</span>
                </Link>
              ))}
              <Link href="/system-map" className="py-3 text-lg">System map ↗</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Moon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}
function Sun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
