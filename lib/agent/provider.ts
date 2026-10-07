// ─── Plug your model in here ───────────────────────────────────────────────
// `generate` is the only function that talks to an LLM. While it returns null,
// the agent answers from the local retriever instead, so the site always works.
//
// To connect a provider: read your key from an environment variable (set it in
// Vercel → Project → Settings → Environment Variables, never in code), call the
// provider's chat API with `system` + `messages`, and return the reply text.

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function generate(system: string, messages: ChatMessage[]): Promise<string | null> {
  void system;
  void messages;
  return null;
}
