// Tiny isometric projection helpers for hand-built line drawings in the Hairline style.
const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);

export type P3 = [number, number, number];

export function iso([x, y, z]: P3): [number, number] {
  return [(x - y) * C, (x + y) * S - z];
}

const pt = (p: P3) => iso(p).map((n) => n.toFixed(2)).join(" ");

/** Polyline through 3D points. */
export function line(...pts: P3[]) {
  return pts.map((p, i) => `${i ? "L" : "M"} ${pt(p)}`).join(" ");
}

/**
 * A box from (x,y,z) with size (w,d,h).
 * `outline` is the visible silhouette (closed), `inner` the three creases meeting at the near top corner.
 */
export function prism(x: number, y: number, z: number, w: number, d: number, h: number) {
  const t = z + h;
  const outline = line([x, y, t], [x + w, y, t], [x + w, y, z], [x + w, y + d, z], [x, y + d, z], [x, y + d, t], [x, y, t]) + " Z";
  const inner = line([x + w, y, t], [x + w, y + d, t], [x, y + d, t]) + " " + line([x + w, y + d, t], [x + w, y + d, z]);
  return { outline, inner };
}
