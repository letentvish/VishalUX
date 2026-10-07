// All site copy lives here so it can be edited without touching components.
// Rule for this file: no invented research. Evidence is either countable from
// the build, a scenario walkthrough, or an explicit hypothesis.

export const profile = {
  name: "Vishal Singh",
  short: "VISHAL",
  role: "Agentic UX & Systems Designer",
  location: "Delhi, India",
  email: "vvishal5297@gmail.com",
  links: [
    { label: "LinkedIn", handle: "in/visualux", href: "https://www.linkedin.com/in/visualux" },
    { label: "GitHub", handle: "letentvish", href: "https://github.com/letentvish" },
    { label: "WhatsApp", handle: "+91 95114 44357", href: "https://wa.me/919511444357" },
    { label: "Resume / CV", handle: "PDF ↗", href: "/Vishal_Singh_CV.pdf" },
  ],
  verbs: [
    "agent workflows",
    "decision frameworks",
    "AI-native products",
    "enterprise systems",
    "process flows",
  ],
  facts: [
    { k: "UI/UX", v: "3+ yrs" },
    { k: "Agentic AI", v: "1+ yr" },
    { k: "Degree", v: "Maths (Hons)" },
  ],
};

export type Screen = { src: string; caption: string; wide?: boolean };

export type CaseStudy = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  kind: string;
  status: string;
  role: string;
  stack: string[];
  accent: string;
  cover?: string;
  live?: string;
  summary: string;
  problem: string[];
  vague: { question: string; formula: string[]; note: string };
  flow: string[];
  decisions: { title: string; body: string }[];
  system: { title: string; items: string[] };
  screens: Screen[];
  evidence: { label: string; value: string }[];
  honest: string;
  validate: string[];
  next: string[];
};

export const work: CaseStudy[] = [
  {
    slug: "assessment-framework",
    index: "01",
    name: "Assessment Framework",
    tagline: "A psychometric framework that turns “who am I?” into a career map.",
    kind: "Psychometric framework · research & design",
    status: "Own product · handed over (NDA)",
    role: "Research direction, framework architecture, scoring logic, spec review",
    stack: ["RIASEC", "Big Five", "Values & aptitude", "Forced-choice items", "Adaptive branching", "Agent skill"],
    accent: "#0a0a0a",
    summary:
      "Career tests either hand out a four-letter label or drown people in a 30-page report. I designed the assessment behind my own career-assessment product end to end: what it measures, how questions are asked so they're hard to fake, how answers become an archetype, and what happens when someone's dream role doesn't fit.",
    problem: [
      "Likert-style tests are easy to game: people answer as who they want to be, not who they are.",
      "Single-model tests see one side of a person: interests without personality, or personality without readiness.",
      "When the dream role doesn't fit, most tools say “not for you” and stop. That's where people need the most help.",
    ],
    vague: {
      question: "“Who am I, and what should I do next?”",
      formula: [
        "interests (RIASEC) pick the domain → personality, aptitude & values pick the archetype",
        "fit(role) = scored on 4 layers: interest · trait · capability · motivation",
        "→ aligned · stretch · hard misfit, and every gap becomes a bridge, never a rejection",
      ],
      note: "Item wording, weights and thresholds stay private. What's shown is the structure: a vague life question broken into measurable layers.",
    },
    flow: ["Intake & persona", "Adaptive forced-choice modules", "Trait scores", "Archetype match", "Fit vs desired role", "Roadmap & report"],
    decisions: [
      {
        title: "Forced-choice over Likert",
        body: "Each item offers several options mapped to different traits, so there's no “obviously right” answer to pick. Harder to fake, and paired with reverse-scored items and evidence questions that check self-perception.",
      },
      {
        title: "24 archetypes, and a reason for the number",
        body: "6 is too broad, 16 ignores vocational interests, a thousand occupations is too granular. Six interest domains × four archetypes each gives 24: specific enough to feel personal, few enough to run tracks and cohorts.",
      },
      {
        title: "Mismatch is a “stretch”, not a verdict",
        body: "When the archetype and the desired role diverge, the system names the gap layer, then offers a bridge track, adjacent roles and a counsellor session.",
      },
      {
        title: "Weights are hypotheses until data says otherwise",
        body: "Every weight is treated as a starting assumption, with a pilot plan and reliability targets built in to recalibrate them.",
      },
    ],
    system: {
      title: "Scoring architecture",
      items: [
        "Layer 1 · raw trait scores: each option feeds several traits",
        "Layer 2 · composite readiness axes",
        "Layer 3 · archetype fit against target profiles, with a confidence score",
        "Layer 4 · growth-edge engine: user vs desired-role requirement, banded by severity",
        "Layer 5 · track recommendation, plus an agent skill that matches archetypes to live roles (3–5 options, not one verdict)",
      ],
    },
    screens: [],
    evidence: [
      { label: "Career archetypes", value: "24" },
      { label: "Scoring layers", value: "5" },
      { label: "Fit layers", value: "4" },
      { label: "Spec defects caught before build", value: "13+" },
    ],
    honest:
      "I built this for my own career-assessment product, which has since been handed over to a company, so the product itself is under NDA and isn't shown. The framework was developed through a research process I directed, using AI research agents for the literature and specification work. It is grounded in established models (RIASEC, Big Five) but has not been piloted yet, so no accuracy claims are made. I also ran my own spec review, which found 13+ defects (undefined scoring targets, missing normalisation, drifting trait names) before anything was built.",
    validate: [
      "A 200-user pilot with a “does this feel like you?” rating on every archetype result.",
      "Reliability per scale (Cronbach's alpha ≥ 0.70) and item difficulty / discrimination checks.",
      "A bias audit across academic streams and regions before launch.",
    ],
    next: ["Freeze the question bank before the scoring service is built.", "Define normalisation so every scale lands on the same 0–100 range."],
  },
  {
    slug: "astrodash",
    index: "02",
    name: "AstroDash",
    tagline: "Classical Vedic maths in, a daily operating plan out.",
    kind: "Own product · web + Android",
    status: "Working build",
    role: "Product design, agent architecture, front-end",
    stack: ["React 19", "Vite", "Tailwind 4", "Express", "FastAPI", "Swiss Ephemeris", "Gemini / Ollama", "Capacitor"],
    accent: "#7c5cff",
    cover: "/work/astrodash/07-planner.png",
    summary:
      "Most astrology apps stop at a horoscope paragraph. AstroDash computes the actual chart on the server, then uses a team of agents to turn that maths into plans at every zoom level: the hour, the week, the dasha, the decade.",
    problem: [
      "Generic horoscopes are lookup tables written for millions of people. They ignore birth time, place, and what is happening in the sky today.",
      "Raw LLMs are worse: they sound confident and get celestial maths wrong. A wrong ascendant breaks every reading built on it.",
      "People who take this seriously still go to a human astrologer for the parts that matter: when to act, and why.",
    ],
    vague: {
      question: "“When is a good time for me to get married / switch jobs?”",
      formula: [
        "window = 0.45·MD + 0.35·AD + 0.20·PD",
        "MD/AD/PD = how strongly each running dasha period activates the 2nd, 7th and 11th houses",
        "→ cross-checked against the D9 chart and live transits",
      ],
      note: "A question people ask an astrologer, rewritten as a weighted score the system can compute, rank and explain.",
    },
    flow: ["Birth details", "Ephemeris maths", "Researcher agent", "Interpreter agent", "Auditor loop", "Plain-language plan"],
    decisions: [
      {
        title: "Maths is deterministic, language is generative",
        body: "Positions, dashas and hora timings are computed with Swiss Ephemeris. The LLM is only allowed to explain numbers it is handed, never to produce them.",
      },
      {
        title: "Every claim carries its calculation",
        body: "Predictions show the dasha chain and the formula that produced them, with the line “probable windows, not guaranteed dates”. Trust comes from being able to check the work.",
      },
      {
        title: "An auditor sits between the model and the screen",
        body: "An evaluator–optimizer loop checks each answer against the computed chart and the expected JSON shape before it renders, so the UI never shows a contradiction.",
      },
      {
        title: "Time is the navigation",
        body: "A temporal shift control moves the whole app ±day/week/month/year. Users plan by time, so the interface does too.",
      },
    ],
    system: {
      title: "Agent topology",
      items: [
        "Orchestrator: routes each request to the right specialist",
        "Researcher: hybrid retrieval over classical texts",
        "Interpreter: turns computed facts into narrative",
        "Auditor: rejects answers that contradict the maths",
        "Model router: cloud (Gemini) or fully local (Ollama) per user setting",
      ],
    },
    screens: [
      { src: "/work/astrodash/02-dashboard.png", caption: "Daily dashboard: today's theme anchored to the transiting Moon, five domain scores, time-travel controls.", wide: true },
      { src: "/work/astrodash/07-planner.png", caption: "Planner: a 24-hour energy curve plus Rahu Kaal and other blocked windows. The screen a user returns to most." },
      { src: "/work/astrodash/06-predictions.png", caption: "Predictions: each window shows its dasha chain, reasoning and a remedy." },
      { src: "/work/astrodash/03-kundli.png", caption: "Sidereal chart with D1/D9/D10 and an ascendant override when a user trusts another chart." },
      { src: "/work/astrodash/04-relocation.png", caption: "Relocation: the whole chart is recast for a target city, not just a line on a map." },
      { src: "/work/astrodash/09-timeline.png", caption: "10-year timeline with a clear “you are here”." },
      { src: "/work/astrodash/12-chat.png", caption: "AstroChat knows the user's chart, but can't yet answer “when”. Flagged below." },
    ],
    evidence: [
      { label: "Modules from one birth record", value: "10" },
      { label: "AI endpoints", value: "13" },
      { label: "Agents in the loop", value: "5" },
      { label: "Self-audit issues logged", value: "6" },
    ],
    honest:
      "Evaluated through a scenario walkthrough with one sample user (a 32-year-old PM weighing a job switch), not a study. The walkthrough found that planning today's work and understanding the chart are strong, while picking a job-change window is only partly served.",
    validate: [
      "5 moderated sessions with people who already consult an astrologer: can they find a decision window unaided?",
      "Track whether users return to the Planner on day 2 and day 7, since it's the daily-habit screen.",
      "Compare trust ratings with and without the visible calculation panel.",
    ],
    next: [
      "Prediction scores saturate at 100. Normalise after modifiers so the ranking means something.",
      "Pass the dasha timeline into chat so “when” questions return actual windows.",
      "Mobile header overflows at 390px. Move language and date into the drawer.",
    ],
  },
  {
    slug: "watchmatch",
    index: "03",
    name: "WatchMatch",
    tagline: "A movie scout that tells you why a pick might be wrong for you.",
    kind: "Own product · shipped",
    status: "Shipped · now retired",
    role: "Product design, AI flow, front-end",
    stack: ["React 19", "TypeScript", "Tailwind 4", "Express", "Gemini structured output"],
    accent: "#e5484d",
    cover: "/work/watchmatch/results-screen.jpg",
    summary:
      "People with four streaming apps still spend the evening scrolling. WatchMatch replaces the catalogue with a conversation, and shows a short list where every pick explains its fit and its risk.",
    problem: [
      "Genre filters break on real requests like “a rainy-night neon-noir mystery, grounded, under two hours, no gore”.",
      "Platform rails push their own originals. “Because you watched X” explains nothing.",
      "The real dealbreakers (slow pacing, a cancelled show with no ending) are hidden until you're two hours in.",
    ],
    vague: {
      question: "“Something like Blade Runner 2049, but lighter?”",
      formula: [
        "mood = (darkness, pace, complexity, emotional depth), each 0–100",
        "match = closeness of a title's mood to the request − dealbreaker penalties",
        "→ every penalty is shown to the user as a “possible mismatch”",
      ],
      note: "A vibe, turned into four axes the model can extract and the interface can display as sliders.",
    },
    flow: ["Free-text request", "Mood + constraint extraction", "Candidate scoring", "Mismatch check", "Shortlist of 3"],
    decisions: [
      {
        title: "Show the risk next to the recommendation",
        body: "Each pick carries a “Possible mismatch” note. Admitting a weakness is what makes the rest of the recommendation believable.",
      },
      {
        title: "Four mood axes instead of one rating",
        body: "Darkness, pace, complexity and emotional depth as 0–100 bars let people compare titles at a glance.",
      },
      {
        title: "Filters for commitment, not genre",
        body: "Runtime caps, finished series only, and ending type (satisfying, bittersweet, open), because the fear is wasting an evening.",
      },
      {
        title: "Works when the AI doesn't",
        body: "If the model is rate-limited or offline, a local rule engine with typo correction takes over. No sign-up; taste history stays in the browser.",
      },
    ],
    system: {
      title: "Pipeline",
      items: [
        "LLM with a strict output schema extracts mood + constraints",
        "Local fallback parser when the API fails",
        "Scoring and mismatch detection",
        "Taste profile kept in local storage",
      ],
    },
    screens: [
      { src: "/work/watchmatch/hero-screen.jpg", caption: "Concept screen · Discover: describe a mood in your own words instead of picking genres.", wide: true },
      { src: "/work/watchmatch/results-screen.jpg", caption: "Concept screen · Match results: why it fits, a visible “possible mismatch”, and four mood axes." },
      { src: "/work/watchmatch/persona-screen.jpg", caption: "Concept screen · CineTaste Passport: a taste archetype with five-dimension taste DNA." },
      { src: "/work/watchmatch/detail-modal.jpg", caption: "Concept screen · Detail: where to watch, ending type and content advisories.", wide: true },
    ],
    evidence: [
      { label: "Mood axes", value: "4" },
      { label: "Shortlist size", value: "3" },
      { label: "Sign-up walls", value: "0" },
      { label: "Fallback modes", value: "2" },
    ],
    honest:
      "WatchMatch shipped, but no structured usability study was run, so there are no outcome numbers here. The case rests on the design decisions and the system behind them.",
    validate: [
      "Time-to-decision vs. browsing a streaming app, same people, same evening scenario.",
      "How often a shortlisted title is actually started.",
      "Whether the mismatch note raises or lowers trust in the top pick.",
    ],
    next: ["Bring back a lighter version as a share-a-shortlist page."],
  },
  {
    slug: "shaktivibe",
    index: "04",
    name: "ShaktiVibe",
    tagline: "Wellness data turned into three things to do today.",
    kind: "Own product · prototype",
    status: "Prototype live",
    role: "Product design, information architecture, front-end",
    stack: ["Next.js", "TypeScript", "Tailwind", "Retrieval over Ayurvedic texts", "MCP (designed)"],
    accent: "#16a34a",
    cover: "/work/shaktivibe/home.png",
    live: "https://shaktivibe.netlify.app/dashboard",
    summary:
      "Wearables are data-rich and insight-poor. ShaktiVibe combines sleep, energy and mood check-ins with an Ayurvedic lens, and instead of another dashboard it gives you a few small rituals that fit the time of day.",
    problem: [
      "Sleep, heart-rate and mood live in separate apps as separate numbers.",
      "Advice is either generic (“sleep more”) or a 20-step routine nobody follows.",
      "Health data is personal; most tools ship it to someone else's cloud.",
    ],
    vague: {
      question: "“How should I take care of myself today?”",
      formula: [
        "today = f(sleep, energy, mood, time of day, season)",
        "→ rank possible practices by relevance",
        "→ show only the top 3",
      ],
      note: "The constraint matters more than the formula: three rituals, not twenty, because the goal is doing it.",
    },
    flow: ["Check-ins + wearable data", "Normalise signals", "Retrieve from texts", "Rank practices", "3 daily rituals"],
    decisions: [
      {
        title: "Three rituals, never more",
        body: "A hard cap on daily actions. Fewer suggestions that get done beat a complete plan that gets ignored.",
      },
      {
        title: "Physical, emotional, spiritual as equal doors",
        body: "The navigation follows the three ways people talk about feeling well, not how sensors happen to group data.",
      },
      {
        title: "Data stays local",
        body: "Designed for local storage and local models, with a tool server so other assistants can ask questions without the raw data leaving the device.",
      },
    ],
    system: {
      title: "System",
      items: [
        "Signal ingestion and normalisation",
        "Retrieval over classical Ayurvedic texts",
        "Time-of-day and season rules",
        "Local tool server for external AI assistants",
      ],
    },
    screens: [
      { src: "/work/shaktivibe/home.png", caption: "Home: energy centres and a snapshot across physical, emotional and spiritual health.", wide: true },
      { src: "/work/shaktivibe/emotional.png", caption: "Emotional health: mood log, 7-day heatmap and a journaling prompt." },
      { src: "/work/shaktivibe/physical.png", caption: "Physical health view." },
    ],
    evidence: [
      { label: "Daily rituals shown", value: "3" },
      { label: "Health domains", value: "3" },
    ],
    honest:
      "A front-end prototype with sample data. Wearable integrations and the retrieval layer are designed, not connected. This is a wellness concept, not medical advice.",
    validate: [
      "A 2-week diary study: do people complete the 3 rituals, and which ones get skipped?",
      "Card-sort the navigation with target users to confirm the three-domain structure.",
    ],
    next: ["Connect one wearable source end to end.", "Replace sample insights with retrieved, cited ones."],
  },
];

export const comingSoon = {
  name: "Uniquely",
  tagline: "An agentic project-management app. In progress.",
  index: "05",
};

export const services = [
  {
    n: "01",
    title: "Agentic UX & AI workflows",
    body: "Where the agent acts, where the human decides, and what the interface shows in between. Designed so people can see and correct what the AI did.",
    tags: ["Agent topology", "Human-in-the-loop", "Failure states", "Trust patterns"],
  },
  {
    n: "02",
    title: "Frameworks & decision models",
    body: "Turning a vague question (“is this a good fit?”, “when should I act?”) into a model with dimensions, weights and rules a system can compute and explain.",
    tags: ["Psychometric frameworks", "Scoring models", "Taxonomies", "Explainability"],
  },
  {
    n: "03",
    title: "Process & workflow design",
    body: "Mapping the hand-offs between people, roles and systems before any screen is drawn. ERP and HRMS-scale: permissions, approvals, audit trails.",
    tags: ["Process flows", "Access models", "Service blueprints", "Edge cases"],
  },
  {
    n: "04",
    title: "UX research & product design",
    body: "From problem framing to Figma to a clickable product. Research plans sized to the budget, and honest about what's assumed.",
    tags: ["Research plans", "IA", "Figma", "Prototypes"],
  },
  {
    n: "05",
    title: "Front-end build",
    body: "I ship what I design in React and Next.js, so the prototype is the product, not a picture of it.",
    tags: ["React / Next.js", "TypeScript", "Tailwind", "Motion"],
  },
];

// Pre-baked examples for the "Vague → Formula → Flow" demo on the home page.
export const translations = [
  {
    vague: "Which leave requests need my attention first?",
    dims: ["days until leave", "classes affected", "cover available?"],
    formula: "priority = classes_affected × (1 / days_left) × (no_cover ? 2 : 1)",
    flow: ["Request in", "Find affected classes", "Suggest cover", "Rank by priority", "Approver inbox"],
  },
  {
    vague: "Is this candidate right for the role?",
    dims: ["thinking style", "stress load", "values", "readiness"],
    formula: "fit = Σ layerᵢ · wᵢ   →   lowest layer = next step",
    flow: ["Assessment", "Profile vector", "Compare to role", "Score 4 layers", "Gap → plan"],
  },
  {
    vague: "Can I trust what the AI just told me?",
    dims: ["matches source data?", "schema valid?", "confidence"],
    formula: "ship = consistent ∧ valid ∧ confidence > θ   else → retry or ask a human",
    flow: ["Model answer", "Check against facts", "Validate shape", "Retry / escalate", "Show with reasoning"],
  },
];

export const story = [
  "Maths (Hons) graduate.",
  "Self-taught designer.",
  "3+ years of UI/UX, the last one deep in agentic AI.",
  "I led product design on ERP and HRMS platforms, where the hard part is never the screen. It's who approves what, and what happens next.",
  "Maths taught me to find the variables hiding in a vague question.",
  "Design taught me to make the answer usable.",
  "Code lets me ship it myself.",
];
