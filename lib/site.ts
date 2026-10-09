import { profile } from "./content";

// The live URL. Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is known;
// until then the default Vercel address is assumed.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://vishalux.vercel.app").replace(/\/$/, "");

export const SITE_NAME = "Vishal Singh";
export const SITE_TITLE = "Vishal Singh · Agentic UX & AI Product Designer";
export const SITE_DESCRIPTION =
  "Vishal Singh is an agentic UX and AI product designer in Delhi, India. He designs the human side of AI: clear inputs, answers people can understand and intuitive flows, plus decision frameworks, psychometric assessments and the front-end to ship them.";

export const KEYWORDS = [
  "Vishal Singh",
  "agentic UX designer",
  "AI product designer",
  "AI UX designer India",
  "UX designer Delhi",
  "human-AI interaction designer",
  "conversational UX",
  "AI workflow design",
  "multi-agent system design",
  "decision framework design",
  "psychometric assessment design",
  "product designer who codes",
  "Figma",
  "React",
  "Next.js",
  "freelance UX designer",
];

export const SAME_AS = profile.links.filter((l) => l.label !== "WhatsApp").map((l) => l.href);

/** Person + WebSite structured data, shared by every page. */
export function siteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      url: SITE_URL,
      jobTitle: "Agentic UX & AI Product Designer",
      description: SITE_DESCRIPTION,
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Delhi", addressCountry: "IN" },
      sameAs: SAME_AS,
      knowsAbout: [
        "Agentic UX",
        "Human-AI interaction",
        "AI product design",
        "Multi-agent systems",
        "Decision frameworks",
        "Psychometric assessment design",
        "Process and workflow design",
        "UX research",
        "Design systems",
        "Figma",
        "React",
        "Next.js",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ];
}

/** Safe to drop inside a <script type="application/ld+json">. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
