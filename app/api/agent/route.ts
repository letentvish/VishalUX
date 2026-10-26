import { docs, type Doc } from "@/lib/agent/knowledge";
import { generate, type ChatMessage } from "@/lib/agent/provider";
import { profile } from "@/lib/content";

const SYSTEM = `You are the portfolio agent for Vishal Singh, an agentic UX & systems designer.
Answer visitors' questions about Vishal in 2–4 short sentences, in the third person.
Use ONLY the context provided. If the answer isn't in it, say so and suggest emailing him.
Never invent clients, metrics, dates or research. His enterprise application work is under NDA: never name it.`;

const STOP = new Set(["what", "does", "about", "with", "that", "this", "have", "your", "tell", "help", "from", "they", "them", "when", "which", "will", "would", "could", "should", "there", "their", "into", "more", "some", "like", "just", "vishal", "singh"]);

function tokenize(s: string) {
  return s.toLowerCase().split(/[^a-z0-9+]+/).filter((w) => w.length > 1 && !STOP.has(w));
}

function retrieve(query: string, k = 3): Doc[] {
  const q = tokenize(query);
  const qs = query.toLowerCase();
  return docs
    .map((d) => {
      let score = 0;
      for (const kw of d.keywords) {
        if (kw.includes(" ") ? qs.includes(kw) : q.includes(kw)) score += 3;
      }
      const body = tokenize(d.text);
      for (const w of q) if (w.length > 3 && body.includes(w)) score += 1;
      return { d, score };
    })
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.d);
}

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: ChatMessage) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-8)
      .map((m: ChatMessage) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return Response.json({ error: "No question" }, { status: 400 });

  const hits = retrieve(last.content);
  const sources = hits.map((h) => ({ id: h.id, title: h.title, href: h.href }));

  const context = (hits.length ? hits : docs.slice(0, 2)).map((h) => `[${h.title}] ${h.text}`).join("\n");
  try {
    const reply = await generate(`${SYSTEM}\n\nContext:\n${context}`, messages);
    if (reply) return Response.json({ reply, sources, mode: "llm" });
  } catch (e) {
    console.error("agent provider failed, falling back to local retrieval", e);
  }

  // Deterministic fallback: answer with the best-matching knowledge.
  const reply = hits.length
    ? hits[0].text
    : `I don't have that in my notes. Vishal can answer it directly: ${profile.email}.`;
  return Response.json({ reply, sources: sources.slice(0, 1), mode: "local" });
}
