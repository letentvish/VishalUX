"use client";

import { useEffect, useRef, useState } from "react";
import { prism } from "@/lib/iso";

type Pt = { x: number; y: number; via?: boolean };
const SHUTTLE = prism(-5, -5, -4, 10, 10, 8);

// The one continuous line. It runs through every element marked `data-anchor`
// (in DOM order), draws itself as the page scrolls, and carries a small isometric
// shuttle at its tip. Anchors light up as the shuttle passes them.
export function Thread() {
  const svg = useRef<SVGSVGElement>(null);
  const drawn = useRef<SVGPathElement>(null);
  const shuttle = useRef<SVGGElement>(null);
  const [d, setD] = useState("");
  const [nodes, setNodes] = useState<Pt[]>([]);
  const state = useRef({ total: 0, samples: [] as { len: number; y: number }[], nodeLens: [] as number[], cur: 0, target: 0 });

  // Build the path from anchor positions.
  useEffect(() => {
    const host = svg.current?.parentElement;
    if (!host) return;
    const measure = () => {
      const base = host.getBoundingClientRect();
      const pts: Pt[] = [];
      host.querySelectorAll<HTMLElement>("[data-anchor]").forEach((el) => {
        if (!el.offsetParent) return; // hidden
        const r = el.getBoundingClientRect();
        const p = { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top, via: el.dataset.anchor === "via" };
        if (!pts.length || p.y > pts[pts.length - 1].y + 8) pts.push(p);
      });
      if (pts.length < 2) return;
      // Orthogonal routing: straight down, then one rounded turn into a straight run sideways.
      // Sideways runs happen only at anchors placed in empty space, so the line never crosses text.
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const dx = b.x - a.x;
        if (Math.abs(dx) < 1) {
          path += ` L ${b.x} ${b.y}`;
          continue;
        }
        const r = Math.min(28, Math.abs(dx) / 2, (b.y - a.y) / 2);
        const sx = Math.sign(dx);
        path += ` L ${a.x} ${b.y - r} Q ${a.x} ${b.y}, ${a.x + sx * r} ${b.y} L ${b.x} ${b.y}`;
      }
      setD(path);
      setNodes(pts);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    addEventListener("resize", measure);
    const t = setTimeout(measure, 800);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  // Sample the path once per layout.
  useEffect(() => {
    const p = drawn.current;
    if (!p || !d) return;
    const total = p.getTotalLength();
    const samples: { len: number; y: number }[] = [];
    const N = 800;
    for (let i = 0; i <= N; i++) {
      const len = (total * i) / N;
      samples.push({ len, y: p.getPointAtLength(len).y });
    }
    const pts = samples.map((s) => ({ ...s, ...p.getPointAtLength(s.len) }));
    const nodeLens = nodes.map((n) => pts.reduce((best, q) => (Math.hypot(q.x - n.x, q.y - n.y) < Math.hypot(best.x - n.x, best.y - n.y) ? q : best)).len);
    Object.assign(state.current, { total, samples, nodeLens });
    p.style.strokeDasharray = `${total}`;
  }, [d, nodes]);

  // Follow the scroll, eased, every frame.
  useEffect(() => {
    let raf = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const s = state.current;
      const host = svg.current?.parentElement;
      if (!s.total || !host) return;
      const top = host.getBoundingClientRect().top;
      const tip = -top + innerHeight * 0.6;
      const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
      let target = 0;
      if (atEnd) target = s.total;
      else {
        let lo = 0;
        let hi = s.samples.length - 1;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (s.samples[mid].y < tip) lo = mid + 1;
          else hi = mid;
        }
        target = s.samples[lo]?.len ?? 0;
      }
      s.target = target;
      s.cur = reduced ? target : s.cur + (target - s.cur) * 0.12;
      const p = drawn.current!;
      p.style.strokeDashoffset = `${s.total - s.cur}`;
      const pt = p.getPointAtLength(s.cur);
      shuttle.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      s.nodeLens.forEach((len, i) => {
        const c = svg.current?.querySelector<SVGCircleElement>(`[data-node="${i}"]`);
        if (c) c.dataset.on = s.cur >= len - 2 ? "1" : "0";
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg ref={svg} className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" aria-hidden>
      <path d={d} fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 6" />
      <path ref={drawn} d={d} fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" />
      {nodes.map((n, i) => (n.via ? null : <circle key={i} data-node={i} cx={n.x} cy={n.y} r="4.5" className="thread-node" />))}
      <g ref={shuttle}>
        <path d={SHUTTLE.outline} fill="var(--card)" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d={SHUTTLE.inner} fill="none" stroke="var(--ink)" strokeWidth="0.9" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
