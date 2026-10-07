"use client";

import { useEffect, useRef } from "react";

// Mounts a figure drawn with the hairline-create skill (public/hairline/<name>.js)
// on the Hairline kernel, the same way the skill's bench page does.

type Spec = {
  name: string;
  means: string;
  range: [number, number, number];
  mount: (ctx: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string | null } }, value: number) => {
    set: (v: number) => void;
    destroy: () => void;
  };
};
type Kernel = { inject: (d: Document) => void; mk: (tag: string, attrs: Record<string, string>, parent: Element) => SVGSVGElement };
type W = Window & { HL?: Kernel; hairline?: (s: Spec) => void };

let kernel: Promise<void> | null = null;
let chain: Promise<unknown> = Promise.resolve();
const specs = new Map<string, Promise<Spec>>();

function addScript(src: string, module = false) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    if (module) s.type = "module";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`could not load ${src}`));
    document.head.appendChild(s);
  });
}

function loadKernel() {
  kernel ??= (window as W).HL ? Promise.resolve() : addScript("/hairline/kernel.js").then(() => (window as W).HL!.inject(document));
  return kernel;
}

// Figures announce themselves through a global `hairline(spec)`, so load them one at a time.
function loadFigure(name: string) {
  if (!specs.has(name)) {
    const p = (chain = chain.then(() =>
      loadKernel().then(
        () =>
          new Promise<Spec>((resolve, reject) => {
            (window as W).hairline = resolve;
            addScript(`/hairline/${name}.js`, true).catch(reject);
          }),
      ),
    )) as Promise<Spec>;
    specs.set(name, p);
  }
  return specs.get(name)!;
}

export function CustomFigure({
  name,
  intensity = 0.5,
  label,
  onRead,
  className,
  live = true,
}: {
  name: string;
  intensity?: number;
  label?: string;
  onRead?: (text: string) => void;
  className?: string;
  live?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const readRef = useRef(onRead);
  readRef.current = onRead;

  useEffect(() => {
    let handle: ReturnType<Spec["mount"]> | null = null;
    let svg: SVGSVGElement | null = null;
    let dead = false;
    loadFigure(name)
      .then((spec) => {
        const stage = ref.current;
        if (dead || !stage) return;
        stage.setAttribute("aria-label", label ?? spec.means);
        svg = (window as W).HL!.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
        let text: string | null = null;
        const read = {
          get textContent() {
            return text;
          },
          set textContent(v: string | null) {
            text = v ?? "";
            readRef.current?.(text);
          },
        };
        const [lo, mid, hi] = spec.range;
        const i = Math.min(1, Math.max(0, intensity));
        const value = i <= 0.5 ? lo + (i / 0.5) * (mid - lo) : mid + ((i - 0.5) / 0.5) * (hi - mid);
        handle = spec.mount({ stage, svg, read }, value);
        if (text === null) read.textContent = "rest";
      })
      .catch((e) => console.warn(e));
    return () => {
      dead = true;
      handle?.destroy();
      svg?.remove();
    };
  }, [name, intensity, label]);

  return <div ref={ref} data-hairline={name} data-live={live ? "" : undefined} role="img" className={className} style={{ aspectRatio: "5 / 4" }} />;
}
