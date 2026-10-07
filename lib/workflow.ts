// The 6-layer intelligence stack, as shown on the workflow canvas.
// Adapted from my 3D workflow generator; the products listed are the ones that run on it.

export type Layer = {
  n: number;
  name: string;
  short: string;
  file: string;
  role: string;
  analogy: string;
  desc: string;
  code: string;
};

export const LAYERS: Layer[] = [
  {
    n: 1,
    name: "Reception",
    short: "reception",
    file: "main.py",
    role: "The entry point",
    analogy: "the inbox of the brain",
    desc: "Receives the request, validates it against a typed schema, applies input guardrails and hands it to the router. Nothing malformed gets further than this.",
    code: `@app.post("/analyze", response_model=PipelineResponse)
async def analyze(req: PipelineRequest):
    agent = CoreAgent()
    return await agent.process(
        query=req.query,
        context=req.context,
        mode=req.engine_mode,
    )`,
  },
  {
    n: 2,
    name: "Agent router",
    short: "agent",
    file: "agent.py",
    role: "The decider",
    analogy: "the switchboard",
    desc: "Reads the user's privacy setting and routes inference to a cloud model or a fully local one. Same contract either way, so the rest of the stack never knows the difference.",
    code: `class CoreAgent:
    def model(self, mode):
        if mode == "local":
            return Ollama("llama3")      # data stays on device
        return Gemini("gemini-2.5-flash")

    async def process(self, query, context, mode):
        prompt = build_prompt(query, context)
        return await self.model(mode).generate(prompt)`,
  },
  {
    n: 3,
    name: "Prompt & skills",
    short: "prompt",
    file: "prompts/",
    role: "The instruction manuals",
    analogy: "a library of templates",
    desc: "Picks the right template (summary, sequence or strategy), injects context, and attaches a strict output schema so the model answers in a shape the UI can trust.",
    code: `TEMPLATES = {
    "summary":  "summary_prompt.md",
    "sequence": "timeline_prompt.md",
    "strategy": "planner_prompt.md",
}

def build_prompt(kind, facts, history):
    return render(TEMPLATES[kind], facts=facts,
                  history=history, schema=OutputSchema)`,
  },
  {
    n: 4,
    name: "Retrieval",
    short: "rag",
    file: "tools.py",
    role: "The professional library",
    analogy: "the reference shelf",
    desc: "Before the model speaks, it looks things up: hybrid search over a local knowledge base, plus a live web search when freshness matters. Only the highest-signal chunks go into the prompt.",
    code: `def retrieve(query, k=3):
    dense  = vector_db.search(embed(query), k=20)
    sparse = bm25.search(query, k=20)
    ranked = rerank(query, dense + sparse)
    return ranked[:k]           # top chunks only`,
  },
  {
    n: 5,
    name: "Memory",
    short: "memory",
    file: "memory.py",
    role: "Short-term context",
    analogy: "the conversation's RAM",
    desc: "Carries the thread: recent turns and earlier results, so a follow-up question doesn't start from zero and two screens never disagree.",
    code: `def context_for(session_id, turns=4):
    rows = db.execute(
        "SELECT q, a FROM turns WHERE sid=? "
        "ORDER BY ts DESC LIMIT ?", (session_id, turns))
    return list(reversed(rows))`,
  },
  {
    n: 6,
    name: "Consistency auditor",
    short: "consistency",
    file: "analyze.py",
    role: "The sanity filter",
    analogy: "the editor before print",
    desc: "Checks every answer against computed facts and the expected schema. On failure it retries with the reason; if that fails too, a deterministic fallback answers. The screen never breaks.",
    code: `def audit(answer, facts):
    if not schema_ok(answer):
        return retry(reason="schema")
    if contradicts(answer, facts):
        return retry(reason="facts")
    return answer   # safe to show`,
  },
];

export const TEMPLATES = [
  { id: "summary", label: "Summary" },
  { id: "sequence", label: "Sequence" },
  { id: "strategy", label: "Strategy" },
] as const;

export const SAMPLE_QUERIES: Record<string, string> = {
  summary: "Summarise what changed in my week.",
  sequence: "Lay out the next 90 days, step by step.",
  strategy: "What should I do first, and why?",
};

// What comes out of the top of the stack: the typed, audited answer the UI renders.
export const RESULT: Layer & { codeFor: Record<string, string>; line: Record<string, string> } = {
  n: 7,
  name: "Result",
  short: "result",
  file: "response.json",
  role: "What the person sees",
  analogy: "the finished page",
  desc: "The other half of my job. The machine returns typed data; I decide how a person reads it: the answer first, then the steps, then why, with sources and an honest “possible mismatch” note. No jargon, nothing to decode.",
  code: "",
  codeFor: {
    summary: `{
  "summary": "A steady week; two decisions are waiting on you.",
  "highlights": ["Shipped onboarding v2", "Hiring loop paused"],
  "why": ["3 sources", "matches last week's trend"],
  "confidence": 0.82
}`,
    sequence: `{
  "phases": [
    { "days": "1–30",  "goal": "Validate the core flow" },
    { "days": "31–60", "goal": "Pilot with 5 teams" },
    { "days": "61–90", "goal": "Decide: scale or pivot" }
  ],
  "why": ["timeline_prompt", "2 prior turns"]
}`,
    strategy: `{
  "first_step": "Interview 5 users before building",
  "because": "Two assumptions have no evidence yet",
  "next": ["Prototype the riskiest flow", "Set one success metric"],
  "risk": "Possible mismatch: needs a researcher's time",
  "sources": ["kb#12", "web#3"]
}`,
  },
  line: {
    summary: "summary + 2 highlights + sources",
    sequence: "3-phase plan · 30 / 60 / 90 days",
    strategy: "first step + reason + risk + sources",
  },
};

// What goes in at the bottom: the part of the system a person actually touches.
export const INPUT: Layer = {
  n: 0,
  name: "Input",
  short: "input",
  file: "ui/Ask.tsx",
  role: "What the person does",
  analogy: "a conversation, not a form",
  desc: "Half of my job. People shouldn't need to know prompts, models or schemas. They type in their own words, tap a suggestion, and can always see whether their data stays on the device. The UI turns that into a clean, typed request for the machine.",
  code: `<Ask
  placeholder="Ask in your own words…"
  suggestions={["Summary", "Sequence", "Strategy"]}
  privacy={mode}        // cloud or local, always visible
  constraints={chips}   // no prompt-writing needed
  onSubmit={toRequest}  // UI → typed request
/>`,
};
