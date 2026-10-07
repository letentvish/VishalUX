"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { INPUT, LAYERS, RESULT, SAMPLE_QUERIES, TEMPLATES } from "@/lib/workflow";

// index 0–5: machine layers · 6: result · 7: input
const ALL = [...LAYERS, RESULT, INPUT];
// the inspector reads bottom to top: input, the six layers, result
const ORDER = [7, 0, 1, 2, 3, 4, 5, 6];
import { pointer } from "@/lib/pointer";
import { Em } from "./Station";

// The 6-layer stack as a hairline 3D object: filled plates in the page colour,
// thin edges, one bright stroke for whatever is active. Orbit it, click a
// layer, or run a request and watch it travel up the stack.

type Tone = "lo" | "mid" | "edge" | "hi";
type Mode = "cloud" | "local";
type Log = { t: string; layer: number; text: string };

const GAP = 1.75;
const PLATE = 3.3;
const PH = 0.14;
const SCREEN_SCALE = 1.4;
const yOf = (i: number) => i * GAP;

function css(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
}

export function WorkflowCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const satLabels = useRef<(HTMLButtonElement | null)[]>([]);
  const api = useRef<{
    run: (mode: Mode, template: string, log: (l: Log) => void) => Promise<void>;
    select: (i: number) => void;
    setMode: (m: Mode) => void;
    setTemplate: (t: string) => void;
  } | null>(null);

  const [selected, setSelected] = useState(0);
  const [hover, setHover] = useState(-1);
  const [mode, setMode] = useState<Mode>("cloud");
  const [template, setTemplate] = useState<string>("strategy");
  const [logs, setLogs] = useState<Log[]>([]);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(-1);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleRef.current?.scrollTo({ top: consoleRef.current.scrollHeight, behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const el = host.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    const world = new THREE.Group();
    scene.add(world);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    const target = new THREE.Vector3(0, 5.0, 0);
    camera.position.set(14, 7, 14).add(target);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minZoom = 0.75;
    controls.maxZoom = 1.8;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 1.35;
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.5;
    controls.addEventListener("start", () => (controls.autoRotate = false));

    // ---- materials, recoloured on theme change ----
    const fills: THREE.MeshBasicMaterial[] = [];
    const lines: { m: THREE.LineBasicMaterial; tone: Tone }[] = [];
    const fillMat = () => {
      const m = new THREE.MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
      fills.push(m);
      return m;
    };
    const lineMat = (tone: Tone, dashed = false) => {
      const m = dashed ? new THREE.LineDashedMaterial({ dashSize: 0.12, gapSize: 0.12 }) : new THREE.LineBasicMaterial();
      lines.push({ m, tone });
      return m;
    };
    const palette = () => ({
      card: css("--card"),
      lo: css("--hairline-lo"),
      mid: css("--hairline-mid"),
      edge: css("--hairline-edge"),
      hi: css("--hairline-hi"),
    });
    let pal = palette();
    const recolor = () => {
      pal = palette();
      fills.forEach((m) => m.color.set(pal.card));
      lines.forEach(({ m, tone }) => m.color.set(pal[tone]));
    };

    // ---- primitives ----
    function solid(geo: THREE.BufferGeometry, tone: Tone = "edge") {
      const g = new THREE.Group();
      const mesh = new THREE.Mesh(geo, fillMat());
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), lineMat(tone));
      g.add(mesh, edges);
      return { g, mesh, edges };
    }
    function roundedBox(w: number, h: number, d: number, r: number, tone: Tone = "edge") {
      const s = new THREE.Shape();
      const x = -w / 2;
      const y = -d / 2;
      r = Math.min(r, w / 2, d / 2);
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + d - r);
      s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
      s.lineTo(x + r, y + d);
      s.quadraticCurveTo(x, y + d, x, y + d - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      const geo = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 8 });
      geo.rotateX(-Math.PI / 2);
      return solid(geo, tone);
    }
    function cylinder(r: number, h: number, tone: Tone = "edge") {
      const geo = new THREE.CylinderGeometry(r, r, h, 40);
      geo.translate(0, h / 2, 0);
      return solid(geo, tone);
    }
    function wire(points: THREE.Vector3[], tone: Tone, dashed = false) {
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const l = new THREE.Line(geo, lineMat(tone, dashed));
      if (dashed) l.computeLineDistances();
      return l;
    }

    // ---- the stack ----
    type LayerObj = { group: THREE.Group; plate: ReturnType<typeof roundedBox>; parts: THREE.Object3D[] };
    const layerObjs: LayerObj[] = [];
    const pickables: THREE.Object3D[] = [];

    LAYERS.forEach((_, i) => {
      const group = new THREE.Group();
      group.position.y = yOf(i);
      const plate = roundedBox(PLATE, PH, PLATE, 0.35, "mid");
      plate.mesh.userData.layer = i;
      pickables.push(plate.mesh);
      group.add(plate.g);
      layerObjs.push({ group, plate, parts: [] });
      world.add(group);
    });

    const top = PH;
    const add = <T extends { g: THREE.Group; mesh: THREE.Mesh }>(i: number, o: T, x: number, y: number, z: number): T => {
      o.g.position.set(x, top + y, z);
      o.mesh.userData.layer = i;
      pickables.push(o.mesh);
      layerObjs[i].group.add(o.g);
      layerObjs[i].parts.push(o.g);
      return o;
    };

    // L1 reception: an inbox tray with requests waiting in it
    add(0, roundedBox(1.7, 0.32, 1.2, 0.18), 0, 0, 0);
    const letters = [0, 1, 2].map((k) => add(0, roundedBox(1.2, 0.06, 0.8, 0.08, "mid"), -0.12 + k * 0.1, 0.34 + k * 0.08, -0.08 + k * 0.06));

    // L2 agent router: a hub with two branches, cloud and local
    add(1, cylinder(0.32, 0.5), 0, 0, 0);
    const cloud = add(1, roundedBox(0.7, 0.42, 0.7, 0.16), -1.15, 0, 0.95);
    const local = add(1, roundedBox(0.7, 0.42, 0.7, 0.16), 1.15, 0, -0.95);
    const branchCloud = wire([new THREE.Vector3(0, top + 0.25, 0), new THREE.Vector3(-1.15, top + 0.25, 0.95)], "mid");
    const branchLocal = wire([new THREE.Vector3(0, top + 0.25, 0), new THREE.Vector3(1.15, top + 0.25, -0.95)], "mid", true);
    layerObjs[1].group.add(branchCloud, branchLocal);

    // L3 prompt: three template cards standing in a rack
    const cards = [0, 1, 2].map((k) => {
      const c = roundedBox(1.1, 0.07, 0.9, 0.1);
      c.g.rotation.x = Math.PI / 2;
      add(2, c, -0.6 + k * 0.6, 0.46, 0.3 - k * 0.3);
      c.g.position.y = top + 0.46;
      return c;
    });

    // L4 retrieval: a knowledge grid; chunks rise when they're picked
    const chunks: { o: ReturnType<typeof roundedBox>; base: number }[] = [];
    for (let a = 0; a < 4; a++)
      for (let b = 0; b < 4; b++) {
        const o = add(3, roundedBox(0.36, 0.22 + ((a * 7 + b * 3) % 4) * 0.06, 0.36, 0.06, "mid"), -0.84 + a * 0.56, 0, -0.84 + b * 0.56);
        chunks.push({ o, base: o.g.position.y });
      }
    // its two outside sources: a vector store and a web search
    const sat = (x: number, z: number) => {
      const g = new THREE.Group();
      g.position.set(x, yOf(3), z);
      const base = roundedBox(1, 0.1, 1, 0.2, "mid");
      g.add(base.g);
      base.mesh.userData.layer = 3;
      pickables.push(base.mesh);
      world.add(g);
      return g;
    };
    const vdb = sat(-3.4, 1.4);
    const store = cylinder(0.3, 0.55);
    store.g.position.y = 0.1;
    vdb.add(store.g);
    const web = sat(1.4, -3.4);
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 12), fillMat());
    globe.position.y = 0.45;
    web.add(globe, new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.SphereGeometry(0.32, 8, 6), 1), lineMat("lo")));
    const linkV = wire([new THREE.Vector3(-1.8, yOf(3) + 0.07, 0.7), new THREE.Vector3(-2.9, yOf(3) + 0.07, 1.15)], "mid", true);
    const linkW = wire([new THREE.Vector3(0.7, yOf(3) + 0.07, -1.8), new THREE.Vector3(1.15, yOf(3) + 0.07, -2.9)], "mid", true);
    world.add(linkV, linkW);

    // L5 memory: a spindle of past turns
    add(4, cylinder(0.75, 0.08), 0, 0, 0);
    [0, 1, 2, 3].forEach((k) => add(4, cylinder(0.62 - k * 0.06, 0.07, "mid"), 0, 0.16 + k * 0.14, 0));

    // L6 consistency: a gate everything must pass through
    add(5, roundedBox(0.2, 1.0, 0.2, 0), -0.7, 0, 0);
    add(5, roundedBox(0.2, 1.0, 0.2, 0), 0.7, 0, 0);
    add(5, roundedBox(1.6, 0.14, 0.2, 0.06), 0, 1.0, 0);

    // ---- the two human ends: upright screens with their interface drawn on the face ----
    // Everything between them is machine. These two are what a person actually touches.
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    function rrShape(w: number, h: number, r: number) {
      const s = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      r = Math.min(r, w / 2, h / 2);
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h);
      s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }
    /** A rounded rectangle drawn as a line on a screen's face. */
    function outline(w: number, h: number, r: number, x: number, y: number, z: number, tone: Tone) {
      const pts = rrShape(w, h, r).getPoints(6).map((p) => V(p.x + x, p.y + y, z));
      return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), lineMat(tone));
    }
    /** A line that can be "written in": scale.x goes 0 → 1 from its left end. */
    function textLine(len: number, x: number, y: number, z: number, tone: Tone) {
      const l = wire([V(0, 0, 0), V(len, 0, 0)], tone);
      l.position.set(x, y, z);
      return l;
    }
    function screen(w: number, h: number, layer: number, y: number) {
      const g = new THREE.Group();
      g.position.y = y;
      const geo = new THREE.ExtrudeGeometry(rrShape(w, h, 0.16), { depth: 0.12, bevelEnabled: false, curveSegments: 8 });
      geo.translate(0, 0, -0.06);
      const frame = solid(geo, "edge");
      frame.mesh.userData.layer = layer;
      pickables.push(frame.mesh);
      g.add(frame.g);
      const z = 0.075;
      // window chrome: three dots and a header rule
      [0, 1, 2].forEach((k) => g.add(outline(0.08, 0.08, 0.04, -w / 2 + 0.2 + k * 0.15, h / 2 - 0.16, z, "mid")));
      g.add(wire([V(-w / 2 + 0.06, h / 2 - 0.3, z), V(w / 2 - 0.06, h / 2 - 0.3, z)], "lo"));
      g.rotation.y = Math.PI / 4; // face the default camera
      g.scale.setScalar(SCREEN_SCALE);
      world.add(g);
      return { g, frame, z, w, h };
    }

    // INPUT: ask in your own words, tap a suggestion, see where your data goes, send
    const inputY = -2.9;
    const inScreen = screen(2.5, 1.75, 7, inputY);
    {
      const { g, z } = inScreen;
      g.add(outline(2.0, 0.36, 0.14, 0, 0.28, z, "edge")); // text field
      g.add(textLine(1.0, -0.82, 0.28, z, "lo")); // placeholder
      [-0.68, 0, 0.68].forEach((x) => g.add(outline(0.54, 0.2, 0.1, x, -0.14, z, "edge"))); // suggestion chips
      g.add(outline(0.44, 0.2, 0.1, -0.72, -0.55, z, "mid")); // privacy toggle track
      g.add(wire([V(0.48, -0.55, z), V(0.74, -0.55, z), V(0.66, -0.5, z), V(0.74, -0.55, z), V(0.66, -0.6, z)], "mid")); // send arrow
    }
    const caret = wire([V(-0.86, 0.2, inScreen.z), V(-0.86, 0.36, inScreen.z)], "hi");
    inScreen.g.add(caret);
    const knob = outline(0.13, 0.13, 0.065, -0.82, -0.55, inScreen.z, "edge");
    inScreen.g.add(knob);
    const sendBtn = outline(0.62, 0.26, 0.13, 0.62, -0.55, inScreen.z, "edge");
    inScreen.g.add(sendBtn);
    world.add(wire([V(0, inputY + 0.88 * SCREEN_SCALE, 0), V(0, yOf(0) - 0.02, 0)], "lo", true));

    // RESULT: the answer first, then the steps, then why: sources, an honest risk, confidence
    const resultY = yOf(5) + 3.15;
    const outScreen = screen(2.7, 1.95, 6, resultY);
    const resRows: THREE.Line[] = [];
    {
      const { g, z } = outScreen;
      const add2 = (l: THREE.Line) => (g.add(l), resRows.push(l), l);
      add2(textLine(1.7, -1.15, 0.42, z, "edge")); // the answer
      add2(textLine(2.1, -1.15, 0.2, z, "mid"));
      add2(textLine(1.6, -1.15, 0.04, z, "mid"));
      add2(textLine(1.85, -1.15, -0.12, z, "mid"));
      [-0.88, -0.3].forEach((x) => g.add(outline(0.48, 0.18, 0.09, x, -0.42, z, "edge"))); // source chips
      g.add(outline(0.8, 0.18, 0.09, 0.62, -0.42, z, "edge")); // “possible mismatch” tag
      g.add(outline(2.3, 0.08, 0.04, 0, -0.7, z, "lo")); // confidence track
      add2(textLine(1.75, -1.15, -0.7, z, "edge")); // confidence fill
    }
    world.add(wire([V(0, yOf(5) + top + 1.15, 0), V(0, resultY - 0.98 * SCREEN_SCALE, 0)], "lo", true));

    // the spine and the pulse that travels it
    const spine = wire([new THREE.Vector3(1.55, -0.9, 1.55), new THREE.Vector3(1.55, yOf(5) + 1.2, 1.55)], "lo", true);
    world.add(spine);
    for (let i = 0; i < 6; i++) world.add(wire([new THREE.Vector3(1.55, yOf(i) + top, 1.55), new THREE.Vector3(1.2, yOf(i) + top, 1.2)], "lo"));
    const pulse = roundedBox(0.26, 0.26, 0.26, 0.06, "hi");
    pulse.g.visible = false;
    world.add(pulse.g);
    const satPulse = roundedBox(0.18, 0.18, 0.18, 0.05, "hi");
    satPulse.g.visible = false;
    world.add(satPulse.g);

    recolor();

    // ---- state shared with React ----
    const st = {
      selected: 0,
      hover: -1,
      active: -1,
      mode: "cloud" as Mode,
      template: "strategy",
      lift: [0, 0, 0],
      rise: new Set<number>(),
      pulseTo: new THREE.Vector3(1.55, -0.9, 1.55),
      satTo: null as THREE.Vector3 | null,
      delivered: 0,
      rowsP: 0.15,
    };
    const tplIndex = () => Math.max(0, TEMPLATES.findIndex((t) => t.id === st.template));

    // ---- sizing ----
    const VIEW = 20.5;
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      const a = w / h;
      const v = a < 1 ? VIEW / a : VIEW;
      camera.left = (-v * a) / 2;
      camera.right = (v * a) / 2;
      camera.top = v / 2;
      camera.bottom = -v / 2;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mo = new MutationObserver(recolor);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // ---- picking ----
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down: { x: number; y: number } | null = null;
    const pick = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(pickables, false)[0];
      return hit ? (hit.object.userData.layer as number) : -1;
    };
    const onMove = (e: PointerEvent) => {
      const i = pick(e);
      if (i !== st.hover) {
        st.hover = i;
        setHover(i);
        renderer.domElement.style.cursor = i >= 0 ? "pointer" : "grab";
      }
    };
    const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
    const onUp = (e: PointerEvent) => {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5) {
        const i = pick(e);
        if (i >= 0) select(i);
      }
      down = null;
    };
    const onLeave = () => {
      st.hover = -1;
      setHover(-1);
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    function select(i: number) {
      st.selected = i;
      setSelected(i);
    }

    // ---- the run ----
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 120) : ms));
    const stamp = (() => {
      let t0 = 0;
      return { reset: () => (t0 = performance.now()), now: () => ((performance.now() - t0) / 1000).toFixed(2).padStart(5, "0") + "s" };
    })();
    const at = (i: number) => new THREE.Vector3(1.55, yOf(i) + top + 0.2, 1.55);

    async function run(mode: Mode, template: string, log: (l: Log) => void) {
      st.mode = mode;
      st.template = template;
      controls.autoRotate = false;
      stamp.reset();
      const say = (layer: number, text: string) => log({ t: stamp.now(), layer, text });
      st.delivered = 0;
      // it starts with a person: typed in their own words, sent from the input screen
      st.active = 7;
      setActive(7);
      say(7, `“${SAMPLE_QUERIES[template]}” · ${mode === "local" ? "stays on device" : "cloud ok"}`);
      await wait(700);
      pulse.g.position.set(0, inputY + 0.9 * SCREEN_SCALE, 0);
      st.pulseTo = new THREE.Vector3(0, inputY + 0.9 * SCREEN_SCALE, 0);
      pulse.g.visible = true;
      say(7, "UI → typed request");
      await wait(350);

      const step = async (i: number, lines: string[], hold = 650) => {
        st.active = i;
        setActive(i);
        st.pulseTo = at(i);
        await wait(520);
        for (const l of lines) {
          say(i, l);
          await wait(260);
        }
        await wait(hold);
      };

      await step(0, ["schema valid · guardrails passed"]);
      await step(1, [mode === "cloud" ? "route → cloud model" : "route → local model · data stays on device"]);
      st.lift = TEMPLATES.map((_, k) => (k === tplIndex() ? 1 : 0));
      await step(2, [`template: ${template} · output schema attached`]);
      // retrieval: the pulse visits both sources
      st.active = 3;
      setActive(3);
      st.pulseTo = at(3);
      await wait(520);
      for (const [src, pos, msg] of [
        [vdb, vdb.position, "vector store → 20 candidates"],
        [web, web.position, "web search → 6 results"],
      ] as const) {
        void src;
        satPulse.g.position.copy(at(3));
        satPulse.g.visible = true;
        st.satTo = new THREE.Vector3(pos.x, pos.y + 0.5, pos.z);
        await wait(520);
        say(3, msg);
        st.satTo = at(3);
        await wait(480);
      }
      satPulse.g.visible = false;
      st.satTo = null;
      [1, 6, 11].forEach((k) => st.rise.add(k));
      say(3, "re-ranked → top 3 chunks in the prompt");
      await wait(700);
      await step(4, ["4 previous turns loaded"]);
      await step(5, ["facts check ✓ · schema check ✓"], 500);
      // out through the gate and onto the result page
      st.pulseTo = new THREE.Vector3(0, yOf(5) + top + 1.4, 0);
      await wait(450);
      st.active = 6;
      setActive(6);
      st.pulseTo = new THREE.Vector3(0, resultY - SCREEN_SCALE, 0);
      await wait(500);
      st.delivered = 1;
      select(6);
      say(6, RESULT.line[template]);
      await wait(500);
      say(-1, "answer delivered (simulated run)");
      st.active = -1;
      setActive(-1);
      await wait(900);
      pulse.g.visible = false;
      st.rise.clear();
      st.lift = [0, 0, 0];
    }

    api.current = {
      run,
      select,
      setMode: (m) => (st.mode = m),
      setTemplate: (t) => (st.template = t),
    };

    // ---- loop ----
    const proj = new THREE.Vector3();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    function tick() {
      raf = 0;
      if (!visible) return;
      // lean toward the cursor anywhere on the page
      world.rotation.y += (pointer.x.get() * 0.18 - world.rotation.y) * 0.06;
      world.rotation.x += (pointer.y.get() * 0.05 - world.rotation.x) * 0.06;
      controls.update();

      // highlight: the running layer, else the selected one; hover gets the edge tone
      layerObjs.forEach((L, i) => {
        const tone: Tone = i === st.active || (st.active < 0 && i === st.selected) ? "hi" : i === st.hover ? "edge" : "mid";
        (L.plate.edges.material as THREE.LineBasicMaterial).color.set(pal[tone]);
        const lift = i === st.active ? 0.18 : i === st.selected && st.active < 0 ? 0.08 : 0;
        L.group.position.y += (yOf(i) + lift - L.group.position.y) * 0.12;
      });
      // router branch
      (branchCloud.material as THREE.LineBasicMaterial).color.set(pal[st.mode === "cloud" ? "hi" : "lo"]);
      (branchLocal.material as THREE.LineBasicMaterial).color.set(pal[st.mode === "local" ? "hi" : "lo"]);
      (cloud.edges.material as THREE.LineBasicMaterial).color.set(pal[st.mode === "cloud" ? "hi" : "mid"]);
      (local.edges.material as THREE.LineBasicMaterial).color.set(pal[st.mode === "local" ? "hi" : "mid"]);
      // template cards lift
      cards.forEach((c, k) => {
        const want = top + 0.46 + (st.lift[k] ? 0.3 : 0);
        c.g.position.y += (want - c.g.position.y) * 0.12;
        (c.edges.material as THREE.LineBasicMaterial).color.set(pal[st.lift[k] ? "hi" : "edge"]);
      });
      // chunks rise
      chunks.forEach(({ o, base }, k) => {
        const want = base + (st.rise.has(k) ? 0.35 : 0);
        o.g.position.y += (want - o.g.position.y) * 0.12;
        (o.edges.material as THREE.LineBasicMaterial).color.set(pal[st.rise.has(k) ? "hi" : "mid"]);
      });
      letters.forEach((l, k) => (l.g.position.y = top + 0.34 + k * 0.08 + Math.sin(performance.now() / 600 + k) * 0.015));
      // the two human ends: brighter than the machine by default, bright when in play
      const now = performance.now();
      const inOn = st.active === 7 || (st.active < 0 && st.selected === 7) || st.hover === 7;
      (inScreen.frame.edges.material as THREE.LineBasicMaterial).color.set(pal[inOn ? "hi" : "edge"]);
      (sendBtn.material as THREE.LineBasicMaterial).color.set(pal[st.active === 7 ? "hi" : "edge"]);
      caret.visible = st.active === 7 || Math.floor(now / 530) % 2 === 0;
      knob.position.x += ((st.mode === "cloud" ? 0 : 0.2) - knob.position.x) * 0.15;
      const outOn = st.active === 6 || (st.active < 0 && st.selected === 6) || st.hover === 6 || st.delivered > 0;
      (outScreen.frame.edges.material as THREE.LineBasicMaterial).color.set(pal[outOn ? "hi" : "edge"]);
      outScreen.g.position.y += (resultY + (st.active === 6 ? 0.2 : 0) - outScreen.g.position.y) * 0.12;
      st.rowsP += ((st.delivered ? 1 : 0.22) - st.rowsP) * 0.06;
      resRows.forEach((l, k) => (l.scale.x = Math.max(0.001, Math.min(1, st.rowsP * 1.5 - k * 0.1))));
      // pulses
      pulse.g.position.lerp(st.pulseTo, 0.12);
      pulse.g.rotation.y += 0.04;
      if (st.satTo) satPulse.g.position.lerp(st.satTo, 0.14);

      renderer.render(scene, camera);

      // labels follow their layers
      const w = el.clientWidth;
      const h = el.clientHeight;
      layerObjs.forEach((L, i) => {
        const lab = labels.current[i];
        if (!lab) return;
        proj.set(PLATE / 2, PH, PLATE / 2).applyMatrix4(L.group.matrixWorld).project(camera);
        lab.style.transform = `translate(${((proj.x + 1) / 2) * w + 14}px, ${((1 - proj.y) / 2) * h - 10}px)`;
      });
      // screen labels sit off each screen's lower-right corner
      [
        [6, outScreen],
        [7, inScreen],
      ].forEach(([i, sc]) => {
        const s = sc as typeof inScreen;
        const lab = labels.current[i as number];
        if (!lab) return;
        proj.set(s.w / 2, -s.h / 2 + 0.2, 0).applyMatrix4(s.g.matrixWorld).project(camera);
        lab.style.transform = `translate(${((proj.x + 1) / 2) * w + 12}px, ${((1 - proj.y) / 2) * h - 10}px)`;
      });
      // the two retrieval sources
      [vdb, web].forEach((g, k) => {
        const lab = satLabels.current[k];
        if (!lab) return;
        lab.style.display = w < 560 ? "none" : ""; // too tight on phones: the L4 label says "+ 2 sources" instead
        proj.set(0, 0, 0).applyMatrix4(g.matrixWorld).project(camera);
        // just under the object, reading outward from the stack; flipped inward at the canvas edge
        const px = ((proj.x + 1) / 2) * w;
        const lw = lab.offsetWidth;
        let lx = k === 0 ? px - lw + 12 : px - 12;
        if (lx < 8) lx = px - 12;
        if (lx + lw > w - 8) lx = px - lw + 12;
        lab.style.transform = `translate(${lx}px, ${((1 - proj.y) / 2) * h + 18}px)`;
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      controls.dispose();
      renderer.domElement.remove();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
      });
      fills.forEach((m) => m.dispose());
      lines.forEach(({ m }) => m.dispose());
      renderer.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.setMode(mode);
  }, [mode]);
  useEffect(() => {
    api.current?.setTemplate(template);
  }, [template]);

  async function runIt() {
    if (!api.current || running) return;
    setRunning(true);
    setLogs([]);
    await api.current.run(mode, template, (l) => setLogs((x) => [...x, l]));
    setRunning(false);
  }

  const L = ALL[selected];

  return (
    <section className="relative px-4 pb-16 pt-24 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="label"># system map · workflow canvas</div>
        <h1 className="mt-3 max-w-4xl text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl">
          AI is the middle. I design <Em>both ends.</Em>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">
          Most of this happens in the backend: six layers of machine that AstroDash, WatchMatch and ShaktiVibe run on. Whether
          anyone can use it is decided at the two ends, the input a person gives and the answer they get back. That's where I
          work: making AI's power easy to use through UI, UX and flow.
        </p>
        <p className="mt-3 font-mono text-[11px] text-muted">drag to orbit · click any part · or run a request from the input screen up to the result</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-[290px_1fr_360px]">
          {/* controls + console */}
          <div className="order-2 flex flex-col gap-4 lg:order-1">
            <div className="rounded-2xl border border-line bg-card p-4">
              <div className="label">engine mode</div>
              <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg border border-line p-1">
                {(["cloud", "local"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    disabled={running}
                    className={`rounded-md py-1.5 text-sm transition-colors ${mode === m ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
                  >
                    {m === "cloud" ? "Cloud model" : "Local model"}
                  </button>
                ))}
              </div>
              <div className="label mt-4">prompt template</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    disabled={running}
                    className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                      template === t.id ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="mt-4 font-serif text-[17px] italic leading-snug text-ink-2">“{SAMPLE_QUERIES[template]}”</p>
              <button
                onClick={runIt}
                disabled={running}
                className="iso-btn mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-ink bg-ink py-2.5 text-sm font-medium text-paper disabled:opacity-60"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6 4l14 8-14 8z" />
                </svg>
                {running ? "Running…" : "Run a request"}
              </button>
            </div>

            <div className="flex min-h-[220px] flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-[#08090a] text-[#e4e4e7]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="font-mono text-[11px] text-white/50">trace</span>
                <span className={`font-mono text-[11px] ${running ? "text-[#fbbf24]" : "text-white/40"}`}>{running ? "● running" : "○ idle"}</span>
              </div>
              <div ref={consoleRef} className="max-h-[300px] flex-1 space-y-1 overflow-y-auto p-3 font-mono text-[11.5px] leading-relaxed" aria-live="polite">
                {logs.length === 0 && <p className="text-white/40">› press “Run a request”</p>}
                {logs.map((l, k) => (
                  <p key={k}>
                    <span className="text-white/35">{l.t} </span>
                    <span className="text-white/55">{l.layer >= 0 ? `${l.layer === 6 ? "OUT" : l.layer === 7 ? "IN " : "L" + (l.layer + 1)} ${ALL[l.layer].short.padEnd(12, " ")}` : "··           "}</span>
                    {l.text}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* the canvas */}
          <div className="relative order-1 h-[540px] overflow-hidden rounded-2xl border border-line bg-card sm:h-[600px] lg:order-2 lg:h-[680px]">
            <div ref={host} className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-0">
              {ALL.map((layer, i) => (
                <button
                  key={layer.n}
                  ref={(b) => {
                    labels.current[i] = b;
                  }}
                  onClick={() => api.current?.select(i)}
                  className={`pointer-events-auto absolute left-0 top-0 whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10.5px] transition-colors ${
                    i === active || (active < 0 && i === selected)
                      ? "border-ink bg-ink text-paper"
                      : i === hover
                        ? "border-ink bg-card text-ink"
                        : "border-line bg-card/90 text-muted"
                  }`}
                >
                  {layer.n === 7 ? "out" : layer.n === 0 ? "in" : `L${layer.n}`} · {layer.short}
                  {(layer.n === 7 || layer.n === 0) && <span className="hidden opacity-60 sm:inline"> · human side</span>}
                  {layer.n === 4 && <span className="sm:hidden"> + 2 sources</span>}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0">
              {["vector store", "web search"].map((name, k) => (
                <button
                  key={name}
                  ref={(b) => {
                    satLabels.current[k] = b;
                  }}
                  onClick={() => api.current?.select(3)}
                  className={`pointer-events-auto absolute left-0 top-0 whitespace-nowrap rounded-md border border-dashed px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                    active === 3 || (active < 0 && selected === 3) ? "border-ink bg-card text-ink" : "border-line bg-card/90 text-muted"
                  }`}
                >
                  L4 · {name}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute bottom-3 left-4 hidden font-mono text-[10.5px] text-muted sm:block">drag to orbit · scroll to zoom · click a layer</div>
          </div>

          {/* inspector */}
          <aside className="order-3 rounded-2xl border border-line bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="whitespace-nowrap rounded-md border border-ink px-2 py-0.5 font-mono text-[10.5px]">{L.n === 7 ? "OUTPUT · HUMAN" : L.n === 0 ? "INPUT · HUMAN" : `LAYER ${L.n} · MACHINE`}</span>
              <div className="flex gap-1">
                {ORDER.map((i) => ALL[i]).map((x) => ({ x, i: ALL.indexOf(x) })).map(({ x, i }) => (
                  <button
                    key={x.n}
                    onClick={() => api.current?.select(i)}
                    aria-label={x.n === 7 ? "Result" : x.n === 0 ? "Input" : `Layer ${x.n}: ${x.name}`}
                    className={`h-6 min-w-6 rounded-md px-1 font-mono text-[10px] transition-colors ${i === selected ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
                  >
                    {x.n === 7 ? "out" : x.n === 0 ? "in" : x.n}
                  </button>
                ))}
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">{L.name}</h2>
            <p className="mt-1 font-mono text-[11px] text-muted">file · {L.file}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-y border-line py-3">
              <div>
                <div className="label">role</div>
                <div className="mt-1 text-sm">{L.role}</div>
              </div>
              <div>
                <div className="label">think of it as</div>
                <div className="mt-0.5 font-serif text-[17px] italic">{L.analogy}</div>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{L.desc}</p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-paper-2 p-3 font-mono text-[11px] leading-relaxed text-ink">{L.n === 7 ? RESULT.codeFor[template] : L.code}</pre>
          </aside>
        </div>
      </div>
    </section>
  );
}
