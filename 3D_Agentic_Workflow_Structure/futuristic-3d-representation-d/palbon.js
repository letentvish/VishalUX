import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ─── MODULE DATA — Exact Layout & Colors from Reference Image ─────────────────
const MODULES = [
  { name: 'HRMS',           subtitle: 'People First',        color: 0x0ea5e9, hex: '#0ea5e9', ledColor: 0x00e5ff, icon: 'hrms',       pos: [-4.6, 0, -3.4] },
  { name: 'ERP',            subtitle: 'Process Excellence',   color: 0x2563eb, hex: '#2563eb', ledColor: 0x3b82f6, icon: 'erp',        pos: [ 4.6, 0, -3.4] },
  { name: 'CRM',            subtitle: 'Customer Centric',     color: 0x00b4d8, hex: '#00b4d8', ledColor: 0x00f5d4, icon: 'crm',        pos: [-6.6, 0,  0] },
  { name: 'OPERATIONS',     subtitle: 'Run Better',           color: 0x10b981, hex: '#10b981', ledColor: 0x34d399, icon: 'operations', pos: [ 6.6, 0,  0] },
  { name: 'ANALYTICS & AI', subtitle: 'Data to Decisions',    color: 0x0284c7, hex: '#0284c7', ledColor: 0x38bdf8, icon: 'analytics',  pos: [-4.6, 0,  3.4] },
  { name: 'LEARNING (LXP)', subtitle: 'Develop Potential',   color: 0x06b6d4, hex: '#06b6d4', ledColor: 0x22d3ee, icon: 'learning',   pos: [ 4.6, 0,  3.4] },
];

// Metric KPI Cards Data matching the reference image layout
const METRIC_CARDS = [
  {
    targetPos: [-4.6, 0, -3.4], cardOffset: [-2.6, 0.4, 0],
    title: 'Workforce Efficiency', stat: '92%', badge: '↑ 8.2%', subLabel: 'Active Employees', subVal: '24,850', color: '#0ea5e9'
  },
  {
    targetPos: [4.6, 0, -3.4], cardOffset: [2.6, 0.4, 0],
    title: 'Process Efficiency', stat: '78%', badge: '↑ 6.1%', subLabel: 'Transactions / Day', subVal: '185K', color: '#2563eb'
  },
  {
    targetPos: [-6.6, 0, 0], cardOffset: [-2.6, 0.4, 0],
    title: 'Customer Satisfaction', stat: '94%', badge: '↑ 10.4%', subLabel: 'Active Accounts', subVal: '12,430', color: '#00b4d8'
  },
  {
    targetPos: [6.6, 0, 0], cardOffset: [2.6, 0.4, 0],
    title: 'Operational Reliability', stat: '99.6%', badge: '↑ 2.3%', subLabel: 'Uptime This Month', subVal: '99.6%', color: '#10b981'
  },
  {
    targetPos: [-4.6, 0, 3.4], cardOffset: [-2.6, 0.4, 0],
    title: 'Insight Accuracy', stat: '90%', badge: '↑ 7.6%', subLabel: 'Insights Generated', subVal: '2,340', color: '#0284c7'
  },
  {
    targetPos: [4.6, 0, 3.4], cardOffset: [2.6, 0.4, 0],
    title: 'Learning Engagement', stat: '88%', badge: '↑ 9.3%', subLabel: 'Active Learners', subVal: '18,650', color: '#06b6d4'
  }
];

// ─── SCENE / CAMERA / RENDERER SETUP ─────────────────────────────────────────
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 12, 17);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('root') ?? document.body;

const getW = () => container.clientWidth || window.innerWidth;
const getH = () => container.clientHeight || window.innerHeight;

renderer.setSize(getW(), getH());
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);

// ─── LIGHT BACKGROUND GRADIENT ─────────────────────────────────────────────
const bgCanvas = document.createElement('canvas');
bgCanvas.width = bgCanvas.height = 512;
const bgCtx = bgCanvas.getContext('2d');
const bgGrad = bgCtx.createRadialGradient(256, 256, 20, 256, 256, 380);
bgGrad.addColorStop(0,   '#f8fafc');   // Crisp soft white center
bgGrad.addColorStop(0.5, '#eef5fc');   // Soft light blue mid
bgGrad.addColorStop(1,   '#dce8f5');   // Sky blue edge
bgCtx.fillStyle = bgGrad;
bgCtx.fillRect(0, 0, 512, 512);
scene.background = new THREE.CanvasTexture(bgCanvas);

// ─── CONTROLS ──────────────────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping   = true;
controls.dampingFactor   = 0.05;
controls.maxPolarAngle   = Math.PI / 2.05;
controls.minDistance     = 6;
controls.maxDistance     = 28;
controls.autoRotate      = true;
controls.autoRotateSpeed = 0.2;
controls.target.set(0, 0, 0);

// ─── HIGH-BRIGHTNESS LIGHTING (Prevents dark/black rendering) ──────────────
scene.add(new THREE.AmbientLight(0xffffff, 2.8));

const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
mainLight.position.set(-8, 16, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(1024, 1024);
mainLight.shadow.bias = -0.001;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xdceefd, 1.0);
fillLight.position.set(8, 8, -8);
scene.add(fillLight);

const blueAccent = new THREE.PointLight(0x3b82f6, 1.5, 22);
blueAccent.position.set(0, 6, 0);
scene.add(blueAccent);

// ─── ROUNDED SHAPE BUILDERS ────────────────────────────────────────────────
function drawRoundedRect(shape, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2 - 0.01, height / 2 - 0.01);
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
}

function createRoundedSlabGeometry(w, d, h, r = 0.35) {
  const shape = new THREE.Shape();
  drawRoundedRect(shape, -w / 2, -d / 2, w, d, r);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: h,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    curveSegments: 16
  });
  geo.center();
  return geo;
}

function createRoundedShapeGeometry(w, d, r = 0.35) {
  const shape = new THREE.Shape();
  drawRoundedRect(shape, -w / 2, -d / 2, w, d, r);
  return new THREE.ShapeGeometry(shape, 16);
}

function whiteSlabMat() {
  return new THREE.MeshStandardMaterial({
    color:     0xffffff,
    roughness: 0.12,
    metalness: 0.02,
  });
}

// ─── OCTAGONAL STAGE BASE ──────────────────────────────────────────────────
function buildOctagonBase() {
  const shape = new THREE.Shape();
  const R = 9.8;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const x = Math.cos(a) * R;
    const y = Math.sin(a) * R;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.35,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.08,
    bevelThickness: 0.08,
    curveSegments: 16
  });
  geo.center();

  const mat = new THREE.MeshStandardMaterial({
    color: 0xf4f8fe, roughness: 0.2, metalness: 0.02,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.38;
  mesh.receiveShadow = true;
  return mesh;
}

// ─── PLATFORM SLAB BUILDER ─────────────────────────────────────────────────
function buildSlab(w, d, cornerRadius = 0.35, ledColor = null) {
  const H = 0.34;
  const g = new THREE.Group();

  // Drop Shadow Plane
  const shGeo = createRoundedShapeGeometry(w + 0.45, d + 0.45, cornerRadius + 0.1);
  const sh = new THREE.Mesh(
    shGeo,
    new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide })
  );
  sh.rotation.x = -Math.PI / 2;
  sh.position.set(0.06, -H/2 - 0.04, 0.06);
  g.add(sh);

  // Main White Slab Body
  const body = new THREE.Mesh(createRoundedSlabGeometry(w, H, d, cornerRadius), whiteSlabMat());
  body.castShadow    = true;
  body.receiveShadow = true;
  g.add(body);

  // Dark Blue Base Rim Accent on bottom of slab
  const rimBaseGeo = createRoundedSlabGeometry(w + 0.02, d + 0.02, 0.08, cornerRadius + 0.01);
  const rimBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
  const rimBase = new THREE.Mesh(rimBaseGeo, rimBaseMat);
  rimBase.position.y = -H/2 + 0.03;
  g.add(rimBase);

  // Front Row of 4 LED Status Dots
  if (ledColor) {
    const ledGroup = new THREE.Group();
    const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
    for (let i = 0; i < 4; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), ledMat);
      dot.position.set((i - 1.5) * 0.14, -H/2 + 0.03, d / 2 + 0.018);
      ledGroup.add(dot);
    }
    g.add(ledGroup);
  }

  // Top Face Highlight
  const topGeo = createRoundedShapeGeometry(w - 0.06, d - 0.06, Math.max(0.05, cornerRadius - 0.04));
  const top = new THREE.Mesh(
    topGeo,
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide })
  );
  top.rotation.x = -Math.PI / 2;
  top.position.y = H/2 + 0.015;
  g.add(top);

  return g;
}

// ─── 3D ICONS ──────────────────────────────────────────────────────────────
function iMat(c) {
  return new THREE.MeshStandardMaterial({
    color: c, roughness: 0.2, metalness: 0.1,
  });
}

function hrmsIcon(c) {
  const g = new THREE.Group(), m = iMat(c);
  const leadHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), m); leadHead.position.set(0, 0.52, 0); g.add(leadHead);
  const leadBody = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.16, 0.28, 16), m); leadBody.position.set(0, 0.24, 0); g.add(leadBody);
  [ -0.26, 0.26 ].forEach((x) => {
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), m); head.position.set(x, 0.44, -0.05); g.add(head);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.22, 14), m); body.position.set(x, 0.20, -0.05); g.add(body);
  });
  return g;
}

function erpIcon(c) {
  const g = new THREE.Group(), m = iMat(c);
  const pie = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.10, 24, 1, false, 0, Math.PI * 1.6), m);
  pie.position.set(0, 0.35, 0); g.add(pie);
  const wedge = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 16, 1, false, Math.PI * 1.65, Math.PI * 0.3), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
  wedge.position.set(0.06, 0.36, -0.06); g.add(wedge);
  return g;
}

function crmIcon(c) {
  const g = new THREE.Group(), m = iMat(c);
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.28, 14), m); leftArm.position.set(-0.20, 0.28, 0); leftArm.rotation.z = Math.PI / 3.5; g.add(leftArm);
  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.28, 14), m); rightArm.position.set(0.20, 0.28, 0); rightArm.rotation.z = -Math.PI / 3.5; g.add(rightArm);
  const handClasp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), m); handClasp.position.set(0, 0.36, 0); g.add(handClasp);
  return g; }

function operationsIcon(c) {
  const g = new THREE.Group(), m = iMat(c);
  const g1Hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 16), m); g1Hub.position.set(0, 0.36, 0); g1Hub.rotation.x = Math.PI / 3; g.add(g1Hub);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), m); tooth.position.set(Math.cos(a) * 0.26, 0.36 + Math.sin(a) * 0.26, 0); g.add(tooth);
  }
  return g;
}

function analyticsIcon(c) {
  const g = new THREE.Group(), m = iMat(c);
  [ 0.22, 0.38, 0.54 ].forEach((h, i) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, 0.12), m); bar.position.set((i - 1) * 0.18, h / 2 + 0.06, 0); g.add(bar);
  });
  return g;
}

function learningIcon(c) {
  const g = new THREE.Group(), m = iMat(c);
  const capTop = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.03, 0.44), m); capTop.position.set(0, 0.44, 0); capTop.rotation.y = Math.PI / 4; g.add(capTop);
  const capSkull = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.14, 16), m); capSkull.position.set(0, 0.34, 0); g.add(capSkull);
  return g;
}

function buildIcon(type, color) {
  return ({
    hrms: hrmsIcon, erp: erpIcon, crm: crmIcon, operations: operationsIcon, analytics: analyticsIcon, learning: learningIcon
  }[type] || ((c) => new THREE.Group()))(color);
}

// ─── 3D CRISP LABEL SPRITE ──────────────────────────────────────────────────
function makeLabelSprite(name, subtitle, hexColor, worldW = 3.2) {
  const CW = 512, CH = 148;
  const cv  = document.createElement('canvas');
  cv.width  = CW; cv.height = CH;
  const ctx = cv.getContext('2d');

  const rr = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  };

  ctx.save();
  ctx.shadowColor   = 'rgba(30, 80, 160, 0.18)';
  ctx.shadowBlur    = 14; ctx.shadowOffsetY = 4;
  rr(14, 10, CW-28, CH-20, 16);
  ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.restore();

  rr(14, 10, CW-28, CH-20, 16);
  ctx.fillStyle = '#ffffff'; ctx.fill();

  rr(14, 10, CW-28, 6, 3);
  ctx.fillStyle = hexColor; ctx.fill();

  ctx.fillStyle    = '#0f172a';
  ctx.font         = '800 52px Arial, Inter, sans-serif';
  ctx.textAlign    = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(name, CW/2, 74);

  ctx.fillStyle = '#475569';
  ctx.font      = '600 24px Arial, Inter, sans-serif';
  ctx.fillText(subtitle, CW/2, 118);

  const mat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(cv), transparent: true, depthTest: false, depthWrite: false
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(worldW, worldW*(CH/CW), 1);
  sprite.renderOrder = 10;
  return sprite;
}

// ─── FLOATING METRIC KPI CARD SPRITES ───────────────────────────────────────
function makeMetricCardSprite(data, worldW = 3.6) {
  const CW = 512, CH = 256;
  const cv  = document.createElement('canvas');
  cv.width  = CW; cv.height = CH;
  const ctx = cv.getContext('2d');

  const rr = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  };

  ctx.save();
  ctx.shadowColor   = 'rgba(30, 80, 160, 0.16)';
  ctx.shadowBlur    = 18; ctx.shadowOffsetY = 6;
  rr(16, 12, CW-32, CH-24, 20);
  ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.restore();

  rr(16, 12, CW-32, CH-24, 20);
  ctx.fillStyle = '#ffffff'; ctx.fill();

  ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)'; ctx.lineWidth = 2; ctx.stroke();

  ctx.fillStyle    = '#64748b';
  ctx.font         = '600 24px Arial, Inter, sans-serif';
  ctx.textAlign    = 'left';
  ctx.fillText(data.title, 42, 54);

  ctx.fillStyle    = '#0f172a';
  ctx.font         = '800 64px Arial, Inter, sans-serif';
  ctx.fillText(data.stat, 42, 128);

  const badgeText = data.badge;
  ctx.font = '700 22px Arial, Inter, sans-serif';
  const bw = ctx.measureText(badgeText).width + 24;
  const bx = 42 + ctx.measureText(data.stat).width + 20;

  rr(bx, 82, bw, 42, 21);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.12)'; ctx.fill();
  ctx.fillStyle = '#10b981'; ctx.fillText(badgeText, bx + 12, 111);

  ctx.beginPath(); ctx.moveTo(42, 156); ctx.lineTo(CW-42, 156);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)'; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.fillStyle = '#64748b'; ctx.font = '600 22px Arial, Inter, sans-serif';
  ctx.fillText(data.subLabel, 42, 198);

  ctx.fillStyle = '#0f172a'; ctx.font = '800 32px Arial, Inter, sans-serif';
  ctx.fillText(data.subVal, 42, 232);

  const cx = CW - 72, cy = CH - 64, cr = 34;
  ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fillStyle = data.color + '18'; ctx.fill();
  ctx.strokeStyle = data.color + '60'; ctx.lineWidth = 2; ctx.stroke();

  const spriteMat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(cv), transparent: true, depthTest: false, depthWrite: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(worldW, worldW * (CH / CW), 1);
  sprite.renderOrder = 12;
  return sprite;
}

// ─── UNIFIED PILLARS FOOTER BAR ──────────────────────────────────────────────
function makeFooterBarSprite(worldW = 16.0) {
  const CW = 1536, CH = 180;
  const cv  = document.createElement('canvas');
  cv.width  = CW; cv.height = CH;
  const ctx = cv.getContext('2d');

  const rr = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
  };

  ctx.save();
  ctx.shadowColor   = 'rgba(30, 80, 160, 0.16)';
  ctx.shadowBlur    = 24; ctx.shadowOffsetY = 6;
  rr(16, 12, CW-32, CH-24, 24);
  ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.restore();

  rr(16, 12, CW-32, CH-24, 24);
  ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)'; ctx.lineWidth = 2; ctx.stroke();

  const pillars = [
    { icon: '🗄️', title: 'Unified Data', sub: 'One source of truth' },
    { icon: '🔀', title: 'Unified Processes', sub: 'End-to-end automation' },
    { icon: '👤', title: 'Unified Experience', sub: 'Consistency across touchpoints' },
    { icon: '🧠', title: 'Unified Intelligence', sub: 'Smarter decisions, faster' }
  ];

  const colW = (CW - 64) / 4;
  pillars.forEach((p, i) => {
    const x = 32 + i * colW;
    ctx.font = '36px Arial'; ctx.textAlign = 'left';
    ctx.fillText(p.icon, x + 24, 92);
    ctx.fillStyle = '#0f172a'; ctx.font = '800 28px Arial, Inter, sans-serif';
    ctx.fillText(p.title, x + 84, 76);
    ctx.fillStyle = '#64748b'; ctx.font = '600 20px Arial, Inter, sans-serif';
    ctx.fillText(p.sub, x + 84, 108);

    if (i < 3) {
      ctx.beginPath(); ctx.moveTo(x + colW, 40); ctx.lineTo(x + colW, CH - 40);
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.9)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
  });

  const spriteMat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(cv), transparent: true, depthTest: false, depthWrite: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(worldW, worldW * (CH / CW), 1);
  sprite.renderOrder = 14;
  return sprite;
}

// ─── CENTRAL HUB ("PALBON CORE") ─────────────────────────────────────────────
function buildHub() {
  const hub = new THREE.Group();

  // Stacked White Slabs
  const s1 = buildSlab(3.6, 3.6, 0.44, 0x3b82f6); s1.position.y = 0; hub.add(s1);
  const s2 = buildSlab(2.8, 2.8, 0.36, 0x3b82f6); s2.position.y = 0.34; hub.add(s2);

  // Core Gem
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.42, 4),
    new THREE.MeshStandardMaterial({
      color: 0x3b82f6, roughness: 0.1, metalness: 0.8
    })
  );
  core.name = 'core'; core.position.set(0, 1.55, 0); hub.add(core);

  // "P" Logo
  const pCv = document.createElement('canvas'); pCv.width = pCv.height = 256;
  const pCtx = pCv.getContext('2d');
  pCtx.clearRect(0, 0, 256, 256);
  pCtx.fillStyle = '#ffffff';
  pCtx.font = 'bold 110px Arial, sans-serif'; pCtx.textAlign = 'center'; pCtx.textBaseline = 'middle';
  pCtx.fillText('P', 128, 120);

  const pMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.65, 0.65),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pCv), transparent: true, side: THREE.DoubleSide, depthTest: false })
  );
  pMesh.name = 'pLabel'; pMesh.position.set(0, 1.55, 0); hub.add(pMesh);

  // Orbital rings
  [{r:0.66,rx:0,n:'r0'},{r:0.66,rx:Math.PI/2,n:'r1'},{r:0.90,rx:Math.PI/3,n:'r2'}].forEach(({r,rx,n}) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.013, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.55 })
    );
    ring.name = n; ring.position.set(0, 1.55, 0); ring.rotation.x = rx; hub.add(ring);
  });

  // 3D PALBON CORE Hub Label
  const lbl = makeLabelSprite('PALBON CORE', 'Unified Enterprise Platform', '#2563eb', 4.6);
  lbl.name = 'hubLabel'; lbl.position.set(0, 2.85, 0); hub.add(lbl);

  return hub;
}

// ─── MODULE SATELLITE NODE ─────────────────────────────────────────────────
function buildNode(mod) {
  const g = new THREE.Group();

  const s1 = buildSlab(2.4, 2.4, 0.36, mod.ledColor); s1.position.y = 0; g.add(s1);
  const s2 = buildSlab(1.9, 1.9, 0.28, mod.ledColor); s2.position.y = 0.34; g.add(s2);

  const edge = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.013, 8, 80),
    new THREE.MeshBasicMaterial({ color: mod.color, transparent: true, opacity: 0.65 })
  );
  edge.rotation.x = Math.PI / 2; edge.position.y = 0.06; g.add(edge);

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 12, 12),
    new THREE.MeshBasicMaterial({ color: mod.color })
  );
  dot.position.y = 0.07; g.add(dot);

  const icon = buildIcon(mod.icon, mod.color);
  icon.name = 'icon'; icon.position.set(0, 0.82, 0); g.add(icon);

  const lbl = makeLabelSprite(mod.name, mod.subtitle, mod.hex, 3.2);
  lbl.name = 'label'; lbl.position.set(0, 2.2, 0); g.add(lbl);

  return g;
}

// ─── SMOOTH 90-DEGREE CATMULL-ROM CONDUIT BEAMS ─────────────────────────────
function buildConduitBeam(sx, sz, ex, ez, color) {
  const g = new THREE.Group();
  const Y = 0.42;

  let curve;
  const isDirect = Math.abs(sz - ez) < 0.2; // Middle-left and middle-right are straight

  if (isDirect) {
    curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sx, Y, sz),
      new THREE.Vector3(ex, Y, ez)
    ]);
  } else {
    // Smooth 90-degree L-turn curve
    const cornerX = ex;
    const cornerZ = sz;
    curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sx, Y, sz),
      new THREE.Vector3(cornerX, Y, cornerZ),
      new THREE.Vector3(ex, Y, ez)
    ], false, 'catmullrom', 0.2);
  }

  // Outer Glass Tube
  g.add(new THREE.Mesh(
    new THREE.TubeGeometry(curve, 48, 0.045, 10, false),
    new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, roughness: 0.1, opacity: 0.35, transparent: true })
  ));

  // Inner Glowing Fiber Core
  g.add(new THREE.Mesh(
    new THREE.TubeGeometry(curve, 48, 0.016, 8, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 })
  ));

  // Metallic End Socket Plugs
  [ [sx, Y, sz], [ex, Y, ez] ].forEach(([px, py, pz]) => {
    const plug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.16, 12),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 })
    );
    plug.position.set(px, py, pz); plug.rotation.x = Math.PI / 2; g.add(plug);
  });

  // Animated traveling LED dots inside conduit
  for (let i = 0; i < 3; i++) {
    const pg = new THREE.Group();
    pg.userData.curve  = curve;
    pg.userData.speed  = 0.1 + Math.random() * 0.06;
    pg.userData.offset = i / 3;

    pg.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    ));

    for (let j = 1; j <= 6; j++) {
      const ts = new THREE.Mesh(
        new THREE.SphereGeometry(0.024 * (1 - j / 7), 6, 6),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 * (1 - j / 7) })
      );
      ts.userData.tailOffset = j * 0.015; pg.add(ts);
    }
    g.add(pg);
  }

  g.userData.curve = curve;
  return g;
}

// ─── AMBIENT PARTICLES ──────────────────────────────────────────────────────
function buildParticles() {
  const N = 350; const pos = new Float32Array(N * 3); const col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 34;
    pos[i * 3 + 1] = Math.random() * 12 - 1;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 34;
    const c = new THREE.Color().setHSL(0.58 + Math.random() * 0.08, 0.65, 0.6 + Math.random() * 0.2);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.04, vertexColors: true, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false
  }));
}

// ─── BUILD SCENE ────────────────────────────────────────────────────────────
scene.add(buildOctagonBase());

const hub   = buildHub();
const nodes = [];
const beams = [];
scene.add(hub);
scene.add(buildParticles());

const grid = new THREE.GridHelper(38, 38, 0x93c5fd, 0xbfdbfe);
grid.position.y = -0.6; grid.material.transparent = true; grid.material.opacity = 0.18;
scene.add(grid);

MODULES.forEach(mod => {
  const node = buildNode(mod);
  node.position.set(mod.pos[0], mod.pos[1], mod.pos[2]);
  scene.add(node); nodes.push(node);

  const hubSocketX = Math.sign(mod.pos[0]) * 1.8;
  const beam = buildConduitBeam(hubSocketX, mod.pos[2], mod.pos[0], mod.pos[2], mod.color);
  scene.add(beam); beams.push(beam);
});

// Build Floating Metric KPI Cards
METRIC_CARDS.forEach((cardData) => {
  const sprite = makeMetricCardSprite(cardData, 3.6);
  sprite.position.set(
    cardData.targetPos[0] + cardData.cardOffset[0],
    cardData.targetPos[1] + cardData.cardOffset[1],
    cardData.targetPos[2] + cardData.cardOffset[2]
  );
  scene.add(sprite);
});

// Build Unified Pillars Footer Bar at front of stage
const footerBar = makeFooterBarSprite(16.5);
footerBar.position.set(0, 0.12, 6.4);
scene.add(footerBar);

// ─── ANIMATION LOOP ─────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();

  const core   = hub.getObjectByName('core');
  const pLabel = hub.getObjectByName('pLabel');
  if (core) { core.rotation.y = t * 0.55; core.rotation.x = Math.sin(t * 0.28) * 0.18; core.position.y = 1.55 + Math.sin(t * 0.9) * 0.08; }
  if (pLabel && core) { pLabel.position.y = core.position.y; pLabel.lookAt(camera.position); }

  ['r0', 'r1', 'r2'].forEach((n, i) => {
    const r = hub.getObjectByName(n); if (!r) return;
    if (i === 0) r.rotation.y = t * 0.9;
    if (i === 1) { r.rotation.y = -t * 0.7; r.rotation.z = t * 0.3; }
    if (i === 2) r.rotation.y = t * 0.5;
  });

  nodes.forEach((node, i) => {
    node.position.y = Math.sin(t * 0.45 + i * 1.1) * 0.14;
    const icon = node.getObjectByName('icon'); if (icon) icon.rotation.y = t * 0.22 + i * 0.55;
  });

  beams.forEach(beam => {
    beam.children.forEach(pg => {
      if (!pg.userData.curve) return;
      const prog = (t * pg.userData.speed + pg.userData.offset) % 1;
      const hp   = pg.userData.curve.getPoint(prog);
      if (pg.children[0]) pg.children[0].position.copy(hp);
      pg.children.slice(1).forEach(ts => {
        if (ts.userData.tailOffset) {
          pg.userData.curve.getPoint(Math.max(0, prog - ts.userData.tailOffset), ts.position);
        }
      });
    });
  });

  blueAccent.intensity = 1.5 + Math.sin(t * 0.9) * 0.2;

  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// ─── RESIZE LISTENER ────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  const W = getW(), H = getH();
  camera.aspect = W / H; camera.updateProjectionMatrix();
  renderer.setSize(W, H);
});
