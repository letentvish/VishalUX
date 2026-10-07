# Case Study: ShaktiVibe
## Holistic Wellness Intelligence & Chronobiological Telemetry Engine

---

### Executive Summary

| Attribute | Specification |
| :--- | :--- |
| **Product Name** | **ShaktiVibe** |
| **Subtitle** | Holistic Wellness Intelligence & Ayurvedic Chronobiology Platform |
| **Role** | Product Architect, Lead UI/UX Designer & AI Systems Engineer |
| **Platforms** | Responsive Web App & Mobile Edge Interface |
| **Tech Stack** | Next.js 14, TypeScript, Tailwind CSS, Python (FastAPI), SQLite, Ollama |
| **AI & Retrieval Stack** | Domain-Specific Ayurvedic RAG 2.0 (BM25 Hybrid Retrieval), Model Context Protocol (MCP) Health Server, Ollama Local Inference |
| **Design Language** | Dynamic Circadian Glassmorphism (color palette shifts dynamically from Dawn Amber to Solar Gold and Twilight Obsidian) |
| **Core Value** | Translates fragmented wearable telemetry (sleep, HRV, energy, nutrition) into holistic Ayurvedic dosha diagnostics and circadian daily action plans |

---

### 1. The Problem Space: Data-Rich, Insight-Poor Wearables

Modern health ecosystems (Apple Health, Oura, Whoop, Fitbit) record immense volumes of physiological telemetry:

```
[ Sleep Stages ] ──┐
[ Resting HR   ] ──┼──> [ Isolated Dashboards ] ──> "Your Sleep Score is 78."
[ HRV Trends   ] ──┤                                 (No contextual 'Why' or 'What next')
[ Subjective Mood] ┘
```

#### Core User Pain Points
1. **The Telemetry Silo**: Wearables present biometric data in isolated silos. They tell a user their Heart Rate Variability (HRV) dropped by 15%, but cannot explain whether the root cause is digestive strain, emotional stress, or seasonal misalignment.
2. **Generic, One-Size-Fits-All Advice**: Mainstream wellness apps recommend generic habits (e.g., *"Drink 8 glasses of cold water"*, *"Do high-intensity interval training at 7 PM"*) that can severely aggravate specific biological constitutions (e.g., aggravating *Vata* nervous system sensitivity or overheating *Pitta* metabolism).
3. **Absence of Chronobiological & Seasonal Awareness**: Modern tracking ignores the profound biological impact of solar cycles (*Dinacharya*) and seasonal climate shifts (*Ritucharya*), which govern metabolic digestive fire (*Agni*) and circadian hormone secretion.
4. **Severe Privacy Risks with Health Data**: Centralized health cloud providers monetize sensitive personal wellness logs, leading privacy-conscious users to abandon comprehensive health tracking.

---

### 2. The Solution: Bridging Modern Biometrics with Ancient Ayurveda

ShaktiVibe acts as a **holistic wellness intelligence bridge**. It ingests modern biometric telemetry, normalizes the data into temporal vectors, and queries an authoritative Ayurvedic medical knowledge base to diagnose energetic balances and deliver personalized daily guidance.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SHAKTIVIBE SYSTEM PIPELINE                        │
│                                                                        │
│   STAGE 1: MULTI-MODAL TELEMETRY INGESTION                             │
│   • Wearable Biometrics: Sleep duration, HRV, resting HR               │
│   • Subjective Check-Ins: Perceived energy, mental fog, digestion      │
│   • Environmental Context: Local season, solar position, temperature   │
│                                │                                       │
│                                ▼                                       │
│   STAGE 2: TEMPORAL VECTOR NORMALIZATION                               │
│   • Converts heterogeneous data into standardized wellness vectors     │
│   • Preserves acute day-to-day shifts vs. long-term baseline trends    │
│                                │                                       │
│                                ▼                                       │
│   STAGE 3: AYURVEDIC RAG 2.0 KNOWLEDGE ENGINE                          │
│   • Curated classical corpus (Charaka Samhita & Sushruta principles)   │
│   • BM25 Hybrid Retrieval matching symptom patterns to dosha states    │
│   • Detects acute constitutional imbalances: Vata, Pitta, or Kapha     │
│                                │                                       │
│                                ▼                                       │
│   STAGE 4: CIRCADIAN & SEASONAL ACTION PLANNER                         │
│   • Dinacharya: Optimal windows for eating, deep work, and sleep       │
│   • Ritucharya: Seasonal dietary adjustments (Agni optimization)       │
│   • High-Impact Micro-Rituals (3 actionable interventions per day)     │
│                                │                                       │
│                                ▼                                       │
│   STAGE 5: MODEL CONTEXT PROTOCOL (MCP) LOCAL HEALTH SERVER            │
│   • Standardized local MCP endpoints for external AI assistants        │
│   • 100% private: raw telemetry never leaves the user's device         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Core Architectural Pillars

#### 1. Multi-Modal Telemetry Ingestion & Vectorization
ShaktiVibe takes disparate health inputs and normalizes them into continuous vectors:
- **Biometric Markers**: Deep sleep percentage, HRV variation, resting heart rate spikes.
- **Subjective Symptom Logs**: Bloating, mental agitation, lethargy, cold extremities, hydration levels.
- **Temporal Alignment**: Synchronized with solar transit times to assess whether eating or sleeping occurred during harmonious biological windows.

#### 2. Domain-Specific Ayurvedic RAG 2.0 Engine
Rather than relying on generic LLM prompts that risk hallucinating herbal remedies, ShaktiVibe uses a verified medical corpus indexed with BM25 hybrid search:
- **Constitutional Archetyping**: Evaluates the user's baseline constitution (*Prakriti*) and calculates real-time fluctuations (*Vikriti*).
- **Dosha Imbalance Detection**:
  - **Vata Elevation**: Irregular sleep, high HRV volatility, mental restlessness, dry skin. Prescribes grounding, warm, unctuous nutrition and gentle somatic routines.
  - **Pitta Elevation**: Elevated resting HR, nighttime wakefulness around 2 AM, inflammatory signs. Prescribes cooling foods, moderate exertion, and reflective wind-downs.
  - **Kapha Elevation**: Heavy waking inertia, sluggish digestion, low motivation. Prescribes stimulating movement, bitter herbs, and lighter meals.

#### 3. Chronobiological Micro-Ritual Generator
Rather than burdening users with 20-step wellness regimes that lead to failure, ShaktiVibe synthesizes **three high-leverage micro-rituals** tailored to the specific day:
1. **Morning Metabolic Ignition**: Tailored hydration and breathing exercises (*Pranayama*) aligned with sunrise.
2. **Peak Solar Digestive Window**: Guidance to consume the heaviest meal during the solar zenith when metabolic enzymes are at their physiological peak.
3. **Evening Circadian Taper**: Blue-light and digestive wind-down protocol calibrated to the user's specific resting heart rate recovery patterns.

---

### 4. Model Context Protocol (MCP) Health Integration

In alignment with the **Sovereign AI** architecture, ShaktiVibe features a native **Model Context Protocol (MCP)** server:
- **Zero Third-Party Cloud Surveillance**: All biometric telemetry, daily reflections, and dosha evaluations are stored locally in an embedded SQLite database.
- **Standardized MCP Health Tools**: Allows external AI agents (such as Claude Desktop or custom productivity agents) to query health state via local tools:
  - `get_daily_energy_phase()`: Informs calendar planning agents when to schedule demanding creative sessions vs. administrative tasks.
  - `get_dosha_dietary_guidelines()`: Provides meal suggestions based on today's current digestive state.
  - `log_wellness_checkin()`: Enables seamless natural language logging from any desktop interface.

---

### 5. UI/UX Design System: Circadian Glassmorphism

ShaktiVibe’s visual interface is intrinsically tied to biological rhythms:

- **Daylight-Reactive Interface**:
  - **Dawn / Morning**: Warm golden amber highlights (`#F59E0B`) signaling gentle awakening and metabolic ignition.
  - **Solar Zenith**: Bright, high-clarity daylight cyan and emerald accents signaling peak physical and cognitive output.
  - **Dusk / Twilight**: Deep obsidian dark mode (`#0B0F19`) with soft violet accents (`#8B5CF6`) promoting melatonin synthesis and nervous system relaxation.
- **Translucent Depth & Organic Flow**:
  - Soft frosted glass cards (`backdrop-blur-lg`) with organic radial gradients that mimic natural cellular structures and fluid energy states.
  - Dynamic Dosha Balance Radar: An interactive 3-axis visualizer showing real-time equilibrium between Vata, Pitta, and Kapha.
