/**
 * Loom: a small rigid-heddle table loom. Warp threads run from the back beam,
 * through the heddle's slots and holes, to the woven cloth at the front. A boat
 * shuttle rides the shed across the warp: the pointer, put on the warp plane,
 * sets where it goes, and it follows on a spring. The threads around it part,
 * holes up and slots down, so it can pass; the farther from it the less. Behind
 * it, the weft it lays trails back to the selvedge. At rest the shuttle is a
 * third of the way across, mid-pick. The slider is the shed's reach, in ends.
 *
 * The pattern: a continuous position. One spring for the shuttle, a clamped
 * falloff by distance for the threads, a hit test on the warp plane, which
 * never moves, and one bright stroke, the shuttle's.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, proj, prism, rings, ringAt, seg, unproj,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 15, SP = 7, X0 = 0, X1 = (N - 1) * SP;
const Y0 = 0, YH = 30, YS = 48, YF = 64, Y1 = 104, WZ = 16, SHED = 23, HL_ = 27;
const REST_X = X0 + 0.32 * (X1 - X0), XMIN = X0 - 4, XMAX = X1 + 4;
const xs = Array.from({ length: N }, (_, i) => X0 + i * SP);

/** Share of the full shed at u reaches past the shuttle's body: 1 → .31 at 42% → .09 beyond. */
const falloff = (u) =>
  u <= 0 ? 1 : u <= 0.417 ? 1 - (u / 0.417) * 0.6875 : u <= 1 ? 0.3125 - ((u - 0.417) / 0.583) * 0.2185 : 0.094;

/** A ring of samples {u, v, nu, nv} from a closed outline, with outward normals, and its crease inset by b. */
function ringOf(pts, b) {
  const n = pts.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const a = pts[i], c = pts[(i + 1) % n]; area += a[0] * c[1] - c[0] * a[1]; }
  const ring = pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n], c = pts[(i + 1) % n];
    let tx = c[0] - a[0], ty = c[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l; ty /= l;
    const s = area > 0 ? 1 : -1;
    return { u: p[0], v: p[1], nu: ty * s, nv: -tx * s };
  });
  return [ring, ring.map((q) => ({ ...q, u: q.u - q.nu * b, v: q.v - q.nv * b }))];
}

// The boat shuttle's footprint about its centre: long, with pointed ends.
const SH = fillet([[-HL_, 0], [-16, -6], [16, -6], [HL_, 0], [16, 6], [-16, 6]], [1.2, 4.5, 4.5, 1.2, 4.5, 4.5], 4);
const [SH_RING, SH_INNER] = ringOf(SH, 1);
const shift = (ring, dx) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + YS }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;

  const C = Cam(45, 0.5, 1.62);
  fit(C, [[X0 - 18, Y0 - 8, 0], [X1 + 18, Y1 + 8, 0], [X1 + 18, Y0 - 8, 0], [X0 - 18, Y1 + 8, 0], [X0 - 13, YH, WZ + 18], [X1 + 13, YH, WZ + 18], [X0, YS, WZ + SHED]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };

  // Frame, far to near: two side rails, the back beam the warp comes off.
  block(X0 - 17, Y0 - 8, X0 - 9, Y1 + 8, 3, 1, 0, 6);
  block(X1 + 9, Y0 - 8, X1 + 17, Y1 + 8, 3, 1, 0, 6);
  block(X0 - 18, Y0 - 5, X1 + 18, Y0 + 5, 4.5, 1.2, 6, WZ);

  // Warp behind the heddle: still, so drawn once.
  mk("path", { d: xs.map((x) => seg(P(x, Y0, WZ), P(x, YH, WZ))).join(""), class: "nf lo" }, g);

  // The rigid heddle, standing in a block on each rail: holes on the odd ends, slots on the even.
  block(X0 - 17, YH - 5, X0 - 9, YH + 5, 2, 0.8, 6, 14);
  block(X0 - 13, YH - 1.5, X1 + 13, YH + 1.5, 1.5, 0.6, 6, WZ + 18);
  const face = (x, z) => P(x, YH + 1.6, z);
  mk("path", { d: xs.filter((_, i) => i % 2 === 0).map((x) => seg(face(x, WZ - 6), face(x, WZ + 9))).join(""), class: "nf lo" }, g);
  xs.forEach((x, i) => {
    if (i % 2 === 0) return;
    const [cx, cy] = face(x, WZ + 1);
    mk("ellipse", { cx, cy, rx: 1.5, ry: 1.9, class: "nf" }, g);
  });
  block(X1 + 9, YH - 5, X1 + 17, YH + 5, 2, 0.8, 6, 14);

  // The shed: down ends under the shuttle, the shuttle and its weft, up ends over it.
  const downs = mk("path", { class: "nf" }, g);
  const weft = mk("path", { class: "nf" }, g);
  const shuttle = solid(g);
  shuttle.sil.classList.add("hi");
  const pirn = mk("path", { class: "nf lo" }, g);
  const ups = mk("path", { class: "nf" }, g);

  // The cloth already woven, and the front beam it winds onto.
  block(X0 - 1, YF, X1 + 1, Y1 - 4, 1.5, 0.8, WZ - 2, WZ);
  const rows = [];
  for (let y = YF + 3.5; y < Y1 - 5; y += 3.4) rows.push(seg(P(X0 + 0.5, y, WZ), P(X1 - 0.5, y, WZ)));
  mk("path", { d: rows.join(""), class: "nf lo" }, g);
  block(X0 - 18, Y1 - 5, X1 + 18, Y1 + 5, 4.5, 1.2, 6, WZ);

  const sx = spring(REST_X);
  let drawn = NaN;

  function draw() {
    const x = sx.x;
    if (Math.abs(x - drawn) < 0.01) return;
    drawn = x;
    let up = "", down = "";
    xs.forEach((xi, i) => {
      const f = falloff(Math.max(0, Math.abs(xi - x) - HL_ * 0.6) / (reach * SP));
      const lift = i % 2 ? SHED * f : -SHED * 0.5 * f;
      const d = open([P(xi, YH, WZ), P(xi, YS, WZ + lift), P(xi, YF, WZ)]);
      if (i % 2) up += d; else down += d;
    });
    ups.setAttribute("d", up);
    downs.setAttribute("d", down);
    weft.setAttribute("d", x - HL_ > X0 - 2 ? open([P(X0 - 2, YS, WZ), P(x - HL_ + 1, YS, WZ)]) : "");
    const ring = shift(SH_RING, x), inner = shift(SH_INNER, x);
    put(shuttle, prism(P, front, ring, inner, WZ - 3, WZ + 3));
    pirn.setAttribute("d", poly(ringAt(P, shift(fillet([[-8, -2], [8, -2], [8, 2], [-8, 2]], [2, 2, 2, 2], 4).map(([u, v]) => ({ u, v })), x), WZ + 3)) + seg(P(x - 6, YS, WZ + 3.1), P(x + 6, YS, WZ + 3.1)));
  }

  const B = register(stage, (dt) => {
    const m = stepS(sx, dt);
    draw();
    return m;
  });
  bag.add(B.unregister);
  draw();

  function aim(tx) {
    sx.t = tx;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [wx] = unproj(C, p[0], p[1], WZ);
      const tx = clamp(wx, XMIN, XMAX);
      read.textContent = "end " + String(clamp(Math.round((tx - X0) / SP), 0, N - 1) + 1).padStart(2, "0");
      aim(tx);
    },
    leave: () => { read.textContent = "rest"; aim(REST_X); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { reach = v; drawn = NaN; draw(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "loom",
  means: "A table loom: the shuttle follows the pointer across the warp, and the threads part around it to let it through.",
  rules: [1, 3, 5, 8],
  range: [1.5, 3, 5],
  mount,
});
