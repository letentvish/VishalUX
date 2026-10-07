# AstroDash Agentic System Architecture
## Complete Technical Specification & Workflow Breakdown

---

### Executive Overview

The AstroDash AI subsystem is an enterprise-grade, multi-agent Vedic astrological reasoning engine. Rather than relying on simple prompt-completion loops, it employs a **4-Pillar Agentic Architecture** combined with **Deterministic Mathematical Co-Processing**, **RAG 2.0 Contextual Retrieval**, and an **Evaluator-Optimizer Self-Correction Loop**.

The system is designed to eliminate common LLM failure modes in technical astrology:
1. **Hallucination Prevention**: Core mathematical metrics (degrees, divisional charts, Shadbala, Ashtakavarga, hourly Horas, Muhurtas, and life-area scores) are pre-computed mathematically before the LLM sees them. The LLM acts as an interpretive synthesis agent rather than a calculator.
2. **Temporal Consistency**: Historical insights for each user and domain are preserved and fed back into subsequent generations to prevent contradictory readings across days.
3. **Structured Reliability**: Output schemas are enforced via strict Pydantic models, JSON extraction fallbacks, fast-path validators, and an automated Auditor Agent.

---

## 1. Inventory of Agents & Specialized Workers

The architecture features **7 distinct agents and worker roles** working in orchestration across backend, engine, and client layers:

| Agent / Worker Role | Implementation File | Primary Responsibility |
| :--- | :--- | :--- |
| **1. Orchestrator Agent** | `ai_engine/orchestrator.py` | Central coordinator. Directs request lifecycle, executes input guardrails, coordinates worker agents, enforces progressive disclosure (skills), and manages the evaluator loop. |
| **2. Researcher Worker** | `ai_engine/agent.py` (`ResearcherWorker`), `tools.py` | Information retrieval agent. Executes RAG 2.0 hybrid search over classical Vedic treatises (`knowledge_base/`), expands Sanskrit synonyms, and provides contextualized reference texts. |
| **3. Interpreter Worker** | `ai_engine/agent.py` (`InterpreterWorker`), `analyze.py` | Domain synthesis agent. Ingests raw planetary ephemeris, deterministic scores, and knowledge chunks to draft deep astrological narratives conforming to target schemas. |
| **4. Auditor / Evaluator Worker** | `ai_engine/agent.py` (`AuditorWorker`), `orchestrator.py` | Quality assurance & verification agent. Inspects drafted insights, tests structural JSON integrity, verifies domain coverage, and feeds corrective critiques back to the Interpreter. |
| **5. Backend Controller Agent** | `backend/app/api/routes/ai_routes.py` | Gateway & session broker. Handles client intake, token authentication, astrologer-client access control, birth-data injection, temporal chaining, caching, and async job queueing. |
| **6. Automated Proctor Agent** | `ai_engine/proctor.py` | End-to-end integration test agent. Simulates chart retrieval, executes live multi-provider inference, runs Pydantic validation checks, and verifies cache storage integrity. |
| **7. Mobile Client Agent** | `mobile/lib/MobileAgent.ts`, `ToolRegistry.ts` | Edge/client agent. Runs on React Native, orchestrates local/remote LLM calls, and executes client-side tools (Calendar, Mail) via a recursive tool-use loop. |

---

## 2. End-to-End Workflow & Processing Lifecycle

```
[ Client Request (Web/Mobile) ]
              ?
              ?
??????????????????????????????????????????????????????????
? Phase 1: Intake & Access Gateway (FastAPI Route)       ?
? - JWT Authentication & Profile Resolution              ?
? - Astrologer Access Verification (ChartAccessRequest)   ?
? - User Birth Data Auto-Injection from DB               ?
? - Multi-Tier Cache Lookup (DAILY / WEEKLY / MONTHLY)   ?
??????????????????????????????????????????????????????????
                           ? (Cache Miss / Force Refresh)
                           ?
??????????????????????????????????????????????????????????
? Phase 2: Deterministic Pre-Computation Co-Processors   ?
? - Swiss Ephemeris & Skyfield Natal Charts (D1, D9, D10)?
? - Planetary Strength Matrix (Shadbala calculation)     ?
? - Ashtakavarga & Transit Multi-Factor Life Area Scorer ?
? - NOAA Solar Equation & Chaldean Planetary Horas       ?
? - Muhurtas (30 day/night windows) & Kaal Periods       ?
??????????????????????????????????????????????????????????
                           ?
                           ?
??????????????????????????????????????????????????????????
? Phase 3: Temporal Consistency Injection                ?
? - DB query for user's previous insight in this domain  ?
? - Inject 'previous_insight' into context payload       ?
??????????????????????????????????????????????????????????
                           ?
                           ?
??????????????????????????????????????????????????????????
? Phase 4: Async Job Dispatch (AIJobManager)             ?
? - Returns HTTP 202 with unique Job ID to client        ?
? - Semaphore locks concurrent LLM executions            ?
??????????????????????????????????????????????????????????
                           ?
                           ?
??????????????????????????????????????????????????????????
? Phase 5: Orchestrator & Input Guardrails               ?
? - Input validation (anti-injection, sanity checks)     ?
? - Progressive Disclosure: Load domain skill markdown   ?
??????????????????????????????????????????????????????????
                           ?
                           ?
??????????????????????????????????????????????????????????
? Phase 6: Researcher Worker & RAG 2.0 Retrieval         ?
? - Extract astrological entities (Planets, Bhavas)      ?
? - Sanskrit synonym mapping (Jupiter <-> Guru)          ?
? - Contextual Chunking & Scoring against Knowledge Base ?
? - Web Search fallback via Perplexity API               ?
??????????????????????????????????????????????????????????
                           ?
                           ?
??????????????????????????????????????????????????????????
? Phase 7: Interpreter Worker Generation                 ?
? - Model routing (Gemini / Groq / NVIDIA / Sarvam)      ?
? - Prompt formatting with pre-calculated numbers        ?
? - JSON response generation                             ?
??????????????????????????????????????????????????????????
                           ?
                           ?
??????????????????????????????????????????????????????????
? Phase 8: Evaluator-Optimizer Loop (Auditor Worker)     ?
? - Fast-Path JSON validation                            ?
? - Structural Audit (no "TBD", "Unknown", or empty tags)?
? - If invalid -> Refine prompt with feedback (Retry ? 2)?
??????????????????????????????????????????????????????????
                           ?
                           ?
??????????????????????????????????????????????????????????
? Phase 9: Normalization, Caching & Database Persistence ?
? - Timeline Normalizer (Standardize dates & milestones) ?
? - Store in AI_CACHE (ai_cache.json)                    ?
? - Commit new AIInsight record to SQL database          ?
? - Update AIJob status to 'succeeded' (100% progress)   ?
??????????????????????????????????????????????????????????
```

---

## 3. Deep Dive: Architectural Phases

### Phase 1: Intake, Identity & Security Gateway
* **Module**: `backend/app/api/routes/ai_routes.py`
* **Entry Points**:
  - `/api/v1/ai/dashboard` & `/api/v1/ai/dashboard/sections/{section}`
  - `/api/v1/ai/planner` (Day / Week / Month modes)
  - `/api/v1/ai/timeline` (1W / 1M / 1Y zoom levels)
  - `/api/v1/ai/insights`, `/api/v1/ai/me`, `/api/v1/ai/transit_analysis`, `/api/v1/ai/chat`
* **Authorization & RBAC**:
  - `OAuth2PasswordBearer` extracts Bearer JWT token.
  - Astrologer vs. Client Verification: If an astrologer views a client chart (`target_user_id`), the gateway verifies permissions against the `ChartAccessRequest` database table before granting access.
* **Birth Data Injection**:
  - If the client payload lacks birth parameters, the backend intercepts the request, queries the `User` and `birth_data` tables, and injects exact latitude, longitude, birth date, birth time, timezone, and user name.

---

### Phase 2: Deterministic Pre-Computation Co-Processors
To ensure 100% astronomical accuracy, the system does not ask the LLM to calculate planetary positions or numerical scores. Instead, mathematical co-processors execute before prompt assembly:

#### 1. Astronomical Calculation Engine (`ContextBuilder`)
- **Ephemeris Library**: Swiss Ephemeris (`pyswisseph`) & `skyfield`.
- **Outputs**:
  - D1 (Rashi Natal Chart): Ascendant, planet longitudes, zodiac signs, and whole-sign house placements.
  - D9 (Navamsa Chart): Soul/inner destiny harmonics.
  - D10 (Dasamsa Chart): Career, status, and professional calling.
  - Shadbala: Six-fold planetary strength metrics (total rupas + top component).
  - Current Transits: Real-time transiting planets mapped to houses relative to natal ascendant.
  - Vimshottari Dasha: Current Mahadasha, Antardasha, and Pratyantardasha hierarchy with precise transition timestamps.

#### 2. Formula 7 Planetary Hora & Muhurta Engine (`context_builder.py`)
- **Sunrise / Sunset Algorithm**: High-precision NOAA solar position algorithm (`_solar_event`) accurate to 1 minute based on day-of-year anomaly and equation of time.
- **Hora Generation**: Calculates 12 daylight horas and 12 nocturnal horas in perpetual Chaldean order (`Saturn -> Jupiter -> Mars -> Sun -> Venus -> Mercury -> Moon`) starting from the planetary Day Lord.
- **Muhurta Windows**: Splits the solar cycle into 15 daytime muhurtas (e.g. Abhijit, Rudra) and 15 nighttime muhurtas (e.g. Brahma Muhurta, Pushkara) with positive/negative score modifiers ($M_{off}$).
- **Kaal Periods**: Pre-computes exact windows for **Rahu Kaal** ($K_{mod} = -3$), **Gulika Kaal** ($K_{mod} = -2$), and **Yamaganda** ($K_{mod} = -1$).

#### 3. Life Area Scorer (`life_area_scorer.py`)
- Calculates scores $\in [20, 95]$ across 5 domains (Career, Wealth, Health, Relationships, Spirituality).
- **Core Formula**:
  $$	ext{Score} = (	ext{natal\_base} 	imes 0.4) + (	ext{dasha\_score} 	imes 0.4) + (	ext{transit\_score} 	imes 0.2)$$
  - $	ext{natal\_base}$: Derived from Sarvashtakavarga points of domain houses ($rac{	ext{points}}{50} 	imes 100$).
  - $	ext{dasha\_score}$: Evaluates natural and functional benefic/malefic lordship of active Mahadasha and Antardasha rulers.
  - $	ext{transit\_score}$: Real-time transit aspects and planetary occupations of relevant houses.
  - Injected directly into prompt instructions: the LLM must adopt these exact numerical scores and write analytical justifications around them.

#### 4. Soul Blueprint Calculator (`me_calculator.py`)
- Computes core personality parameters: Atmakaraka (soul planet), Amatyakaraka (career indicator), Lagna lord placements, and dominant planetary energies.

---

### Phase 3: Temporal Consistency Injection
* **Mechanism**: Astrological predictions must not oscillate randomly between days.
* **Process**:
  1. The backend queries `AIInsight` for the user's most recent generation in the requested domain:
     ```python
     prev_insight = db.query(AIInsight).filter(
         AIInsight.user_id == str(user_id),
         AIInsight.insight_type == insight_type
     ).order_by(AIInsight.generated_for_date.desc()).first()
     ```
  2. If found, `prev_insight.data` is injected into the prompt context under `PREVIOUS INSIGHT (for consistency)`.
  3. The prompt explicitly commands the model to maintain thematic continuity with prior forecasts while detailing day-over-day evolutionary shifts.

---

### Phase 4: Progressive Disclosure & Modular Skill System
* **Module**: `ai_engine/skill_loader.py`
* **Philosophy**: Avoid stuffing all rules, astrological texts, and domain instructions into one giant prompt. Load only what is needed for the active task.
* **Skill Catalog**:
  - `skills/dashboard.md`: Directs synthesis of Moon signs, top 3 planetary transits, life-area mappings, and daily cosmic theme.
  - `skills/personality.md`: Guides synthesis of the Soul Blueprint, chakra alignments, and psychological growth edges.
  - Dynamically loaded and merged into the system prompt context on demand.

---

### Phase 5: RAG 2.0 & Knowledge Base Retrieval
* **Module**: `ai_engine/tools.py` (`AITools`)
* **Knowledge Store**: Classical Vedic astrological scriptures stored in `ai_engine/knowledge_base/` (e.g. `parashara_hora.txt` ? Brihat Parashara Hora Shastra).
* **Retrieval Pipeline**:
  1. **Entity Extraction**: Parses user query and context for planetary bodies, houses, yogas, and dashas.
  2. **Semantic Sanskrit Synonym Expansion**:
     - $	ext{Jupiter} \longleftrightarrow 	ext{Guru} / 	ext{Brihaspati}$
     - $	ext{Saturn} \longleftrightarrow 	ext{Shani}$
     - $	ext{Venus} \longleftrightarrow 	ext{Shukra}$
     - $	ext{Mars} \longleftrightarrow 	ext{Mangal}$
  3. **Contextual Retrieval (Context Mapping)**: Each knowledge file is indexed with high-level contextual summaries prepended to chunks to prevent LLM decontextualization:
     ```text
     [CONTEXT: Fundamental Vedic text (Brihat Parashara Hora Shastra) covering planetary influences and bhavas.]
     CHUNK: ...
     ```
  4. **Scoring & Re-Ranking**:
     - Exact keyword match: $+2$ points per hit.
     - Synonym / semantic match: $+1$ point per hit.
     - Top 3 highest-scoring chunks are formatted with source attribution and injected into prompt context.
  5. **Live Web Search Fallback**: If configured, `search_astrology` calls Perplexity `sonar-pro` API to retrieve contemporary transit contexts.

---

### Phase 6: Multi-Provider Model Inference
* **Module**: `ai_engine/agent.py` (`AstroAIAgent`)
* Supports flexible multi-cloud routing configured via `settings.AI_ENGINE_MODE`:
  - **Google Gemini** (`gemini-2.0-flash`): Features rate-limiting semaphore (`asyncio.Semaphore(1)`), automated exponential backoff on HTTP 429 (`4.0s * (attempt + 1)`), and native `response_mime_type="application/json"`.
  - **Groq** (`llama-3.3-70b-versatile`): High-speed inference with dynamic token budget management (`calculate_groq_max_tokens`) to ensure requests stay strictly within Tier TPM limits.
  - **NVIDIA Integrate API** (`minimaxai/minimax-m3`): Enterprise high-parameter inference.
  - **Perplexity AI** (`sonar-pro`): Web-grounded reasoning.
  - **Sarvam AI** (`sarvam-m`): Indian language native generation.
  - **Local Ollama** (`llama3` on `localhost:11434`): Air-gapped offline inference with JSON-mode enforcement.

---

### Phase 7: Evaluator-Optimizer Self-Correction Loop
* **Module**: `ai_engine/orchestrator.py` (`Orchestrator`), `ai_engine/agent.py` (`AuditorWorker`)
* An automated feedback loop reviews drafted content before client delivery:

```
[ Interpreter Worker Generates Draft ]
                  ?
                  ?
         [ Fast-Path Check ]
         Does valid JSON parse?
             ???? YES (Attempt 0) ??? Return Output Immediately
             ?
             ???? NO or Attempt > 0
                  ?
                  ?
         [ Auditor Worker ]
         Checks:
         - Valid JSON object
         - No 'error' fields
         - No 'Unknown' / 'TBD' placeholders
         - Schema field completeness
                  ?
         ???????????????????
      [VALID]           [FAILED]
         ?                 ?
         ?                 ?
         ?        Feedback Aggregation:
         ?        PREVIOUS FEEDBACK: {audit_result}
         ?                 ?
         ?                 ?
         ?        Re-prompt Interpreter
         ?        (Max Retries = 2)
         ?
[ Return Final Verified Insight ]
```

---

### Phase 8: Normalization & Post-Processing
* **Module**: `ai_engine/timeline_normalizer.py`
* Cleans and normalizes LLM outputs:
  - Formats date strings to standard ISO formats.
  - Validates that milestone phases do not contain gaps or inverted timeline bounds.
  - Strips markdown code-block ticks (` ```json `) to guarantee pure JSON return types.

---

### Phase 9: Asynchronous Jobs & Multi-Tier Caching
* **Module**: `ai_engine/ai_jobs.py` (`AIJobManager`), `backend/app/api/routes/ai_routes.py`

#### Multi-Tier Retention Caching:
1. **DAILY** (24-hour expiration): Daily themes, daily transit summaries, 1-week timeline view.
2. **WEEKLY** (7-day validity): 1-month timeline strategy and weekly forecasts.
3. **MONTHLY** (30-day validity): 1-year macro timeline and dasha phase breakdowns.
4. **PERMANENT** (Immutable until birth data updates): Soul Blueprint (`/me`), Natal Shadbala analysis, static transit lookups.

#### Dual-Layer Storage:
- **Layer 1 (File/Memory)**: `ai_engine/ai_cache.json` persists generated insights across AI engine container restarts.
- **Layer 2 (Relational DB)**: SQLite / PostgreSQL `AIInsight` table stores persistent records tied to `user_id`, `insight_type`, and `generated_for_date`.

#### Asynchronous Polling Protocol:
- If `AI_ASYNC_JOBS=1`:
  1. Gateway instantly returns HTTP 202: `{"status": "queued", "job_id": "...", "progress": 10}`.
  2. Frontend polls `/jobs/status/{job_id}`:
     - 10%: Preparing astronomical context
     - 35%: Generating insight & running evaluator
     - 100%: Complete (delivers full payload)
  3. Deduplication: Identical concurrent requests for the same cache key share a single job instance.

---

## 4. Section-by-Section Dashboard Streaming
Rather than blocking on a single massive 40-second prompt for the dashboard, `ai_engine/dashboard_sections.py` provides 5 independent modular section endpoints:
1. `daily_theme`: Moon sign, dominant energy, energetic focus areas.
2. `transit_summary`: Top 3 impactful current planetary transits.
3. `life_areas`: 5-domain scores calculated via `life_area_scorer.py`.
4. `weekly_forecast`: Day-by-day 7-day energetic outlook.
5. `monthly_context`: High-level monthly astrological themes.

Frontend clients can fetch these concurrently in parallel (e.g. `Promise.allSettled`), populating UI widgets in under 3 seconds as each completes.

---

## 5. Mobile Edge Agent Architecture
* **Module**: `mobile/lib/MobileAgent.ts`, `mobile/lib/ToolRegistry.ts`
* Provides an autonomous on-device agent interface with tool execution:
  - **Tool Definitions**:
    - `calendar_read`: Reads user calendar events for date-correlated astrological alignment.
    - `mail_send`: Prepares and sends astrological reports or meeting summaries.
  - **Recursive Tool Execution Loop**:
    1. User inputs query: *"Check my schedule for tomorrow and tell me the best time for meetings."*
    2. Model identifies tool requirement and responds with tool call schema: `{"tool": "calendar_read", "args": {"date": "2026-09-29"}}`.
    3. MobileAgent intercepts tool call, executes `ToolRegistry.executeTool()`, and appends tool output to message history.
    4. MobileAgent recursively calls the model with the tool output to generate the final personalized response.
  - **Multi-Provider Switcher**: Supports seamless switching between backend proxy, OpenAI, DeepSeek, Groq, Gemini, and on-device WebLLM (`LocalLLMContext`).

---

## 6. Verification & Proctoring Subsystem
* **Module**: `ai_engine/proctor.py`
* Provides automated continuous verification of the agent pipeline:
  - Step 1: Tests ContextBuilder formatting against canonical Aries/Capricorn chart fixture.
  - Step 2: Executes a live LLM analysis call and validates resulting JSON against Pydantic `DashboardResponse`.
  - Step 3: Verifies required nested arrays (`transit_summary`, `life_areas`) are populated without fallback placeholders.
  - Step 4: Simulates storage and retrieval through the caching layer.

---

### Summary Checklist of Architecture

| Architecture Attribute | Implementation Details |
| :--- | :--- |
| **Agent Paradigm** | Orchestrator-Worker with Evaluator-Optimizer Loop |
| **Workers** | Researcher (RAG), Interpreter (Synthesis), Auditor (QA) |
| **Deterministic Co-Processing** | Swiss Ephemeris, NOAA Solar, Formula 7 Horas, Ashtakavarga Scorer |
| **RAG Version** | RAG 2.0 with Sanskrit Synonyms, Context Mapping & Re-Ranking |
| **Knowledge Base** | Brihat Parashara Hora Shastra (`parashara_hora.txt`) + Live Search |
| **Output Integrity** | Strict Pydantic JSON schemas + Fast-Path Parser + Auditor feedback loop |
| **Temporal State** | Historical insight injection (`previous_insight`) |
| **Concurrency** | Async job queue (`AIJobManager`), semaphore rate-limiting, dedup |
| **Client Edge** | Mobile React Native Agent with recursive function-calling loop |

