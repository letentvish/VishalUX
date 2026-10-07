"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { prism } from "@/lib/iso";

// The mark: a pen scribble (a vague idea) that resolves into an isometric cube (a system).
// At rest it shows the cube; on hover it scribbles again and snaps back.
const cube = prism(-7, -7, -8, 14, 14, 14);
const SCRIBBLE =
  "M -9 2 C -12 -6, -2 -12, 3 -6 S 10 6, 2 7 S -9 -1, -3 -5 S 9 -6, 8 1 S -1 9, -6 4 S -4 -9, 4 -9 S 11 -1, 6 4";

export function LogoMark({ size = 30, playing }: { size?: number; playing?: boolean }) {
  const [hover, setHover] = useState(false);
  const vague = playing ?? hover;
  const t = { duration: 0.55, ease: [0.65, 0, 0.35, 1] as const };

  return (
    <svg
      width={size}
      height={size}
      viewBox="-16 -16 32 32"
      fill="none"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      aria-hidden
      className="overflow-visible"
    >
      <motion.path
        d={SCRIBBLE}
        stroke="var(--ink)"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: vague ? 1 : 0, opacity: vague ? 1 : 0 }}
        transition={t}
      />
      <motion.g initial={false} animate={{ opacity: vague ? 0 : 1, scale: vague ? 0.6 : 1, rotate: vague ? -20 : 0 }} transition={t}>
        <motion.path d={cube.outline} stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" fill="var(--card)" initial={false} animate={{ pathLength: vague ? 0 : 1 }} transition={t} />
        <motion.path d={cube.inner} stroke="var(--ink)" strokeWidth="1.1" strokeLinejoin="round" initial={false} animate={{ pathLength: vague ? 0 : 1 }} transition={{ ...t, delay: vague ? 0 : 0.2 }} />
      </motion.g>
    </svg>
  );
}
