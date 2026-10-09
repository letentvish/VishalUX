import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { work } from "@/lib/content";
import { SITE_URL, jsonLd } from "@/lib/site";
import { Sieve } from "@lucasmarkes/hairline/react";

export function generateStaticParams() {
  return work.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = work.find((w) => w.slug === slug);
  if (!p) return {};
  const full = `${p.tagline} ${p.summary}`;
  const description = full.length > 158 ? full.slice(0, full.lastIndexOf(" ", 155)) + "…" : full;
  const title = `${p.name} case study`;
  const url = `/work/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: `${p.name} · Vishal Singh`, description },
    twitter: { card: "summary_large_image", title: `${p.name} · Vishal Singh`, description },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const i = work.findIndex((w) => w.slug === slug);
  if (i < 0) notFound();
  const p = work[i];
  const nextP = work[(i + 1) % work.length];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: p.name,
            headline: p.tagline,
            description: p.summary,
            url: SITE_URL + "/work/" + p.slug,
            image: p.cover ? SITE_URL + p.cover : undefined,
            keywords: p.stack.join(", "),
            creativeWorkStatus: p.status,
            author: { "@id": SITE_URL + "/#person" },
            creator: { "@id": SITE_URL + "/#person" },
          }),
        }}
      />
      {/* Header */}
      <section className="iso-grid border-b border-line px-4 pb-16 pt-32 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link href="/#work" className="label hover:text-ink">← all work</Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: p.accent }} />
            <span className="label">case study {p.index} · {p.kind}</span>
          </div>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">{p.name}</h1>
          <p className="mt-4 max-w-3xl text-2xl leading-snug text-ink-2">{p.tagline}</p>

          <dl className="card mt-10 grid grid-cols-2 divide-line rounded-2xl text-sm md:grid-cols-4 md:divide-x">
            <Meta k="Role" v={p.role} />
            <Meta k="Status" v={p.status} />
            <Meta k="Type" v={p.kind} />
            <Meta k="Stack" v={p.stack.slice(0, 4).join(", ")} />
          </dl>
          {p.live && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-medium text-paper">
                Open {p.liveLabel ? p.liveLabel.toLowerCase() : "live app"} ↗
              </a>
              {p.liveNote && (
                <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-xs text-ink-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent }} />
                  {p.liveNote}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <article className="px-4 sm:px-8">
        <div className="mx-auto max-w-5xl space-y-24 py-20">
          <Block n="01" title="Overview">
            <p className="text-xl leading-relaxed text-ink-2">{p.summary}</p>
            {p.cover && (
              <div className="card relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl">
                <Image src={p.cover} alt={`${p.name} interface`} fill priority sizes="(min-width:1024px) 1000px, 100vw" className="object-cover object-top" />
              </div>
            )}
          </Block>

          <Block n="02" title="The problem">
            <ul className="space-y-3">
              {p.problem.map((x, k) => (
                <li key={k} className="grid grid-cols-[28px_1fr] text-lg text-ink-2">
                  <span className="font-mono text-sm text-accent">{String(k + 1).padStart(2, "0")}</span>
                  {x}
                </li>
              ))}
            </ul>
          </Block>

          <Block n="03" title="Vague → Formula → Flow">
            <div className="card overflow-hidden rounded-2xl">
              <div className="border-b border-line p-6">
                <div className="label">the vague question</div>
                <p className="mt-2 font-serif italic text-3xl text-ink-2">{p.vague.question}</p>
              </div>
              <div className="border-b border-line bg-paper-2 p-6">
                <div className="label">the model</div>
                <div className="mt-3 space-y-1.5 font-mono text-[13px] sm:text-sm">
                  {p.vague.formula.map((f, k) => (
                    <p key={k} className={k === 0 ? "text-ink" : "text-muted"}>{f}</p>
                  ))}
                </div>
                <p className="mt-4 text-sm text-ink-2">{p.vague.note}</p>
              </div>
              <div className="p-6">
                <div className="label">the flow</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {p.flow.map((f, k) => (
                    <span key={f} className="flex items-center gap-2">
                      <span className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm">{f}</span>
                      {k < p.flow.length - 1 && <span className="text-accent">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Block>

          <Block n="04" title="Key decisions">
            <div className="grid gap-4 md:grid-cols-2">
              {p.decisions.map((d, k) => (
                <div key={d.title} className="card rounded-2xl p-5">
                  <div className="font-mono text-[11px] text-accent">D{k + 1}</div>
                  <h3 className="mt-1 text-lg font-semibold">{d.title}</h3>
                  <p className="mt-2 text-ink-2">{d.body}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block n="05" title={p.system.title}>
            <ol className="relative space-y-3 border-l-2 border-dashed border-line pl-6">
              {p.system.items.map((x) => (
                <li key={x} className="relative text-lg text-ink-2">
                  <span className="absolute -left-[33px] top-2 h-3 w-3 rounded-full border-2 border-accent bg-paper" />
                  {x}
                </li>
              ))}
            </ol>
          </Block>

          <Block n="06" title="The interface">
            {p.screens.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {p.screens.map((s) => (
                  <figure key={s.src} className={s.wide ? "md:col-span-2" : ""}>
                    <div className="card relative aspect-[16/10] overflow-hidden rounded-2xl">
                      <Image src={s.src} alt={s.caption} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-top" />
                    </div>
                    <figcaption className="mt-2 text-sm text-muted">{s.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="grid items-center gap-6 rounded-2xl border border-line bg-card p-6 md:grid-cols-[1fr_1.2fr]">
                <div className="mx-auto w-full max-w-[320px]">
                  <Sieve data-live intensity={0.75} label="Stacked test sieves: each layer filters the answers further" />
                </div>
                <p className="font-serif text-2xl italic leading-snug text-ink-2">
                  A framework has no screens of its own. The product it powers is under NDA, so the structure above is the part I can show.
                </p>
              </div>
            )}
          </Block>

          <Block n="07" title="Evidence, honestly">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {p.evidence.map((e) => (
                <div key={e.label} className="card rounded-2xl p-4">
                  <div className="font-mono text-3xl font-semibold">{e.value}</div>
                  <div className="mt-1 text-sm text-muted">{e.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-2xl border border-warn/40 bg-warn/10 p-5 text-ink-2">
              <span className="label mr-2 !text-warn">what&apos;s validated</span>
              {p.honest}
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <div className="label mb-3">how I&apos;d validate it</div>
                <ul className="space-y-2 text-ink-2">
                  {p.validate.map((v) => (
                    <li key={v} className="flex gap-2"><span className="text-port">◇</span>{v}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="label mb-3">what I&apos;d fix next</div>
                <ul className="space-y-2 text-ink-2">
                  {p.next.map((v) => (
                    <li key={v} className="flex gap-2"><span className="text-accent">→</span>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Block>

          <Link href={`/work/${nextP.slug}`} className="card group flex items-center justify-between rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <div>
              <div className="label">next run</div>
              <div className="mt-1 text-3xl font-semibold">{nextP.name}</div>
              <div className="text-ink-2">{nextP.tagline}</div>
            </div>
            <span className="text-3xl text-accent transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </article>
      <Contact />
    </main>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="p-4">
      <dt className="label">{k}</dt>
      <dd className="mt-1 font-medium">{v}</dd>
    </div>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 md:grid-cols-[180px_1fr]">
      <div className="md:sticky md:top-24 md:self-start">
        <div className="font-mono text-xs text-accent">{n}</div>
        <h2 className="mt-1 text-xl font-semibold">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}
