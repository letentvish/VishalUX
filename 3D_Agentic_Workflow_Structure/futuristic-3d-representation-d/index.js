import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Layer definitions & metadata (astrology generalized to standard AI engine)
const layerData = [
  {
    index: 0,
    name: "The Reception Layer",
    file: "main.py",
    role: "The Entry Point (API)",
    analogy: "The 'Inbox' of the brain",
    desc: "Receives external client requests via FastAPI. Handles Pydantic input schemas validation, initializes routing to the core router, and dispatches responses back to the client.",
    color: 0x00ffcc,
    hexColor: "#00ffcc",
    code: `from fastapi import FastAPI, Depends, HTTPException
from schemas import PipelineRequest, PipelineResponse
from agent import CoreAIAgent

app = FastAPI(title="Intelligence Pipeline API")

@app.post("/analyze", response_model=PipelineResponse)
async def analyze_request(request: PipelineRequest):
    try:
        agent = CoreAIAgent()
        result = await agent.process(
            query=request.query,
            user_context=request.context,
            mode=request.engine_mode
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`,
    schema: `{
  "http_transaction": {
    "endpoint": "POST /analyze",
    "status_code": 200,
    "latency_ms": 1420,
    "request": {
      "query": "Analyze system metrics and generate actionable scaling strategy.",
      "engine_mode": "cloud",
      "context": { "user_id": "usr_7721", "region": "US-West" }
    },
    "response": {
      "summary": "System metrics stabilized under current loading.",
      "critical_phases": [
        {
          "phase": "Traffic Rebalance",
          "timeframe": "10 minutes",
          "steps": ["Trigger Cloud DNS update", "Drain connection pools"]
        }
      ],
      "actionable_strategy": [
        "Allocate 2 spare worker instances to US-East region."
      ]
    }
  }
}`
  },
  {
    index: 1,
    name: "The Agent Layer",
    file: "agent.py",
    role: "The Intelligence Router",
    analogy: "The heart/decider of the engine",
    desc: "The central brain. Evaluates environment configurations (AI_ENGINE_MODE) to dynamically route model inference to either Cloud LLMs (Gemini API) or Local LLMs (via Ollama API).",
    color: 0x00aaff,
    hexColor: "#00aaff",
    code: `import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.llms import Ollama
from tools import run_rag_search
from memory import load_session_history

class CoreAIAgent:
    def __init__(self):
        self.mode = os.getenv("AI_ENGINE_MODE", "cloud")
        
    def _get_llm(self, request_mode=None):
        mode = request_mode or self.mode
        if mode == "cloud":
            return ChatGoogleGenerativeAI(model="gemini-2.5-pro")
        else:
            return Ollama(model="llama3:8b", base_url="http://localhost:11434")

    async def process(self, query, user_context, mode=None):
        llm = self._get_llm(mode)
        # Coordinates execution: RAG -> Memory -> Prompt -> LLM -> Consistency
        return await self.execute_pipeline(llm, query, user_context)`,
    schema: `{
  "agent_config": {
    "default_engine_mode": "cloud",
    "supported_models": {
      "cloud": "gemini-2.5-pro",
      "local": "ollama/llama3:8b"
    },
    "temperature": 0.2,
    "max_retries": 3
  }
}`
  },
  {
    index: 2,
    name: "The Prompt Layer",
    file: "prompts/",
    role: "The Instruction Manuals",
    analogy: "The instruction templates library",
    desc: "Houses highly optimized templates for specialized insights (Summary, Sequence, Actionable Strategy). Programmatically builds the payload, injects contexts, and formats strict output rules.",
    color: 0x9d4edd,
    hexColor: "#9d4edd",
    code: `# prompts/planner_prompt.py
PLANNER_PROMPT_TEMPLATE = """
System: You are Core Planning Logic.
Review metrics and compile an action plan.

[CONTEXT]
User Context: {user_context}
Historical Trend: {previous_insights}

[DOMAIN KNOWLEDGE & WEB STATS]
Database Context: {kb_rules}
Web Context: {web_search}

[SESSION HISTORY]
Last Interactions: {history}

User Query: {query}

Generate response in valid JSON matching UI schema.
"""`,
    schema: `{
  "prompt_variables": [
    "user_context",
    "previous_insights",
    "kb_rules",
    "web_search",
    "history",
    "query"
  ],
  "expected_output_format": "JSON",
  "system_instructions_active": true
}`
  },
  {
    index: 3,
    name: "The RAG Layer",
    file: "tools.py & knowledge_base/",
    role: "The Professional Library",
    analogy: "Knowledge & Web search utility",
    desc: "Retrieval Augmented Generation. Before prompting the LLM, queries a local database (SQLite) for domain facts and fetches live environment updates via external web search (Tavily).",
    color: 0x10b981,
    hexColor: "#10b981",
    code: `import sqlite3
from tavily import TavilyClient

tavily = TavilyClient(api_key="tvly-...")

def run_rag_search(query: str):
    # 1. Query local sqlite database for domain rules
    conn = sqlite3.connect("astrodash.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT content FROM knowledge WHERE content LIKE ?", 
        (f"%{query}%",)
    )
    db_results = [r[0] for r in cursor.fetchall()[:2]]
    
    # 2. Run real-time web search for current parameters
    web_results = tavily.search(
        query=f"current metrics {query}", 
        search_depth="advanced"
    )
    
    return {
        "local_kb": db_results,
        "live_web": web_results.get("results", [])
    }`,
    schema: `{
  "rag_retrieved_context": {
    "local_knowledge_base": [
      "Rule #104: Scaling thresholds triggers at 85% cpu load.",
      "Rule #209: Rebalancing node allocations takes ~120s."
    ],
    "web_search_results": [
      {
        "title": "Cloud Status Monitor",
        "url": "https://status.cloud.io/metrics",
        "latency": "42ms"
      }
    ]
  }
}`
  },
  {
    index: 4,
    name: "The Memory Layer",
    file: "memory.py",
    role: "Short-Term Context",
    analogy: "The conversation RAM",
    desc: "Maintains session continuity. Tracks recent request-response context. Pulls the conversation history for the current thread to support multi-turn instructions and follow-ups.",
    color: 0xf59e0b,
    hexColor: "#f59e0b",
    code: `import sqlite3
import json

class SessionMemory:
    def __init__(self, db_path="astrodash.db"):
        self.db_path = db_path
        
    def get_context(self, session_id: str, limit=5):
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute(
            "SELECT role, content FROM chat_history "
            "WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?", 
            (session_id, limit)
        )
        history = [{"role": r[0], "content": r[1]} for r in c.fetchall()]
        return list(reversed(history))

    def add_message(self, session_id: str, role: str, content: str):
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute(
            "INSERT INTO chat_history (session_id, role, content) "
            "VALUES (?, ?, ?)", (session_id, role, content)
        )
        conn.commit()`,
    schema: `{
  "history": [
    { "role": "user", "content": "How do I balance load between regions?" },
    { "role": "assistant", "content": "Set up latency-based DNS routing rules." }
  ],
  "session_id": "sess_9824_abc",
  "max_history_tokens": 2048
}`
  },
  {
    index: 5,
    name: "The Consistency Logic",
    file: "analyze.py",
    role: "Narrative Continuity",
    analogy: "Sanity filter & UI alignment",
    desc: "Post-processing pipeline. Injects output data of previous execution runs into new prompts, sanitizes the model output to strictly fit UI schemas, and prevents logical contradictions between successive steps.",
    color: 0xec4899,
    hexColor: "#ec4899",
    code: `import json

def apply_consistency_filter(raw_output: str, previous_run_data: dict):
    # 1. Clean JSON formatting anomalies
    cleaned_json = raw_output.replace("\`\`\`json", "").replace("\`\`\`", "").strip()
    data = json.loads(cleaned_json)
    
    # 2. Check narrative logic against previous trends
    if previous_run_data:
        last_load = previous_run_data.get("metrics", {}).get("load_index", 0.5)
        current_load = data.get("metrics", {}).get("load_index", 0.5)
        # Ensure smooth transitions between consecutive states
        if abs(current_load - last_load) > 0.4:
            data["anomaly_flag"] = True
            data["reconciled_notes"] = "High load variance detected between states."
            
    return data`,
    schema: `{
  "filtered_response": {
    "summary": "System metrics stabilized under current loading.",
    "critical_phases": [
      {
        "phase": "Traffic Rebalance",
        "timeframe": "10 minutes",
        "steps": ["Trigger Cloud DNS update", "Drain connection pools"]
      }
    ],
    "actionable_strategy": [
      "Allocate 2 spare worker instances to US-East region."
    ],
    "anomaly_flag": false,
    "reconciled_notes": "Narrative aligned with previous load states."
  }
}`
  }
];

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-11, 4, 13);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('root') ?? document.body;
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// Post-processing setup
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight), 0.55, 0.4, 0.8);
bloomPass.threshold = 0.45;
bloomPass.strength = 0.5;
bloomPass.radius = 0.42;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Texture loader & canvas texture utilities
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(0, 212, 255, 0.4)');
  grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}
const glowTexture = createGlowTexture();

// Background canvas gradient
const bgCanvas = document.createElement('canvas');
bgCanvas.width = 512;
bgCanvas.height = 512;
const bgCtx = bgCanvas.getContext('2d');
const grad = bgCtx.createRadialGradient(256, 256, 50, 256, 256, 350);
grad.addColorStop(0, '#040b17');
grad.addColorStop(0.6, '#01050e');
grad.addColorStop(1, '#000205');
bgCtx.fillStyle = grad;
bgCtx.fillRect(0, 0, 512, 512);
scene.background = new THREE.CanvasTexture(bgCanvas);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.05;
controls.minDistance = 6;
controls.maxDistance = 25;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;
controls.target.set(0, 0.7, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0x0e1b30, 1.4);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(5, 12, 8);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(1024, 1024);
mainLight.shadow.bias = -0.001;
scene.add(mainLight);

const accentLight1 = new THREE.PointLight(0x00d4ff, 3.0, 20);
accentLight1.position.set(-6, 3, 4);
scene.add(accentLight1);

const accentLight2 = new THREE.PointLight(0x9d4edd, 2.5, 20);
accentLight2.position.set(6, 0, -4);
scene.add(accentLight2);

// Holo platform materials generator
function createHoloMaterial(color, opacity = 0.35) {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: opacity,
    emissive: color,
    emissiveIntensity: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    side: THREE.DoubleSide,
  });
}

// Glowing rings
function createGlowRingMesh(radius, color, y = 0) {
  const ringGeo = new THREE.TorusGeometry(radius, 0.015, 8, 96);
  const ringMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.25 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = y;
  return ring;
}

// Unique structures generator for each layer (Upgraded/Beautified mechanics)
function createLayerStructure(idx, color) {
  const group = new THREE.Group();
  
  // 1. Mechanical Holographic Base Bracket (Visual upgrade from raw disks)
  const baseRingGeo = new THREE.TorusGeometry(1.25, 0.02, 8, 64);
  const baseRingMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 });
  const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.02;
  group.add(baseRing);
  
  // 3 mechanical slanted bracket legs
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const legGeo = new THREE.BoxGeometry(0.08, 0.28, 0.32);
    const legMat = createHoloMaterial(color, 0.6);
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(Math.cos(angle) * 0.88, 0.14, Math.sin(angle) * 0.88);
    leg.rotation.y = -angle;
    leg.rotation.x = 0.25; // slanted inwards
    group.add(leg);
  }
  
  // Inner glowing power core disk
  const coreDiskGeo = new THREE.CylinderGeometry(0.68, 0.73, 0.06, 32);
  const coreDiskMat = new THREE.MeshPhysicalMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.5,
    metalness: 0.9,
    roughness: 0.1
  });
  const coreDisk = new THREE.Mesh(coreDiskGeo, coreDiskMat);
  coreDisk.position.y = 0.06;
  group.add(coreDisk);

  // 2. Custom Layer Visual Structures
  if (idx === 0) {
    // Reception: Upgraded Gateway/Portal structure
    const gatewayGroup = new THREE.Group();
    gatewayGroup.name = 'gateway';
    
    const pillarGeo = new THREE.BoxGeometry(0.1, 1.1, 0.1);
    const pillarMat = createHoloMaterial(color, 0.7);
    
    // Outer pillars
    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-0.85, 0.55, 0);
    const rightPillar = leftPillar.clone();
    rightPillar.position.x = 0.85;
    gatewayGroup.add(leftPillar);
    gatewayGroup.add(rightPillar);
    
    const topBeamGeo = new THREE.BoxGeometry(1.8, 0.08, 0.1);
    const topBeam = new THREE.Mesh(topBeamGeo, pillarMat);
    topBeam.position.set(0, 1.1, 0);
    gatewayGroup.add(topBeam);

    // Inner archway (nested design)
    const innerPillarGeo = new THREE.BoxGeometry(0.06, 0.78, 0.06);
    const leftInner = new THREE.Mesh(innerPillarGeo, pillarMat);
    leftInner.position.set(-0.58, 0.39, 0);
    const rightInner = leftInner.clone();
    rightInner.position.x = 0.58;
    gatewayGroup.add(leftInner);
    gatewayGroup.add(rightInner);
    
    const innerTopGeo = new THREE.BoxGeometry(1.22, 0.06, 0.06);
    const innerTop = new THREE.Mesh(innerTopGeo, pillarMat);
    innerTop.position.set(0, 0.78, 0);
    gatewayGroup.add(innerTop);
    
    // Pulsing Core receptor sphere
    const coreGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = 'receptor_core';
    core.position.set(0, 0.48, 0);
    gatewayGroup.add(core);
    
    group.add(gatewayGroup);
  }
  else if (idx === 1) {
    // Agent Router: Spinning geodesic core with spoke node crystals
    const routerGroup = new THREE.Group();
    routerGroup.name = 'router';
    
    // Spin core (wireframe outline shell + faceted core)
    const coreGeo = new THREE.IcosahedronGeometry(0.28, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({ color: color, emissive: color, emissiveIntensity: 0.8, metalness: 0.9, roughness: 0.1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = 'router_core';
    core.position.y = 0.58;
    routerGroup.add(core);

    const shellGeo = new THREE.IcosahedronGeometry(0.4, 1);
    const shellMat = new THREE.MeshBasicMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.35 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.name = 'router_shell';
    shell.position.y = 0.58;
    routerGroup.add(shell);
    
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const spokeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8);
      const spokeMat = createHoloMaterial(color, 0.65);
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.position.set(Math.cos(angle) * 0.32, 0.58, Math.sin(angle) * 0.32);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = -angle;
      routerGroup.add(spoke);
      
      const nodeGeo = new THREE.OctahedronGeometry(0.1, 0);
      const nodeMat = new THREE.MeshPhysicalMaterial({ color: color, emissive: color, emissiveIntensity: 0.7, metalness: 0.8, roughness: 0.2 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.name = `router_node_${i}`;
      node.position.set(Math.cos(angle) * 0.68, 0.58, Math.sin(angle) * 0.68);
      routerGroup.add(node);
    }
    
    group.add(routerGroup);
  }
  else if (idx === 2) {
    // Prompt: document plates with outline frames
    const promptGroup = new THREE.Group();
    promptGroup.name = 'prompt';
    
    const plateGeo = new THREE.BoxGeometry(0.72, 0.015, 1.1);
    const plateMat = createHoloMaterial(color, 0.55);
    
    for (let i = 0; i < 3; i++) {
      const pSubGroup = new THREE.Group();
      pSubGroup.position.set(i * 0.15 - 0.15, 0.28 + i * 0.2, -i * 0.08 + 0.08);
      pSubGroup.rotation.set(0.12, 0.18, -0.08);
      
      const plate = new THREE.Mesh(plateGeo, plateMat);
      pSubGroup.add(plate);
      
      const edges = new THREE.EdgesGeometry(plateGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.7 });
      const edgeLines = new THREE.LineSegments(edges, edgeMat);
      pSubGroup.add(edgeLines);
      
      promptGroup.add(pSubGroup);
    }
    group.add(promptGroup);
  }
  else if (idx === 3) {
    // RAG: Server blade rack with blinking LEDs
    const ragGroup = new THREE.Group();
    ragGroup.name = 'rag';
    
    const frameGeo = new THREE.BoxGeometry(1.1, 0.9, 1.1);
    const frameMat = createHoloMaterial(color, 0.12);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 0.5;
    ragGroup.add(frame);
    
    const edges = new THREE.EdgesGeometry(frameGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.y = 0.5;
    ragGroup.add(wireframe);
    
    const bladeGeo = new THREE.BoxGeometry(0.85, 0.14, 0.98);
    const bladeMat = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.15
    });
    
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0, 0.18 + i * 0.25, 0);
      ragGroup.add(blade);
      
      // Blinking / Status LEDs
      const ledGeo = new THREE.SphereGeometry(0.028, 8, 8);
      const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const ledGreen = new THREE.Mesh(ledGeo, ledGreenMat);
      ledGreen.position.set(-0.25, 0.18 + i * 0.25, 0.5);
      ragGroup.add(ledGreen);
      
      const ledBlueMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
      const ledBlue = new THREE.Mesh(ledGeo, ledBlueMat);
      ledBlue.name = `led_blue_${i}`;
      ledBlue.position.set(0.25, 0.18 + i * 0.25, 0.5);
      ragGroup.add(ledBlue);
    }
    
    group.add(ragGroup);
  }
  else if (idx === 4) {
    // Memory: Glass bipyramid crystal with floating outline
    const memGroup = new THREE.Group();
    memGroup.name = 'memory';
    
    // Glass physical material
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: 0.35,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: color,
      emissiveIntensity: 0.35
    });
    
    const crystalGeo = new THREE.OctahedronGeometry(0.32, 0);
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.name = 'mem_crystal';
    crystal.position.y = 0.52;
    memGroup.add(crystal);
    
    const crystalEdges = new THREE.EdgesGeometry(crystalGeo);
    const crystalLineMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
    const crystalWire = new THREE.LineSegments(crystalEdges, crystalLineMat);
    crystalWire.name = 'mem_crystal_wire';
    crystalWire.position.y = 0.52;
    memGroup.add(crystalWire);

    // Memory block cells
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const blockGeo = new THREE.BoxGeometry(0.22, 0.12, 0.12);
      const blockMat = createHoloMaterial(color, 0.6);
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(Math.cos(angle) * 0.65, 0.52, Math.sin(angle) * 0.65);
      block.rotation.y = -angle;
      memGroup.add(block);
      
      const points = [new THREE.Vector3(0, 0.52, 0), new THREE.Vector3(Math.cos(angle) * 0.65, 0.52, Math.sin(angle) * 0.65)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.4 }));
      memGroup.add(line);
    }
    
    group.add(memGroup);
  }
  else if (idx === 5) {
    // Consistency: Concentric triple gyroscope rings
    const gyroGroup = new THREE.Group();
    gyroGroup.name = 'gyro';
    
    const ring1Geo = new THREE.TorusGeometry(0.7, 0.022, 8, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.85 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.name = 'gyro1';
    ring1.position.y = 0.52;
    gyroGroup.add(ring1);
    
    const ring2Geo = new THREE.TorusGeometry(0.53, 0.018, 8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.name = 'gyro2';
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.52;
    gyroGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(0.36, 0.014, 8, 64);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.9 });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.name = 'gyro3';
    ring3.rotation.y = Math.PI / 2;
    ring3.position.y = 0.52;
    gyroGroup.add(ring3);
    
    const coreGeo = new THREE.DodecahedronGeometry(0.16, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({ color: color, emissive: color, emissiveIntensity: 0.8, metalness: 0.95, roughness: 0.05 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.52;
    gyroGroup.add(core);
    
    group.add(gyroGroup);
  }

  return group;
}

// Tower Elements
const towerGroup = new THREE.Group();
scene.add(towerGroup);

const platforms = [];
const platformYCoords = [-2.5, -1.2, 0.1, 1.4, 2.7, 4.0];

// Create 6 Stacked Structures
layerData.forEach((layer, idx) => {
  const pGroup = new THREE.Group();
  pGroup.userData = { layerIndex: idx, layerInfo: layer };
  
  const y = platformYCoords[idx];
  pGroup.position.y = y;

  // Custom 3D structure
  const structure = createLayerStructure(idx, layer.color);
  structure.name = 'structure';
  pGroup.add(structure);

  // Glowing Outer ring
  const ring = createGlowRingMesh(1.6, layer.color, 0.04);
  ring.name = 'ring';
  pGroup.add(ring);

  towerGroup.add(pGroup);
  platforms.push(pGroup);
});

// Create Central Data Core Line (Vertical spine connecting platforms)
const spinePoints = [];
platformYCoords.forEach(y => spinePoints.push(new THREE.Vector3(0, y, 0)));
const spineGeo = new THREE.BufferGeometry().setFromPoints(spinePoints);
const spineMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.3 });
const spine = new THREE.Line(spineGeo, spineMat);
scene.add(spine);

// Visual Helix Spine Upgrade (DNA-like spirals of light passing through the tower)
const helixGroup = new THREE.Group();
const helixPoints1 = [];
const helixPoints2 = [];
const helixHeight = platformYCoords[5] - platformYCoords[0];
const numTurns = 3.2;
const numPoints = 120;
const helixRadius = 0.5;

for (let i = 0; i <= numPoints; i++) {
  const t = i / numPoints;
  const y = platformYCoords[0] + t * helixHeight;
  const angle = t * Math.PI * 2 * numTurns;
  
  helixPoints1.push(new THREE.Vector3(Math.cos(angle) * helixRadius, y, Math.sin(angle) * helixRadius));
  helixPoints2.push(new THREE.Vector3(Math.cos(angle + Math.PI) * helixRadius, y, Math.sin(angle + Math.PI) * helixRadius));
}

const helixCurve1 = new THREE.CatmullRomCurve3(helixPoints1);
const helixCurve2 = new THREE.CatmullRomCurve3(helixPoints2);

const helixGeo1 = new THREE.TubeGeometry(helixCurve1, 120, 0.012, 8, false);
const helixGeo2 = new THREE.TubeGeometry(helixCurve2, 120, 0.012, 8, false);

const helixMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.1 });
const helix1 = new THREE.Mesh(helixGeo1, helixMat);
const helix2 = new THREE.Mesh(helixGeo2, helixMat);

helixGroup.add(helix1);
helixGroup.add(helix2);
scene.add(helixGroup);

// Satellites
const satellites = [];

function createSatellite(name, parentLayerIdx, pos, color, iconType) {
  const satGroup = new THREE.Group();
  satGroup.position.set(pos[0], pos[1], pos[2]);
  satGroup.userData = { name, parentLayerIdx, isSatellite: true };

  // Base platform
  const baseGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.08, 32);
  const baseMat = createHoloMaterial(color, 0.5);
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.castShadow = true;
  satGroup.add(base);

  // Glow ring
  satGroup.add(createGlowRingMesh(0.52, color, 0.041));

  // Visual Core Mesh representation
  let coreMesh;
  if (iconType === 'database') {
    const dbStack = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const dbCylGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16);
      const dbCylMat = new THREE.MeshPhysicalMaterial({ color: color, emissive: color, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2 });
      const dbCyl = new THREE.Mesh(dbCylGeo, dbCylMat);
      dbCyl.position.y = 0.12 + i * 0.12;
      dbStack.add(dbCyl);
    }
    coreMesh = dbStack;
  } else if (iconType === 'search') {
    const searchGlobe = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    searchGlobe.add(new THREE.Mesh(sphereGeo, sphereMat));

    const ring1Geo = new THREE.TorusGeometry(0.22, 0.012, 6, 32);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: color });
    const r1 = new THREE.Mesh(ring1Geo, ring1Mat);
    r1.rotation.x = Math.PI / 3;
    searchGlobe.add(r1);

    const r2 = r1.clone();
    r2.rotation.y = Math.PI / 3;
    searchGlobe.add(r2);

    searchGlobe.position.y = 0.2;
    coreMesh = searchGlobe;
  } else if (iconType === 'memory') {
    const crystalGeo = new THREE.OctahedronGeometry(0.16, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({ color: color, emissive: color, emissiveIntensity: 0.65, metalness: 0.9, roughness: 0.1 });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = 0.22;
    coreMesh = crystal;
  }

  if (coreMesh) {
    coreMesh.name = 'core';
    satGroup.add(coreMesh);
  }

  // Connection Beam (line curve from tower node to satellite)
  const parentY = platformYCoords[parentLayerIdx];
  const startVec = new THREE.Vector3(0, parentY, 0);
  const endVec = new THREE.Vector3(pos[0], pos[1], pos[2]);
  
  // Bezier curve
  const midVec = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  midVec.y += 0.4;
  const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
  
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.006, 8, false);
  const tubeMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.18 });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  scene.add(tube);

  satGroup.userData.beamCurve = curve;
  scene.add(satGroup);
  satellites.push(satGroup);
  return satGroup;
}

// Connect satellites
const localKBSat = createSatellite('Vector DB (Local)', 3, [-3.5, 1.4, -1.2], 0x10b981, 'database');
const webSearchSat = createSatellite('Web Search API', 3, [3.5, 1.4, -1.2], 0x10b981, 'search');
const memorySat = createSatellite('Session Cache', 4, [3.5, 2.7, 1.2], 0xf59e0b, 'memory');

// Ambient Pipeline Data Flow Upgrade (Constant visual streams running when idle)
const ambientDataPackets = [];
satellites.forEach(sat => {
  const curve = sat.userData.beamCurve;
  // Create 2 ambient data packets per satellite path
  for (let k = 0; k < 2; k++) {
    const pMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    scene.add(pMesh);
    ambientDataPackets.push({
      mesh: pMesh,
      curve: curve,
      speed: 0.18 + Math.random() * 0.15,
      progress: Math.random(),
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }
});


// HTML Floating Labels Setup (Ensures 100% crisp text visibility)
const labelsContainer = document.getElementById('labels-container');
const labelDivs = [];

layerData.forEach((layer, idx) => {
  const div = document.createElement('div');
  div.className = 'floating-label';
  div.id = `label-layer-${idx}`;
  div.style.borderColor = layer.hexColor;
  div.style.setProperty('--accent', layer.hexColor);
  div.style.setProperty('--accent-glow', `rgba(${layer.color >> 16}, ${(layer.color >> 8) & 255}, ${layer.color & 255}, 0.3)`);
  
  div.innerHTML = `
    <span>${layer.name}</span>
    <small>📁 ${layer.file}</small>
  `;
  
  div.addEventListener('click', () => {
    selectLayer(idx);
  });
  
  labelsContainer.appendChild(div);
  labelDivs.push(div);
});

// Satellite 2D Labels
const satLabels = [
  { sat: localKBSat, name: "Vector DB (Local)", color: "#10b981" },
  { sat: webSearchSat, name: "Web Search API", color: "#10b981" },
  { sat: memorySat, name: "Session Cache", color: "#f59e0b" }
];
const satDivs = [];

satLabels.forEach((item) => {
  const div = document.createElement('div');
  div.className = 'floating-label';
  div.style.minWidth = '130px';
  div.style.borderColor = item.color;
  div.style.setProperty('--accent', item.color);
  div.style.setProperty('--accent-glow', `rgba(255,255,255,0.05)`);
  
  div.innerHTML = `
    <span>${item.name}</span>
    <small>Satellite Node</small>
  `;
  
  div.addEventListener('click', () => {
    selectLayer(item.sat.userData.parentLayerIdx);
  });
  
  labelsContainer.appendChild(div);
  satDivs.push({ div, sat: item.sat });
});


// Intersect / Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;
let activeSelectedLayer = 0; // Default active layer (Reception)

// Handle 3D elements selection
function selectLayer(idx, updateUIOnly = false) {
  if (idx < 0 || idx >= layerData.length) return;
  activeSelectedLayer = idx;

  // Scale and adjust properties on 3D meshes inside platforms
  platforms.forEach((plat, i) => {
    const isActive = (i === idx);
    
    // Scale active platform slightly to draw attention
    if (isActive) {
      plat.scale.set(1.08, 1.08, 1.08);
    } else {
      plat.scale.set(1.0, 1.0, 1.0);
    }
    
    plat.traverse(child => {
      if (child.isMesh) {
        if (child.material) {
          if (child.material.isPhysicalMaterial || child.material.isStandardMaterial) {
            child.material.opacity = isActive ? 0.75 : 0.35;
            child.material.emissiveIntensity = isActive ? 0.4 : 0.04;
          } else if (child.material.isBasicMaterial) {
            child.material.opacity = isActive ? 0.65 : 0.25;
          }
        }
      }
    });
  });

  // Focus orbit target slightly on selected layer height
  if (!updateUIOnly) {
    const targetY = platformYCoords[idx];
    const duration = 500;
    const startY = controls.target.y;
    const startTime = performance.now();
    
    function smoothCameraTarget() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      controls.target.y = startY + (targetY - startY) * ease;
      if (progress < 1) {
        requestAnimationFrame(smoothCameraTarget);
      }
    }
    smoothCameraTarget();
  }

  // Update HTML overlay active states
  labelDivs.forEach((div, i) => {
    if (i === idx) {
      div.classList.add('active');
    } else {
      div.classList.remove('active');
    }
  });

  // Update 2D Inspector elements
  const data = layerData[idx];
  document.getElementById('inspect-layer-badge').innerText = `LAYER ${data.index + 1}`;
  document.getElementById('inspect-layer-badge').style.borderColor = data.hexColor;
  document.getElementById('inspect-layer-badge').style.color = data.hexColor;
  document.getElementById('inspect-layer-name').innerText = data.name;
  document.getElementById('inspect-layer-file').innerText = data.file;
  document.getElementById('inspect-layer-role').innerText = data.role;
  document.getElementById('inspect-layer-analogy').innerText = data.analogy;
  document.getElementById('inspect-layer-desc').innerText = data.desc;

  // Update mock code & schema
  document.getElementById('inspect-code-block').innerHTML = `<code class="language-python">${escapeHtml(data.code)}</code>`;
  document.getElementById('inspect-schema-block').innerHTML = `<code class="language-json">${escapeHtml(data.schema)}</code>`;

  // Select tab in UI
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.getAttribute('data-layer')) === idx) {
      btn.classList.add('active');
    }
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 3D Canvas Events
container.addEventListener('mousemove', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  const validIntersects = intersects.filter(intersect => {
    return intersect.object.type === 'Mesh';
  });

  if (validIntersects.length > 0) {
    let target = validIntersects[0].object;
    let parentGroup = target;
    while (parentGroup && parentGroup.parent && !parentGroup.userData.hasOwnProperty('layerIndex') && !parentGroup.userData.hasOwnProperty('isSatellite')) {
      parentGroup = parentGroup.parent;
    }

    if (parentGroup && (parentGroup.userData.hasOwnProperty('layerIndex') || parentGroup.userData.hasOwnProperty('isSatellite'))) {
      if (hoveredObject !== parentGroup) {
        // Reset old hover
        if (hoveredObject && hoveredObject.userData.hasOwnProperty('layerIndex') && hoveredObject.userData.layerIndex !== activeSelectedLayer) {
          hoveredObject.traverse(child => {
            if (child.isMesh && child.material && (child.material.isPhysicalMaterial || child.material.isStandardMaterial)) {
              child.material.emissiveIntensity = 0.15;
            }
          });
        }

        hoveredObject = parentGroup;
        document.body.style.cursor = 'pointer';

        // Set hover emissive highlight
        if (hoveredObject.userData.hasOwnProperty('layerIndex')) {
          hoveredObject.traverse(child => {
            if (child.isMesh && child.material && (child.material.isPhysicalMaterial || child.material.isStandardMaterial)) {
              child.material.emissiveIntensity = 0.55;
            }
          });
        }
      }
      return;
    }
  }

  // Clear hover state
  if (hoveredObject) {
    if (hoveredObject.userData.hasOwnProperty('layerIndex')) {
      if (hoveredObject.userData.layerIndex !== activeSelectedLayer) {
        hoveredObject.traverse(child => {
          if (child.isMesh && child.material && (child.material.isPhysicalMaterial || child.material.isStandardMaterial)) {
            child.material.emissiveIntensity = 0.15;
          }
        });
      }
    }
    hoveredObject = null;
    document.body.style.cursor = 'default';
  }
});

container.addEventListener('click', () => {
  if (hoveredObject) {
    if (hoveredObject.userData.hasOwnProperty('layerIndex')) {
      selectLayer(hoveredObject.userData.layerIndex);
    } else if (hoveredObject.userData.hasOwnProperty('isSatellite')) {
      selectLayer(hoveredObject.userData.parentLayerIdx);
    }
  }
});


// Simulation Logic: Animated Particle Packet
let simulationRunning = false;
let simProgress = 0;
let simStepIndex = 0;
let simSpeedMultiplier = 1.0;

// Set up visual data packets
const dataPacketGroup = new THREE.Group();
dataPacketGroup.visible = false;
scene.add(dataPacketGroup);

const packetSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
dataPacketGroup.add(packetSphere);

const packetGlow = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  })
);
packetGlow.scale.set(0.6, 0.6, 1);
dataPacketGroup.add(packetGlow);

// Tail particles trail
const trailCount = 15;
const trailMeshes = [];
for (let i = 0; i < trailCount; i++) {
  const tailMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.08 * (1 - i/trailCount), 8, 8),
    new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.6 * (1 - i/trailCount)
    })
  );
  scene.add(tailMesh);
  tailMesh.visible = false;
  trailMeshes.push(tailMesh);
}

// Queue of positions for the packet's path
let activeSimulationPath = [];

function clearConsole() {
  const container = document.getElementById('console-logs');
  container.innerHTML = `<div class="console-line system">[SYSTEM] Console cleared. Standing by.</div>`;
}

function writeConsoleLog(text, type = 'info') {
  const container = document.getElementById('console-logs');
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  
  const div = document.createElement('div');
  div.className = `console-line ${type}`;
  div.innerText = `[${timeStr}] ${text}`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// Initialize dynamic path points for simulation
function buildSimulationPath() {
  const path = [];
  const L = (idx) => new THREE.Vector3(0, platformYCoords[idx], 0);

  // 1. Reception API entry to Agent router
  path.push({
    type: 'linear',
    start: L(0),
    end: L(1),
    duration: 1200,
    layer: 0,
    stateName: "RECEPT",
    logs: [
      "[RECEPTION] POST /analyze request received at endpoint.",
      "[RECEPTION] Verifying request content against schemas.py...",
      "[RECEPTION] Content verified. Forwarding payload to Agent Router."
    ]
  });

  // 2. Agent router to RAG layer
  path.push({
    type: 'linear',
    start: L(1),
    end: L(3),
    duration: 1000,
    layer: 1,
    stateName: "ROUTING",
    logs: [
      "[AGENT] Router invoked. Reading AI_ENGINE_MODE: [CLOUD].",
      "[AGENT] Instantiating ChatGoogleGenerativeAI (Gemini 2.5 Pro).",
      "[AGENT] Initiating context enrichment via Retrieval Augmented Generation (RAG)."
    ]
  });

  // 3. RAG to Local DB Satellite
  path.push({
    type: 'curve',
    curveObj: localKBSat.userData.beamCurve,
    reverse: false,
    duration: 1000,
    layer: 3,
    stateName: "DB_RETRIEVE",
    logs: [
      "[RAG] Running local knowledge base semantic lookup...",
      "[RAG] Vector DB: Scanning astrodash.db metadata table..."
    ]
  });
  
  // 4. Local DB Satellite back to RAG
  path.push({
    type: 'curve',
    curveObj: localKBSat.userData.beamCurve,
    reverse: true,
    duration: 800,
    layer: 3,
    stateName: "DB_RETURN",
    logs: [
      "[RAG] Database: Retrieved 2 matching domain constraints & rule embeddings."
    ]
  });

  // 5. RAG to Web Search Satellite
  path.push({
    type: 'curve',
    curveObj: webSearchSat.userData.beamCurve,
    reverse: false,
    duration: 1200,
    layer: 3,
    stateName: "WEB_RETRIEVE",
    logs: [
      "[RAG] Executing real-time web query via Tavily Search client...",
      "[RAG] Tavily API: Querying 'current system load performance parameters'..."
    ]
  });

  // 6. Web Search Satellite back to RAG
  path.push({
    type: 'curve',
    curveObj: webSearchSat.userData.beamCurve,
    reverse: true,
    duration: 800,
    layer: 3,
    stateName: "WEB_RETURN",
    logs: [
      "[RAG] Tavily Search complete. Appending search context (42ms latency, healthy)."
    ]
  });

  // 7. RAG to Memory Layer
  path.push({
    type: 'linear',
    start: L(3),
    end: L(4),
    duration: 1000,
    layer: 4,
    stateName: "MEM_FETCH",
    logs: [
      "[MEMORY] Loading short term conversation history..."
    ]
  });

  // 8. Memory to Cache Satellite
  path.push({
    type: 'curve',
    curveObj: memorySat.userData.beamCurve,
    reverse: false,
    duration: 900,
    layer: 4,
    stateName: "CACHE_RETRIEVE",
    logs: [
      "[MEMORY] Querying thread session chat log cache..."
    ]
  });

  // 9. Cache Satellite back to Memory
  path.push({
    type: 'curve',
    curveObj: memorySat.userData.beamCurve,
    reverse: true,
    duration: 700,
    layer: 4,
    stateName: "CACHE_RETURN",
    logs: [
      "[MEMORY] Retrieved last 2 conversation turns. History context size: 412 tokens."
    ]
  });

  // 10. Memory to Prompt compiler
  path.push({
    type: 'linear',
    start: L(4),
    end: L(2),
    duration: 1100,
    layer: 2,
    stateName: "PROMPT_BUILD",
    logs: [
      "[PROMPT] Template selected: planner_prompt.py.",
      "[PROMPT] Constructing prompt string: compiling user request + vector db rules + web search results + conversation history.",
      "[PROMPT] Compiling strict JSON response schemas and formatting instructions."
    ]
  });

  // 11. Prompt compiler back to Agent router (LLM evaluation)
  path.push({
    type: 'linear',
    start: L(2),
    end: L(1),
    duration: 1500,
    layer: 1,
    stateName: "LLM_INFERENCE",
    logs: [
      "[AGENT] Payload assembled: 8,432 prompt tokens. Despatching payload to LLM model...",
      "[AGENT] Model inference running... (Awaiting response payload)"
    ]
  });

  // 12. Model Inference completion glow (local delay at L2)
  path.push({
    type: 'linear',
    start: L(1),
    end: L(1),
    duration: 1200,
    layer: 1,
    stateName: "LLM_RESPONSE",
    logs: [
      "[AGENT] LLM response received successfully. Processed in 1.4 seconds.",
      "[AGENT] Parsing raw payload into valid JSON structures."
    ]
  });

  // 13. Agent router to Consistency Logic
  path.push({
    type: 'linear',
    start: L(1),
    end: L(5),
    duration: 1100,
    layer: 5,
    stateName: "CONSISTENCY",
    logs: [
      "[CONSISTENCY] Post-processing system active. Intercepting model response.",
      "[CONSISTENCY] Evaluating output coherence against last baseline metrics run...",
      "[CONSISTENCY] Integrity checks passed. 0 anomalies detected. Injecting validation flag."
    ]
  });

  // 14. Consistency Logic down to Reception API for final response
  path.push({
    type: 'linear',
    start: L(5),
    end: L(0),
    duration: 1300,
    layer: 0,
    stateName: "COMPLETE",
    logs: [
      "[RECEPTION] Serializing response message against schemas.py:AnalysisResponse.",
      "[RECEPTION] Dispatched final HTTP 200 output payload (JSON format).",
      "[SYSTEM] Request flow pipeline processing completed successfully."
    ]
  });

  return path;
}

function runSimulation() {
  if (simulationRunning) return;
  
  simulationRunning = true;
  simProgress = 0;
  simStepIndex = 0;
  activeSimulationPath = buildSimulationPath();
  
  // Set UI state to Processing
  const statusBadge = document.getElementById('engine-status');
  statusBadge.innerText = 'PROCESSING';
  statusBadge.className = 'status-value processing';
  
  const runBtn = document.getElementById('run-simulation');
  runBtn.classList.add('running');
  runBtn.innerHTML = `<span class="btn-icon">⏳</span> Pipeline Executing...`;

  clearConsole();
  writeConsoleLog(`[SYSTEM] Starting simulation pipeline flow...`, 'system');

  // Activate packet visibility
  dataPacketGroup.visible = true;
  trailMeshes.forEach(mesh => {
    mesh.visible = true;
    mesh.position.copy(platformYCoords[0]);
  });

  selectLayer(0);
}

// UI bindings & Event listeners
document.getElementById('run-simulation').addEventListener('click', runSimulation);

document.getElementById('clear-console').addEventListener('click', clearConsole);

// Speed control
const speedSlider = document.getElementById('sim-speed');
const speedLabel = document.getElementById('speed-label');
speedSlider.addEventListener('input', (e) => {
  simSpeedMultiplier = parseFloat(e.target.value);
  speedLabel.innerText = `${simSpeedMultiplier.toFixed(1)}x`;
});

// Segmented control engine mode
const engineModeRadios = document.querySelectorAll('input[name="engine_mode"]');
engineModeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    writeConsoleLog(`[SYSTEM] Config: AI_ENGINE_MODE updated to [${e.target.value.toUpperCase()}].`, 'system');
  });
});

// Prompt select trigger
document.getElementById('prompt-template').addEventListener('change', (e) => {
  const template = e.target.value;
  writeConsoleLog(`[SYSTEM] Config: Prompt layer mapped to [${template.toUpperCase()}_PROMPT_TEMPLATE].`, 'system');
});

// Suggestion buttons
const suggestBtns = document.querySelectorAll('.suggest-btn');
const queryTextarea = document.getElementById('user-query');
suggestBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    queryTextarea.value = btn.getAttribute('data-query');
    const templateSelect = document.getElementById('prompt-template');
    if (btn.innerText === 'Summary') templateSelect.value = 'summary';
    else if (btn.innerText === 'Sequence') templateSelect.value = 'sequence';
    else if (btn.innerText === 'Strategy') templateSelect.value = 'strategy';
  });
});

// Inspector Layer Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.getAttribute('data-layer'));
    selectLayer(idx);
  });
});

// Code vs Schema Toggle
const viewerTabs = document.getElementById('viewer-tabs');
const codeBlock = document.getElementById('inspect-code-block');
const schemaBlock = document.getElementById('inspect-schema-block');

viewerTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('viewer-tab')) {
    const tabs = viewerTabs.querySelectorAll('.viewer-tab');
    tabs.forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    
    const view = e.target.getAttribute('data-view');
    if (view === 'code') {
      codeBlock.classList.remove('hidden');
      schemaBlock.classList.add('hidden');
    } else {
      codeBlock.classList.add('hidden');
      schemaBlock.classList.remove('hidden');
    }
  }
});

// Canvas control buttons
const resetCamBtn = document.getElementById('reset-cam-btn');
resetCamBtn.addEventListener('click', () => {
  camera.position.set(-11, 4, 13);
  controls.target.set(0, 0.7, 0);
  controls.update();
  writeConsoleLog(`[SYSTEM] Camera viewpoint reset.`, 'system');
});

const autoRotateBtn = document.getElementById('auto-rotate-btn');
autoRotateBtn.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  if (controls.autoRotate) {
    autoRotateBtn.classList.add('active');
    autoRotateBtn.innerText = '🔄 Auto-Rotate: ON';
  } else {
    autoRotateBtn.classList.remove('active');
    autoRotateBtn.innerText = '🔄 Auto-Rotate: OFF';
  }
});

// Set up default view
selectLayer(0, true);

// Animation Clock
const clock = new THREE.Clock();
const packetHistory = [];

function animate() {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  controls.update();

  // Slowly rotate satellites around their axis
  satellites.forEach((sat, i) => {
    const core = sat.getObjectByName('core');
    if (core) {
      core.rotation.y = elapsed * 0.7 + i;
    }
    sat.position.y = (sat.userData.parentLayerIdx === 3 ? 1.4 : 2.7) + Math.sin(elapsed * 1.5 + i) * 0.08;
  });

  // Animate Helix Spine (Spins double helix light effect vertically)
  helixGroup.rotation.y = elapsed * 0.8;

  // Constant Ambient Data Packets flowing along satellite connection beams
  ambientDataPackets.forEach(p => {
    p.progress += delta * p.speed;
    if (p.progress > 1.0) {
      p.progress = 0;
    }
    const t = p.direction === 1 ? p.progress : 1.0 - p.progress;
    const pos = p.curve.getPoint(t);
    p.mesh.position.copy(pos);
  });

  // Rotational Animators for Layer Custom visual shapes
  
  // Layer 0: Reception API Core Pulse
  const receptorCore = platforms[0].getObjectByName('receptor_core');
  if (receptorCore) {
    receptorCore.scale.setScalar(1.0 + Math.sin(elapsed * 4.0) * 0.06);
  }
  
  // Layer 1: Agent Router Core & Wireframe Shell (Counter-rotates)
  const routerCore = platforms[1].getObjectByName('router_core');
  const routerShell = platforms[1].getObjectByName('router_shell');
  if (routerCore) {
    routerCore.rotation.y = elapsed * 1.2;
    routerCore.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
  }
  if (routerShell) {
    routerShell.rotation.y = -elapsed * 0.8;
  }
  
  // Spoke nodes floating
  for (let i = 0; i < 5; i++) {
    const node = platforms[1].getObjectByName(`router_node_${i}`);
    if (node) {
      node.position.y = 0.58 + Math.sin(elapsed * 3.0 + i) * 0.05;
    }
  }

  // Layer 2: Prompt Plates stack float
  const promptStack = platforms[2].getObjectByName('prompt');
  if (promptStack) {
    promptStack.position.y = Math.sin(elapsed * 1.5) * 0.04;
  }

  // Layer 3: RAG server blade LED indicators blinking
  for (let i = 0; i < 3; i++) {
    const ledBlue = platforms[3].getObjectByName(`led_blue_${i}`);
    if (ledBlue) {
      ledBlue.material.opacity = Math.sin(elapsed * 6.0 + i * 2.0) > 0 ? 0.95 : 0.15;
    }
  }

  // Layer 4: Memory glass crystal spins
  const memCrystal = platforms[4].getObjectByName('mem_crystal');
  const memCrystalWire = platforms[4].getObjectByName('mem_crystal_wire');
  if (memCrystal) {
    memCrystal.rotation.y = elapsed * 0.8;
  }
  if (memCrystalWire) {
    memCrystalWire.rotation.y = elapsed * 0.8;
  }

  // Layer 5: Consistency Concentric rings spin
  const gyro1 = platforms[5].getObjectByName('gyro1');
  const gyro2 = platforms[5].getObjectByName('gyro2');
  const gyro3 = platforms[5].getObjectByName('gyro3');
  if (gyro1) gyro1.rotation.y = elapsed * 1.4;
  if (gyro2) gyro2.rotation.x = -elapsed * 1.0;
  if (gyro3) gyro3.rotation.z = elapsed * 1.8;

  // Pulsing background lights
  accentLight1.intensity = 3.0 + Math.sin(elapsed * 1.2) * 0.4;
  accentLight2.intensity = 2.5 + Math.cos(elapsed * 1.0) * 0.3;

  // Project 3D Platform Coordinates to HTML 2D Overlay Labels (Offset in screen space to clear structures)
  const tempV = new THREE.Vector3();
  platforms.forEach((plat, idx) => {
    const div = labelDivs[idx];
    if (div) {
      tempV.setFromMatrixPosition(plat.matrixWorld);
      tempV.project(camera);
      
      if (tempV.z > 1) {
        div.style.display = 'none';
      } else {
        div.style.display = 'flex';
        const w = container.clientWidth;
        const h = container.clientHeight;
        const baseX = (tempV.x * 0.5 + 0.5) * w;
        const baseY = (-tempV.y * 0.5 + 0.5) * h;
        
        // Offset all platform labels to the right of the center tower
        const x = baseX + 180;
        const y = baseY;
        
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
      }
      
      if (idx === activeSelectedLayer) {
        div.classList.add('active');
      } else {
        div.classList.remove('active');
      }
    }
  });

  // Project Satellite Coordinates to HTML 2D Labels (Offset in screen space to clear structures)
  satDivs.forEach(item => {
    tempV.setFromMatrixPosition(item.sat.matrixWorld);
    tempV.project(camera);
    
    if (tempV.z > 1) {
      item.div.style.display = 'none';
    } else {
      item.div.style.display = 'flex';
      const w = container.clientWidth;
      const h = container.clientHeight;
      const baseX = (tempV.x * 0.5 + 0.5) * w;
      const baseY = (-tempV.y * 0.5 + 0.5) * h;
      
      // Offset all satellite labels to the left of their nodes to separate them from platform labels
      const x = baseX - 160;
      const y = baseY;
      
      item.div.style.left = `${x}px`;
      item.div.style.top = `${y}px`;
    }
  });

  // Active Simulation Code
  if (simulationRunning && activeSimulationPath.length > 0) {
    const step = activeSimulationPath[simStepIndex];
    const stepDuration = step.duration / simSpeedMultiplier;
    simProgress += (delta * 1000) / stepDuration;

    let currentPos = new THREE.Vector3();

    if (step.type === 'linear') {
      currentPos.lerpVectors(step.start, step.end, Math.min(simProgress, 1.0));
    } else if (step.type === 'curve') {
      const curveT = step.reverse ? 1.0 - Math.min(simProgress, 1.0) : Math.min(simProgress, 1.0);
      currentPos = step.curveObj.getPoint(curveT);
    }

    dataPacketGroup.position.copy(currentPos);

    const layerColorObj = new THREE.Color(layerData[step.layer].color);
    packetGlow.material.color.copy(layerColorObj);

    packetHistory.unshift(currentPos.clone());
    if (packetHistory.length > trailCount * 3) {
      packetHistory.pop();
    }

    trailMeshes.forEach((mesh, index) => {
      const historyIndex = Math.min(index * 2, packetHistory.length - 1);
      if (packetHistory[historyIndex]) {
        mesh.position.copy(packetHistory[historyIndex]);
        mesh.material.color.copy(layerColorObj);
      }
    });

    if (step.logs && step.logs.length > 0) {
      const logTriggerFraction = 1.0 / (step.logs.length + 1);
      const logExecutedCount = step.logsExecuted || 0;
      
      if (simProgress >= (logExecutedCount + 1) * logTriggerFraction && logExecutedCount < step.logs.length) {
        writeConsoleLog(step.logs[logExecutedCount], 'highlight');
        step.logsExecuted = logExecutedCount + 1;
        
        if (activeSelectedLayer !== step.layer) {
          selectLayer(step.layer, true);
        }
      }
    }

    if (simProgress >= 1.0) {
      simProgress = 0;
      simStepIndex++;
      
      if (simStepIndex >= activeSimulationPath.length) {
        simulationRunning = false;
        dataPacketGroup.visible = false;
        trailMeshes.forEach(mesh => mesh.visible = false);
        
        const statusBadge = document.getElementById('engine-status');
        statusBadge.innerText = 'STANDBY';
        statusBadge.className = 'status-value active';
        
        const runBtn = document.getElementById('run-simulation');
        runBtn.classList.remove('running');
        runBtn.innerHTML = `<span class="btn-icon">⚡</span> Run Pipeline Simulation`;

        // Highlight Reception Layer (idx 0) to show where the transaction completes
        selectLayer(0);
        
        // Trigger a visual flash on the Reception structure
        const receptionPlatform = platforms[0];
        receptionPlatform.traverse(child => {
          if (child.isMesh && child.material && (child.material.isPhysicalMaterial || child.material.isStandardMaterial)) {
            child.material.emissiveIntensity = 2.5;
            setTimeout(() => {
              child.material.emissiveIntensity = 0.85;
            }, 600);
          }
        });
        
        writeConsoleLog("[SYSTEM] Response successfully dispatched to client. Transaction complete.", "success");
        
        // Switch Code Viewer to Schema to highlight JSON response output
        const schemaTab = viewerTabs.querySelector('[data-view="schema"]');
        if (schemaTab) schemaTab.click();
      }
    }
  }

  composer.render();
}

renderer.setAnimationLoop(animate);

// Handle window resizing
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
});