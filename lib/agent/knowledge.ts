import { profile, services, work } from "@/lib/content";

export type Doc = { id: string; title: string; keywords: string[]; text: string; href?: string };

// The agent's knowledge base. The local retriever ranks these; an LLM (once
// connected) receives the top matches as grounding context.
export const docs: Doc[] = [
  {
    id: "about",
    title: "About Vishal",
    keywords: ["who", "about", "vishal", "background", "intro", "yourself", "story"],
    text: `${profile.name} is an ${profile.role} based in ${profile.location}. He has 3+ years in UI/UX and has spent the last year designing agentic AI products and AI workflows. He's a self-taught designer with a Maths (Hons) degree, and he builds what he designs in React and Next.js.`,
  },
  {
    id: "maths",
    title: "Maths background",
    keywords: ["maths", "math", "mathematics", "degree", "education", "formula", "formulas", "analytical", "study", "edge", "graduate"],
    text: "Vishal graduated in Mathematics (Hons). It's his edge in UX: he turns vague questions into variables, weights and rules (a formula a system can compute and explain), then designs the flow around it.",
  },
  {
    id: "agentic",
    title: "Agentic UX",
    keywords: ["agent", "agentic", "ai", "llm", "workflow", "automation", "multi-agent", "trust", "human", "interaction", "input", "output"],
    text: "Vishal designs the human side of AI. Most of an AI system runs in the backend; he designs the two ends people touch: the input (plain language, suggestions, visible privacy) and the output (the answer first, then steps and reasons). In agentic products he decides where the agent acts, where a human decides, and what the interface shows in between. His recurring patterns: deterministic maths under generative language, an auditor step before anything reaches the screen, visible reasoning and mismatch warnings, and a working fallback when the model fails.",
  },
  {
    id: "erp",
    title: "Enterprise experience",
    keywords: ["erp", "hrms", "enterprise", "company", "job", "experience", "lead", "work history", "b2b", "saas"],
    text: "Vishal worked as Lead Product Designer at a company building ERP and HRMS platforms: role-based access, approval chains, cross-role workflows and audit trails. That work is under NDA, so it isn't shown on the site, but he's happy to discuss his approach on a call.",
  },
  {
    id: "process",
    title: "How he works",
    keywords: ["process", "approach", "method", "how", "research", "start", "steps"],
    text: "Every project runs the same pipeline: start from the vague question, find the variables, write the model, map the flow between people and agents, then design and build the interface. Research is sized to the budget and honest about what is assumed versus validated.",
  },
  ...work.map((p) => ({
    id: p.slug,
    title: p.name,
    keywords: [p.slug, p.name.toLowerCase(), ...p.stack.map((s) => s.toLowerCase()), ...(p.slug === "assessment-framework" ? ["psychometric", "psychometrics", "assessment", "archetype", "archetypes", "test", "riasec"] : [])],
    text: `${p.name} (${p.kind}, ${p.status.toLowerCase()}): ${p.summary} Key idea: ${p.decisions[0].title.toLowerCase()}. ${p.honest}`,
    href: `/work/${p.slug}`,
  })),
  {
    id: "uniquely",
    title: "Uniquely",
    keywords: ["uniquely", "current", "now", "working on", "project management", "pm", "next"],
    text: "Vishal is currently building Uniquely, an agentic project-management app. Details coming soon.",
  },
  {
    id: "services",
    title: "Services",
    keywords: ["hire", "hiring", "services", "offer", "freelance", "work with", "do for", "cost", "rates"],
    text: `Vishal can help with: ${services.map((s) => s.title).join("; ")}. He's open to freelance projects and full-time roles.`,
    href: "/#services",
  },
  {
    id: "stack",
    title: "Tools & stack",
    keywords: ["tools", "stack", "figma", "react", "next", "code", "frontend", "tech", "skills"],
    text: "Design: Figma, prototyping, design systems. Front-end: React, Next.js, TypeScript, Tailwind, Framer Motion. AI: Gemini, local models via Ollama, retrieval pipelines, MCP tool servers, structured outputs.",
  },
  {
    id: "contact",
    title: "Contact",
    keywords: ["contact", "email", "reach", "call", "available", "availability", "linkedin", "whatsapp", "phone"],
    text: `Reach Vishal at ${profile.email}, or on LinkedIn (in/visualux). He's available for freelance and full-time work.`,
    href: "/#contact",
  },
];
