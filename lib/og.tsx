import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// One social card design for every page: the cube mark, a kicker, a big title,
// a line of context, and an isometric grid in the background.
export function ogCard({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  const grid = Array.from({ length: 28 }, (_, i) => i * 60 - 600);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#fafafa", position: "relative" }}>
        <svg width="1200" height="630" style={{ position: "absolute", left: 0, top: 0 }}>
          {grid.map((x) => (
            <line key={`a${x}`} x1={x} y1={0} x2={x + 1091} y2={630} stroke="#0a0a0a" strokeOpacity="0.05" strokeWidth="1" />
          ))}
          {grid.map((x) => (
            <line key={`b${x}`} x1={x + 1091} y1={0} x2={x} y2={630} stroke="#0a0a0a" strokeOpacity="0.05" strokeWidth="1" />
          ))}
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="-16 -16 32 32" fill="none">
            <path d="M 0 -14 L 12.1 -7 L 12.1 7 L 0 14 L -12.1 7 L -12.1 -7 Z" stroke="#0a0a0a" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M -12.1 -7 L 0 0 L 12.1 -7 M 0 0 L 0 14" stroke="#0a0a0a" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 600, color: "#0a0a0a" }}>Vishal Singh</div>
            <div style={{ fontSize: 18, color: "#71717a", letterSpacing: 2, textTransform: "uppercase" }}>Agentic UX · AI product design</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 22, color: "#71717a", letterSpacing: 3, textTransform: "uppercase" }}>{kicker}</div>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#0a0a0a", lineHeight: 1.04, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#3f3f46", maxWidth: 980, lineHeight: 1.35 }}>{sub}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
