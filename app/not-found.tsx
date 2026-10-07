import type { Metadata } from "next";
import Link from "next/link";
import { work } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="iso-grid flex min-h-[100svh] items-center px-4 pt-20 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="label">404 · the line breaks here</div>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
          This page <span className="font-serif font-normal italic">isn&apos;t on the map.</span>
        </h1>
        <p className="mt-5 text-lg text-ink-2">It may have moved, or never existed. Here&apos;s where the line does go:</p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/" className="iso-btn rounded-lg border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper">
            Home →
          </Link>
          <Link href="/system-map" className="iso-btn rounded-lg border border-line bg-card px-4 py-2 text-sm">
            Workflow canvas
          </Link>
          {work.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="iso-btn rounded-lg border border-line bg-card px-4 py-2 text-sm">
              {p.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
