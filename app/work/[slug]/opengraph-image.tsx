import { work } from "@/lib/content";
import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "A case study by Vishal Singh";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return work.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = work.find((w) => w.slug === slug);
  return ogCard({
    kicker: p ? `Case study · ${p.kind}` : "Case study",
    title: p?.name ?? "Vishal Singh",
    sub: p?.tagline ?? "",
  });
}
