# 3D Agentic Workflow Structure & Pipeline Generator
## Interactive 3D Representation of the 6-Layer Intelligence Flow Engine

---

### Overview

This standalone directory contains the **3D Web Element Generator** that visualizes Vishal Singh's proprietary **6-Layer Agentic Workflow Structure** in an interactive, real-time 3D Three.js environment.

It represents the exact software architecture powering products like **AstroDash**, **WatchMatch**, and **ShaktiVibe**, mapping abstract pipeline mechanics into interactive physical geometries.

---

### The 6-Layer Agentic Architecture Visualized

Each layer of the stack is modeled as an interactive 3D tier with custom geometry, satellite nodes, glow rings, and dynamic data pulse streams:

| Tier | Layer Name | File & System Role | 3D Visualization Mechanic |
| :---: | :--- | :--- | :--- |
| **Layer 1** | **The Reception Layer** | `app.py` / FastAPI Gateway: Handles schema validation, token auth, routing, and async queueing. | Hexagonal intake port with incoming payload particle streams. |
| **Layer 2** | **The Agent Layer** | `agent.py` / Agent Router: Core dynamic dispatcher toggling between cloud (Gemini) and local (Ollama). | Spinning geodesic core with spoke node crystals and dynamic model routing. |
| **Layer 3** | **The Prompt Layer** | `prompt_engine.py` / Schema & Skill Engine: Injects domain constraints, Pydantic target contracts, and progressive disclosure skills. | Floating concentric code discs with constraint lattice. |
| **Layer 4** | **The RAG Layer** | `rag_service.py` / Hybrid Retrieval: Dense FAISS vector search + sparse BM25 + Cross-Encoder re-ranking. | High-dimensional point cloud with query vector intersection beams. |
| **Layer 5** | **The Memory Layer** | `memory_store.py` / State & Chaining: Edge SQLite/Postgres storage preserving session state and cross-view continuity. | Dual helical memory cylinder with persistent state rings. |
| **Layer 6** | **Consistency & Auditor** | `consistency.py` / Evaluator-Optimizer: Fast-path JSON audit, contradiction prevention, and self-healing retry loop. | Prismatic auditor shield with feedback reflection arcs back to Layer 2. |

---

### Key Interactive Features

1. **Real-Time 3D Camera Controls**: Orbit, pan, and zoom across all 6 tiers with smooth cinematic dampening via `OrbitControls`.
2. **Layer Inspection Mode**: Clicking on any layer or satellite node focuses the camera and displays its live code snippet, schema contract, and telemetry description in the side drawer.
3. **Pipeline Simulation Runner**: Click **"Run Pipeline Simulation"** to trigger a real-time glowing photon packet traveling step-by-step from Layer 1 through Layer 6, showing latency logs at each hop.
4. **Interactive Telemetry & Code Drawer**: Displays real Python/TypeScript implementations for each layer's engine logic.

---

### How to Run

#### Option 1: One-Click Instant Launcher (Windows)
Double-click [`run.bat`](./run.bat). It will automatically launch the local Vite development server and open `http://localhost:5173` in your default browser.

#### Option 2: Direct Production Build (Zero Install)
You can directly open the pre-compiled, self-contained build in any modern browser without installing Node.js:
- Open [`futuristic-3d-representation-d/dist/index.html`](./futuristic-3d-representation-d/dist/index.html) in Chrome, Edge, or Firefox.

#### Option 3: Manual CLI Launch
```powershell
cd futuristic-3d-representation-d
npm install   # If node_modules not yet present
npm run dev
```
Open `http://localhost:5173`.
