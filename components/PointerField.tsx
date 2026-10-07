"use client";

import { useEffect } from "react";
import { pointer } from "@/lib/pointer";

// Makes every Hairline figure on the page answer the whole page, not just its own box.
// Figures opt in with a `data-live` attribute. On each pointer move or scroll, every
// visible figure the cursor is NOT already over gets a synthetic pointermove: the
// cursor's position in the viewport, mapped into the figure's frame, blended with how
// far the figure has travelled through the viewport (so scrolling moves it too).
export function PointerField() {
  useEffect(() => {
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(el);
        else visible.delete(el);
      }
    });
    const watched = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-live]").forEach((el) => {
        if (!watched.has(el)) {
          watched.add(el);
          io.observe(el);
        }
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    const coarse = matchMedia("(pointer: coarse)").matches;
    let cx = innerWidth / 2;
    let cy = innerHeight / 2;
    let hasPointer = !coarse;
    let raf = 0;

    const drive = () => {
      raf = 0;
      const vw = innerWidth;
      const vh = innerHeight;
      const root = document.documentElement.style;
      root.setProperty("--mx", ((cx / vw) * 2 - 1).toFixed(3));
      root.setProperty("--my", ((cy / vh) * 2 - 1).toFixed(3));
      for (const el of visible) {
        const r = el.getBoundingClientRect();
        if (!r.width) continue;
        const inside = hasPointer && cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
        if (inside) continue; // the real event already reaches it
        const travel = Math.min(1, Math.max(0, 1 - (r.top + r.height / 2) / vh)); // 0 entering at the bottom → 1 leaving at the top
        const fx = hasPointer ? cx / vw : 0.15 + travel * 0.7;
        const fy = hasPointer ? (cy / vh) * 0.55 + travel * 0.45 : travel;
        el.dispatchEvent(
          new PointerEvent("pointermove", {
            clientX: r.left + fx * r.width,
            clientY: r.top + fy * r.height,
            pointerType: "mouse",
          }),
        );
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(drive);
    };

    const onMove = (e: PointerEvent) => {
      if (!e.isTrusted) return;
      if (e.pointerType === "mouse") hasPointer = true;
      cx = e.clientX;
      cy = e.clientY;
      pointer.x.set((cx / innerWidth) * 2 - 1);
      pointer.y.set((cy / innerHeight) * 2 - 1);
      schedule();
    };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const t = setTimeout(schedule, 300);
    return () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      clearTimeout(t);
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
