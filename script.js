(async () => {
  try {
    let THREE;
    try {
      THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    } catch (_) {
      THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    }
await new Promise(r => requestAnimationFrame(() => setTimeout(r, 30)));
const V3 = THREE.Vector3, Q4 = THREE.Quaternion;
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const FW = 250, FL = 330, FH = 70, HW = FW / 2, HL = FL / 2;
const GW = 60, GH = 22, GD = 24;
const RF = 11, RCORN = 45, GZ0 = HL - RF - 1;
const BR = 3.5, G = 30, BALL_MAX = 150;
const CHX = 1.45, CHY = 0.62, CHZ = 2.4, CAR_Y = 0.97;
const MAX_DRIVE = 52, MAX_BOOST = 86, SUPERSONIC = 78, MAX_REV = 26;
const BOOST_ACC = 52, AIR_BOOST = 50, BRAKE = 100, COAST = 10, BOOST_USE = 30;
const REGEN_DELAY = 5, REGEN_RATE = 25;
const OVERSPEED = 36;
const JUMP_V = 12, JUMP_HOLD = 34, DOUBLE_V = 10.5, FLIP_V = 20, FLIP_DUR = 0.6;
const PITCH_R = 5.5, YAW_R = 4.2, ROLL_R = 6;
const STEP = 1 / 120;
const TEAM_COL = [0x1f6bff, 0xe3202b], TEAM_CSS = ['#4b97ff', '#ff4545'], TEAM_NAME = ['BLUE', 'RED'];
const UP = new V3(0, 1, 0);
const BOT_NAMES = ['VIPER', 'BLAZE', 'NOVA', 'ROGUE', 'JINX', 'TURBO', 'COMET', 'SPARKS', 'RAZOR', 'ECHO'];
const DIFF = [
    { throttle: 0.86, est: 36, boostDist: 45, reserve: 25, flip: false, dbl: false, aerial: false, flipChance: 0, reach: 7.2 },
    { throttle: 1.0, est: 46, boostDist: 20, reserve: 8, flip: true, dbl: true, aerial: false, flipChance: 0.6, reach: 11.8 },
    { throttle: 1.0, est: 56, boostDist: 8, reserve: 0, flip: true, dbl: true, aerial: true, flipChance: 0.9, reach: 18 },
];
const settings = { mode: 1, diff: 1, len: 300 };
const STORE_KEY = 'turboclash.store.v1';
const STORE = (() => {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (_) { }
    if (!d || typeof d.coins !== 'number' || !Array.isArray(d.owned))
        d = { coins: 0, owned: ['stock'], equipped: 'stock' };
    if (!d.owned.includes('stock'))
        d.owned.push('stock');
    if (!Array.isArray(d.ownedBalls))
        d.ownedBalls = ['classic'];
    if (!d.ownedBalls.includes('classic'))
        d.ownedBalls.push('classic');
    if (typeof d.ball !== 'string')
        d.ball = 'classic';
    return d;
})();
function saveStore() { try { localStorage.setItem(STORE_KEY, JSON.stringify(STORE)); } catch (_) { } }
const online = window.TCMultiplayer;
let playType = 'bots';
const usernamePattern = /^[A-Za-z0-9_]{3,12}$/;
let playerName = 'You';
try {
    const saved = localStorage.getItem('turboclash-display-name');
    if (usernamePattern.test(saved || '')) playerName = saved;
} catch (_) { }
$('usernameInput').value = playerName === 'You' ? '' : playerName;
function confirmUsername() {
    const value = $('usernameInput').value.trim();
    playerName = usernamePattern.test(value) ? value : 'You';
    try {
        if (playerName === 'You') localStorage.removeItem('turboclash-display-name');
        else localStorage.setItem('turboclash-display-name',playerName);
    } catch (_) {}
    if (online) online.setUsername(playerName);
    return true;
}
const remoteInputs = new Map();
let onlineInputTimer = 0, onlineSnapshotTimer = 0;
const _netPos = new V3(), _netVel = new V3(), _netQ = new Q4();
function serializeInput(inp) {
    return [inp.throttle, inp.steer, inp.pitch, inp.roll, +inp.jump, +inp.boost, +inp.slide];
}
function useRemoteInput(inp, arr) {
    if (!Array.isArray(arr) || arr.length !== 7) return;
    for (const x of arr) if (!Number.isFinite(x) || Math.abs(x) > 1.001) return;
    [inp.throttle, inp.steer, inp.pitch, inp.roll] = arr.slice(0, 4);
    inp.jump = !!arr[4]; inp.boost = !!arr[5]; inp.slide = !!arr[6];
}
function clearInput(inp) { inp.throttle=inp.steer=inp.pitch=inp.roll=0; inp.jump=inp.boost=inp.slide=false; }

const BX = HW + 9, BZ = HL + GD + 9, RC = 36;
const LR = 10, D1 = 1.8, R1 = 1.05, H1 = 2.2;
const O2 = LR * D1 + 6, TOP_L = H1 + (LR - 1) * R1;
const UR = 12, D2 = 2.0, R2 = 1.35, H2 = TOP_L + 6.5;
const BACK = O2 + UR * D2, TOP_U = H2 + (UR - 1) * R2;
const SUITE_Y = TOP_U + 7, O3 = BACK + 2, TR = 15, D3 = 2.0, R3 = 1.6, H3 = SUITE_Y + 1.6;
const BACK3 = O3 + TR * D3, TOP_3 = H3 + (TR - 1) * R3, ROOF_Y = TOP_3 + 14, ROOF_IN = 34;
function sdRR(x, z, ax, az, r) {
    const qx = Math.abs(x) - (ax - r), qz = Math.abs(z) - (az - r);
    return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r;
}
function fil(u, v) { return (u < RF && v < RF) ? RF - Math.hypot(RF - u, RF - v) : Math.min(u, v); }
function arenaD(x, y, z) {
    const u = -sdRR(x, z, HW, HL, RCORN);
    let d = Math.min(fil(u, y), fil(u, FH - y));
    const az = Math.abs(z);
    if (az > GZ0 - 1) {
        const g = Math.min(GW / 2 - Math.abs(x), y, GH - y, HL + GD - az, az - GZ0);
        if (g > d)
            d = g;
    }
    return d;
}
function arenaN(p, out) {
    const e = .05;
    out.set(arenaD(p.x + e, p.y, p.z) - arenaD(p.x - e, p.y, p.z), arenaD(p.x, p.y + e, p.z) - arenaD(p.x, p.y - e, p.z), arenaD(p.x, p.y, p.z + e) - arenaD(p.x, p.y, p.z - e));
    const l = out.length();
    if (l < 1e-6)
        out.set(0, 1, 0);
    else
        out.divideScalar(l);
    return out;
}
const renderer = new THREE.WebGLRenderer({ canvas: $('gl'), antialias: true, powerPreference: 'high-performance' });
const PR_MAX = Math.min(devicePixelRatio || 1, 1.5);
let prCur = PR_MAX;
renderer.setPixelRatio(prCur);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.62;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcfe2f7, 450, 1600);
const camera = new THREE.PerspectiveCamera(76, innerWidth / innerHeight, 0.2, 6000);
camera.position.set(0, 50, -150);
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
const SUN = new V3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(40), THREE.MathUtils.degToRad(32));
const sky = new THREE.Mesh(new THREE.SphereGeometry(4000, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { sunDir: { value: SUN.clone() }, uLow: { value: 1 } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }',
    fragmentShader: `uniform vec3 sunDir; uniform float uLow; varying vec3 vDir;
    void main(){
      vec3 d = normalize(vDir); float h = clamp(d.y, 0.0, 1.0);
      vec3 zen = vec3(0.035, 0.19, 0.66), hor = vec3(0.58, 0.74, 0.93);
      vec3 col = mix(hor, zen, pow(h, 0.5));
      float sd = max(dot(d, normalize(sunDir)), 0.0);
      col += vec3(1.0, 0.93, 0.8) * (pow(sd, 1400.0) * 30.0 + pow(sd, 10.0) * 0.22);
      if (d.y < 0.0) col = mix(hor, vec3(0.3, 0.32, 0.36), min(-d.y * 3.0, 1.0) * uLow);
      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }`,
}));
sky.material.toneMapped = false;
sky.frustumCulled = false;
const pmrem = new THREE.PMREMGenerator(renderer);
let envBuilt = false;
function buildEnv() {
    if (envBuilt)
        return;
    envBuilt = true;
    const envScene = new THREE.Scene();
    envScene.add(sky);
    scene.environment = pmrem.fromScene(envScene).texture;
    sky.material.uniforms.uLow.value = 0;
    scene.add(sky);
}
scene.add(new THREE.HemisphereLight(0xd2e2ff, 0x4d6e38, 0.38));
const sun = new THREE.DirectionalLight(0xfff2de, 3.0);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
sun.shadow.camera.near = 20;
sun.shadow.camera.far = 560;
scene.add(sun);
scene.add(sun.target);
let shadowExt = 0;
function updateShadow(cx, cz, ext) {
    const sc = sun.shadow.camera;
    if (ext !== shadowExt) {
        shadowExt = ext;
        sc.left = -ext;
        sc.right = ext;
        sc.top = ext;
        sc.bottom = -ext;
        sc.updateProjectionMatrix();
    }
    const snap = 2 * ext / 2048;
    cx = Math.round(cx / snap) * snap;
    cz = Math.round(cz / snap) * snap;
    sun.target.position.set(cx, 0, cz);
    sun.position.set(cx + SUN.x * 260, SUN.y * 260, cz + SUN.z * 260);
    sun.target.updateMatrixWorld();
}
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const MAX_ANI = Math.min(8, renderer.capabilities.getMaxAnisotropy());
function mkTex(c, srgb = true) { const t = new THREE.CanvasTexture(c); if (srgb)
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = MAX_ANI; return t; }
function rep(t, x, y) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(x, y); return t; }
function shade(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = n >> 8 & 255, b = n & 255;
    if (a < 0) {
        r *= 1 + a;
        g *= 1 + a;
        b *= 1 + a;
    }
    else {
        r += (255 - r) * a;
        g += (255 - g) * a;
        b += (255 - b) * a;
    }
    return `rgb(${r | 0},${g | 0},${b | 0})`;
}
function makeFieldTex() {
    const W = 2048, H = Math.round(W * FL / FW), s = W / FW;
    const c = mkCanvas(W, H), g = c.getContext('2d');
    const img = g.createImageData(W, H), d = img.data;
    const sx1 = new Float32Array(W), cx1 = new Float32Array(W), sx2 = new Float32Array(W), cx2 = new Float32Array(W);
    for (let x = 0; x < W; x++) {
        sx1[x] = Math.sin(x * .011);
        cx1[x] = Math.cos(x * .011);
        sx2[x] = Math.sin(x * .0023);
        cx2[x] = Math.cos(x * .0023);
    }
    for (let y = 0; y < H; y++) {
        const band = Math.floor(y / H * 22) & 1;
        const r0 = band ? 80 : 64, g0 = band ? 150 : 127, b0 = band ? 58 : 47;
        const sy1 = Math.sin(y * .006), cy1 = Math.cos(y * .006), sy2 = Math.sin(y * .0031), cy2 = Math.cos(y * .0031);
        for (let x = 0; x < W; x++) {
            const i = (y * W + x) << 2, n = Math.random() * 16 - 8;
            const lf = (sx1[x] * cy1 + cx1[x] * sy1) * 2.5 + (sx2[x] * cy2 - cx2[x] * sy2) * 3.5;
            d[i] = r0 + n * .5 + lf;
            d[i + 1] = g0 + n + lf * 1.4;
            d[i + 2] = b0 + n * .4 + lf * .5;
            d[i + 3] = 255;
        }
    }
    g.putImageData(img, 0, 0);
    g.strokeStyle = 'rgba(248,250,255,.93)';
    g.fillStyle = 'rgba(248,250,255,.93)';
    g.lineWidth = .7 * s;
    const m = (RF + .6) * s;
    const lw = g.lineWidth;
    g.beginPath();
    g.roundRect(m, m, W - 2 * m, H - 2 * m, (RCORN - RF - .6) * s);
    g.stroke();
    const gx0 = W / 2 - GW / 2 * s, gx1 = W / 2 + GW / 2 * s;
    g.putImageData(img, 0, 0, gx0 + lw / 2, m - lw, gx1 - gx0 - lw, lw * 2);
    g.putImageData(img, 0, 0, gx0 + lw / 2, H - m - lw, gx1 - gx0 - lw, lw * 2);
    const open3 = (xl, xr, ya, yb) => { g.beginPath(); g.moveTo(xl, ya); g.lineTo(xl, yb); g.lineTo(xr, yb); g.lineTo(xr, ya); g.stroke(); };
    open3(gx0, gx1, m, .6 * s);
    open3(gx0, gx1, H - m, H - .6 * s);
    g.beginPath();
    g.moveTo(m, H / 2);
    g.lineTo(W - m, H / 2);
    g.stroke();
    g.beginPath();
    g.arc(W / 2, H / 2, 26 * s, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.arc(W / 2, H / 2, .9 * s, 0, Math.PI * 2);
    g.fill();
    const a = Math.asin(16 / 26);
    for (const top of [true, false]) {
        const y0 = top ? m : H - m, dir = top ? 1 : -1, pbW = 150 * s, pbD = 52 * s, gaW = 84 * s, gaD = 20 * s;
        open3(W / 2 - pbW / 2, W / 2 + pbW / 2, y0, y0 + dir * pbD);
        open3(W / 2 - gaW / 2, W / 2 + gaW / 2, y0, y0 + dir * gaD);
        const spotY = y0 + dir * 36 * s;
        g.beginPath();
        g.arc(W / 2, spotY, .8 * s, 0, Math.PI * 2);
        g.fill();
        g.beginPath();
        if (top)
            g.arc(W / 2, spotY, 26 * s, a, Math.PI - a);
        else
            g.arc(W / 2, spotY, 26 * s, Math.PI + a, Math.PI * 2 - a);
        g.stroke();
    }
    return mkTex(c);
}
function makeGrassBump() {
    const c = mkCanvas(512, 512), g = c.getContext('2d');
    g.fillStyle = '#808080';
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 26000; i++) {
        const v = 80 + Math.random() * 140 | 0;
        g.fillStyle = `rgb(${v},${v},${v})`;
        g.fillRect(Math.random() * 512, Math.random() * 512, 1.3, 2 + Math.random() * 4);
    }
    return rep(mkTex(c, false), FW / 3, FL / 3);
}
function makeNetTex() {
    const c = mkCanvas(128, 128), g = c.getContext('2d');
    g.strokeStyle = '#fff';
    g.lineWidth = 5;
    for (let i = 0; i <= 2; i++) {
        g.beginPath();
        g.moveTo(i * 64, 0);
        g.lineTo(i * 64, 128);
        g.stroke();
        g.beginPath();
        g.moveTo(0, i * 64);
        g.lineTo(128, i * 64);
        g.stroke();
    }
    return mkTex(c);
}
function drawPlayvora(g, cx, cy, size) {
    g.font = `800 ${size}px Segoe UI, Arial`;
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    const w1 = g.measureText('Play').width, w2 = g.measureText('vora').width, x0 = cx - (w1 + w2) / 2;
    g.fillStyle = '#ffffff';
    g.fillText('Play', x0, cy);
    g.fillStyle = '#d6a2ff';
    g.fillText('vora', x0 + w1, cy);
}
function drawTurboClash(g, cx, cy, size) {
    g.font = `italic 900 ${size}px Segoe UI, Arial`;
    g.textBaseline = 'middle';
    g.textAlign = 'left';
    const w1 = g.measureText('TURBO').width, w2 = g.measureText('CLASH').width, x0 = cx - (w1 + w2) / 2;
    g.fillStyle = '#4b97ff';
    g.fillText('TURBO', x0, cy);
    g.fillStyle = '#ff4545';
    g.fillText('CLASH', x0 + w1, cy);
}
function makeLedTex() {
    const W = 2048, H = 128, c = mkCanvas(W, H), g = c.getContext('2d'), pw = W / 2;
    let gr = g.createLinearGradient(0, 0, pw, 0);
    gr.addColorStop(0, '#0b0d16');
    gr.addColorStop(.5, '#181030');
    gr.addColorStop(1, '#0b0d16');
    g.fillStyle = gr;
    g.fillRect(0, 0, pw, H);
    drawPlayvora(g, pw / 2, H / 2 + 4, 86);
    gr = g.createLinearGradient(pw, 0, W, 0);
    gr.addColorStop(0, '#0a1838');
    gr.addColorStop(.5, '#0b0d16');
    gr.addColorStop(1, '#360b10');
    g.fillStyle = gr;
    g.fillRect(pw, 0, pw, H);
    drawTurboClash(g, pw + pw / 2, H / 2 + 4, 82);
    g.fillStyle = 'rgba(0,0,0,.2)';
    for (let y = 0; y < H; y += 4)
        g.fillRect(0, y, W, 1);
    for (let x = 0; x < W; x += 4)
        g.fillRect(x, 0, 1, H);
    const t = mkTex(c);
    t.wrapS = THREE.RepeatWrapping;
    return t;
}
function makeHexTex() {
    const r = 40, W = 3 * r, H = Math.round(Math.sqrt(3) * r), c = mkCanvas(W, H), g = c.getContext('2d');
    g.fillStyle = 'rgba(255,255,255,.1)';
    g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(255,255,255,1)';
    g.lineWidth = 3;
    const hex = (x, y) => { g.beginPath(); for (let k = 0; k <= 6; k++) {
        const t = k * Math.PI / 3;
        g.lineTo(x + r * Math.cos(t), y + r * Math.sin(t));
    } g.stroke(); };
    for (const [x, y] of [[0, 0], [W, 0], [0, H], [W, H], [1.5 * r, H / 2], [1.5 * r, -H / 2], [1.5 * r, 1.5 * H], [-1.5 * r, H / 2], [4.5 * r, H / 2]])
        hex(x, y);
    const t = mkTex(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
}
function makeSuiteTex() {
    const W = 512, H = 192, c = mkCanvas(W, H), g = c.getContext('2d'), R = mulberry32(7), PW = 64;
    let gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#0c1424');
    gr.addColorStop(1, '#16233a');
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += PW) {
        const lit = .3 + R() * .7;
        gr = g.createLinearGradient(0, 22, 0, H - 10);
        gr.addColorStop(0, `rgba(255,214,150,${.1 * lit})`);
        gr.addColorStop(.6, `rgba(255,200,130,${.5 * lit})`);
        gr.addColorStop(1, `rgba(255,190,120,${.2 * lit})`);
        g.fillStyle = gr;
        g.fillRect(x + 4, 22, PW - 8, H - 32);
        g.fillStyle = `rgba(255,236,200,${.55 * lit})`;
        g.fillRect(x + 10, 26, PW - 20, 3);
    }
    g.fillStyle = '#080c14';
    for (let x = 0; x <= W; x += PW)
        g.fillRect(x - 3, 0, 6, H);
    g.fillRect(0, 0, W, 20);
    g.fillRect(0, H - 10, W, 10);
    g.fillStyle = 'rgba(255,255,255,.07)';
    g.fillRect(0, 20, W, 3);
    const t = mkTex(c);
    t.wrapS = THREE.RepeatWrapping;
    return t;
}
function makeTurfTex() {
    const c = mkCanvas(256, 256), g = c.getContext('2d'), img = g.createImageData(256, 256), d = img.data;
    for (let i = 0; i < 256 * 256; i++) {
        const n = Math.random() * 16 - 8;
        d[i * 4] = 70 + n * .5;
        d[i * 4 + 1] = 136 + n;
        d[i * 4 + 2] = 51 + n * .4;
        d[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const t = mkTex(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
}
function makeBallTex() {
    const W = 1536, H = 768;
    const cc = mkCanvas(W, H), cb = mkCanvas(W, H), gc = cc.getContext('2d'), gb = cb.getContext('2d');
    const ic = gc.createImageData(W, H), ib = gb.createImageData(W, H), dc = ic.data, db = ib.data;
    const ph = (1 + Math.sqrt(5)) / 2, P = [], X = [];
    for (const a of [-1, 1])
        for (const b of [-1, 1])
            P.push([0, a, b * ph], [a, b * ph, 0], [b * ph, 0, a]);
    for (const a of [-1, 1])
        for (const b of [-1, 1])
            for (const c of [-1, 1])
                X.push([a, b, c]);
    for (const a of [-1, 1])
        for (const b of [-1, 1])
            X.push([0, a / ph, b * ph], [a / ph, b * ph, 0], [b * ph, 0, a / ph]);
    const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; };
    const Pn = P.map(nrm).flat(), Xn = X.map(nrm).flat();
    const cbt = Math.cos(.0768), sbt = Math.sin(.0768);
    for (let py = 0; py < H; py++) {
        const th = (py + .5) / H * Math.PI, st = Math.sin(th), ct = Math.cos(th);
        for (let px = 0; px < W; px++) {
            const phi = (px + .5) / W * Math.PI * 2, x = -Math.cos(phi) * st, y = ct, z = Math.sin(phi) * st;
            let b1 = -9, b2 = -9, t1 = 0;
            for (let k = 0; k < 36; k += 3) {
                const dd = Pn[k] * x + Pn[k + 1] * y + Pn[k + 2] * z;
                const e = dd * cbt - Math.sqrt(Math.max(0, 1 - dd * dd)) * sbt;
                if (e > b1) {
                    b2 = b1;
                    b1 = e;
                    t1 = 0;
                }
                else if (e > b2)
                    b2 = e;
            }
            for (let k = 0; k < 60; k += 3) {
                const dd = Xn[k] * x + Xn[k + 1] * y + Xn[k + 2] * z;
                if (dd > b1) {
                    b2 = b1;
                    b1 = dd;
                    t1 = 1;
                }
                else if (dd > b2)
                    b2 = dd;
            }
            const edge = b1 - b2, seam = Math.min(1, edge / .008), puff = .84 + .16 * Math.min(1, edge / .07);
            let r = t1 ? 238 : 24, gg = t1 ? 240 : 26, bb = t1 ? 244 : 32;
            r = 50 + (r * puff - 50) * seam;
            gg = 52 + (gg * puff - 52) * seam;
            bb = 58 + (bb * puff - 58) * seam;
            const i = (py * W + px) << 2;
            dc[i] = r;
            dc[i + 1] = gg;
            dc[i + 2] = bb;
            dc[i + 3] = 255;
            db[i] = db[i + 1] = db[i + 2] = 50 + 205 * Math.min(1, edge / .03);
            db[i + 3] = 255;
        }
    }
    gc.putImageData(ic, 0, 0);
    gb.putImageData(ib, 0, 0);
    return [mkTex(cc), mkTex(cb, false)];
}
const SKIN = ['#f3cfa5', '#e8b98d', '#d9a273', '#c68642', '#a96b3c', '#8d5524', '#6b3e1f', '#4f2c16', '#f6d7c3', '#e0ac69'];
const HAIR = ['#14100c', '#22180f', '#3b2616', '#5a3d22', '#7b5a36', '#a77b4a', '#d4b06a', '#8a8a8a', '#cfcfcf', '#5c2414'];
const PANTS = ['#1d2433', '#2c3a57', '#3a3d44', '#15161a', '#4b4f59', '#5a4a3a', '#2f4f6f'];
const SHIRTS = [['#1f5fd6', '#2a6ff0', '#173f8f', '#3d86ff', '#0f2f6e', '#5a9bff', '#1b4fb3'], ['#d61f2a', '#b3141d', '#ef3b3b', '#8f1016', '#ff5252', '#c4161c', '#a3121a']];
const NEUTRAL = ['#f2f2f2', '#1c1c1c', '#6b6f78', '#e8e2d0', '#33363d', '#9aa0a8', '#2d4a35'];
function drawCrowdStrip(seed, side, cheer) {
    const N = 32, PW = 128, W = N * PW, H = 192, c = mkCanvas(W, H), g = c.getContext('2d');
    const R = mulberry32(seed);
    const shirt = side ? '#ed424d' : '#3988ff';
    const sleeve = side ? '#cb2935' : '#2466d5';
    const pants = '#202e47', shoes = '#f3f5fc';
    for (let i = 0; i < N; i++) {
        const cx = i * PW + PW / 2 + (R() - .5) * 11;
        const skin = R() < .5 ? '#e2ad82' : '#9d6042';
        const cheering = cheer && R() < .85;
        const armAngle = (R() - .5) * .18;
        g.fillStyle = pants;
        g.fillRect(cx - 28, 119, 23, 62);
        g.fillRect(cx + 5, 119, 23, 62);
        g.fillStyle = shoes;
        g.fillRect(cx - 32, 176, 29, 13);
        g.fillRect(cx + 3, 176, 29, 13);
        for (const sign of [-1, 1]) {
            g.save();
            g.translate(cx + sign * 44, 85);
            g.rotate(sign * (cheering ? 2.65 + armAngle : .1 + armAngle));
            g.fillStyle = sleeve;
            g.fillRect(-10, 0, 20, 43);
            g.fillStyle = skin;
            g.fillRect(-8, 40, 16, 22);
            g.beginPath();
            g.arc(0, 63, 9, 0, Math.PI * 2);
            g.fill();
            g.restore();
        }
        g.fillStyle = shirt;
        g.fillRect(cx - 40, 80, 80, 54);
        g.fillStyle = skin;
        g.fillRect(cx - 10, 68, 20, 16);
        g.beginPath();
        g.arc(cx, 49, 29, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = 'rgba(30,25,23,.78)';
        g.beginPath();
        g.arc(cx - 10, 49, 2.5, 0, Math.PI * 2);
        g.arc(cx + 10, 49, 2.5, 0, Math.PI * 2);
        g.fill();
    }
    const t = mkTex(c);
    t.wrapS = THREE.RepeatWrapping;
    return t;
}
function rrLen(o) { return 4 * (BX - RC) + 4 * (BZ - RC) + 2 * Math.PI * (RC + o); }
function rrAt(o, s, out = {}) {
    const r = RC + o, ax = BX - RC, az = BZ - RC, sx = 2 * ax, sz = 2 * az, arc = Math.PI * r / 2, L = 2 * sx + 2 * sz + 4 * arc;
    s = ((s % L) + L) % L;
    const set = (x, z, nx, nz) => { out.x = x; out.z = z; out.nx = nx; out.nz = nz; return out; };
    if (s < sz)
        return set(ax + r, -az + s, 1, 0);
    s -= sz;
    if (s < arc) {
        const t = s / r;
        return set(ax + r * Math.cos(t), az + r * Math.sin(t), Math.cos(t), Math.sin(t));
    }
    s -= arc;
    if (s < sx)
        return set(ax - s, az + r, 0, 1);
    s -= sx;
    if (s < arc) {
        const t = Math.PI / 2 + s / r;
        return set(-ax + r * Math.cos(t), az + r * Math.sin(t), Math.cos(t), Math.sin(t));
    }
    s -= arc;
    if (s < sz)
        return set(-ax - r, az - s, -1, 0);
    s -= sz;
    if (s < arc) {
        const t = Math.PI + s / r;
        return set(-ax + r * Math.cos(t), -az + r * Math.sin(t), Math.cos(t), Math.sin(t));
    }
    s -= arc;
    if (s < sx)
        return set(-ax + s, -az - r, 0, -1);
    s -= sx;
    const t = 1.5 * Math.PI + s / r;
    return set(ax + r * Math.cos(t), -az + r * Math.sin(t), Math.cos(t), Math.sin(t));
}
const BASE = [];
{
    const L0 = rrLen(0), N = Math.ceil(L0 / 2.5);
    for (let i = 0; i <= N; i++)
        BASE.push(rrAt(0, i / N * L0, {}));
}
function band(P, C, o0, y0, o1, y1, color) {
    for (let i = 0; i < BASE.length - 1; i++) {
        const a = BASE[i], b = BASE[i + 1];
        P.push(a.x + a.nx * o0, y0, a.z + a.nz * o0, b.x + b.nx * o0, y0, b.z + b.nz * o0, b.x + b.nx * o1, y1, b.z + b.nz * o1, a.x + a.nx * o0, y0, a.z + a.nz * o0, b.x + b.nx * o1, y1, b.z + b.nz * o1, a.x + a.nx * o1, y1, a.z + a.nz * o1);
        const c = typeof color === 'function' ? color((a.x + b.x) / 2, (a.z + b.z) / 2) : color;
        for (let k = 0; k < 6; k++)
            C.push(c.r, c.g, c.b);
    }
}
function ribbonGeo(o, y0, y1, tile, uOff = 0, filter = null, extra = null) {
    const pos = [], uv = [], ex = [];
    let acc = 0;
    for (let i = 0; i < BASE.length - 1; i++) {
        const a = BASE[i], b = BASE[i + 1];
        const ax = a.x + a.nx * o, az = a.z + a.nz * o, bx = b.x + b.nx * o, bz = b.z + b.nz * o, len = Math.hypot(bx - ax, bz - az);
        const u0 = uOff + acc / tile, u1 = uOff + (acc + len) / tile;
        acc += len;
        if (filter && !filter((az + bz) / 2))
            continue;
        pos.push(ax, y0, az, bx, y0, bz, bx, y1, bz, ax, y0, az, bx, y1, bz, ax, y1, az);
        uv.push(u0, 0, u1, 0, u1, 1, u0, 0, u1, 1, u0, 1);
        if (extra !== null)
            for (let k = 0; k < 6; k++)
                ex.push(extra);
    }
    return { pos, uv, ex };
}
function geoFrom(pos, uv, ex) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    if (uv)
        g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    if (ex)
        g.setAttribute('aSeed', new THREE.Float32BufferAttribute(ex, 1));
    g.computeVertexNormals();
    return g;
}
const ledTexes = [];
const fieldTex = makeFieldTex(), grassBump = makeGrassBump(), netBase = makeNetTex(), ledBase = makeLedTex(), hexBase = makeHexTex(), turfTex = makeTurfTex();
const BANNER_Y0 = RF + 1.2, BANNER_Y1 = RF + 5.2;
function rrShape(ax, az, r) {
    const s = new THREE.Shape();
    s.moveTo(-ax + r, -az);
    s.lineTo(ax - r, -az);
    s.absarc(ax - r, -az + r, r, -Math.PI / 2, 0, false);
    s.lineTo(ax, az - r);
    s.absarc(ax - r, az - r, r, 0, Math.PI / 2, false);
    s.lineTo(-ax + r, az);
    s.absarc(-ax + r, az - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(-ax, -az + r);
    s.absarc(-ax + r, -az + r, r, Math.PI, 1.5 * Math.PI, false);
    return s;
}
function arenaPath() {
    const pts = [], ax = HW - RCORN, az = HL - RCORN;
    const line = (x0, z0, x1, z1, mx, mz, extra = []) => {
        const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.ceil(L / 6)), ts = [];
        for (let i = 0; i < n; i++)
            ts.push(i / n);
        ts.push(...extra);
        ts.sort((p, q) => p - q);
        for (const t of ts)
            pts.push({ x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t, mx, mz });
    };
    const arc = (cx, cz, a0) => { for (let i = 0; i < 18; i++) {
        const t = a0 + i / 18 * Math.PI / 2;
        pts.push({ x: cx + RCORN * Math.cos(t), z: cz + RCORN * Math.sin(t), mx: -Math.cos(t), mz: -Math.sin(t) });
    } };
    const brk = [(ax - GW / 2) / (2 * ax), (ax + GW / 2) / (2 * ax)];
    line(HW, -az, HW, az, -1, 0);
    arc(ax, az, 0);
    line(ax, HL, -ax, HL, 0, -1, brk);
    arc(-ax, az, Math.PI / 2);
    line(-HW, az, -HW, -az, 1, 0);
    arc(-ax, -az, Math.PI);
    line(-ax, -HL, ax, -HL, 0, 1, brk);
    arc(ax, -az, 1.5 * Math.PI);
    pts.push({ ...pts[0] });
    return pts;
}
const isMouth = (a, b) => Math.abs(Math.abs(a.z) - HL) < .01 && Math.abs(Math.abs(b.z) - HL) < .01 && Math.abs((a.x + b.x) / 2) < GW / 2;
function sweepGeo(path, prof, K, filter, uS, uV) {
    const pos = [], nor = [], uv = [];
    let s = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const a = path[i], b = path[i + 1], len = Math.hypot(b.x - a.x, b.z - a.z);
        if (len < 1e-6)
            continue;
        const s0 = s;
        s += len;
        if (!filter(a, b))
            continue;
        for (let k = 0; k < K; k++) {
            const p0 = prof(k), p1 = prof(k + 1);
            const P = (q, pr) => [q.x + q.mx * pr[0], pr[1], q.z + q.mz * pr[0]], Nn = (q, pr) => [q.mx * pr[2], pr[3], q.mz * pr[2]];
            const A = P(a, p0), B = P(b, p0), C = P(b, p1), D = P(a, p1), nA = Nn(a, p0), nB = Nn(b, p0), nC = Nn(b, p1), nD = Nn(a, p1);
            pos.push(...A, ...B, ...C, ...A, ...C, ...D);
            nor.push(...nA, ...nB, ...nC, ...nA, ...nC, ...nD);
            const v0 = k / K * uV, v1 = (k + 1) / K * uV, u0 = s0 / uS, u1 = s / uS;
            uv.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1);
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    return g;
}
function buildArena() {
    const fg = new THREE.ShapeGeometry(rrShape(HW, HL, RCORN), 24);
    fg.rotateX(-Math.PI / 2);
    {
        const p = fg.attributes.position, uv = fg.attributes.uv;
        for (let i = 0; i < p.count; i++)
            uv.setXY(i, (p.getX(i) + HW) / FW, (HL - p.getZ(i)) / FL);
    }
    const field = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ map: fieldTex, bumpMap: grassBump, bumpScale: 1.4, roughness: .9, metalness: 0, envMapIntensity: .35 }));
    field.receiveShadow = true;
    scene.add(field);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600, 32, 32), new THREE.MeshStandardMaterial({ color: 0x2f5128, roughness: .95, envMapIntensity: .3, polygonOffset: true, polygonOffsetFactor: 4, polygonOffsetUnits: 4 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.3;
    ground.receiveShadow = true;
    scene.add(ground);
    const path = arenaPath(), K = 12;
    const floorFil = k => { const f = k / K * Math.PI / 2; return [RF - RF * Math.sin(f), RF - RF * Math.cos(f), Math.sin(f), Math.cos(f)]; };
    const turf = new THREE.MeshStandardMaterial({ map: turfTex, roughness: .9, envMapIntensity: .5, emissive: 0x112b0c, side: THREE.DoubleSide });
    const ramp = new THREE.Mesh(sweepGeo(path, floorFil, K, (a, b) => !isMouth(a, b), 14, RF * 1.57 / 14), turf);
    ramp.receiveShadow = true;
    scene.add(ramp);
    {
        const pos = [];
        for (const sz of [-1, 1])
            for (const sx of [-1, 1]) {
                const x0 = sx * GW / 2, J = 12, pts = [];
                for (let j = 0; j <= J; j++) {
                    const u = RF - j / J * RF, h = RF - Math.sqrt(Math.max(0, RF * RF - (RF - u) * (RF - u)));
                    pts.push([sz * (HL - u), h]);
                }
                if ((pts[J][0] - pts[0][0]) * sx < 0)
                    pts.reverse();
                for (let j = 0; j < J; j++) {
                    const [za, ha] = pts[j], [zb, hb] = pts[j + 1];
                    pos.push(x0, 0, za, x0, 0, zb, x0, hb, zb, x0, 0, za, x0, hb, zb, x0, ha, za);
                }
            }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        g.computeVertexNormals();
        scene.add(new THREE.Mesh(g, turf));
    }
    const glassMat = (col, rep, op) => {
        const t = hexBase.clone();
        t.needsUpdate = true;
        t.repeat.set(rep, rep);
        return new THREE.MeshStandardMaterial({ color: col, map: t, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide, roughness: .12, metalness: .4, envMapIntensity: 1.2, emissive: col, emissiveIntensity: .15 });
    };
    const wallProf = (y0, y1) => k => [0, k ? y1 : y0, 1, 0];
    const ceilFil = k => { const f = (1 - k / K) * Math.PI / 2; return [RF - RF * Math.sin(f), FH - RF + RF * Math.cos(f), Math.sin(f), -Math.cos(f)]; };
    for (const side of [0, 1]) {
        const half = (a, b) => ((a.z + b.z) / 2 < 0) === (side === 0);
        const mat = glassMat(side ? 0xff9a9a : 0x9ac0ff, 1, .5), topMat = glassMat(side ? 0xffb8b8 : 0xb8d2ff, 1, .26);
        const add = (g, m) => { const me = new THREE.Mesh(g, m); me.renderOrder = 2; scene.add(me); };
        add(sweepGeo(path, wallProf(RF, FH - RF), 1, (a, b) => half(a, b) && !isMouth(a, b), 12, (FH - 2 * RF) / 12), mat);
        add(sweepGeo(path, wallProf(GH, FH - RF), 1, (a, b) => half(a, b) && isMouth(a, b), 12, (FH - RF - GH) / 12), mat);
        add(sweepGeo(path, ceilFil, K, half, 12, RF * 1.57 / 12), topMat);
    }
    const cg = new THREE.ShapeGeometry(rrShape(HW - RF, HL - RF, RCORN - RF), 24);
    cg.rotateX(Math.PI / 2);
    cg.translate(0, FH, 0);
    const ceil = new THREE.Mesh(cg, glassMat(0xd8e6ff, 1 / 12, .13));
    ceil.renderOrder = 2;
    scene.add(ceil);
    {
        const t = ledBase.clone();
        t.needsUpdate = true;
        t.wrapS = THREE.RepeatWrapping;
        ledTexes.push(t);
        scene.add(new THREE.Mesh(sweepGeo(path, k => [.05, k ? BANNER_Y1 : BANNER_Y0, 1, 0], 1, (a, b) => !isMouth(a, b), 64, 1), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })));
    }
    for (const sz of [-1, 1])
        buildGoal(sz);
}
function buildGoal(sz) {
    const team = sz < 0 ? 0 : 1, col = TEAM_COL[team];
    const fm = new THREE.MeshStandardMaterial({ color: col, metalness: .45, roughness: .28, emissive: col, emissiveIntensity: .3 });
    const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; scene.add(m); return m; };
    for (const sx of [-1, 1])
        add(new THREE.CylinderGeometry(.6, .6, GH, 18), fm, sx * GW / 2, GH / 2, sz * HL);
    add(new THREE.CylinderGeometry(.6, .6, GW + 1.2, 18), fm, 0, GH, sz * HL).rotation.z = Math.PI / 2;
    const bm = new THREE.MeshStandardMaterial({ color: 0xe6e9ef, metalness: .6, roughness: .35 });
    for (const sx of [-1, 1]) {
        add(new THREE.CylinderGeometry(.3, .3, GH, 10), bm, sx * GW / 2, GH / 2, sz * (HL + GD));
        add(new THREE.CylinderGeometry(.3, .3, GD, 10), bm, sx * GW / 2, GH, sz * (HL + GD / 2)).rotation.x = Math.PI / 2;
    }
    add(new THREE.CylinderGeometry(.3, .3, GW, 10), bm, 0, GH, sz * (HL + GD)).rotation.z = Math.PI / 2;
    const net = (w, h) => { const t = netBase.clone(); t.needsUpdate = true; rep(t, w / 2.4, h / 2.4); return new THREE.MeshStandardMaterial({ color: 0xffffff, map: t, alphaTest: .4, side: THREE.DoubleSide, roughness: .8 }); };
    const back = new THREE.Mesh(new THREE.PlaneGeometry(GW, GH), net(GW, GH));
    back.position.set(0, GH / 2, sz * (HL + GD));
    scene.add(back);
    for (const sx of [-1, 1]) {
        const s = new THREE.Mesh(new THREE.PlaneGeometry(GD, GH), net(GD, GH));
        s.rotation.y = Math.PI / 2;
        s.position.set(sx * GW / 2, GH / 2, sz * (HL + GD / 2));
        scene.add(s);
    }
    const top = new THREE.Mesh(new THREE.PlaneGeometry(GW, GD), net(GW, GD));
    top.rotation.x = Math.PI / 2;
    top.position.set(0, GH, sz * (HL + GD / 2));
    scene.add(top);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(GW, GD), new THREE.MeshStandardMaterial({ color: 0x3f7d2f, roughness: .9 }));
    fl.rotation.x = -Math.PI / 2;
    fl.position.set(0, .01, sz * (HL + GD / 2));
    fl.receiveShadow = true;
    scene.add(fl);
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(GW, 1.1), new THREE.MeshBasicMaterial({ color: col, toneMapped: false }));
    strip.rotation.x = -Math.PI / 2;
    strip.position.set(0, .03, sz * (HL + .7));
    scene.add(strip);
    const L = new THREE.PointLight(col, 900, 80, 2);
    L.position.set(0, GH * .6, sz * (HL + GD * .55));
    scene.add(L);
}
buildArena();
const crowdU = { uTime: { value: 0 }, uExciteB: { value: 0 }, uExciteR: { value: 0 } };
const cardMats = [];
let jumboTex = null;
function buildStadium() {
    const P = [], C = [];
    const conc = new THREE.Color(0x9b9ea4), concD = new THREE.Color(0x63666d), walk = new THREE.Color(0x80838a);
    const seats = [[new THREE.Color(0x1d4fb8), new THREE.Color(0x173f94)], [new THREE.Color(0xb8141f), new THREE.Color(0x93101a)]];
    const seatCol = k => (x, z) => seats[z < 0 ? 0 : 1][k & 1];
    band(P, C, 0, 0, 0, H1, concD);
    for (let r = 0; r < LR; r++) {
        const o = r * D1, h = H1 + r * R1;
        if (r)
            band(P, C, o, h - R1, o, h, conc);
        band(P, C, o, h, o + D1, h, seatCol(r));
    }
    band(P, C, LR * D1, TOP_L, O2, TOP_L, walk);
    band(P, C, O2, TOP_L, O2, H2, concD);
    for (let r = 0; r < UR; r++) {
        const o = O2 + r * D2, h = H2 + r * R2;
        if (r)
            band(P, C, o, h - R2, o, h, conc);
        band(P, C, o, h, o + D2, h, seatCol(r));
    }
    band(P, C, BACK, TOP_U, BACK, SUITE_Y, concD);
    band(P, C, BACK, SUITE_Y, O3, SUITE_Y, walk);
    band(P, C, O3, SUITE_Y, O3, H3, concD);
    for (let r = 0; r < TR; r++) {
        const o = O3 + r * D3, h = H3 + r * R3;
        if (r)
            band(P, C, o, h - R3, o, h, conc);
        band(P, C, o, h, o + D3, h, seatCol(r));
    }
    band(P, C, BACK3, TOP_3, BACK3, ROOF_Y, new THREE.Color(0x1b2232));
    band(P, C, ROOF_IN, ROOF_Y - 2.5, BACK3 + 1, ROOF_Y, new THREE.Color(0x2b313c));
    band(P, C, ROOF_IN, ROOF_Y - 5.5, ROOF_IN, ROOF_Y - 2.5, new THREE.Color(0xeef1f5));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
    g.computeVertexNormals();
    scene.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .88, side: THREE.DoubleSide, envMapIntensity: .3 })));
    {
        const r = ribbonGeo(O2 - .08, TOP_L + 1.4, H2 - 1.4, 60);
        const t = ledBase.clone();
        t.needsUpdate = true;
        t.wrapS = THREE.RepeatWrapping;
        ledTexes.push(t);
        scene.add(new THREE.Mesh(geoFrom(r.pos, r.uv), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, side: THREE.DoubleSide })));
    }
    {
        const r = ribbonGeo(BACK - .06, TOP_U + .25, SUITE_Y - .2, 18);
        scene.add(new THREE.Mesh(geoFrom(r.pos, r.uv), new THREE.MeshBasicMaterial({ map: makeSuiteTex(), toneMapped: false, side: THREE.DoubleSide })));
    }
    {
        const L = rrLen(ROOF_IN - .4), n = Math.floor(L / 7), lm = new THREE.InstancedMesh(new THREE.BoxGeometry(2.4, .9, .6), new THREE.MeshBasicMaterial({ color: 0xfffbea, toneMapped: false }), n), m4 = new THREE.Matrix4(), q = new Q4(), p = {};
        for (let i = 0; i < n; i++) {
            rrAt(ROOF_IN - .4, i * L / n, p);
            q.setFromEuler(new THREE.Euler(.5, Math.atan2(-p.nx, -p.nz), 0, 'YXZ'));
            m4.compose(new V3(p.x, ROOF_Y - 6.3, p.z), q, new V3(1, 1, 1));
            lm.setMatrixAt(i, m4);
        }
        scene.add(lm);
    }
    jumboTex = mkTex(jumboC);
    const JY = 55, JZ = BZ + ROOF_IN + 3, JTOP = JY + 13.5, JROOF = ROOF_Y - 2.5 + 2.5 * 3.8 / (BACK3 + 1 - ROOF_IN);
    for (const sz of [-1, 1]) {
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(64, 26.9), new THREE.MeshBasicMaterial({ map: jumboTex, toneMapped: false }));
        scr.position.set(0, JY, sz * JZ);
        if (sz > 0)
            scr.rotation.y = Math.PI;
        scene.add(scr);
        const fr = new THREE.Mesh(new THREE.BoxGeometry(66, 29, 1.2), new THREE.MeshStandardMaterial({ color: 0x14171d, metalness: .6, roughness: .4 }));
        fr.position.set(0, JY, sz * (JZ + .8));
        scene.add(fr);
        for (const sx of [-1, 1]) {
            const c = new THREE.Mesh(new THREE.BoxGeometry(.4, JROOF - JTOP, .4), fr.material);
            c.position.set(sx * 22, (JTOP + JROOF) / 2, sz * (JZ + .8));
            scene.add(c);
        }
    }
    buildCrowd3D();
    buildCrowdCards();
}
function personGeo(hi) {
    const pieces = [];
    const add = (geo, part, arm, x, y, z) => {
        const gg = geo.index ? geo.toNonIndexed() : geo;
        gg.translate(x, y, z);
        gg.deleteAttribute('uv');
        const n = gg.attributes.position.count;
        gg.setAttribute('aPart', new THREE.Float32BufferAttribute(new Float32Array(n).fill(part), 1));
        gg.setAttribute('aArm', new THREE.Float32BufferAttribute(new Float32Array(n).fill(arm), 1));
        pieces.push(gg);
    };
    add(new THREE.BoxGeometry(.86, .90, .46), 0, 0, 0, 1.38, 0);
    add(new THREE.BoxGeometry(.20, .17, .20), 1, 0, 0, 1.86, 0);
    add(new THREE.IcosahedronGeometry(.33, hi ? 1 : 0), 1, 0, 0, 2.17, 0);
    for (const side of [-1, 1]) {
        add(new THREE.BoxGeometry(.29, .70, .34), 0, side, side * .61, 1.36, 0);
        add(new THREE.BoxGeometry(.24, .19, .28), 1, side, side * .61, .91, 0);
        add(new THREE.BoxGeometry(.31, .82, .39), 3, 0, side * .225, .51, 0);
        add(new THREE.BoxGeometry(.42, .17, .61), 2, 0, side * .225, .09, .11);
    }
    let total = 0;
    for (const piece of pieces)
        total += piece.attributes.position.count;
    const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), part = new Float32Array(total), arm = new Float32Array(total);
    let offset = 0;
    for (const piece of pieces) {
        pos.set(piece.attributes.position.array, offset * 3);
        nor.set(piece.attributes.normal.array, offset * 3);
        part.set(piece.attributes.aPart.array, offset);
        arm.set(piece.attributes.aArm.array, offset);
        offset += piece.attributes.position.count;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setAttribute('aPart', new THREE.BufferAttribute(part, 1));
    g.setAttribute('aArm', new THREE.BufferAttribute(arm, 1));
    return g;
}
let crowdCount = 0;
const crowdLOD = [];
function buildCrowd3D() {
    const base = personGeo(false), baseHi = personGeo(true), NSEC = 24, secs = Array.from({ length: NSEC }, () => []);
    const S = 1.0, SP = 1.3, R = mulberry32(1234);
    for (let r = 0; r < LR; r++) {
        const o = r * D1 + .95, h = H1 + r * R1, L = rrLen(o), n = Math.floor(L / SP), j = R() * SP;
        for (let k = 0; k < n; k++) {
            const s = k * SP + j + (R() - .5) * .18, p = rrAt(o, s, {});
            const yaw = Math.atan2(-p.nx, -p.nz) + (R() - .5) * .3, side = p.z < 0 ? 0 : 1;
            const sec = Math.min(NSEC - 1, Math.floor((((s % L) + L) % L) / L * NSEC));
            secs[sec].push({ x: p.x, y: h, z: p.z, yaw, sc: S * (.92 + R() * .16), side, r1: R(), r2: R(), r3: R(), r4: R(), r5: R(), ph: R() * 6.283 });
        }
    }
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    mat.onBeforeCompile = sh => {
        sh.uniforms.uTime = crowdU.uTime;
        sh.uniforms.uExciteB = crowdU.uExciteB;
        sh.uniforms.uExciteR = crowdU.uExciteR;
        sh.vertexShader = 'attribute float aPart; attribute float aArm; attribute vec3 aShirt; attribute vec3 aSkin; attribute vec3 aHair; attribute vec3 aPants; attribute float aPhase; attribute float aTeam;\nuniform float uTime; uniform float uExciteB; uniform float uExciteR; varying vec3 vCrowd;\n' +
            sh.vertexShader.replace('#include <begin_vertex>', `
        vec3 transformed = vec3(position);
        float ex = clamp((aTeam < 0.5 ? uExciteB : uExciteR) * (0.55 + 0.45 * sin(aPhase * 3.7)), 0.0, 1.0);
        if (aArm != 0.0) {
          vec2 piv = vec2(aArm * 0.61, 1.70);
          float th = aArm * ex * (2.3 + 0.5 * sin(aPhase * 5.3)) + aArm * ex * 0.25 * sin(uTime * 9.0 + aPhase);
          vec2 p = transformed.xy - piv; float cs = cos(th), sn = sin(th);
          transformed.xy = piv + vec2(p.x * cs - p.y * sn, p.x * sn + p.y * cs);
        }
        transformed.y += ex * abs(sin(uTime * 7.5 + aPhase)) * 0.32;
        transformed.x += sin(uTime * 1.1 + aPhase) * 0.02 * max(transformed.y, 0.0);
        vCrowd = aPart < 0.5 ? aShirt : (aPart < 1.5 ? aSkin : (aPart < 2.5 ? aHair : aPants));`);
        sh.fragmentShader = 'varying vec3 vCrowd;\n' + sh.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'vec4 diffuseColor = vec4( diffuse * vCrowd, opacity );')
            .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb * 0.3;');
    };
    const col = new THREE.Color(), m4 = new THREE.Matrix4(), q = new Q4(), sc = new V3(), ps = new V3();
    for (const list of secs) {
        const n = list.length;
        if (!n)
            continue;
        const geo = new THREE.BufferGeometry(), geoHi = new THREE.BufferGeometry();
        for (const k of ['position', 'normal', 'aPart', 'aArm']) {
            geo.setAttribute(k, base.attributes[k]);
            geoHi.setAttribute(k, baseHi.attributes[k]);
        }
        const shirt = new Float32Array(n * 3), skin = new Float32Array(n * 3), hair = new Float32Array(n * 3), pants = new Float32Array(n * 3), phase = new Float32Array(n), team = new Float32Array(n);
        list.forEach((pp, i) => {
            const t = pp.side, sk = pp.r3 < .5 ? '#e2ad82' : '#9d6042';
            col.set(t ? '#ed424d' : '#3988ff').toArray(shirt, i * 3);
            col.set(sk).toArray(skin, i * 3);
            col.set('#f3f5fc').toArray(hair, i * 3);
            col.set('#202e47').toArray(pants, i * 3);
            phase[i] = pp.ph;
            team[i] = pp.side;
        });
        geo.setAttribute('aShirt', new THREE.InstancedBufferAttribute(shirt, 3));
        geo.setAttribute('aSkin', new THREE.InstancedBufferAttribute(skin, 3));
        geo.setAttribute('aHair', new THREE.InstancedBufferAttribute(hair, 3));
        geo.setAttribute('aPants', new THREE.InstancedBufferAttribute(pants, 3));
        geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1));
        geo.setAttribute('aTeam', new THREE.InstancedBufferAttribute(team, 1));
        for (const k of ['aShirt', 'aSkin', 'aHair', 'aPants', 'aPhase', 'aTeam'])
            geoHi.setAttribute(k, geo.attributes[k]);
        const mesh = new THREE.InstancedMesh(geo, mat, n), meshHi = new THREE.InstancedMesh(geoHi, mat, n);
        list.forEach((pp, i) => { q.setFromAxisAngle(UP, pp.yaw); sc.setScalar(pp.sc); ps.set(pp.x, pp.y, pp.z); mesh.setMatrixAt(i, m4.compose(ps, q, sc)); });
        mesh.instanceMatrix.needsUpdate = true;
        meshHi.instanceMatrix = mesh.instanceMatrix;
        mesh.computeBoundingSphere();
        meshHi.computeBoundingSphere();
        meshHi.visible = false;
        scene.add(mesh);
        scene.add(meshHi);
        crowdLOD.push({ lo: mesh, hi: meshHi, c: mesh.boundingSphere.center.clone(), r: mesh.boundingSphere.radius });
        crowdCount += n;
    }
}
function buildCrowdCards() {
    const TILE = 32 * 1.3, R = mulberry32(99);
    const texs = [[drawCrowdStrip(11, 0, false), drawCrowdStrip(11, 0, true)], [drawCrowdStrip(22, 1, false), drawCrowdStrip(22, 1, true)]];
    const data = [{ pos: [], uv: [], ex: [] }, { pos: [], uv: [], ex: [] }];
    const rows = [];
    for (let r = 0; r < UR; r++)
        rows.push([O2 + r * D2 + 1.0, H2 + r * R2 + .05]);
    for (let r = 0; r < TR; r++)
        rows.push([O3 + r * D3 + 1.0, H3 + r * R3 + .05]);
    for (const [o, y0] of rows) {
        const seed = R() * 100, uOff = R() * 30;
        for (const side of [0, 1]) {
            const g = ribbonGeo(o, y0, y0 + 1.95, TILE, uOff, z => side ? z >= 0 : z < 0, seed);
            data[side].pos.push(...g.pos);
            data[side].uv.push(...g.uv);
            data[side].ex.push(...g.ex);
        }
    }
    for (const side of [0, 1]) {
        const mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uCalm: { value: null }, uCheer: { value: null }, uShade: { value: .86 } }]),
            vertexShader: `attribute float aSeed; varying vec2 vUv; varying float vSeed;
        #include <fog_pars_vertex>
        void main() { vUv = uv; vSeed = aSeed; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,
            fragmentShader: `uniform sampler2D uCalm; uniform sampler2D uCheer; uniform float uTime; uniform float uExcite; uniform float uShade; varying vec2 vUv; varying float vSeed;
        #include <fog_pars_fragment>
        float h1(float n) { return fract(sin(n * 12.9898 + vSeed * 78.233) * 43758.5453); }
        void main() {
          float r = h1(floor(vUv.x * 32.0));
          float cheer = step(r, uExcite * 1.15 - 0.1);
          float jump = cheer * abs(sin(uTime * 7.5 + r * 6.2831)) * 0.11;
          vec2 uv = vec2(vUv.x, vUv.y - jump);
          if (uv.y < 0.0) discard;
          vec2 dx = dFdx(vUv), dy = dFdy(vUv);
          vec4 c = mix(textureGrad(uCalm, uv, dx, dy), textureGrad(uCheer, uv, dx, dy), cheer);
          if (c.a < 0.5) discard;
          gl_FragColor = vec4(c.rgb * uShade, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }`,
            fog: true, side: THREE.DoubleSide,
        });
        mat.uniforms.uCalm.value = texs[side][0];
        mat.uniforms.uCheer.value = texs[side][1];
        mat.uniforms.uTime = crowdU.uTime;
        mat.uniforms.uExcite = side ? crowdU.uExciteR : crowdU.uExciteB;
        cardMats.push(mat);
        scene.add(new THREE.Mesh(geoFrom(data[side].pos, data[side].uv, data[side].ex), mat));
    }
}
const jumboC = mkCanvas(1024, 430);
let jumboKey = '', lastGoalTeam = -1;
function drawJumbo() {
    const clock = overtime ? '+' + fmt(otTime) : fmt(timeLeft), flash = state === 'goal' || state === 'replay' ? lastGoalTeam : -1, rp = state === 'replay', fin = rp && !!(replay && replay.final);
    const key = `${scoreArr[0]}|${scoreArr[1]}|${attract ? 'A' : clock}|${flash}|${rp}|${fin}|${replayScorer}`;
    if (key === jumboKey)
        return;
    jumboKey = key;
    const g = jumboC.getContext('2d'), W = 1024, H = 430;
    g.fillStyle = '#04060b';
    g.fillRect(0, 0, W, H);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    if (flash >= 0) {
        const gr = g.createLinearGradient(0, 0, W, H);
        gr.addColorStop(0, flash ? '#ff3b3b' : '#3d86ff');
        gr.addColorStop(1, flash ? '#6e0a10' : '#0b2a6e');
        g.fillStyle = gr;
        g.fillRect(0, 0, W, H);
        g.fillStyle = '#fff';
        const word = fin ? 'FINAL REPLAY' : rp ? 'REPLAY' : 'GOAL!';
        let fs = rp ? 190 : 220;
        g.font = `italic 900 ${fs}px Segoe UI, Arial`;
        while (fs > 60 && g.measureText(word).width > W - 70) {
            fs -= 6;
            g.font = `italic 900 ${fs}px Segoe UI, Arial`;
        }
        g.fillText(word, W / 2, H / 2 - 20);
        g.font = '800 46px Segoe UI, Arial';
        const goalScorer = replayScorer >= 0 ? cars[replayScorer] : null;
        g.fillText(`${goalScorer ? goalScorer.name : TEAM_NAME[flash]} SCORED!`, W / 2, H - 55);
    }
    else {
        const bw = 340;
        let gr = g.createLinearGradient(0, 60, 0, 320);
        gr.addColorStop(0, '#3d86ff');
        gr.addColorStop(1, '#123b9a');
        g.fillStyle = gr;
        g.fillRect(36, 60, bw, 250);
        gr = g.createLinearGradient(0, 60, 0, 320);
        gr.addColorStop(0, '#ff4747');
        gr.addColorStop(1, '#8e0f16');
        g.fillStyle = gr;
        g.fillRect(W - 36 - bw, 60, bw, 250);
        g.fillStyle = '#fff';
        g.font = '800 40px Segoe UI, Arial';
        g.fillText('BLUE', 36 + bw / 2, 100);
        g.fillText('RED', W - 36 - bw / 2, 100);
        g.font = 'italic 900 150px Segoe UI, Arial';
        g.fillText(scoreArr[0], 36 + bw / 2, 212);
        g.fillText(scoreArr[1], W - 36 - bw / 2, 212);
        g.font = 'italic 900 62px Segoe UI, Arial';
        g.fillStyle = !attract && !overtime && timeLeft <= 60 ? '#ff4545' : '#fff';
        g.fillText(attract ? 'LIVE' : clock, W / 2, 185);
        drawTurboClash(g, W / 2 - 150, H - 52, 40);
        drawPlayvora(g, W / 2 + 160, H - 52, 40);
        g.fillStyle = '#9fb3d9';
        g.textAlign = 'center';
        g.fillText('\u2022', W / 2 + 8, H - 52);
    }
    g.fillStyle = 'rgba(0,0,0,.22)';
    for (let y = 0; y < H; y += 4)
        g.fillRect(0, y, W, 1.4);
    for (let x = 0; x < W; x += 4)
        g.fillRect(x, 0, 1.4, H);
    if (jumboTex)
        jumboTex.needsUpdate = true;
}
buildStadium();
const [ballMap, ballBump] = makeBallTex();
const ball = {
    pos: new V3(0, BR, 0), vel: new V3(), active: true, spin: new V3(),
    mesh: new THREE.Mesh(new THREE.SphereGeometry(BR, 64, 40), new THREE.MeshPhysicalMaterial({ map: ballMap, bumpMap: ballBump, bumpScale: 2.5, roughness: .42, metalness: 0, clearcoat: .35, clearcoatRoughness: .3 })),
};
ball.mesh.castShadow = true;
scene.add(ball.mesh);
const blob = new THREE.Mesh(new THREE.CircleGeometry(BR * 1.05, 40), new THREE.MeshBasicMaterial({ map: mkTex((() => { const c = mkCanvas(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.7)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; })()), transparent: true, depthWrite: false }));
blob.rotation.x = -Math.PI / 2;
scene.add(blob);
const shock = new THREE.Mesh(new THREE.RingGeometry(.85, 1, 64), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
shock.visible = false;
scene.add(shock);
let shockT = 0;
const MAXP = 2600;
const parts = { pos: new Float32Array(MAXP * 3), col: new Float32Array(MAXP * 3), vel: new Float32Array(MAXP * 3), base: new Float32Array(MAXP * 3), life: new Float32Array(MAXP), max: new Float32Array(MAXP), grav: new Float32Array(MAXP), i: 0 };
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(parts.pos, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(parts.col, 3));
for (let i = 0; i < MAXP; i++)
    parts.pos[i * 3 + 1] = -999;
const dotTex = mkTex((() => { const c = mkCanvas(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c; })());
const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: .9, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
pMesh.frustumCulled = false;
scene.add(pMesh);
function spawnP(x, y, z, vx, vy, vz, r, g, b, life, grav = 0) {
    const i = parts.i;
    parts.i = (i + 1) % MAXP;
    const k = i * 3;
    parts.pos[k] = x;
    parts.pos[k + 1] = y;
    parts.pos[k + 2] = z;
    parts.vel[k] = vx;
    parts.vel[k + 1] = vy;
    parts.vel[k + 2] = vz;
    parts.base[k] = r;
    parts.base[k + 1] = g;
    parts.base[k + 2] = b;
    parts.life[i] = life;
    parts.max[i] = life;
    parts.grav[i] = grav;
}
function burst(p, hex, n, spd, life = 1.2) {
    const c = new THREE.Color(hex), d = new V3();
    for (let i = 0; i < n; i++) {
        d.set(rand(-1, 1), rand(-.3, 1), rand(-1, 1)).normalize().multiplyScalar(spd * rand(.3, 1));
        const w = Math.random() < .25 ? 1 : 0;
        spawnP(p.x, p.y, p.z, d.x, d.y, d.z, lerp(c.r, 1, w), lerp(c.g, 1, w), lerp(c.b, 1, w), life * rand(.5, 1), 12);
    }
}
function updateParts(dt) {
    const dr = Math.exp(-2.2 * dt);
    for (let i = 0; i < MAXP; i++) {
        const k = i * 3;
        if (parts.life[i] <= 0) {
            parts.pos[k + 1] = -999;
            continue;
        }
        parts.life[i] -= dt;
        const f = Math.max(0, parts.life[i] / parts.max[i]);
        parts.vel[k + 1] -= parts.grav[i] * dt;
        parts.vel[k] *= dr;
        parts.vel[k + 1] *= dr;
        parts.vel[k + 2] *= dr;
        parts.pos[k] += parts.vel[k] * dt;
        parts.pos[k + 1] += parts.vel[k + 1] * dt;
        parts.pos[k + 2] += parts.vel[k + 2] * dt;
        parts.col[k] = parts.base[k] * f;
        parts.col[k + 1] = parts.base[k + 1] * f;
        parts.col[k + 2] = parts.base[k + 2] * f;
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;
}
function makeNameTag(text, col) {
    const c = mkCanvas(256, 64), g = c.getContext('2d');
    g.font = 'italic 900 34px Segoe UI, Arial';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.lineWidth = 6;
    g.strokeStyle = 'rgba(0,0,0,.75)';
    g.strokeText(text, 128, 32);
    g.fillStyle = col;
    g.fillText(text, 128, 32);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: mkTex(c), depthWrite: false, transparent: true, toneMapped: false }));
    s.scale.set(7, 1.75, 1);
    s.position.y = 3.1;
    return s;
}
const tireGeo = new THREE.LatheGeometry([[.34, -.25], [.5, -.26], [.57, -.2], [.59, -.07], [.59, .07], [.57, .2], [.5, .26], [.34, .25]].map(([x, y]) => new THREE.Vector2(x, y)), 24).rotateZ(Math.PI / 2);
const rimGeo = new THREE.CylinderGeometry(.36, .36, .36, 20).rotateZ(Math.PI / 2);
const spokeGeo = new THREE.BoxGeometry(.06, .62, .09), capGeo = new THREE.CylinderGeometry(.1, .1, .06, 12).rotateZ(Math.PI / 2);
const tireM = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: .82 }), rimM = new THREE.MeshStandardMaterial({ color: 0xa5adb8, metalness: .95, roughness: .22 });
function extrudeSide(pts, width, bevel) {
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++)
        s.lineTo(pts[i][0], pts[i][1]);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: width, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * .85, bevelSegments: 3, curveSegments: 6 });
    g.rotateY(-Math.PI / 2);
    g.translate(width / 2, -CAR_Y, 0);
    return g;
}
const SKIN_TIME = { value: 0 };
const SKIN_GLSL = `
uniform vec3 uSkA; uniform vec3 uSkB; uniform vec3 uSkC; uniform float uSkTime;
varying vec3 vSkinP;
float skH(vec3 p){ p = fract(p * 0.3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float skN(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(skH(i), skH(i + vec3(1,0,0)), f.x), mix(skH(i + vec3(0,1,0)), skH(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(skH(i + vec3(0,0,1)), skH(i + vec3(1,0,1)), f.x), mix(skH(i + vec3(0,1,1)), skH(i + vec3(1,1,1)), f.x), f.y), f.z); }
float skF(vec3 p){ float a = 0.0, w = .5; for (int i = 0; i < 4; i++) { a += w * skN(p); p = p * 2.03 + 7.1; w *= .5; } return a; }
`;
const SKIN_PAT = {
    1: `float s = step(.1, abs(p.x)) * step(abs(p.x), .32) + step(abs(abs(p.x) - .42), .03);
        col = mix(uSkA, uSkB, clamp(s, 0.0, 1.0));`,
    2: `float c = mod(floor(p.x * 2.6) + floor(p.y * 2.6) + floor(p.z * 2.6), 2.0);
        col = mix(uSkA, uSkB, c);`,
    3: `float n = skF(p * 1.4 + 3.0);
        col = n < .43 ? uSkA : (n < .56 ? uSkB : uSkC);`,
    4: `float t = (2.55 - p.z) / 3.4;
        float e = .55 + .16 * sin(p.y * 11.0 + p.x * 4.0) + .22 * (skN(p * 3.2) - .5) + .1 * sin(abs(p.x) * 9.0);
        float m = 1.0 - smoothstep(e - .02, e + .02, t);
        vec3 fc = mix(uSkC, uSkB, clamp(t * 1.9, 0.0, 1.0));
        col = mix(uSkA, fc, m); emi += fc * m * .35;`,
    5: `float n = skF(p * 1.1);
        col = mix(uSkA, uSkB, smoothstep(.35, .75, n));
        float h = skH(floor(p * 38.0)); float st = step(.982, h);
        float tw = .6 + .4 * sin(uSkTime * 3.0 + h * 60.0);
        col = mix(col, vec3(1.0), st); emi += uSkB * smoothstep(.55, .8, n) * .25 + uSkC * st * 2.2 * tw; rough = .25;`,
    6: `vec3 d = abs(fract(p * 2.2) - .5);
        float g = max(max(smoothstep(.455, .49, d.x), smoothstep(.455, .49, d.z)), smoothstep(.455, .49, d.y) * .6);
        float pulse = 1.3 + .7 * sin(uSkTime * 3.0 - p.z * 2.5);
        col = mix(uSkA, uSkB, g); emi += uSkB * g * pulse;`,
    7: `float n = skF(p * 1.8 + vec3(0.0, -uSkTime * .25, uSkTime * .1));
        float k = 1.0 - smoothstep(0.0, .07, abs(n - .5));
        float hot = pow(k, 3.0);
        col = mix(uSkA, uSkB, k); emi += uSkB * k * 2.0 + uSkC * hot * 2.5; rough = mix(.8, .3, k); metal = 0.05;`,
    8: `float v = sin(p.z * 7.5 + skN(p * 2.2) * 3.4 + abs(p.x) * 2.3 + p.y * 2.0);
        col = mix(uSkA, uSkB, smoothstep(.5, .58, v));`,
    9: `float a = skH(floor(p * 7.0)), b = skH(floor(p * 3.2) + 11.0);
        float n = mix(a, b, .55);
        col = n < .4 ? uSkA : (n < .62 ? uSkB : uSkC);`,
    10: `vec2 uv = vec2(p.z, p.x + p.y) * 15.0;
        float w = sin(uv.x) * sin(uv.y);
        float cell = mod(floor(uv.x / 3.14159) + floor(uv.y / 3.14159), 2.0);
        col = mix(uSkA, uSkB, smoothstep(-.3, .3, cell > .5 ? w : -w));`,
    11: `float f = dot(normal, normalize(vViewPosition));
        float hue = fract(f * 1.6 + p.z * .22 + p.y * .6 + uSkTime * .05);
        vec3 rb = clamp(abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        col = mix(uSkA, rb, .85); emi += rb * .08;`,
};
const RARITY = [
    { name: 'COMMON', css: '#9fb0d0' }, { name: 'RARE', css: '#4b97ff' },
    { name: 'EPIC', css: '#c070ff' }, { name: 'LEGENDARY', css: '#ffb22e' },
];
const SKINS = [
    { id: 'stock', name: 'FACTORY STOCK', rarity: 0, price: 0, team: true },
    { id: 'midnight', name: 'MIDNIGHT MATTE', rarity: 0, price: 500, color: 0x101114, rough: .8, metal: .1, clear: 0, accent: [0xb8c4ff, 0xffffff] },
    { id: 'arctic', name: 'ARCTIC PEARL', rarity: 0, price: 500, color: 0xeef2f7, rough: .22, metal: .25, clear: 1, accent: [0x8fe3ff, 0xffffff] },
    { id: 'yellow', name: 'RACING YELLOW', rarity: 0, price: 500, color: 0xffc400, rough: .3, metal: .2, clear: .9, accent: [0xffb000, 0xfff2b0] },
    { id: 'venom', name: 'LIME VENOM', rarity: 0, price: 500, color: 0x6dff1f, rough: .3, metal: .25, clear: .9, accent: [0x5dff2a, 0xe6ffd0] },
    { id: 'stripes', name: 'GT STRIPES', rarity: 1, price: 1200, pat: 1, color: 0xc4121c, b: 0xf4f4f4, rough: .3, metal: .2, clear: 1, accent: [0xff3b3b, 0xffffff] },
    { id: 'checker', name: 'CHECKERED FLAG', rarity: 1, price: 1200, pat: 2, color: 0xf2f2f2, b: 0x111111, rough: .35, metal: .1, clear: .8, accent: [0xffffff, 0xffffff] },
    { id: 'woodland', name: 'WOODLAND CAMO', rarity: 1, price: 1200, pat: 3, color: 0x3b4a2a, b: 0x6b6a3e, c: 0x1e2416, rough: .75, metal: .05, clear: 0, accent: [0x9adf4a, 0xeaffc8] },
    { id: 'tiger', name: 'TIGER CLAW', rarity: 1, price: 1200, pat: 8, color: 0xff7a00, b: 0x0d0d0d, rough: .4, metal: .15, clear: .7, accent: [0xff8a00, 0xffe2b0] },
    { id: 'chrome', name: 'CHROME MIRROR', rarity: 2, price: 2500, color: 0xf2f6ff, rough: .02, metal: 1, clear: 1, env: 2, accent: [0xcfe8ff, 0xffffff] },
    { id: 'gold', name: 'GOLD RUSH', rarity: 2, price: 2500, color: 0xffd36b, rough: .1, metal: 1, clear: .8, env: 2, accent: [0xffcc33, 0xfff6d0] },
    { id: 'carbon', name: 'CARBON STEALTH', rarity: 2, price: 2500, pat: 10, color: 0x0c0d10, b: 0x2a2d34, rough: .35, metal: .5, clear: 1, rim: 0x222428, accent: [0xff2a2a, 0xffd0d0] },
    { id: 'digital', name: 'DIGITAL CAMO', rarity: 2, price: 2500, pat: 9, color: 0x1d2b4a, b: 0x4c6a9e, c: 0xb5c7e6, rough: .55, metal: .1, clear: .3, accent: [0x5fa8ff, 0xd8ecff] },
    { id: 'neon', name: 'NEON GRID', rarity: 2, price: 3000, pat: 6, color: 0x07070c, b: 0x00f0ff, rough: .3, metal: .4, clear: 1, rim: 0x101018, accent: [0x00f0ff, 0xd8fdff] },
    { id: 'flames', name: 'INFERNO', rarity: 3, price: 5000, pat: 4, color: 0x0c0c10, b: 0xff2200, c: 0xffd400, rough: .25, metal: .3, clear: 1, accent: [0xff5a00, 0xfff0a0] },
    { id: 'galaxy', name: 'GALAXY', rarity: 3, price: 5000, pat: 5, color: 0x0a0630, b: 0x8a2be2, c: 0xffffff, rough: .25, metal: .3, clear: 1, accent: [0xb05cff, 0xf0d8ff] },
    { id: 'lava', name: 'LAVA CORE', rarity: 3, price: 6000, pat: 7, color: 0x140c0a, b: 0xff4a00, c: 0xffd060, rough: .6, metal: .05, clear: .2, rim: 0x1a1210, accent: [0xff3a00, 0xffd27a] },
    { id: 'holo', name: 'HOLO PRISM', rarity: 3, price: 7500, pat: 11, color: 0xffffff, rough: .12, metal: .85, clear: 1, env: 1.5, accent: [0xff6bf0, 0xc8fbff] },
];
const SKIN_BY_ID = Object.fromEntries(SKINS.map(s => [s.id, s]));
const BALL_PAT = {
    beach: `float lon = atan(d.z, d.x); float s = floor((lon / 6.2832 + .5) * 6.0);
        col = s < 1. ? vec3(.85,.05,.04) : s < 2. ? vec3(1.,.75,.02) : s < 3. ? vec3(.95) : s < 4. ? vec3(.02,.25,.9) : s < 5. ? vec3(.1,.7,.15) : vec3(1.,.35,.02);
        col = mix(col, vec3(.95), step(.9, abs(d.y))); col = mix(col, vec3(.8,.05,.04), step(.985, abs(d.y)));`,
    basket: `float m = min(min(abs(d.y), abs(d.x)), abs(abs(d.z) - .72 + .5 * d.y * d.y));
        col = uSkA * (.85 + .2 * skN(p * 40.0)); col = mix(col, uSkB, 1.0 - smoothstep(.012, .022, m)); rough = .8;`,
    melon: `float v = sin(atan(d.z, d.x) * 9.0 + skN(p * 3.0) * 4.0 + d.y * 2.0);
        col = mix(uSkA, uSkB, smoothstep(-.25, .25, v) * (.8 + .2 * skN(p * 9.0)));`,
    eye: `float t = d.z;
        float vein = (1.0 - smoothstep(0.0, .035, abs(skN(p * 4.5) - .5))) * smoothstep(.75, -.4, t);
        col = mix(vec3(.95,.93,.9), vec3(.75,.05,.05), vein * .8);
        float a = atan(d.y, d.x), streak = .7 + .3 * sin(a * 40.0 + skN(p * 8.0) * 6.0);
        col = mix(col, mix(uSkA, uSkB, smoothstep(.86, .95, t)) * streak, step(.86, t));
        col = mix(col, vec3(.01), step(.95, t)); col = mix(col, vec3(.02,.05,.06), smoothstep(.858, .862, t) - smoothstep(.87, .875, t)); rough = .1;`,
    earth: `float n = skF(p * 1.5 + 2.0);
        float land = smoothstep(.5, .53, n);
        vec3 sea = mix(vec3(.01,.05,.25), vec3(.03,.2,.5), smoothstep(.3, .5, n));
        vec3 grd = mix(vec3(.08,.35,.06), vec3(.45,.35,.15), smoothstep(.45, .65, skF(p * 4.0)));
        col = mix(sea, grd, land); col = mix(col, vec3(.95), smoothstep(.82, .88, abs(d.y)));
        float cl = smoothstep(.55, .72, skF(p * 2.4 + vec3(uSkTime * .03, 0.0, 0.0)));
        col = mix(col, vec3(1.0), cl * .75); rough = mix(.25, .85, max(land, cl)); emi += vec3(.02,.05,.12) * (1.0 - land);`,
    disco: `float lat = asin(clamp(d.y, -1.0, 1.0)), lon = atan(d.z, d.x);
        vec2 g = vec2((lon / 6.2832 + .5) * 40.0, (lat / 3.1416 + .5) * 20.0); vec2 f = fract(g);
        float e = step(.07, f.x) * step(.07, f.y) * step(f.x, .93) * step(f.y, .93);
        float h = skH(vec3(floor(g), 3.0));
        col = mix(vec3(.05), uSkA * (.8 + .4 * h), e); metal = e; rough = mix(.9, .04, e);
        emi += vec3(1.0) * step(.965, fract(h * 13.0 + uSkTime * .6)) * e * 2.0;`,
    sun: `float n = skF(p * 2.2 + vec3(0.0, uSkTime * .35, uSkTime * .1));
        col = mix(uSkA, uSkB, n * n); emi += mix(uSkA * .55, uSkC, pow(n, 3.0)) * 1.15; rough = .9; metal = 0.0;`,
};
const BALLS = [
    { id: 'classic', name: 'CLASSIC', rarity: 0, price: 0, classic: true },
    { id: 'beach', name: 'BEACH BALL', rarity: 0, price: 400, bpat: 'beach', rough: .35, metal: 0, clear: .8, accent: [0xffc400] },
    { id: 'hoops', name: 'HOOPS', rarity: 0, price: 400, bpat: 'basket', color: 0xd9581a, b: 0x161210, rough: .8, metal: 0, clear: 0, accent: [0xff7a1a] },
    { id: 'melon', name: 'WATERMELON', rarity: 1, price: 1000, bpat: 'melon', color: 0x1d4d16, b: 0x76b83f, rough: .45, metal: 0, clear: .6, accent: [0x6dff1f] },
    { id: 'eyeball', name: 'EYEBALL', rarity: 1, price: 1000, bpat: 'eye', color: 0x1b7a6e, b: 0x0d3550, rough: .1, metal: 0, clear: 1, accent: [0xff3b3b] },
    { id: 'checkmate', name: 'CHECKMATE', rarity: 1, price: 1000, pat: 2, color: 0xf2f2f2, b: 0x111111, rough: .3, metal: .1, clear: .8, accent: [0xffffff] },
    { id: 'earth', name: 'PLANET EARTH', rarity: 2, price: 2000, bpat: 'earth', rough: .5, metal: 0, clear: .3, accent: [0x3c8cff] },
    { id: 'disco', name: 'DISCO BALL', rarity: 2, price: 2500, bpat: 'disco', color: 0xeef2ff, rough: .05, metal: 1, clear: .4, env: 2, accent: [0xff6bf0] },
    { id: 'neonball', name: 'NEON CORE', rarity: 2, price: 2500, pat: 6, color: 0x07070c, b: 0xff2bd6, rough: .3, metal: .4, clear: 1, accent: [0xff2bd6] },
    { id: 'nebula', name: 'NEBULA', rarity: 3, price: 4000, pat: 5, color: 0x0a0630, b: 0x8a2be2, c: 0xffffff, rough: .25, metal: .3, clear: 1, accent: [0xb05cff] },
    { id: 'magma', name: 'MAGMA', rarity: 3, price: 4500, pat: 7, color: 0x140c0a, b: 0xff4a00, c: 0xffd060, rough: .6, metal: .05, clear: .2, accent: [0xff3a00] },
    { id: 'solar', name: 'SOLAR FLARE', rarity: 3, price: 5000, bpat: 'sun', color: 0xd83a00, b: 0xffa000, c: 0xffe27a, accent: [0xffb000] },
];
const BALL_BY_ID = Object.fromEntries(BALLS.map(b => [b.id, b]));
function ballMaterial(b) {
    if (!b || b.classic)
        return new THREE.MeshPhysicalMaterial({ map: ballMap, bumpMap: ballBump, bumpScale: 2.5, roughness: .42, metalness: 0, clearcoat: .35, clearcoatRoughness: .3 });
    const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: b.metal ?? 0, roughness: b.rough ?? .4, clearcoat: b.clear ?? .4, clearcoatRoughness: .1, envMapIntensity: b.env ?? 1 });
    const code = b.pat ? SKIN_PAT[b.pat] : BALL_PAT[b.bpat], key = 'ball' + (b.pat || b.bpat);
    const u = {
        uSkA: { value: new THREE.Color(b.color ?? 0xffffff) }, uSkB: { value: new THREE.Color(b.b ?? 0xffffff) },
        uSkC: { value: new THREE.Color(b.c ?? 0xffffff) }, uSkTime: SKIN_TIME,
    };
    m.onBeforeCompile = sh => {
        Object.assign(sh.uniforms, u);
        sh.vertexShader = 'varying vec3 vSkinP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvSkinP = normalize(position) * 1.8;');
        sh.fragmentShader = SKIN_GLSL + sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
            { vec3 p = vSkinP; vec3 d = normalize(p); vec3 col = diffuseColor.rgb; vec3 emi = vec3(0.0); float rough = roughnessFactor, metal = metalnessFactor;
              { ${code} }
              diffuseColor.rgb = col; totalEmissiveRadiance += emi; roughnessFactor = rough; metalnessFactor = metal; }`);
    };
    m.customProgramCacheKey = () => key;
    return m;
}
function skinPaint(skin, team) {
    if (!skin || skin.team)
        return new THREE.MeshPhysicalMaterial({ color: team ? 0xb00812 : 0x0b3fcf, metalness: .2, roughness: .36, clearcoat: .7, clearcoatRoughness: .05, envMapIntensity: .6 });
    const m = new THREE.MeshPhysicalMaterial({
        color: skin.pat ? 0xffffff : skin.color, metalness: skin.metal ?? .2, roughness: skin.rough ?? .36,
        clearcoat: skin.clear ?? .7, clearcoatRoughness: .05, envMapIntensity: skin.env ?? (skin.metal > .8 ? 1 : .6),
    });
    if (skin.irid) {
        m.iridescence = 1;
        m.iridescenceIOR = 1.8;
        m.iridescenceThicknessRange = [150, 900];
    }
    if (skin.pat) {
        const pat = skin.pat;
        const u = {
            uSkA: { value: new THREE.Color(skin.color) }, uSkB: { value: new THREE.Color(skin.b ?? 0xffffff) },
            uSkC: { value: new THREE.Color(skin.c ?? 0xffffff) }, uSkTime: SKIN_TIME,
        };
        m.onBeforeCompile = sh => {
            Object.assign(sh.uniforms, u);
            sh.vertexShader = 'varying vec3 vSkinP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvSkinP = position;');
            sh.fragmentShader = SKIN_GLSL + sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
            { vec3 p = vSkinP; vec3 col = diffuseColor.rgb; vec3 emi = vec3(0.0); float rough = roughnessFactor, metal = metalnessFactor;
              ${SKIN_PAT[pat]}
              diffuseColor.rgb = col; totalEmissiveRadiance += emi; roughnessFactor = rough; metalnessFactor = metal; }`);
        };
        m.customProgramCacheKey = () => 'skin' + pat;
    }
    return m;
}
function mergeParts(parts) {
    const geos = parts.map(m => {
        m.updateMatrix();
        const gg = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
        gg.applyMatrix4(m.matrix);
        m.parent.remove(m);
        m.geometry.dispose();
        return gg;
    });
    let n = 0;
    for (const gg of geos)
        n += gg.attributes.position.count;
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
    let o = 0;
    for (const gg of geos) {
        pos.set(gg.attributes.position.array, o * 3);
        nor.set(gg.attributes.normal.array, o * 3);
        o += gg.attributes.position.count;
        gg.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    return out;
}
function buildCarMesh(team, name, human, skin = null, parent = scene) {
    const g = new THREE.Group(), col = TEAM_COL[team], yb = -CAR_Y;
    const paint = skinPaint(skin, team);
    const rimMat = skin && skin.rim != null ? new THREE.MeshStandardMaterial({ color: skin.rim, metalness: .9, roughness: .3 }) : rimM;
    const carbon = new THREE.MeshStandardMaterial({ color: 0x16181d, metalness: .4, roughness: .45 });
    const glassM = new THREE.MeshPhysicalMaterial({ color: 0x0a1120, metalness: .2, roughness: .04, clearcoat: 1, envMapIntensity: 1.6 });
    const mk = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
    mk(extrudeSide([[-2.34, .3], [-2.42, .6], [-2.28, .84], [-1.25, .9], [.85, .84], [2.12, .66], [2.44, .46], [2.4, .26], [2.05, .2], [-2.0, .2]], 2.26, .14), paint);
    mk(extrudeSide([[-1.3, .82], [-.85, 1.3], [.2, 1.37], [.98, .8]], 1.84, .1), glassM);
    mk(new THREE.BoxGeometry(1.72, .07, 1.0), paint, 0, yb + 1.44, -.33).rotation.x = -.06;
    mk(new THREE.BoxGeometry(2.6, .07, .55), carbon, 0, yb + 1.24, -2.12);
    for (const sx of [-1, 1])
        mk(new THREE.BoxGeometry(.08, .34, .26), carbon, sx * .82, yb + 1.04, -2.08);
    mk(new THREE.BoxGeometry(2.55, .06, .42), carbon, 0, yb + .2, 2.38);
    for (const sx of [-1, 1])
        mk(new THREE.BoxGeometry(.1, .13, 3.3), carbon, sx * 1.26, yb + .28, 0);
    mk(new THREE.BoxGeometry(1.3, .16, .06), carbon, 0, yb + .42, 2.5);
    const hl = new THREE.MeshBasicMaterial({ color: 0xf2f6ff, toneMapped: false }), tl = new THREE.MeshBasicMaterial({ color: 0xff1a1a, toneMapped: false });
    for (const sx of [-1, 1]) {
        mk(new THREE.BoxGeometry(.55, .1, .06), hl, sx * .8, yb + .6, 2.36).rotation.x = .3;
        mk(new THREE.BoxGeometry(.7, .09, .05), tl, sx * .76, yb + .7, -2.44);
    }
    {
        const ny = yb + .45, steel = new THREE.MeshStandardMaterial({ color: 0x3a3f48, metalness: .85, roughness: .32 });
        const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe5ee, metalness: 1, roughness: .12 });
        const housing = mk(new THREE.CylinderGeometry(.31, .35, .36, 24), steel, 0, ny, -2.47);
        housing.rotation.x = Math.PI / 2;
        const fins = [];
        for (let k = 0; k < 8; k++) {
            const a = k / 8 * Math.PI * 2, fin = mk(new THREE.BoxGeometry(.035, .1, .3), carbon, Math.cos(a) * .37, ny + Math.sin(a) * .37, -2.45);
            fin.rotation.z = a - Math.PI / 2;
            fins.push(fin);
        }
        const rings = [mk(new THREE.TorusGeometry(.33, .025, 8, 28), chrome, 0, ny, -2.31), mk(new THREE.TorusGeometry(.26, .05, 12, 32), chrome, 0, ny, -2.66)];
        const throat = mk(new THREE.CylinderGeometry(.24, .15, .24, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0x0b0c0f, metalness: .6, roughness: .5, side: THREE.DoubleSide }), 0, ny, -2.6);
        throat.rotation.x = -Math.PI / 2;
        const core = mk(new THREE.CircleGeometry(.16, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(.7), toneMapped: false }), 0, ny, -2.665);
        core.rotation.y = Math.PI;
        core.castShadow = false;
        const ringG = mk(new THREE.RingGeometry(.07, .1, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, opacity: .55 }), 0, ny, -2.67);
        ringG.rotation.y = Math.PI;
        ringG.castShadow = false;
        const bracket = mk(new THREE.BoxGeometry(.14, .2, .26), steel, 0, ny + .3, -2.4);
        mk(mergeParts([housing, bracket]), steel);
        mk(mergeParts(fins), carbon);
        mk(mergeParts(rings), chrome);
    }
    const flameO = new THREE.Mesh(new THREE.ConeGeometry(.42, 2.6, 16, 1, true), new THREE.MeshBasicMaterial({ color: team ? 0xff2d3d : 0x2f8bff, transparent: true, opacity: .75, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    const flameI = new THREE.Mesh(new THREE.ConeGeometry(.22, 1.5, 12, 1, true), new THREE.MeshBasicMaterial({ color: team ? 0xffd2d8 : 0xd2efff, transparent: true, opacity: .95, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    for (const [f, z] of [[flameO, -3.85], [flameI, -3.25]]) {
        f.rotation.x = -Math.PI / 2;
        f.position.set(0, yb + .45, z);
        f.visible = false;
        g.add(f);
    }
    const wheels = [];
    const capM = new THREE.MeshStandardMaterial({ color: col, metalness: .6, roughness: .3, emissive: col, emissiveIntensity: .4 });
    for (const [x, z] of [[1.3, 1.52], [-1.3, 1.52], [1.3, -1.48], [-1.3, -1.48]]) {
        const pivot = new THREE.Group();
        pivot.position.set(x, yb + .59, z);
        g.add(pivot);
        const w = new THREE.Group();
        pivot.add(w);
        const t = new THREE.Mesh(tireGeo, tireM);
        t.castShadow = true;
        w.add(t);
        w.add(new THREE.Mesh(rimGeo, rimMat));
        const s = Math.sign(x);
        for (let k = 0; k < 5; k++) {
            const sp = new THREE.Mesh(spokeGeo, rimMat);
            sp.position.x = s * .2;
            sp.rotation.x = k * Math.PI * 2 / 5;
            w.add(sp);
        }
        const cap = new THREE.Mesh(capGeo, capM);
        cap.position.x = s * .23;
        w.add(cap);
        wheels.push({ pivot, w, front: z > 0 });
    }
    g.traverse(o => { if (o.isMesh) { if (o.material === paint) o.userData.paint = true; else if (o.material === rimMat) o.userData.rim = true; } });
    if (name) {
        g.userData.nameTag = makeNameTag(name, TEAM_CSS[team]);
        g.add(g.userData.nameTag);
    }
    parent.add(g);
    return { g, wheels, flames: [flameO, flameI] };
}
let cars = [];
function createCar(team, name, human, skinOverride) {
    const skin = skinOverride !== undefined ? skinOverride : (human ? SKIN_BY_ID[STORE.equipped] || null : null);
    const m = buildCarMesh(team, name, human, skin);
    return {
        skinId: skin ? skin.id : 'stock',
        team, name, human, mesh: m.g, wheels: m.wheels, flames: m.flames,
        pos: new V3(), vel: new V3(), q: new Q4(), yaw: 0, onGround: true, boost: 100, boostIdle: 0,
        n: new V3(0, 1, 0), fwd: new V3(0, 0, 1), jumpN: new V3(0, 1, 0),
        input: { throttle: 0, steer: 0, pitch: 0, roll: 0, jump: false, boost: false, slide: false },
        prevJump: false, canFlip: false, flipping: false, flipT: 0, flipAxis: new V3(), angVel: new V3(),
        airTime: 0, holdJump: false, stun: 0, slideT: 0, lastBumped: -9, supersonic: false, boosting: false,
        lastHit: -9, stats: { goals: 0, shots: 0, saves: 0, touches: 0 }, ai: { stage: null, t: 0, hold: 0, opts: {}, stuck: 0, rev: 0 }, role: 'attack', wheelRot: 0,
    };
}
function repaintCar(c, id) {
    const skin = SKIN_BY_ID[id];
    if (!skin || c.skinId === id)
        return;
    c.skinId = id;
    const paint = skinPaint(skin.team ? null : skin, c.team);
    const rim = skin.rim != null ? new THREE.MeshStandardMaterial({ color: skin.rim, metalness: .9, roughness: .3 }) : rimM;
    const old = new Set();
    c.mesh.traverse(o => {
        if (o.userData.paint) { old.add(o.material); o.material = paint; }
        else if (o.userData.rim) { if (o.material !== rimM) old.add(o.material); o.material = rim; }
    });
    for (const m of old) m.dispose();
}
function applyBallSkin() {
    const old = ball.mesh.material;
    ball.mesh.material = ballMaterial(BALL_BY_ID[STORE.ball]);
    old.dispose();
}
function clearCars() { for (const c of cars)
    scene.remove(c.mesh); cars = []; }
const _a = new V3(), _b = new V3(), _c = new V3(), _d = new V3(), _q = new Q4(), _qi = new Q4(), _w = new V3();
let simTime = 0;
function forwardOf(c, out) { return out.set(0, 0, 1).applyQuaternion(c.q); }
const _lv = new V3(), _grav = new V3(), _sn = new V3(), _up2 = new V3(), _f2 = new V3(), _m4o = new THREE.Matrix4();
const _ex = new V3(), _ey = new V3(), _ez = new V3();
function setOrientation(c) {
    _lv.crossVectors(c.n, c.fwd).normalize();
    _m4o.makeBasis(_lv, c.n, c.fwd);
    c.q.setFromRotationMatrix(_m4o);
    c.yaw = Math.atan2(c.fwd.x, c.fwd.z);
}
function boxExtent(c, n) {
    _ex.set(1, 0, 0).applyQuaternion(c.q);
    _ey.set(0, 1, 0).applyQuaternion(c.q);
    _ez.set(0, 0, 1).applyQuaternion(c.q);
    return CHX * Math.abs(_ex.dot(n)) + CHY * Math.abs(_ey.dot(n)) + CHZ * Math.abs(_ez.dot(n));
}
function detach(c) { c.onGround = false; c.airTime = 0; c.canFlip = true; c.holdJump = false; c.flipping = false; c.jumpN.copy(c.n); }
function updateCar(c, inp, dt) {
    const jumpEdge = inp.jump && !c.prevJump;
    c.prevJump = inp.jump;
    c.boosting = false;
    const wantBoost = inp.boost && c.boost > 0;
    if (c.onGround) {
        const n = c.n;
        _lv.crossVectors(n, c.fwd).normalize();
        let vf = c.vel.dot(c.fwd), vs = c.vel.dot(_lv);
        const sp = Math.abs(vf);
        const turn = lerp(3.3, 1.75, Math.min(sp / MAX_BOOST, 1)) * Math.min(1, sp / 6) * (inp.slide ? 1.45 : 1);
        c.fwd.applyAxisAngle(n, inp.steer * turn * dt * (vf >= 0 ? 1 : -1));
        c.fwd.addScaledVector(n, -c.fwd.dot(n)).normalize();
        const t = wantBoost ? 1 : inp.throttle;
        if (t > 0.05) {
            if (vf < -0.5)
                vf = Math.min(0, vf + BRAKE * dt);
            else if (vf < MAX_DRIVE)
                vf = Math.min(MAX_DRIVE, vf + 46 * (1 - .7 * vf / MAX_DRIVE) * t * dt);
        }
        else if (t < -0.05) {
            if (vf > 0.5)
                vf = Math.max(0, vf - BRAKE * dt);
            else if (vf > -MAX_REV)
                vf = Math.max(-MAX_REV, vf + 32 * t * dt);
        }
        else
            vf -= Math.sign(vf) * Math.min(Math.abs(vf), COAST * dt);
        if (wantBoost) {
            vf += BOOST_ACC * dt;
            c.boost -= BOOST_USE * dt;
            c.boosting = true;
        }
        else if (vf > MAX_DRIVE)
            vf = Math.max(MAX_DRIVE, vf - OVERSPEED * dt);
        vf = Math.min(vf, MAX_BOOST);
        if (vf < -MAX_REV)
            vf = Math.min(-MAX_REV, vf + 40 * dt);
        _lv.crossVectors(n, c.fwd).normalize();
        _grav.set(0, -G, 0).addScaledVector(n, G * n.y);
        vf += _grav.dot(c.fwd) * dt;
        vs += _grav.dot(_lv) * dt;
        if (c.slideT > 0)
            c.slideT -= dt;
        vs *= Math.exp(-(inp.slide || c.slideT > 0 ? 2.0 : 14) * dt);
        c.vel.copy(c.fwd).multiplyScalar(vf).addScaledVector(_lv, vs);
        setOrientation(c);
        if (jumpEdge) {
            c.vel.addScaledVector(n, JUMP_V);
            c.jumpN.copy(n);
            c.onGround = false;
            c.airTime = 0;
            c.canFlip = true;
            c.holdJump = true;
            c.flipping = false;
            if (c.human)
                sfx.jump();
        }
    }
    else {
        c.airTime += dt;
        c.vel.y -= G * dt;
        if (c.holdJump) {
            if (inp.jump && c.airTime < 0.2)
                c.vel.addScaledVector(c.jumpN, JUMP_HOLD * dt);
            else
                c.holdJump = false;
        }
        if (jumpEdge && c.canFlip && c.airTime < 1.5 && c.stun <= 0) {
            c.canFlip = false;
            const fi = inp.pitch, si = inp.steer;
            if (Math.abs(fi) + Math.abs(si) > 0.3) {
                forwardOf(c, _a);
                _b.set(1, 0, 0).applyQuaternion(c.q);
                _up2.set(0, 1, 0).applyQuaternion(c.q);
                if (_up2.y > .7) {
                    _a.y = 0;
                    _b.y = 0;
                }
                if (_a.lengthSq() < 0.01)
                    _a.set(Math.sin(c.yaw), 0, Math.cos(c.yaw));
                if (_b.lengthSq() < 0.01)
                    _b.set(_a.z, 0, -_a.x);
                _a.normalize();
                _b.normalize();
                _c.copy(_a).multiplyScalar(fi).addScaledVector(_b, si).normalize();
                c.vel.addScaledVector(_c, FLIP_V);
                c.vel.y *= 0.25;
                c.flipAxis.set(fi, 0, -si).normalize();
                c.flipping = true;
                c.flipT = FLIP_DUR;
                c.angVel.set(0, 0, 0);
            }
            else
                c.vel.y = Math.max(c.vel.y, 0) + DOUBLE_V;
            if (c.human)
                sfx.jump();
        }
        if (c.flipping) {
            c.q.multiply(_q.setFromAxisAngle(c.flipAxis, Math.PI * 2 * dt / FLIP_DUR));
            c.flipT -= dt;
            if (c.flipT <= 1e-6)
                c.flipping = false;
        }
        else if (c.stun > 0) {
            c.stun -= dt;
            const ang = c.angVel.length();
            if (ang > 1e-4) {
                _a.copy(c.angVel).divideScalar(ang);
                c.q.multiply(_q.setFromAxisAngle(_a, ang * dt));
            }
        }
        else {
            let yawIn = inp.steer, rollIn = inp.roll;
            if (inp.slide) {
                rollIn = -inp.steer;
                yawIn = 0;
            }
            _w.set(inp.pitch * PITCH_R, yawIn * YAW_R, rollIn * ROLL_R);
            c.angVel.lerp(_w, 1 - Math.exp(-12 * dt));
            const ang = c.angVel.length();
            if (ang > 1e-4) {
                _a.copy(c.angVel).divideScalar(ang);
                c.q.multiply(_q.setFromAxisAngle(_a, ang * dt));
            }
        }
        c.q.normalize();
        if (wantBoost) {
            forwardOf(c, _a);
            c.vel.addScaledVector(_a, AIR_BOOST * dt);
            c.boost -= BOOST_USE * dt;
            c.boosting = true;
        }
        const sp = c.vel.length();
        if (sp > MAX_BOOST + 8)
            c.vel.multiplyScalar((MAX_BOOST + 8) / sp);
    }
    if (c.boosting)
        c.boostIdle = 0;
    else {
        c.boostIdle += dt;
        if (c.boostIdle >= REGEN_DELAY)
            c.boost += REGEN_RATE * dt;
    }
    c.boost = clamp(c.boost, 0, 100);
    c.pos.addScaledVector(c.vel, dt);
    surfaceContact(c, inp);
    c.supersonic = c.vel.length() >= SUPERSONIC;
}
function surfaceContact(c, inp) {
    const p = c.pos, d = arenaD(p.x, p.y, p.z);
    if (c.onGround) {
        if (d > CAR_Y + 1.3) {
            detach(c);
            return;
        }
        arenaN(p, _sn);
        if (_sn.dot(c.n) < .8) {
            const ext = boxExtent(c, _sn);
            if (d < ext) {
                p.addScaledVector(_sn, ext - d);
                const vn = c.vel.dot(_sn);
                if (vn < 0)
                    c.vel.addScaledVector(_sn, -vn);
            }
            return;
        }
        p.addScaledVector(_sn, CAR_Y - d);
        const sp = c.vel.length();
        c.n.copy(_sn);
        c.fwd.addScaledVector(_sn, -c.fwd.dot(_sn));
        if (c.fwd.lengthSq() < 1e-6)
            c.fwd.copy(c.vel).addScaledVector(_sn, -c.vel.dot(_sn));
        if (c.fwd.lengthSq() < 1e-6)
            c.fwd.set(_sn.y, -_sn.x, 0);
        c.fwd.normalize();
        c.vel.addScaledVector(_sn, -c.vel.dot(_sn));
        const sp2 = c.vel.length();
        if (sp2 > 1e-4)
            c.vel.multiplyScalar(sp / sp2);
        setOrientation(c);
        if (_sn.y < .55 && (sp < 12 || (_sn.y < -.3 && !(inp.throttle > .2 || c.boosting)))) {
            detach(c);
            c.vel.addScaledVector(_sn, 2.5);
            return;
        }
        probeWalls(c);
        return;
    }
    if (d > 7)
        return;
    arenaN(p, _sn);
    const vn = c.vel.dot(_sn);
    if (_sn.y > .6) {
        if (d <= CAR_Y && vn <= 0)
            land(c, _sn, d);
        return;
    }
    _up2.set(0, 1, 0).applyQuaternion(c.q);
    const roofOK = _sn.y > -.3 || inp.throttle > .2 || c.boosting;
    if (_up2.dot(_sn) > .5 && d <= CAR_Y + .1 && vn <= 0 && c.airTime > .25 && roofOK) {
        land(c, _sn, d);
        return;
    }
    const ext = boxExtent(c, _sn);
    if (d < ext) {
        p.addScaledVector(_sn, ext - d);
        if (vn < 0)
            c.vel.addScaledVector(_sn, -1.3 * vn);
    }
}
function land(c, n, d) {
    const midFlip = c.flipping;
    c.onGround = true;
    c.flipping = false;
    c.holdJump = false;
    c.stun = 0;
    c.angVel.set(0, 0, 0);
    c.slideT = .3;
    c.n.copy(n);
    c.pos.addScaledVector(n, CAR_Y - d);
    if (!midFlip) {
        forwardOf(c, _f2);
        _f2.addScaledVector(n, -_f2.dot(n));
        if (_f2.lengthSq() < .06) {
            _up2.set(0, 1, 0).applyQuaternion(c.q);
            const s = forwardOf(c, _a).dot(n) > 0 ? -1 : 1;
            _f2.copy(_up2).multiplyScalar(s);
            _f2.addScaledVector(n, -_f2.dot(n));
        }
        if (_f2.lengthSq() > 1e-6)
            c.fwd.copy(_f2);
    }
    c.fwd.addScaledVector(n, -c.fwd.dot(n));
    if (c.fwd.lengthSq() < 1e-6) {
        c.fwd.copy(c.vel).addScaledVector(n, -c.vel.dot(n));
        if (c.fwd.lengthSq() < 1e-6)
            c.fwd.set(n.y, -n.x, 0);
    }
    c.fwd.normalize();
    c.vel.addScaledVector(n, -c.vel.dot(n));
    setOrientation(c);
}
const PROBES = [[0, CHZ], [0, -CHZ], [CHX, 0], [-CHX, 0], [CHX, CHZ], [-CHX, CHZ], [CHX, -CHZ], [-CHX, -CHZ]], _pr = new V3(), _pn = new V3();
function probeWalls(c) {
    _lv.crossVectors(c.n, c.fwd);
    for (const [ox, oz] of PROBES) {
        _pr.copy(c.pos).addScaledVector(_lv, ox).addScaledVector(c.fwd, oz);
        const dp = arenaD(_pr.x, _pr.y, _pr.z);
        if (dp > .15)
            continue;
        arenaN(_pr, _pn);
        if (_pn.dot(c.n) > .8)
            continue;
        _pn.addScaledVector(c.n, -_pn.dot(c.n));
        if (_pn.lengthSq() < 1e-4)
            continue;
        _pn.normalize();
        c.pos.addScaledVector(_pn, .15 - dp);
        const vn = c.vel.dot(_pn);
        if (vn < 0)
            c.vel.addScaledVector(_pn, -vn);
    }
}
function confineCar(c) {
    const p = c.pos, d = arenaD(p.x, p.y, p.z);
    if (c.onGround) {
        if (d > CAR_Y + 1.3)
            return;
        arenaN(p, _sn);
        if (_sn.dot(c.n) < .8) {
            const ext = boxExtent(c, _sn);
            if (d < ext) {
                p.addScaledVector(_sn, ext - d);
                const vn = c.vel.dot(_sn);
                if (vn < 0)
                    c.vel.addScaledVector(_sn, -vn);
            }
        }
        else {
            p.addScaledVector(_sn, CAR_Y - d);
            c.vel.addScaledVector(_sn, -c.vel.dot(_sn));
        }
        probeWalls(c);
        return;
    }
    if (d > 6)
        return;
    arenaN(p, _sn);
    const minD = _sn.y > .6 ? CAR_Y * .6 : boxExtent(c, _sn);
    if (d < minD) {
        p.addScaledVector(_sn, minD - d);
        const vn = c.vel.dot(_sn);
        if (vn < 0)
            c.vel.addScaledVector(_sn, -1.2 * vn);
    }
}
function collideSeg(p, v, a, b, rad) {
    _a.subVectors(b, a);
    const len2 = _a.lengthSq();
    const t = clamp(_b.subVectors(p, a).dot(_a) / len2, 0, 1);
    _c.copy(a).addScaledVector(_a, t);
    _d.subVectors(p, _c);
    const dist = _d.length();
    if (dist < rad && dist > 1e-6) {
        _d.divideScalar(dist);
        p.addScaledVector(_d, rad - dist);
        const vn = v.dot(_d);
        if (vn < 0) {
            v.addScaledVector(_d, -vn * 1.6);
            sfx.bounce(-vn);
            return -vn;
        }
    }
    return 0;
}
const postA = new V3(), postB = new V3(), _bn = new V3(), _sbn = new V3();
let lastOoh = -9, ballStuckFor = 0;
function stepBall(dt) {
    const p = ball.pos, v = ball.vel;
    v.y -= G * dt;
    v.multiplyScalar(Math.exp(-0.03 * dt));
    p.addScaledVector(v, dt);
    const d = arenaD(p.x, p.y, p.z);
    if (d < BR + .02) {
        arenaN(p, _bn);
        if (d < BR)
            p.addScaledVector(_bn, BR - d);
        const vn = v.dot(_bn);
        if (vn < 0) {
            v.addScaledVector(_bn, -vn * 1.6);
            if (-vn > 5)
                sfx.bounce(-vn);
            if (-vn * .6 < 1.2)
                v.addScaledVector(_bn, -v.dot(_bn));
        }
        const f = 1 - Math.exp(-.12 * dt), vn2 = v.dot(_bn);
        v.x -= (v.x - _bn.x * vn2) * f;
        v.y -= (v.y - _bn.y * vn2) * f;
        v.z -= (v.z - _bn.z * vn2) * f;
    }
    const s = Math.sign(p.z) || 1;
    if (Math.abs(p.z) > HL - BR - 1) {
        let hit = 0;
        for (const sx of [-1, 1]) {
            postA.set(sx * GW / 2, 0, s * HL);
            postB.set(sx * GW / 2, GH, s * HL);
            hit = Math.max(hit, collideSeg(p, v, postA, postB, BR + .6));
        }
        postA.set(-GW / 2, GH, s * HL);
        postB.set(GW / 2, GH, s * HL);
        hit = Math.max(hit, collideSeg(p, v, postA, postB, BR + .6));
        if (hit > 14 && state === 'play' && simTime - lastOoh > 2.5) {
            lastOoh = simTime;
            sfx.swell(.5);
        }
    }
    arenaN(p, _sbn);
    if (d < BR + .65 && _sbn.y < .8 && p.y < BR + .9 && Math.hypot(v.x, v.z) < 1.3) {
        ballStuckFor += dt;
        if (ballStuckFor > 1.1) {
            p.addScaledVector(_sbn, .25);
            v.x += _sbn.x * 5;
            v.z += _sbn.z * 5;
            ballStuckFor = 0;
        }
    } else {
        ballStuckFor = 0;
    }
    const sp = v.length();
    if (sp > BALL_MAX)
        v.multiplyScalar(BALL_MAX / sp);
    if (Math.abs(p.z) < HL - BR)
        ignoredOwnGoal = false;
    if (Math.abs(p.z) > HL + BR * .95 && state === 'play' && !ignoredOwnGoal && !netGuest()) {
        const scoringTeam = p.z > 0 ? 0 : 1;
        if (lastToucher && lastToucher.team !== scoringTeam)
            ignoredOwnGoal = true;
        else
            onGoal(scoringTeam);
    }
}
function simBall(p, v, h) {
    v.y -= G * h;
    p.addScaledVector(v, h);
    const d = arenaD(p.x, p.y, p.z);
    if (d < BR) {
        arenaN(p, _sbn);
        p.addScaledVector(_sbn, BR - d);
        const vn = v.dot(_sbn);
        if (vn < 0)
            v.addScaledVector(_sbn, -vn * 1.6);
    }
}
const _gp = new V3(), _gv = new V3();
function goalBound(pos, vel) {
    _gp.copy(pos);
    _gv.copy(vel);
    for (let i = 0; i < 180; i++) {
        simBall(_gp, _gv, 1 / 60);
        if (Math.abs(_gp.z) > HL + BR * .5)
            return Math.sign(_gp.z);
    }
    return 0;
}
const _bvPrev = new V3();
function carBall(c) {
    _qi.copy(c.q).invert();
    _a.subVectors(ball.pos, c.pos).applyQuaternion(_qi);
    _b.set(clamp(_a.x, -CHX, CHX), clamp(_a.y, -CHY, CHY), clamp(_a.z, -CHZ, CHZ));
    _d.subVectors(_a, _b);
    let dist = _d.length();
    if (dist >= BR)
        return;
    _bvPrev.copy(ball.vel);
    if (dist < 1e-4) {
        _d.set(0, 1, 0);
        dist = 0;
    }
    else
        _d.divideScalar(dist);
    _d.applyQuaternion(c.q);
    ball.pos.addScaledVector(_d, BR - dist);
    _c.subVectors(ball.vel, c.vel);
    const vn = _c.dot(_d), relSpeed = _c.length();
    if (vn < 0) {
        ball.vel.addScaledVector(_d, -1.15 * vn);
        c.vel.addScaledVector(_d, vn * .08);
    }
    if (simTime - c.lastHit > 0.12) {
        c.lastHit = simTime;
        _a.subVectors(ball.pos, c.pos);
        _a.y *= .35;
        _a.normalize();
        ball.vel.addScaledVector(_a, Math.min(relSpeed, 100) * .15 + 2 + (c.flipping ? 14 : 0));
        const sp = ball.vel.length();
        if (sp > BALL_MAX)
            ball.vel.multiplyScalar(BALL_MAX / sp);
        c.stats.touches++;
        lastTouch[c.team] = c;
        lastToucher = c;
        touchInfo = { name: c.name, team: c.team, t: +simTime.toFixed(2) };
        if (state === 'play' && !netGuest()) {
            const ad = c.team === 0 ? 1 : -1, before = goalBound(ball.pos, _bvPrev), after = goalBound(ball.pos, ball.vel);
            if (before === -ad && after !== -ad) {
                c.stats.saves++;
                feed(`<span style="color:${TEAM_CSS[c.team]}">${c.name}</span> saved`);
                if (c.human)
                    showCenter('SAVE!', 1.1, TEAM_CSS[c.team]);
                sfx.swell(.7);
            }
            if (after === ad && before !== ad)
                c.stats.shots++;
        }
        if (relSpeed > 8) {
            sfx.hit(relSpeed);
            if (relSpeed > 45)
                shake = Math.max(shake, .25);
        }
        ball.spin.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).multiplyScalar(relSpeed * .08);
    }
}
const OA = [new V3(), new V3(), new V3()], OB = [new V3(), new V3(), new V3()], CAND = Array.from({ length: 15 }, () => new V3());
const _T = new V3(), _N = new V3(), _rv = new V3(), HE = [CHX, CHY, CHZ];
function obbAxes(c, out) { out[0].set(1, 0, 0).applyQuaternion(c.q); out[1].set(0, 1, 0).applyQuaternion(c.q); out[2].set(0, 0, 1).applyQuaternion(c.q); }
function obbContact(a, b, flat) {
    obbAxes(a, OA);
    obbAxes(b, OB);
    _T.subVectors(b.pos, a.pos);
    let n = 0;
    if (flat) {
        CAND[n++].copy(OA[0]);
        CAND[n++].copy(OA[2]);
        CAND[n++].copy(OB[0]);
        CAND[n++].copy(OB[2]);
    }
    else {
        for (let i = 0; i < 3; i++)
            CAND[n++].copy(OA[i]);
        for (let i = 0; i < 3; i++)
            CAND[n++].copy(OB[i]);
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                CAND[n++].crossVectors(OA[i], OB[j]);
    }
    let best = Infinity;
    for (let k = 0; k < n; k++) {
        const L = CAND[k];
        if (flat)
            L.y = 0;
        const l2 = L.lengthSq();
        if (l2 < 1e-6)
            continue;
        L.multiplyScalar(1 / Math.sqrt(l2));
        const ra = HE[0] * Math.abs(OA[0].dot(L)) + HE[1] * Math.abs(OA[1].dot(L)) + HE[2] * Math.abs(OA[2].dot(L));
        const rb = HE[0] * Math.abs(OB[0].dot(L)) + HE[1] * Math.abs(OB[1].dot(L)) + HE[2] * Math.abs(OB[2].dot(L));
        const d = _T.dot(L), pen = ra + rb - Math.abs(d);
        if (pen <= 0)
            return -1;
        if (pen < best) {
            best = pen;
            _N.copy(L);
            if (d < 0)
                _N.negate();
        }
    }
    return best === Infinity ? -1 : best;
}
function carCar() {
    for (let i = 0; i < cars.length; i++)
        for (let j = i + 1; j < cars.length; j++) {
            const a = cars[i], b = cars[j];
            if (Math.abs(a.pos.x - b.pos.x) > 6.5 || Math.abs(a.pos.z - b.pos.z) > 6.5 || Math.abs(a.pos.y - b.pos.y) > 6.5)
                continue;
            const pen = obbContact(a, b, a.onGround && b.onGround && a.n.y > .99 && b.n.y > .99);
            if (pen < 0)
                continue;
            const n = _N;
            a.pos.addScaledVector(n, -pen / 2);
            b.pos.addScaledVector(n, pen / 2);
            const rv = _rv.subVectors(b.vel, a.vel).dot(n);
            if (rv < 0) {
                const sa = a.vel.dot(n), sb = -b.vel.dot(n);
                const jj = -1.3 * rv / 2;
                a.vel.addScaledVector(n, -jj);
                b.vel.addScaledVector(n, jj);
                const impact = -rv;
                if (impact > 34) {
                    const attackerIsA = sa >= sb, victim = attackerIsA ? b : a;
                    if (simTime - victim.lastBumped > .4) {
                        _d.copy(n);
                        if (!attackerIsA)
                            _d.negate();
                        _c.addVectors(a.pos, b.pos).multiplyScalar(.5);
                        bump(victim, _d, impact, _c, attackerIsA ? a : b);
                    }
                }
            }
        }
}
function bump(v, dir, impact, at, attacker) {
    v.lastBumped = simTime;
    v.vel.addScaledVector(dir, impact * .22);
    v.vel.addScaledVector(v.onGround ? v.n : UP, Math.min(3 + impact * .12, 14));
    if (v.onGround)
        detach(v);
    v.canFlip = false;
    v.flipping = false;
    v.holdJump = false;
    v.ai.stage = null;
    v.stun = .55;
    v.angVel.set(rand(-3, 3), rand(-1.5, 1.5), rand(-4, 4));
    burst(at, 0xffe6b0, 40, 18, .5);
    sfx.bump(impact);
    if (v.human || attacker.human)
        shake = Math.max(shake, .35);
}
const PRED_N = 90, PRED_DT = 1 / 30;
const pred = Array.from({ length: PRED_N + 1 }, () => new V3());
const _pp = new V3(), _pv = new V3();
function predictBall() {
    _pp.copy(ball.pos);
    _pv.copy(ball.vel);
    pred[0].copy(_pp);
    for (let i = 1; i <= PRED_N; i++) {
        simBall(_pp, _pv, PRED_DT / 2);
        simBall(_pp, _pv, PRED_DT / 2);
        pred[i].copy(_pp);
    }
}
const _t = new V3();
let freezeBots = false;
function steerAng(c, x, y, z) {
    _a.set(x - c.pos.x, y - c.pos.y, z - c.pos.z);
    _a.addScaledVector(c.n, -_a.dot(c.n));
    _lv.crossVectors(c.n, c.fwd);
    return Math.atan2(_a.dot(_lv), _a.dot(c.fwd));
}
const wallBall = p => p.y > 7 && p.y < FH - 16 && arenaD(p.x, p.y, p.z) < BR + 4;
function assignRoles() {
    for (const team of [0, 1]) {
        const ad = team === 0 ? 1 : -1;
        const score = c => Math.hypot(c.pos.x - ball.pos.x, c.pos.z - ball.pos.z) + ((c.pos.z - ball.pos.z) * ad > 2 ? 30 : 0);
        const m = cars.filter(c => c.team === team).sort((a, b) => score(a) - score(b));
        const roles = ['attack', 'support', 'defend'];
        m.forEach((c, i) => c.role = roles[Math.min(i, 2)]);
        if (m.length === 2 && ball.pos.z * ad < -HL * .3)
            m[1].role = 'defend';
    }
}
function startJump(c, hold, opts = {}) { c.ai.stage = 'jump'; c.ai.t = 0; c.ai.hold = hold; c.ai.opts = opts; }
function botThink(c, dt) {
    const inp = c.input, D = DIFF[settings.diff];
    inp.throttle = 0;
    inp.steer = 0;
    inp.pitch = 0;
    inp.roll = 0;
    inp.jump = false;
    inp.boost = false;
    inp.slide = false;
    if (freezeBots)
        return;
    if (state === 'goal') {
        inp.throttle = .4;
        inp.steer = Math.sin(simTime * 2 + c.pos.x);
        return;
    }
    const ad = c.team === 0 ? 1 : -1, myGoalZ = -ad * HL, oppGoalZ = ad * HL;
    const speed = c.vel.length();
    const kickoff = kickoffT < 3.5 && ball.vel.lengthSq() < .01 && Math.abs(ball.pos.x) < .1 && Math.abs(ball.pos.z) < .1;
    const st = c.ai.stage;
    if (st && (st === 'flip' || st === 'dbl') && c.onGround)
        c.ai.stage = null;
    else if (st) {
        c.ai.t += dt;
        inp.throttle = 1;
        if (st === 'jump') {
            inp.jump = c.ai.t < c.ai.hold;
            if (c.ai.t > c.ai.hold + 0.05)
                c.ai.stage = c.ai.opts.flip ? 'flip' : c.ai.opts.dbl ? 'dbl' : 'air', c.ai.t = 0;
        }
        else if (st === 'flip') {
            inp.jump = true;
            inp.pitch = c.ai.opts.pitch ?? 1;
            inp.steer = c.ai.opts.steer ?? 0;
            if (c.ai.t > 0.05)
                c.ai.stage = 'air';
            return;
        }
        else if (st === 'dbl') {
            inp.jump = true;
            if (c.ai.t > 0.05)
                c.ai.stage = 'air';
        }
        if (!c.onGround) {
            _qi.copy(c.q).invert();
            _a.subVectors(ball.pos, c.pos).applyQuaternion(_qi);
            const yawErr = Math.atan2(_a.x, _a.z), pitchErr = Math.atan2(_a.y, Math.hypot(_a.x, _a.z));
            if (!c.flipping && c.ai.stage !== 'flip') {
                inp.steer = clamp(yawErr * 2.5, -1, 1);
                inp.pitch = clamp(-pitchErr * 2.5, -1, 1);
                _b.set(1, 0, 0).applyQuaternion(c.q);
                inp.roll = clamp(-_b.y * 2, -1, 1);
                if (c.ai.opts.aerial && Math.abs(yawErr) < .5 && Math.abs(pitchErr) < .5 && c.airTime > .15)
                    inp.boost = true;
            }
            return;
        }
        if (c.ai.stage === 'air' || c.airTime > 0) {
            if (c.onGround && c.ai.t > .1)
                c.ai.stage = null;
        }
        if (c.ai.stage)
            return;
    }
    let ti = -1;
    const est = Math.max(speed, D.est);
    for (let i = 1; i <= PRED_N; i++) {
        const bp = pred[i];
        if (bp.y > D.reach && !(wallBall(bp) && bp.z * ad > -20))
            continue;
        const d = Math.hypot(bp.x - c.pos.x, (bp.y - c.pos.y) * .7, bp.z - c.pos.z) - BR - 2;
        if (d / est <= i * PRED_DT) {
            ti = i;
            break;
        }
    }
    let danger = -1;
    for (let i = 1; i <= PRED_N; i++)
        if (pred[i].z * ad < -(HL - BR) && Math.abs(pred[i].x) < GW / 2 + 2) {
            danger = i;
            break;
        }
    if (ti < 0)
        ti = PRED_N;
    const bp = pred[ti];
    let wantBoost = false, arrive = false;
    let role = kickoff && c.role === 'attack' ? 'kickoff' : c.role;
    if (danger > 0 && (ti >= danger || pred[ti].y > D.reach) && role !== 'support')
        role = 'save';
    if (role === 'save') {
        const g = pred[danger];
        _t.set(clamp(g.x, -GW / 2 + 4, GW / 2 - 4), 0, myGoalZ + ad * 5);
        if (Math.hypot(_t.x - c.pos.x, _t.z - c.pos.z) < 10)
            _t.set(bp.x, 0, bp.z);
        wantBoost = true;
    }
    else if (role === 'kickoff') {
        _t.set(0, 0, -ad * 1.8);
        wantBoost = true;
    }
    else if (role === 'attack' && wallBall(bp) && bp.z * ad > -20) {
        _t.set(bp.x, bp.y, bp.z);
        wantBoost = Math.hypot(bp.x - c.pos.x, bp.y - c.pos.y, bp.z - c.pos.z) > D.boostDist;
    }
    else if (role === 'attack') {
        const aimX = clamp(bp.x * .4, -GW / 2 + 7, GW / 2 - 7);
        let dx = aimX - bp.x, dz = oppGoalZ - bp.z;
        const dl = Math.hypot(dx, dz);
        dx /= dl;
        dz /= dl;
        const tmx = c.pos.x - bp.x, tmz = c.pos.z - bp.z;
        const along = tmx * dx + tmz * dz, lat = tmx * -dz + tmz * dx, dist = Math.hypot(tmx, tmz);
        if (along > -2) {
            const side = lat >= 0 ? 1 : -1;
            _t.set(bp.x - dx * 12 + -dz * side * 11, 0, bp.z - dz * 12 + dx * side * 11);
            wantBoost = dist > 24;
        }
        else {
            const k = Math.min(dist * .35, 14);
            if (dist < 13)
                _t.set(bp.x, 0, bp.z);
            else
                _t.set(bp.x - dx * k, 0, bp.z - dz * k);
            wantBoost = dist > D.boostDist || dist < 10;
        }
    }
    else if (role === 'support') {
        _t.set(bp.x * .5, 0, clamp(bp.z - ad * 55, -HL + 15, HL - 15));
        arrive = true;
        wantBoost = Math.hypot(_t.x - c.pos.x, _t.z - c.pos.z) > 60;
    }
    else {
        _t.set(clamp(ball.pos.x * .35, -GW / 2 + 4, GW / 2 - 4), 0, myGoalZ + ad * 6);
        arrive = true;
        wantBoost = Math.hypot(_t.x - c.pos.x, _t.z - c.pos.z) > 50;
    }
    if (!(role === 'attack' && _t.y > 1)) {
        _t.x = clamp(_t.x, -(HW - RF - 3), HW - RF - 3);
        _t.z = Math.abs(_t.x) < GW / 2 - 2 ? clamp(_t.z, -HL - 6, HL + 6) : clamp(_t.z, -(HL - RF - 3), HL - RF - 3);
    }
    const dist = Math.hypot(_t.x - c.pos.x, _t.y - c.pos.y, _t.z - c.pos.z);
    const ang = steerAng(c, _t.x, _t.y, _t.z);
    inp.steer = clamp(ang * 2.6, -1, 1);
    inp.throttle = D.throttle;
    if (Math.abs(ang) > 1.3 && speed > 18)
        inp.slide = true;
    const turnRate = lerp(3.3, 1.75, Math.min(speed / MAX_BOOST, 1)), radius = speed / turnRate;
    if (Math.abs(ang) > .55 && dist < radius * 1.7) {
        inp.throttle = speed > 14 ? -.6 : .6;
        inp.slide = Math.abs(ang) > 1;
        wantBoost = false;
    }
    if (arrive) {
        if (dist < 5)
            inp.throttle = 0;
        else if (dist < 20)
            inp.throttle = D.throttle * Math.max(.25, dist / 20);
        if (speed > dist * 2.2 + 4 && Math.abs(ang) < 1)
            inp.throttle = -1;
    }
    if (wantBoost && Math.abs(ang) < .3 && c.boost > D.reserve && speed < MAX_BOOST - 2)
        inp.boost = true;
    if (kickoff && Math.abs(ang) < .5)
        inp.boost = c.boost > 0;
    if (c.onGround && inp.throttle > .5 && speed < 3)
        c.ai.stuck += dt;
    else
        c.ai.stuck = 0;
    if (c.ai.stuck > .8) {
        c.ai.rev = .7;
        c.ai.stuck = 0;
    }
    if (c.ai.rev > 0) {
        c.ai.rev -= dt;
        inp.throttle = -1;
        inp.steer = -inp.steer;
        inp.boost = false;
    }
    if (c.onGround && c.n.y < -.3) {
        inp.throttle = 0;
        inp.boost = false;
    }
    if (!c.onGround || c.n.y < .9 || role === 'support' || (role === 'defend' && dist > 24))
        return;
    const hd = Math.hypot(ball.pos.x - c.pos.x, ball.pos.z - c.pos.z);
    const bAng = steerAng(c, ball.pos.x, ball.pos.y, ball.pos.z), by = ball.pos.y;
    if (kickoff) {
        if (D.flip && hd < 13 && Math.abs(bAng) < .3)
            startJump(c, .05, { flip: true, pitch: 1, steer: 0 });
        return;
    }
    const goodSide = (ball.pos.z - c.pos.z) * ad > -2;
    if (hd < BR + 6 && Math.abs(bAng) < .7) {
        if (by > 5.4 && by < 8.8)
            startJump(c, .14);
        else if (by >= 8.8 && by < 12.5 && D.dbl)
            startJump(c, .2, { dbl: true });
        else if (by <= 5.4 && D.flip && hd < BR + 5.5 && speed > 24 && goodSide && Math.abs(bAng) < .25 && Math.random() < D.flipChance)
            startJump(c, .06, { flip: true, pitch: 1, steer: clamp(bAng * 2, -1, 1) });
    }
    else if (D.aerial && by > 12.5 && by < FH - 6 && hd < 20 && hd > 5 && c.boost > 30 && goodSide && Math.abs(bAng) < .35 && ball.vel.y < 6) {
        startJump(c, .2, { aerial: true });
    }
}
const keys = {};
let mouseJump = false, padPrev = {}, ballCam = true, bcPitch = 0;
function setBallCam(on) {
    ballCam = on;
    const t = $('camTag');
    if (t) {
        t.textContent = on ? 'BALL CAM' : 'CAR CAM';
        t.classList.toggle('on', on);
    }
}
addEventListener('keydown', e => {
    if (e.target && ['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code))
        e.preventDefault();
    keys[e.code] = true;
    if (e.repeat)
        return;
    if (e.code === 'KeyC' && !storeUI.open) {
        setBallCam(!ballCam);
        return;
    }
    if (e.code === 'Escape' && storeUI.open) {
        storeUI.hide();
        return;
    }
    if (e.code === 'Escape' || e.code === 'KeyP')
        togglePause();
});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys)
    keys[k] = false; mouseJump = false; });
$('gl').addEventListener('mousedown', e => { if (e.button === 2)
    mouseJump = true; });
addEventListener('mouseup', e => { if (e.button === 2)
    mouseJump = false; });
addEventListener('contextmenu', e => e.preventDefault());
function readPlayer(c) {
    const k = keys, inp = c.input;
    const f = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
    const s = (k.KeyA || k.ArrowLeft ? 1 : 0) - (k.KeyD || k.ArrowRight ? 1 : 0);
    inp.throttle = f;
    inp.pitch = f;
    inp.steer = s;
    inp.roll = (k.KeyE ? 1 : 0) - (k.KeyQ ? 1 : 0);
    inp.jump = !!(k.Space || mouseJump);
    inp.boost = !!(k.ShiftLeft || k.ShiftRight);
    inp.slide = !!k.KeyX;
    const gp = [...(navigator.getGamepads ? navigator.getGamepads() : [])].find(g => g && g.connected);
    if (gp) {
        const dz = v => Math.abs(v) < .15 ? 0 : v, b = i => gp.buttons[i] && gp.buttons[i].pressed, bv = i => gp.buttons[i] ? gp.buttons[i].value : 0;
        const ax = dz(gp.axes[0] || 0), ay = dz(gp.axes[1] || 0), thr = bv(7) - bv(6);
        if (Math.abs(thr) > .05)
            inp.throttle = thr;
        if (ax)
            inp.steer = -ax;
        if (ay)
            inp.pitch = -ay;
        if (b(4))
            inp.roll = -1;
        if (b(5))
            inp.roll = 1;
        inp.jump = inp.jump || b(0);
        inp.boost = inp.boost || b(1);
        inp.slide = inp.slide || b(2);
        if (b(9) && !padPrev.st)
            togglePause();
        if (b(3) && !padPrev.y)
            setBallCam(!ballCam);
        padPrev = { st: b(9), y: b(3) };
    }
}
const sfx = {
    init() { }, engine() { }, crowd() { }, swell() { }, playResult() { },
    stopResult() { }, stopGoal() { }, pause() { }, hit() { }, bounce() { },
    bump() { }, jump() { }, beep() { }, goal() { }
};
let state = 'menu', attract = true, paused = false;
let player = null, scoreArr = [0, 0], timeLeft = 300, overtime = false, otTime = 0;
let countT = 0, goalT = 0, kickoffT = 0, lastCount = 0, matchOverAfterGoal = false;
let lastTouch = [null, null], lastToucher = null, ignoredOwnGoal = false, shake = 0, touchInfo = null, exciteB = 0, exciteR = 0, tension = 0;
const goalLog = [];
function setupMatch(isAttract) {
    attract = isAttract;
    applyBallSkin();
    clearCars();
    const n = isAttract ? 2 : settings.mode;
    const names = [...BOT_NAMES].sort(() => Math.random() - .5);
    let ni = 0;
    for (const team of [0, 1])
        for (let i = 0; i < n; i++) {
            const human = !isAttract && team === 0 && i === 0;
            cars.push(createCar(team, human ? playerName : names[ni++], human));
        }
    player = cars.find(c => c.human) || null;
    recInit();
    lastGoalReplay = null;
    scoreArr = [0, 0];
    timeLeft = settings.len;
    overtime = false;
    otTime = 0;
    $('clock').classList.remove('ot', 'last-minute');
    updateScoreHud();
    resetKickoff();
}
function setupOnlineMatch() {
    attract = false;
    applyBallSkin();
    clearCars();
    remoteInputs.clear();
    netReset();
    replay = null;
    $('hud').classList.remove('replaying');
    for (const team of [0, 1]) {
        for (let i = 0; i < settings.mode; i++) {
            const seat = 2 * i + team;
            const human = online.seat === seat;
            const c = createCar(team, online.names.get(seat) || (human ? playerName : `PLAYER ${seat + 1}`), human, human ? undefined : (SKIN_BY_ID[online.skins.get(seat)] || null));
            c.netSeat = seat;
            cars.push(c);
        }
    }
    player = cars.find(c => c.human) || null;
    recInit(); lastGoalReplay = null;
    scoreArr = [0, 0]; timeLeft = settings.len;
    overtime = false; otTime = 0;
    $('clock').classList.remove('ot', 'last-minute');
    updateScoreHud(); resetKickoff();
}
const netHist = [], netSent = new Map();
let netSeq = 0, netRtt = .12, netTouchAt = -9, netLastInput = '', netInputT = 0;
const _ni = new V3(), _nv = new V3(), _nt = new V3(), _netErr = new V3(), _nbp = new V3(), _nbv = new V3();
function netGuest() { return online.active && !online.isHost; }
function netReset() {
    netHist.length = 0;
    netSent.clear();
    netSeq = 0;
    netRtt = .12;
    netTouchAt = -9;
    netLastInput = '';
    netInputT = 0;
    for (const o of [ball, ...cars])
        if (o.nvo) o.nvo.set(0, 0, 0);
}
function netSetPos(o, p) {
    if (!o.nvo) o.nvo = new V3();
    _ni.copy(o.pos).sub(p);
    o.nvo.add(_ni);
    if (o.nvo.lengthSq() > 64) o.nvo.set(0, 0, 0);
    o.pos.copy(p);
}
function netDecay(dt) {
    const k = Math.exp(-14 * dt);
    for (const o of [ball, ...cars])
        if (o.nvo) {
            o.nvo.multiplyScalar(k);
            if (o.nvo.lengthSq() < 1e-6) o.nvo.set(0, 0, 0);
        }
}
function netRecordSelf() {
    netHist.push({ t: performance.now() / 1000, p: player.pos.clone(), v: player.vel.clone() });
    if (netHist.length > 240)
        netHist.shift();
}
function netHistAt(t) {
    for (let i = netHist.length - 1; i > 0; i--) {
        const h0 = netHist[i - 1], h1 = netHist[i];
        if (h0.t <= t && t <= h1.t) {
            const a = h1.t > h0.t ? (t - h0.t) / (h1.t - h0.t) : 0;
            return { p: h0.p.clone().lerp(h1.p, a), v: h0.v.clone().lerp(h1.v, a) };
        }
    }
    return null;
}
function onlineSnapshot() {
    return {
        ht: performance.now() / 1000, replayFinal: !!(replay && replay.final),
        state, timeLeft, overtime, otTime, scores: [...scoreArr], countT, goalT,
        playerNames: cars.map(c=>({seat:c.netSeat,name:c.name,skin:c.skinId})),
        scorerSeat: replayScorer >= 0 ? cars[replayScorer]?.netSeat ?? null : null, goalTeam: lastGoalTeam,
        ball: { pos: ball.pos.toArray(), vel: ball.vel.toArray(), spin: ball.spin.toArray(), active: ball.active },
        cars: cars.map(c => ({ seat: c.netSeat, pos: c.pos.toArray(), vel: c.vel.toArray(),
            q: c.q.toArray(), n: c.n.toArray(), fwd: c.fwd.toArray(),
            jumpN: c.jumpN.toArray(), canFlip: c.canFlip,
            boost: c.boost, boostIdle: c.boostIdle,
            boosting: c.boosting, onGround: c.onGround, supersonic: c.supersonic,
            steer: c.input.steer, stats: c.stats,
            ack: remoteInputs.get(c.netSeat)?.seq ?? null,
            ackAge: remoteInputs.has(c.netSeat) ? (performance.now() - remoteInputs.get(c.netSeat).rt) / 1000 : 0 })),
    };
}
function onlineApplySnapshot(snap) {
    if (!online.active || online.isHost || !Array.isArray(snap.cars) || snap.cars.length !== settings.mode * 2) return;
    const previous = state;
    if (Array.isArray(snap.playerNames)) {
        for (const p of snap.playerNames) {
            if (!p || !Number.isInteger(p.seat) || !usernamePattern.test(p.name || '')) continue;
            if (p.seat === online.seat) continue;
            const c = cars.find(c => c.netSeat === p.seat);
            if (c && typeof p.skin === 'string') repaintCar(c, p.skin);
            if (!c || c.name === p.name) continue;
            const oldTag = c.mesh.userData.nameTag;
            if (oldTag) {
                c.mesh.remove(oldTag);
                oldTag.material.map.dispose();
                oldTag.material.dispose();
            }
            c.name = p.name;
            c.mesh.userData.nameTag = makeNameTag(p.name,TEAM_CSS[c.team]);
            c.mesh.add(c.mesh.userData.nameTag);
        }
    }
    timeLeft = snap.timeLeft; overtime = !!snap.overtime; otTime = snap.otTime;
    scoreArr = snap.scores;
    updateScoreHud();
    $('clock').classList.toggle('ot', overtime);
    const scorerIdx = cars.findIndex(c => c.netSeat === snap.scorerSeat);
    if (snap.state === 'replay') {
        if (state !== 'replay') {
            lastGoalTeam = snap.goalTeam;
            replayScorer = scorerIdx;
            if (!startReplay(!!snap.replayFinal))
                state = 'goal';
        }
        if (state === 'replay')
            return;
    }
    else if (state === 'replay') {
        replay = null;
        $('hud').classList.remove('replaying');
        shock.visible = false;
    }
    const live = snap.state === 'play' || snap.state === 'goal';
    const own = snap.cars.find(d => d && d.seat === online.seat);
    if (own && Number.isInteger(own.ack) && netSent.has(own.ack)) {
        const sample = performance.now() / 1000 - netSent.get(own.ack) - clamp(+own.ackAge || 0, 0, 1);
        if (sample > 0 && sample < 2) netRtt += (sample - netRtt) * .15;
    }
    const lead = live ? clamp(netRtt / 2, 0, .3) * (snap.state === 'goal' && snap.goalT > 2 ? .35 : 1) : 0;
    if (snap.ball && Array.isArray(snap.ball.pos) && Array.isArray(snap.ball.vel)) {
        ball.spin.fromArray(snap.ball.spin);
        ball.active = !!snap.ball.active;
        ball.mesh.visible = ball.active;
        const touching = snap.state === 'play' && performance.now() / 1000 - netTouchAt < netRtt + .12;
        if (!touching) {
            _nbp.fromArray(snap.ball.pos);
            _nbv.fromArray(snap.ball.vel);
            for (let t = lead; t > 1e-4; t -= 1 / 120)
                simBall(_nbp, _nbv, Math.min(1 / 120, t));
            if (live) netSetPos(ball, _nbp);
            else {
                ball.pos.copy(_nbp);
                if (ball.nvo) ball.nvo.set(0, 0, 0);
            }
            ball.vel.copy(_nbv);
        }
    }
    for (const data of snap.cars) {
        const c = cars.find(x => x.netSeat === data.seat);
        if (!c || !Array.isArray(data.pos) || !Array.isArray(data.vel) || !Array.isArray(data.q)) continue;
        _netPos.fromArray(data.pos); _netVel.fromArray(data.vel); _netQ.fromArray(data.q);
        const predicted = data.seat === online.seat && state === 'play' && snap.state === 'play';
        if (predicted) {
            let past = null;
            if (Number.isInteger(data.ack) && netSent.has(data.ack))
                past = netHistAt(netSent.get(data.ack) + clamp(+data.ackAge || 0, 0, .5));
            const refP = past ? past.p : c.pos, refV = past ? past.v : c.vel;
            _netErr.copy(_netPos).sub(refP);
            const err = _netErr.length();
            if (err > 15) {
                c.pos.copy(_netPos); c.vel.copy(_netVel); c.q.copy(_netQ);
                if (c.nvo) c.nvo.set(0, 0, 0);
                netHist.length = 0;
            } else if (err > .5) {
                const k = past ? .3 : .1;
                netSetPos(c, _nt.copy(c.pos).addScaledVector(_netErr, k));
                c.vel.addScaledVector(_nv.copy(_netVel).sub(refV), k);
            }
        } else if (live) {
            netSetPos(c, _nt.copy(_netPos).addScaledVector(_netVel, lead));
            c.vel.copy(_netVel); c.q.copy(_netQ);
        } else {
            c.pos.copy(_netPos); c.vel.copy(_netVel); c.q.copy(_netQ);
            if (c.nvo) c.nvo.set(0, 0, 0);
        }
        if (Array.isArray(data.n)) {
            if (predicted) c.n.lerp(_netPos.fromArray(data.n), .35).normalize();
            else c.n.fromArray(data.n);
        }
        if (Array.isArray(data.fwd)) {
            if (predicted) c.fwd.lerp(_netPos.fromArray(data.fwd), .35).normalize();
            else c.fwd.fromArray(data.fwd);
            c.yaw = Math.atan2(c.fwd.x, c.fwd.z);
        }
        if (Array.isArray(data.jumpN)) c.jumpN.fromArray(data.jumpN);
        if (!predicted) c.canFlip = !!data.canFlip;
        c.boost = data.boost; c.boostIdle = data.boostIdle;
        c.boosting = !!data.boosting; c.onGround = !!data.onGround;
        c.supersonic = !!data.supersonic;
        if (!predicted) c.input.steer = data.steer;
        c.stats = data.stats;
    }
    state = snap.state === 'replay' ? 'goal' : snap.state;
    if (state === 'countdown' && typeof snap.countT === 'number')
        countT = snap.countT;
    if (typeof snap.goalT === 'number')
        goalT = snap.goalT;
    if (previous !== state) {
        if (state === 'goal') {
            lastGoalTeam = snap.goalTeam;
            replayScorer = scorerIdx;
            saveLastGoalReplay();
            showCenter('GOAL!', 1.5, '#fff');
            const scorer = cars.find(c => c.netSeat === snap.scorerSeat);
            const scorerName = scorer ? scorer.name : TEAM_NAME[snap.goalTeam] || 'TEAM';
            showSub(`${scorerName} SCORED!`, 1.5);
        }
        if (state === 'countdown') {
            $('center').classList.remove('show');
            $('sub').classList.remove('show');
            centerTimer = subTimer = 0;
            camSnap = true;
            lastCount = 0;
        }
        if (state === 'play' && previous === 'countdown') {
            showCenter('GO!', .7, '#7dff9a');
            sfx.beep(true);
        }
        if (state === 'ended') endMatch();
    }
}
const SPOTS = [[-64, -82], [64, -82], [-8, -124], [8, -124], [0, -148]];
function resetKickoff() {
    ball.pos.set(0, BR, 0);
    ball.vel.set(0, 0, 0);
    ball.spin.set(0, 0, 0);
    ballStuckFor = 0;
    ball.active = true;
    ball.mesh.visible = true;
    const spots = [...SPOTS].sort(() => Math.random() - .5);
    const blue = cars.filter(c => c.team === 0), red = cars.filter(c => c.team === 1);
    if (player && (!online.active || online.isHost)) {
        const idx = blue.indexOf(player);
        if (idx >= 0) { blue.splice(idx, 1); blue.unshift(player); }
    }
    for (let i = 0; i < blue.length; i++) {
        const [x, z] = spots[i];
        placeCar(blue[i], x, z);
        placeCar(red[i], -x, -z);
    }
    lastTouch = [null, null];
    lastToucher = null;
    ignoredOwnGoal = false;
    if (rec) {
        rec.head = 0;
        rec.count = 0;
    }
    lastRecT = -1;
    replay = null;
    $('hud').classList.remove('replaying');
    state = 'countdown';
    $('center').classList.remove('show');
    $('sub').classList.remove('show');
    centerTimer = subTimer = 0;
    countT = attract ? 1 : 3;
    lastCount = 0;
    kickoffT = 0;
    acc = 0;
    if (!attract) {
        camSnap = true;
        camFlipBlend = 0;
    }
}
function placeCar(c, x, z) {
    if (!c)
        return;
    c.pos.set(x, CAR_Y, z);
    c.vel.set(0, 0, 0);
    c.yaw = Math.atan2(-x, -z);
    c.n.set(0, 1, 0);
    c.fwd.set(Math.sin(c.yaw), 0, Math.cos(c.yaw));
    c.jumpN.set(0, 1, 0);
    setOrientation(c);
    c.onGround = true;
    c.flipping = false;
    c.canFlip = false;
    c.boost = 100;
    c.boostIdle = 0;
    c.stun = 0;
    c.mesh.visible = true;
    c.boosting = false;
    c.ai.stage = null;
    c.ai.stuck = 0;
    c.ai.rev = 0;
    c.prevJump = true;
    c.angVel.set(0, 0, 0);
}
function onGoal(team) {
    recFrame();
    goalLog.push({ team, touch: touchInfo, t: +simTime.toFixed(2) });
    scoreArr[team]++;
    updateScoreHud();
    lastGoalTeam = team;
    const scorer = lastTouch[team];
    replayScorer = scorer ? cars.indexOf(scorer) : -1;
    saveLastGoalReplay();
    if (scorer)
        scorer.stats.goals++;
    burst(ball.pos, TEAM_COL[team], 460, 60, 1.9);
    burst(ball.pos, 0xffffff, 140, 38, 1.3);
    shock.position.set(ball.pos.x, ball.pos.y, Math.sign(ball.pos.z) * HL);
    shock.material.color.set(TEAM_COL[team]);
    shock.visible = true;
    shockT = 1;
    ball.active = false;
    ball.mesh.visible = false;
    state = 'goal';
    goalT = attract ? 2.5 : 2.8;
    shake = .8;
    if (team === 0) {
        exciteB = 1;
        exciteR = 0;
    }
    else {
        exciteR = 1;
        exciteB = 0;
    }
    matchOverAfterGoal = overtime || timeLeft <= 0;
    if (!attract) {
        sfx.goal(!player || team === player.team);
        const own = !scorer && lastToucher;
        showCenter('GOAL!', 2.4, TEAM_CSS[team]);
        showSub(scorer ? `${scorer.name} SCORED${scorer.human ? '!' : ''}` : own ? `OWN GOAL BY ${lastToucher.name}` : `${TEAM_NAME[team]} SCORED!`, 2.4);
        feed(`<span style="color:${TEAM_CSS[team]}">${scorer ? scorer.name : TEAM_NAME[team]}</span> scored`);
    }
}
function endMatch() {
    state = 'ended';
    const win = scoreArr[0] > scoreArr[1] ? 0 : 1, r = $('result');
    r.textContent = win === (player ? player.team : 0) ? 'VICTORY' : 'DEFEAT';
    r.style.color = win === 0 ? TEAM_CSS[0] : TEAM_CSS[1];
    $('finalScore').innerHTML = `<span style="color:${TEAM_CSS[0]}">${scoreArr[0]}</span> &nbsp;&mdash;&nbsp; <span style="color:${TEAM_CSS[1]}">${scoreArr[1]}</span>`;
    let h = '<tr><th>PLAYER</th><th>GOALS</th><th>SHOTS</th><th>SAVES</th><th>TOUCHES</th></tr>';
    for (const c of [...cars].sort((a, b) => a.team - b.team || b.stats.goals - a.stats.goals))
        h += `<tr class="${c.team ? 'to' : 'tb'} ${c.human ? 'me' : ''}"><td>${c.name}</td><td>${c.stats.goals}</td><td>${c.stats.shots}</td><td>${c.stats.saves}</td><td>${c.stats.touches}</td></tr>`;
    $('stats').innerHTML = h;
    $('coinGain').innerHTML = '';
    if (player && !attract) {
        const won = win === player.team;
        const earn = won ? (online.active ? 200 : [100, 200, 300][settings.diff] || 100) : 0;
        STORE.coins += earn;
        saveStore();
        updateCoinUI();
        $('coinGain').innerHTML = `<span class="coinIco"></span>+${earn} COINS`;
    }
    $('end').classList.remove('hidden');
    $('hud').classList.add('hidden');
    sfx.engine(0, false, false);
    sfx.playResult(win === (player ? player.team : 0));
}
function updateScoreHud() { $('sB').textContent = scoreArr[0]; $('sO').textContent = scoreArr[1]; }
let centerTimer = 0, subTimer = 0;
function showCenter(text, dur, col = '#fff') { const e = $('center'); e.textContent = text; e.style.color = col; e.classList.add('show'); centerTimer = dur; }
function showSub(text, dur) { const e = $('sub'); e.textContent = text; e.classList.add('show'); subTimer = dur; }
function feed(html) { if (attract)
    return; const d = document.createElement('div'); d.innerHTML = html; $('feed').prepend(d); setTimeout(() => d.remove(), 4500); while ($('feed').children.length > 5)
    $('feed').lastChild.remove(); }
function fmt(t) { t = Math.max(0, Math.ceil(t)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; }
function togglePause() {
    if (attract || state === 'ended' || online.active)
        return;
    paused = !paused;
    $('pause').classList.toggle('hidden', !paused);
    $('pauseTitle').textContent = 'PAUSED';
    $('restartBtn').classList.toggle('hidden', online.active);
    sfx.pause(paused);
}
document.querySelectorAll('.seg').forEach(seg => seg.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b)
        return;
    seg.querySelectorAll('button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    settings[seg.dataset.key] = +b.dataset.v;
}));
function startGame() {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    sfx.init();
    sfx.stopGoal();
    sfx.stopResult();
    perfHold(3000);
    $('menu').classList.add('hidden');
    $('end').classList.add('hidden');
    $('pause').classList.add('hidden');
    $('hud').classList.remove('hidden');
    $('feed').innerHTML = '';
    paused = false;
    setupMatch(false);
}
function showChoices() {
    $('choosePlay').classList.remove('hidden');
    $('menu').classList.add('hidden');
    $('matchSearch').classList.add('hidden');
}
function showMatchOptions(which) {
    playType = which;
    $('difficultyLabel').textContent = which === 'online' ? 'SKILL LEVEL' : 'BOTS';
    $('choosePlay').classList.add('hidden');
    $('menu').classList.remove('hidden');
}
const ONLINE_ERROR_HTML = 'Sorry, something went wrong. Please try again later. If this problem persists, please contact <span class="pvName">Play<span class="vora">vora</span></span> support.';
const ONLINE_OK_MESSAGES = ['No other player joined this search. Try again.', 'That matchmaking room closed. Try again.'];
function setSearchError(heading) {
    setSearch(heading, ' ', false);
    $('searchDetail').innerHTML = ONLINE_ERROR_HTML;
}
function setSearch(heading, detail, showSpinner = true) {
    $('menu').classList.add('hidden');
    $('matchSearch').classList.remove('hidden');
    $('searchHeading').textContent = heading;
    $('searchDetail').textContent = showSpinner ? '' : detail;
    $('searchDetail').classList.toggle('hidden', showSpinner || !detail);
    document.querySelector('.search-spinner').classList.toggle('hidden', !showSpinner);
    $('cancelSearch').textContent = showSpinner ? 'CANCEL SEARCH' : 'BACK TO MENU';
}
async function searchRealPlayer() {
    setSearch('SEARCHING FOR A MATCH', '');
    online.onFound = () => setSearch('JOINING MATCH', '');
    online.onStart = () => {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        sfx.init(); sfx.stopGoal(); sfx.stopResult();
        perfHold(3000);
        $('matchSearch').classList.add('hidden');
        $('end').classList.add('hidden');
        $('pause').classList.add('hidden');
        $('hud').classList.remove('hidden');
        $('feed').innerHTML = '';
        paused = false;
        onlineInputTimer = onlineSnapshotTimer = 0;
        setupOnlineMatch();
    };
    online.onInput = p => {
        if (online.isHost && Number.isInteger(p.seat) && p.seat >= 0 && p.seat < settings.mode * 2 && p.seat !== online.seat) {
            const prev = remoteInputs.get(p.seat);
            if (prev && Number.isInteger(prev.seq) && Number.isInteger(p.seq) && p.seq < prev.seq) return;
            remoteInputs.set(p.seat, { controls: p.controls, at: Date.now(), seq: p.seq, rt: performance.now() });
        }
    };
    online.onSnapshot = onlineApplySnapshot;
    online.onSkin = (seat, id) => { const c = cars.find(c => c.netSeat === seat); if (c) repaintCar(c, id); };
    online.onLost = (message, reason) => {
        toMenu(true);
        $('choosePlay').classList.add('hidden');
        if (reason === 'disconnect') setSearch('PLAYER DISCONNECTED', 'MATCH ENDED', false);
        else if (ONLINE_OK_MESSAGES.includes(message)) setSearch('ONLINE MATCH ENDED', message, false);
        else setSearchError('ONLINE MATCH ENDED');
    };
    try { await online.search(settings); }
    catch (err) {
        console.warn('Online search failed:', err);
        setSearchError('ONLINE UNAVAILABLE');
    }
}
function toMenu(backToChoice = true) {
    if (online.active || online.finding || online.room) online.cancel();
    $('matchSearch').classList.add('hidden');
    paused = false;
    sfx.pause(false);
    sfx.stopGoal();
    sfx.stopResult();
    sfx.engine(0, false, false);
    ['pause', 'end', 'hud'].forEach(id => $(id).classList.add('hidden'));
    $('menu').classList.toggle('hidden', backToChoice);
    $('choosePlay').classList.toggle('hidden', !backToChoice);
    $('center').classList.remove('show');
    $('sub').classList.remove('show');
    setupMatch(true);
    camSnap = true;
    perfHold(2500);
}
let rec = null, lastRecT = -1, replay = null, replayScorer = -1, lastGoalReplay = null;
const _rq0 = new Q4(), _rq1 = new Q4();
function recInit() { const stride = 12 + cars.length * 11, cap = 600; rec = { stride, cap, buf: new Float32Array(stride * cap), head: 0, count: 0 }; lastRecT = -1; }
function recFrame() {
    if (!rec || attract)
        return;
    const b = rec.buf, o = rec.head * rec.stride, bq = ball.mesh.quaternion;
    b[o] = simTime;
    b[o + 1] = ball.pos.x;
    b[o + 2] = ball.pos.y;
    b[o + 3] = ball.pos.z;
    b[o + 4] = bq.x;
    b[o + 5] = bq.y;
    b[o + 6] = bq.z;
    b[o + 7] = bq.w;
    b[o + 8] = ball.vel.x;
    b[o + 9] = ball.vel.y;
    b[o + 10] = ball.vel.z;
    b[o + 11] = 1;
    let k = o + 12;
    for (const c of cars) {
        b[k] = c.pos.x;
        b[k + 1] = c.pos.y;
        b[k + 2] = c.pos.z;
        b[k + 3] = c.q.x;
        b[k + 4] = c.q.y;
        b[k + 5] = c.q.z;
        b[k + 6] = c.q.w;
        b[k + 7] = c.vel.x;
        b[k + 8] = c.vel.y;
        b[k + 9] = c.vel.z;
        b[k + 10] = c.boosting ? 1 : 0;
        k += 11;
    }
    rec.head = (rec.head + 1) % rec.cap;
    rec.count = Math.min(rec.count + 1, rec.cap);
}
function saveLastGoalReplay() {
    if (!rec || rec.count < 20) {
        lastGoalReplay = null;
        return;
    }
    const n = rec.count, S = rec.stride, cap = rec.cap;
    const start = (rec.head - n + cap) % cap;
    const buf = new Float32Array(n * S);
    for (let i = 0; i < n; i++) {
        const pos = (start + i) % cap * S;
        buf.set(rec.buf.subarray(pos, pos + S), i * S);
    }
    lastGoalReplay = { stride: S, cap: n, buf, head: 0, count: n };
}
function finishMatch() {
    if (!attract && lastGoalReplay && startReplay(true))
        return;
    endMatch();
}
function startReplay(final = false) {
    const source = final ? lastGoalReplay : rec;
    if (!source || source.count < 20)
        return false;
    const n = source.count, cap = source.cap, st = (source.head - n + cap) % cap, idx = [], S = source.stride;
    for (let i = 0; i < n; i++)
        idx.push((st + i) % cap);
    const tEnd = source.buf[idx[n - 1] * S], tStart = Math.max(source.buf[idx[0] * S], tEnd - 5.2);
    let k = 0;
    while (k < n - 2 && source.buf[idx[k + 1] * S] <= tStart)
        k++;
    replay = { source, final, idx, tStart, tEnd, t: tStart, k, team: lastGoalTeam, scorer: replayScorer, cut: false, snapped: false, hold: 0, goalSlow: false, slowBlend: 0 };
    state = 'replay';
    ball.active = true;
    ball.mesh.visible = true;
    shock.visible = false;
    shockT = 0;
    const sc = replayScorer >= 0 ? cars[replayScorer] : null;
    $('replayBadge').style.background = lastGoalTeam ? 'linear-gradient(180deg,#ff5050,#c4161c)' : 'linear-gradient(180deg,#4b97ff,#1c5fd6)';
    $('replayBadge').innerHTML = '<i></i>' + (final ? 'FINAL REPLAY' : 'REPLAY');
    $('replayWho').textContent = `${sc ? sc.name : TEAM_NAME[lastGoalTeam]} SCORED!`;
    $('hud').classList.add('replaying');
    $('center').classList.remove('show');
    $('sub').classList.remove('show');
    centerTimer = subTimer = 0;
    replayApply();
    return true;
}
function replayApply() {
    const r = replay, b = r.source.buf, S = r.source.stride, idx = r.idx;
    while (r.k < idx.length - 2 && b[idx[r.k + 1] * S] <= r.t)
        r.k++;
    const i0 = idx[r.k] * S, i1 = idx[Math.min(r.k + 1, idx.length - 1)] * S;
    const t0 = b[i0], t1 = b[i1], a = t1 > t0 ? clamp((r.t - t0) / (t1 - t0), 0, 1) : 0;
    ball.pos.set(lerp(b[i0 + 1], b[i1 + 1], a), lerp(b[i0 + 2], b[i1 + 2], a), lerp(b[i0 + 3], b[i1 + 3], a));
    _rq0.set(b[i0 + 4], b[i0 + 5], b[i0 + 6], b[i0 + 7]);
    _rq1.set(b[i1 + 4], b[i1 + 5], b[i1 + 6], b[i1 + 7]);
    ball.mesh.quaternion.copy(_rq0).slerp(_rq1, a);
    ball.vel.set(lerp(b[i0 + 8], b[i1 + 8], a), lerp(b[i0 + 9], b[i1 + 9], a), lerp(b[i0 + 10], b[i1 + 10], a));
    let k = 12;
    for (const c of cars) {
        c.pos.set(lerp(b[i0 + k], b[i1 + k], a), lerp(b[i0 + k + 1], b[i1 + k + 1], a), lerp(b[i0 + k + 2], b[i1 + k + 2], a));
        _rq0.set(b[i0 + k + 3], b[i0 + k + 4], b[i0 + k + 5], b[i0 + k + 6]);
        _rq1.set(b[i1 + k + 3], b[i1 + k + 4], b[i1 + k + 5], b[i1 + k + 6]);
        c.q.copy(_rq0).slerp(_rq1, a);
        c.vel.set(lerp(b[i0 + k + 7], b[i1 + k + 7], a), lerp(b[i0 + k + 8], b[i1 + k + 8], a), lerp(b[i0 + k + 9], b[i1 + k + 9], a));
        c.boosting = b[i0 + k + 10] > .5;
        k += 11;
    }
}
function stepReplay(dt) {
    const r = replay, guest = online.active && !online.isHost;
    if (!r) {
        if (!guest)
            afterGoal();
        return;
    }
    if (r.hold > 0) {
        r.hold -= dt;
        if (r.hold <= 0) {
            if (guest)
                r.hold = 1e-3;
            else
                afterGoal();
        }
        return;
    }
    const targetGoalZ = r.team === 0 ? HL : -HL;
    if (Math.abs(ball.pos.z - targetGoalZ) < 65 && Math.abs(ball.pos.x) < GW / 2 + 22)
        r.goalSlow = true;
    r.slowBlend = lerp(r.slowBlend, r.goalSlow ? 1 : 0, Math.min(1, dt * 6));
    r.t += dt * (1 - .65 * r.slowBlend);
    if (r.t >= r.tEnd) {
        r.t = r.tEnd;
        replayApply();
        burst(ball.pos, TEAM_COL[r.team], 360, 55, 1.6);
        burst(ball.pos, 0xffffff, 100, 35, 1.1);
        shock.position.set(ball.pos.x, ball.pos.y, Math.sign(ball.pos.z) * HL);
        shock.material.color.set(TEAM_COL[r.team]);
        shock.visible = true;
        shockT = 1;
        ball.active = false;
        ball.mesh.visible = false;
        for (const c of cars)
            c.boosting = false;
        r.hold = 1.2;
        return;
    }
    replayApply();
}
function afterGoal() {
    const final = replay && replay.final;
    replay = null;
    $('hud').classList.remove('replaying');
    if (final) {
        endMatch();
        return;
    }
    if (!attract && matchOverAfterGoal) {
        if (scoreArr[0] === scoreArr[1]) {
            overtime = true;
            $('clock').classList.add('ot');
            resetKickoff();
        }
        else
            endMatch();
    }
    else
        resetKickoff();
}
function replayCam(dt) {
    const r = replay, gs = r.team === 0 ? 1 : -1;
    if (r.tEnd - r.t < 1.2 || r.hold > 0) {
        camPosT.set(clamp(ball.pos.x * .4, -GW / 2 + 6, GW / 2 - 6), GH * .45, gs * (HL + GD - 2.5));
        if (r.hold <= 0)
            camLookT.copy(ball.pos);
        if (!r.cut) {
            r.cut = true;
            camPos.copy(camPosT);
            camLook.copy(camLookT);
        }
    }
    else {
        const sc = r.scorer >= 0 ? cars[r.scorer] : null;
        if (sc && sc.pos.distanceTo(ball.pos) < 45) {
            _a.set(sc.pos.x - ball.pos.x, 0, sc.pos.z - ball.pos.z);
            if (_a.lengthSq() < 1)
                _a.set(0, 0, -gs);
            _a.normalize();
            camPosT.copy(sc.pos).addScaledVector(_a, 15);
            camPosT.y = sc.pos.y + 6;
        }
        else {
            _a.set(-ball.vel.x, 0, -ball.vel.z);
            if (_a.lengthSq() < 1)
                _a.set(0, 0, -gs);
            _a.normalize();
            camPosT.copy(ball.pos).addScaledVector(_a, 22);
            camPosT.y = ball.pos.y + 8;
        }
        camLookT.copy(ball.pos);
        if (!r.snapped) {
            r.snapped = true;
            camPos.copy(camPosT);
            camLook.copy(camLookT);
        }
    }
    for (let k = 0; k < 2; k++) {
        const dc = arenaD(camPosT.x, camPosT.y, camPosT.z);
        if (dc < 2) {
            arenaN(camPosT, _cn);
            camPosT.addScaledVector(_cn, 2 - dc);
        }
    }
    camPos.lerp(camPosT, 1 - Math.exp(-5 * dt));
    camLook.lerp(camLookT, 1 - Math.exp(-8 * dt));
    camera.fov = 68;
    updateShadow(camLook.x, camLook.z, 110);
}
$('botsChoice').onclick = () => { if (confirmUsername()) showMatchOptions('bots'); };
$('onlineChoice').onclick = () => { if (confirmUsername()) showMatchOptions('online'); };
$('backToChoice').onclick = showChoices;
$('playBtn').onclick = () => playType === 'online' ? searchRealPlayer() : startGame();
$('againBtn').onclick = () => playType === 'online' ? searchRealPlayer() : startGame();
$('restartBtn').onclick = startGame;
$('menuBtn').onclick = () => toMenu(true);
$('quitBtn').onclick = () => toMenu(true);
$('resumeBtn').onclick = togglePause;
function updateCoinUI() {
    document.querySelectorAll('.coinVal').forEach(e => e.textContent = STORE.coins.toLocaleString());
    const eq = SKIN_BY_ID[STORE.equipped];
}
const storeUI = (() => {
    const cv = $('storeView');
    let r2 = null, pscene, pcam, turntable, ring, viewCar = null, open = false, raf = 0, showTok = 0, thumbJob = null, thumbTick = 0, openedAt = 0;
    let sel = STORE.equipped, filter = 'all', from = 'choosePlay', kind = 'car';
    const thumbs = Object.assign({}, window.TC_THUMBS || {}), thumbQ = [];
    const KIND = {
        car: { list: SKINS, by: SKIN_BY_ID, owned: () => STORE.owned, get eq() { return STORE.equipped; }, set eq(v) { STORE.equipped = v; online.setSkin && online.setSkin(v); }, target: .7 },
        ball: { list: BALLS, by: BALL_BY_ID, owned: () => STORE.ownedBalls, get eq() { return STORE.ball; }, set eq(v) { STORE.ball = v; }, target: 1.62 },
    };
    let yaw = .7, pitch = .32, dist = 10.5, vy = 0, vp = 0, drag = null, idleT = 0, lastT = 0, autoSpin = true, curKey = '';
    const stopped = new Map();
    const TARGET = new V3(0, .7, 0);
    function disposeCar(o) {
        if (!o)
            return;
        o.parent && o.parent.remove(o);
        o.traverse(m => {
            if (!m.isMesh)
                return;
            if (![tireGeo, rimGeo, spokeGeo, capGeo].includes(m.geometry))
                m.geometry.dispose();
            if (m.material !== tireM && m.material !== rimM && m.material !== ball.mesh.material)
                m.material.dispose();
        });
    }
    function makeCar(skin, k = kind) {
        const holder = new THREE.Group();
        if (k === 'ball') {
            const m = new THREE.Mesh(new THREE.SphereGeometry(1.6, 64, 40), ballMaterial(skin));
            m.position.y = 1.62;
            m.castShadow = true;
            holder.add(m);
            return holder;
        }
        const m = buildCarMesh(0, null, true, skin.team ? null : skin, holder);
        m.g.position.y = CAR_Y + .02;
        for (const w of m.wheels)
            if (w.front)
                w.pivot.rotation.y = -.32;
        return holder;
    }
    function init() {
        r2 = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
        r2.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
        r2.outputColorSpace = THREE.SRGBColorSpace;
        r2.toneMapping = THREE.ACESFilmicToneMapping;
        r2.toneMappingExposure = .85;
        r2.shadowMap.enabled = true;
        r2.shadowMap.type = THREE.PCFSoftShadowMap;
        pscene = new THREE.Scene();
        const env = new THREE.Scene();
        env.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.ShaderMaterial({
            side: THREE.BackSide,
            vertexShader: 'varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
            fragmentShader: 'varying vec3 vD; void main(){ vec3 d = normalize(vD); float h = d.y * .5 + .5; vec3 c = mix(vec3(.02,.025,.04), vec3(.28,.33,.45), pow(h, 1.6)); gl_FragColor = vec4(c, 1.0); }',
        })));
        const box = (w, h, x, y, z, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
        box(30, 8, 0, 40, 0, 9);
        box(4, 30, 30, 18, -26, 7);
        box(10, 24, 40, 10, 10, 3);
        box(10, 24, -40, 8, -15, 2.2);
        box(36, 3, 0, 6, -44, 3.5);
        box(36, 3, 0, 6, 44, 2.5);
        const pm = new THREE.PMREMGenerator(r2);
        pscene.environment = pm.fromScene(env, .02).texture;
        pm.dispose();
        pscene.add(new THREE.HemisphereLight(0xcfdcff, 0x1a1d26, .5));
        const key = new THREE.DirectionalLight(0xffffff, 2.4);
        key.position.set(6, 12, 5);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 });
        key.shadow.bias = -.0005;
        key.shadow.normalBias = .02;
        pscene.add(key);
        const rim = new THREE.DirectionalLight(0x8fb6ff, 1.4);
        rim.position.set(-7, 4, -8);
        pscene.add(rim);
        turntable = new THREE.Group();
        pscene.add(turntable);
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.5, .26, 72), new THREE.MeshStandardMaterial({ color: 0x151a26, metalness: .7, roughness: .35 }));
        disc.position.y = -.13;
        disc.receiveShadow = true;
        turntable.add(disc);
        ring = new THREE.Mesh(new THREE.TorusGeometry(4.38, .05, 8, 120), new THREE.MeshBasicMaterial({ color: 0x4b97ff, toneMapped: false }));
        ring.rotation.x = Math.PI / 2;
        ring.position.y = .02;
        turntable.add(ring);
        const glow = new THREE.Mesh(new THREE.RingGeometry(4.5, 6.2, 72), new THREE.MeshBasicMaterial({ color: 0x4b97ff, transparent: true, opacity: .12, depthWrite: false, toneMapped: false }));
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = -.25;
        pscene.add(glow);
        pcam = new THREE.PerspectiveCamera(30, 1.6, .1, 200);
        cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; vy = vp = 0; autoSpin = false; if (curKey) stopped.set(curKey, yaw); cv.setPointerCapture(e.pointerId); cv.classList.add('grab'); });
        cv.addEventListener('pointermove', e => {
            if (!drag)
                return;
            const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
            drag.x = e.clientX;
            drag.y = e.clientY;
            yaw += dx * .011;
            pitch = clamp(pitch + dy * .006, -.05, 1.25);
            vy = dx * .011;
            vp = dy * .006;
            idleT = 0;
        });
        const up = e => { drag = null; cv.classList.remove('grab'); };
        cv.addEventListener('pointerup', up);
        cv.addEventListener('pointercancel', up);
        cv.addEventListener('wheel', e => { e.preventDefault(); dist = clamp(dist * (1 + Math.sign(e.deltaY) * .08), 6.5, 17); idleT = 0; }, { passive: false });
        cv.addEventListener('dblclick', () => { yaw = .7; pitch = .32; dist = 10.5; vy = vp = 0; });
        for (const s of SKINS)
            if (!thumbs['car:' + s.id])
                thumbQ.push(['car', s.id]);
        for (const b of BALLS)
            if (!thumbs['ball:' + b.id])
                thumbQ.push(['ball', b.id]);
    }
    function size() {
        const w = cv.clientWidth, h = cv.clientHeight;
        if (!w || !h)
            return;
        const pw = Math.floor(w * r2.getPixelRatio()), ph = Math.floor(h * r2.getPixelRatio());
        if (cv.width !== pw || cv.height !== ph)
            r2.setSize(w, h, false);
        pcam.aspect = w / h;
        pcam.updateProjectionMatrix();
    }
    function placeCam(y, p, d) {
        pcam.position.set(Math.sin(y) * Math.cos(p) * d, TARGET.y + Math.sin(p) * d, Math.cos(y) * Math.cos(p) * d);
        pcam.lookAt(TARGET);
    }
    function startThumbJob() {
        if (thumbJob || !thumbQ.length)
            return;
        const [k, id] = thumbQ.shift();
        const holder = makeCar(KIND[k].by[id], k), job = { k, id, holder, ready: false };
        thumbJob = job;
        r2.compileAsync(holder, pcam, pscene).then(() => { job.ready = true; }, () => { job.ready = true; });
    }
    function renderThumb() {
        const { k, id, holder } = thumbJob;
        thumbJob = null;
        if (viewCar)
            viewCar.visible = false;
        turntable.add(holder);
        const tt = turntable.rotation.y, ty = TARGET.y;
        turntable.rotation.y = 0;
        TARGET.y = KIND[k].target;
        placeCam(.85, k === 'ball' ? .22 : .3, k === 'ball' ? 7.6 : 9.2);
        r2.render(pscene, pcam);
        const c = document.createElement('canvas');
        c.width = 240;
        c.height = 150;
        const W = cv.width, H = cv.height, a = 240 / 150;
        let sw = W, sh = W / a;
        if (sh > H) {
            sh = H;
            sw = H * a;
        }
        c.getContext('2d').drawImage(cv, (W - sw) / 2, (H - sh) / 2, sw, sh, 0, 0, 240, 150);
        thumbs[k + ':' + id] = c.toDataURL('image/png');
        disposeCar(holder);
        turntable.rotation.y = tt;
        TARGET.y = ty;
        if (viewCar)
            viewCar.visible = true;
        const img = k === kind && document.querySelector(`.skinCard[data-id="${id}"] img`);
        if (img) {
            img.src = thumbs[k + ':' + id];
            img.classList.add('ready');
        }
    }
    function showSkin(id) {
        sel = id;
        const k = kind, s = KIND[k].by[id], tok = ++showTok;
        ring.material.color.set(s.team ? 0x4b97ff : (s.accent ? s.accent[0] : 0xffffff));
        $('svName').textContent = s.name;
        $('svRarity').textContent = RARITY[s.rarity].name;
        $('svRarity').style.color = RARITY[s.rarity].css;
        updateCards();
        const holder = makeCar(s, k);
        r2.compileAsync(holder, pcam, pscene).catch(() => { }).then(() => {
            if (tok !== showTok || !open) {
                disposeCar(holder);
                return;
            }
            disposeCar(viewCar);
            viewCar = holder;
            turntable.add(holder);
            TARGET.y = KIND[k].target;
            curKey = k + ':' + id;
            if (stopped.has(curKey)) {
                autoSpin = false;
                yaw = stopped.get(curKey);
            }
            else
                autoSpin = true;
            vy = 0;
        });
    }
    function loop(now) {
        if (!open)
            return;
        raf = requestAnimationFrame(loop);
        const dt = Math.min(.05, (now - (lastT || now)) / 1000);
        lastT = now;
        SKIN_TIME.value = now / 1000;
        size();
        if (!drag && (++thumbTick % 4 === 0) && now - openedAt > 1500) {
            if (thumbJob && thumbJob.ready)
                renderThumb();
            else
                startThumbJob();
        }
        if (!drag) {
            idleT += dt;
            vy *= Math.exp(-9 * dt);
            vp *= Math.exp(-9 * dt);
            if (Math.abs(vy) < .0006)
                vy = 0;
            if (Math.abs(vp) < .0006)
                vp = 0;
            yaw += vy;
            pitch = clamp(pitch + vp, -.05, 1.25);
            if (autoSpin)
                yaw += dt * .35;
        }
        if (!autoSpin && curKey)
            stopped.set(curKey, yaw);
        turntable.rotation.y = yaw;
        placeCam(0, pitch, dist);
        r2.render(pscene, pcam);
    }
    function cardTag(s, owned, eq) {
        return eq ? '<b class="tagEq">EQUIPPED</b>' : owned ? '<b class="tagOwn">OWNED</b>' : `<b class="tagPrice"><span class="coinIco"></span>${s.price.toLocaleString()}</b>`;
    }
    function buildGrid() {
        const K = KIND[kind], grid = $('skinGrid'), frag = document.createDocumentFragment();
        for (const s of K.list) {
            const owned = K.owned().includes(s.id), th = thumbs[kind + ':' + s.id];
            if (filter === 'owned' && !owned)
                continue;
            if (filter !== 'all' && filter !== 'owned' && +filter !== s.rarity)
                continue;
            const d = document.createElement('div');
            d.className = 'skinCard';
            d.dataset.id = s.id;
            d.style.setProperty('--rc', RARITY[s.rarity].css);
            d.innerHTML = `<img alt="" ${th ? `class="ready" src="${th}"` : ''}><div class="scName">${s.name}</div><div class="scFoot"><i>${RARITY[s.rarity].name}</i><span class="scTag"></span></div>`;
            d.onclick = () => { if (sel !== s.id) showSkin(s.id); };
            frag.appendChild(d);
        }
        grid.replaceChildren(frag);
        updateCards();
    }
    function updateCards() {
        updateCoinUI();
        const K = KIND[kind];
        for (const d of $('skinGrid').children) {
            const s = K.by[d.dataset.id], owned = K.owned().includes(s.id), eq = K.eq === s.id;
            d.classList.toggle('sel', sel === s.id);
            d.classList.toggle('eq', eq);
            const tag = d.querySelector('.scTag'), html = cardTag(s, owned, eq);
            if (tag.innerHTML !== html)
                tag.innerHTML = html;
        }
        const s = K.by[sel], owned = K.owned().includes(sel), btn = $('svAction');
        let cls = 'big svAct', html, dis = false;
        if (K.eq === sel) {
            html = 'EQUIPPED';
            dis = true;
            cls += ' done';
        }
        else if (owned)
            html = 'EQUIP';
        else {
            html = `BUY <span class="coinIco"></span>${s.price.toLocaleString()}`;
            if (STORE.coins >= s.price)
                cls += ' buy';
            else {
                dis = true;
                cls += ' locked';
            }
        }
        if (btn.innerHTML !== html)
            btn.innerHTML = html;
        btn.className = cls;
        btn.disabled = dis;
    }
    function refresh() {
        updateCards();
    }
    $('svAction').onclick = () => {
        const K = KIND[kind], s = K.by[sel];
        if (!K.owned().includes(sel)) {
            if (STORE.coins < s.price)
                return;
            STORE.coins -= s.price;
            K.owned().push(sel);
            sfx.init && sfx.init();
        }
        K.eq = sel;
        saveStore();
        if (kind === 'ball' && attract)
            applyBallSkin();
        if (filter === 'owned')
            buildGrid();
        else
            updateCards();
    };
    document.querySelectorAll('#kindTabs button').forEach(b => b.onclick = () => {
        if (b.dataset.k === kind)
            return;
        document.querySelectorAll('#kindTabs button').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        kind = b.dataset.k;
        dist = kind === 'ball' ? 13 : 10.5;
        pitch = .32;
        vy = vp = 0;
        sel = KIND[kind].eq;
        buildGrid();
        $('skinGrid').scrollTop = 0;
        showSkin(sel);
    });
    document.querySelectorAll('#storeTabs button').forEach(b => b.onclick = () => {
        if (b.dataset.f === filter)
            return;
        document.querySelectorAll('#storeTabs button').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        filter = b.dataset.f;
        buildGrid();
        $('skinGrid').scrollTop = 0;
    });
    function prepare() {
        if (r2 || open)
            return;
        init();
        r2.setSize(480, 300, false);
        pcam.aspect = 1.6;
        pcam.updateProjectionMatrix();
        for (const [k, item] of [['car', SKIN_BY_ID[STORE.equipped] || SKINS[0]], ['ball', BALL_BY_ID[STORE.ball] || BALLS[0]]]) {
            const h = makeCar(item, k);
            turntable.add(h);
            TARGET.y = KIND[k].target;
            placeCam(.85, .3, 9.2);
            r2.render(pscene, pcam);
            h.visible = false;
        }
        TARGET.y = KIND.car.target;
    }
    for (const ev of ['pointerenter', 'focus', 'touchstart'])
        $('storeBtn').addEventListener(ev, prepare, { passive: true });
    return {
        prepare,
        get open() { return open; },
        show() {
            if (!r2)
                init();
            open = true;
            openedAt = performance.now();
            from = $('choosePlay').classList.contains('hidden') ? 'menu' : 'choosePlay';
            $(from).classList.add('hidden');
            $('store').classList.remove('hidden');
            sel = KIND[kind].eq;
            buildGrid();
            showSkin(sel);
            lastT = 0;
            idleT = 0;
            autoSpin = true;
            stopped.clear();
            curKey = '';
            raf = requestAnimationFrame(loop);
        },
        hide() {
            open = false;
            cancelAnimationFrame(raf);
            $('store').classList.add('hidden');
            $(from).classList.remove('hidden');
            updateCoinUI();
        },
    };
})();
$('storeBtn').onclick = () => storeUI.show();
$('storeClose').onclick = () => storeUI.hide();
online.setSkin && online.setSkin(STORE.equipped);
updateCoinUI();
$('cancelSearch').onclick = () => { online.cancel(); toMenu(true); };
let acc = 0, last = performance.now(), clockTime = 0;
const camPos = new V3(0, 50, -150), camLook = new V3(), camLookT = new V3(), camPosT = new V3();
let orbitA = 0, debugCam = null, camDirX = 0, camDirZ = 1, camSnap = true, camFlipBlend = 0;
const _cn = new V3();
function update(dt) {
    clockTime += dt;
    if (online.active && !online.isHost) {
        simTime += dt;
        if (player) {
            readPlayer(player);
            if (paused) clearInput(player.input);
            onlineInputTimer += dt;
            const ser = serializeInput(player.input), key = ser.join(',');
            if (key !== netLastInput || onlineInputTimer >= 1 / 30) {
                netSeq++;
                netSent.set(netSeq, performance.now() / 1000);
                if (netSent.size > 300)
                    netSent.delete(netSent.keys().next().value);
                online.sendInput(ser, netSeq);
                netLastInput = key;
                onlineInputTimer = 0;
            }
        }
        if (state === 'replay')
            stepReplay(dt);
        else {
            if (state === 'play' || state === 'goal') {
                if (state === 'goal') goalT -= dt;
                const scale = state === 'goal' && goalT > 2.0 ? .35 : 1;
                acc = Math.min(acc + dt * scale, .1);
                while (acc >= STEP) {
                    acc -= STEP;
                    for (const c of cars) {
                        if (c === player && state === 'play') {
                            updateCar(c, c.input, STEP);
                        } else
                            c.pos.addScaledVector(c.vel, STEP);
                        confineCar(c);
                    }
                    if (ball.active) {
                        stepBall(STEP);
                        for (const c of cars)
                            carBall(c);
                    }
                }
                if (player && ball.active && state === 'play' && player.pos.distanceToSquared(ball.pos) < (BR + 4.5) ** 2)
                    netTouchAt = performance.now() / 1000;
            } else acc = 0;
            if (player && state === 'play')
                netRecordSelf();
            if (state === 'countdown') {
                countT -= dt;
                const n = Math.ceil(countT);
                if (n !== lastCount && n > 0) {
                    showCenter(String(n), .9);
                    sfx.beep(false);
                }
                lastCount = n;
            }
            if (state === 'play' && simTime - lastRecT >= 1 / 60 - 1e-6) {
                recFrame();
                lastRecT = simTime;
            }
        }
        netDecay(dt);
        if (centerTimer > 0) centerTimer -= dt;
        if (subTimer > 0) subTimer -= dt;
        return;
    }
    if (state === 'countdown') {
        countT -= dt;
        const n = Math.ceil(countT);
        if (!attract && n !== lastCount && n > 0) {
            showCenter(String(n), .9);
            sfx.beep(false);
        }
        lastCount = n;
        if (countT <= 0) {
            state = 'play';
            kickoffT = 0;
            if (!attract) {
                showCenter('GO!', .7, '#7dff9a');
                sfx.beep(true);
            }
        }
    }
    else if (state === 'play') {
        kickoffT += dt;
        if (!attract) {
            if (!overtime) {
                timeLeft = Math.max(0, timeLeft - dt);
                if (timeLeft === 0) {
                    if (scoreArr[0] === scoreArr[1]) {
                        overtime = true;
                        otTime = 0;
                        $('clock').classList.add('ot');
                        $('clock').classList.remove('last-minute');
                        showCenter('OVERTIME', 2, '#ffd54a');
                    } else if (ball.pos.y <= BR + .4) {
                        finishMatch();
                    }
                }
            }
            else
                otTime += dt;
        }
    }
    else if (state === 'goal') {
        goalT -= dt;
        if (goalT <= 0) {
            const final = !attract && matchOverAfterGoal && scoreArr[0] !== scoreArr[1];
            if (attract || !startReplay(final))
                afterGoal();
        }
    }
    else if (state === 'replay')
        stepReplay(dt);
    exciteB = Math.max(0, exciteB - dt * .1);
    exciteR = Math.max(0, exciteR - dt * .1);
    tension = state === 'play' && Math.abs(ball.pos.z) > HL - 45 && Math.abs(ball.pos.x) < GW ? .35 : 0;
    if (state === 'ended')
        return;
    if (state === 'play' || state === 'goal') {
        predictBall();
        assignRoles();
        for (const c of cars) {
            if (online.active) {
                if (c.netSeat === online.seat) {
                    readPlayer(c);
                    if (paused) clearInput(c.input);
                } else {
                    const remote = remoteInputs.get(c.netSeat);
                    if (remote && Date.now() - remote.at < 1500) useRemoteInput(c.input, remote.controls);
                    else clearInput(c.input);
                }
            } else if (c.human) readPlayer(c);
            else botThink(c, dt);
        }
        const scale = state === 'goal' && goalT > (attract ? 1.5 : 2.0) ? .35 : 1;
        acc += dt * scale;
        while (acc >= STEP) {
            acc -= STEP;
            simTime += STEP;
            for (const c of cars)
                updateCar(c, c.input, STEP);
            for (let it = 0; it < 3; it++) {
                carCar();
                for (const c of cars)
                    confineCar(c);
            }
            if (ball.active) {
                stepBall(STEP);
                if (ball.active)
                    for (const c of cars)
                        carBall(c);
            }
        }
        if (state === 'play' && simTime - lastRecT >= 1 / 60 - 1e-6) {
            recFrame();
            lastRecT = simTime;
        }
    }
    else if (player)
        readPlayer(player);
}
const _cf = new V3(), _rq = new Q4(), _rax = new V3();
function render(dt) {
    for (const c of cars) {
        c.mesh.position.copy(c.pos);
        if (c.nvo) c.mesh.position.add(c.nvo);
        c.mesh.quaternion.copy(c.q);
        const vf = c.vel.dot(forwardOf(c, _cf));
        c.wheelRot += vf * dt / .59;
        for (const w of c.wheels) {
            w.w.rotation.x = c.wheelRot;
            if (w.front)
                w.pivot.rotation.y = c.onGround ? c.input.steer * .42 : 0;
        }
        for (const f of c.flames) {
            f.visible = c.boosting;
            if (f.visible)
                f.scale.set(1, rand(.85, 1.25), 1);
        }
        if (c.boosting) {
            _a.set(0, -CAR_Y + .45, -2.75).applyQuaternion(c.q).add(c.pos);
            forwardOf(c, _b);
            const col = c.team ? [1, .25, .3] : [.3, .62, 1];
            for (let i = 0; i < 3; i++)
                spawnP(_a.x + rand(-.25, .25), _a.y + rand(-.25, .25), _a.z + rand(-.25, .25), -_b.x * 14 + c.vel.x * .9 + rand(-1.5, 1.5), -_b.y * 14 + c.vel.y * .9 + rand(-1, 1.5), -_b.z * 14 + c.vel.z * .9 + rand(-1.5, 1.5), col[0], col[1], col[2], .26);
        }
    }
    ball.mesh.position.copy(ball.pos);
    if (ball.nvo && state !== 'replay') ball.mesh.position.add(ball.nvo);
    if (ball.active) {
        const sp = Math.hypot(ball.vel.x, ball.vel.z);
        if (state !== 'replay') {
            if (ball.pos.y <= BR + .05 && sp > .1) {
                _rax.set(ball.vel.z, 0, -ball.vel.x).divideScalar(sp);
                ball.mesh.quaternion.premultiply(_rq.setFromAxisAngle(_rax, sp * dt / BR));
            }
            else {
                const w = ball.spin.length();
                if (w > 1e-3) {
                    _rax.copy(ball.spin).divideScalar(w);
                    ball.mesh.quaternion.premultiply(_rq.setFromAxisAngle(_rax, w * dt));
                }
            }
        }
    }
    blob.visible = ball.active;
    blob.position.set(ball.pos.x, .05, ball.pos.z);
    const bs = 1 + ball.pos.y / 30;
    blob.scale.set(bs, bs, 1);
    blob.material.opacity = clamp(1 - ball.pos.y / 45, .15, 1);
    if (shockT > 0) {
        shockT -= dt * 1.1;
        const s = (1 - shockT) * 70 + 3;
        shock.scale.set(s, s, s);
        shock.material.opacity = Math.max(0, shockT) * .9;
        if (shockT <= 0)
            shock.visible = false;
    }
    updateParts(dt);
    for (const t of ledTexes)
        t.offset.x = (t.offset.x + dt * .02) % 1;
    crowdU.uTime.value = clockTime;
    crowdU.uExciteB.value = exciteB;
    crowdU.uExciteR.value = exciteR;
    for (const L of crowdLOD) {
        const near = camera.position.distanceTo(L.c) - L.r < 35;
        L.hi.visible = near;
        L.lo.visible = !near;
    }
    drawJumbo();
    if (attract || !player) {
        orbitA += dt * .06;
        camPosT.set(Math.sin(orbitA) * 100, 46, Math.cos(orbitA) * 135);
        camLookT.set(ball.pos.x * .5, 6, ball.pos.z * .5);
        if (camSnap) {
            camPos.copy(camPosT);
            camLook.copy(camLookT);
        }
        else {
            camPos.lerp(camPosT, 1 - Math.exp(-2 * dt));
            camLook.lerp(camLookT, 1 - Math.exp(-3 * dt));
        }
        camera.fov = 62;
        updateShadow(0, 0, 200);
    }
    else if (state === 'replay' && replay) {
        replayCam(dt);
    }
    else {
        const c = player;
        const bcOn = ballCam && ball.active && ball.mesh.visible;
        let canTrackHeading, bcRate = 7, bcDist = 0;
        if (bcOn) {
            _a.set(ball.pos.x - c.pos.x, 0, ball.pos.z - c.pos.z);
            bcDist = Math.sqrt(_a.lengthSq());
            canTrackHeading = bcDist > 4;
            bcRate = lerp(1.2, 3.4, clamp((bcDist - 6) / 40, 0, 1));
        }
        else {
            if (c.onGround)
                _a.copy(c.fwd);
            else
                forwardOf(c, _a);
            const facingUp = _b.set(0, 1, 0).applyQuaternion(c.q).y;
            canTrackHeading = c.onGround || (!c.flipping && facingUp > .45 && Math.abs(_a.y) < .65);
        }
        _a.y = 0;
        if (canTrackHeading && _a.lengthSq() > .15) {
            _a.normalize();
            const current = Math.atan2(camDirX, camDirZ);
            const desired = Math.atan2(_a.x, _a.z);
            const angle = Math.atan2(Math.sin(desired - current), Math.cos(desired - current));
            const turn = camSnap ? 1 : 1 - Math.exp(-bcRate * dt);
            let step = angle * turn;
            if (bcOn && !camSnap)
                step = clamp(step, -2 * dt, 2 * dt);
            const heading = current + step;
            camDirX = Math.sin(heading);
            camDirZ = Math.cos(heading);
        }
        camFlipBlend += ((c.flipping ? 1 : 0) - camFlipBlend) * (1 - Math.exp(-7 * dt));
        const distance = 13 + 5 * camFlipBlend;
        const height = 4.8 + 2 * camFlipBlend;
        const lookAhead = 6 - 2 * camFlipBlend;
        camPosT.set(c.pos.x - camDirX * distance, c.pos.y + height, c.pos.z - camDirZ * distance);
        camLookT.set(c.pos.x + camDirX * lookAhead, c.pos.y + 1.6 + .7 * camFlipBlend, c.pos.z + camDirZ * lookAhead);
        if (bcOn) {
            const hd = Math.max(4, Math.hypot(ball.pos.x - camPosT.x, ball.pos.z - camPosT.z));
            const want = bcDist > 4 ? clamp(Math.atan2(ball.pos.y - camPosT.y, hd), -.22, .2) : bcPitch;
            bcPitch = camSnap ? want : bcPitch + (want - bcPitch) * (1 - Math.exp(-3 * dt));
            const reach = distance + lookAhead;
            camLookT.set(c.pos.x + camDirX * lookAhead, camPosT.y + Math.tan(bcPitch) * reach, c.pos.z + camDirZ * lookAhead);
        }
        else
            bcPitch = Math.atan2(camLookT.y - camPosT.y, distance + lookAhead);
        for (let k = 0; k < 2; k++) {
            const dc = arenaD(camPosT.x, camPosT.y, camPosT.z);
            if (dc < 2) {
                arenaN(camPosT, _cn);
                camPosT.addScaledVector(_cn, 2 - dc);
            }
        }
        if (camSnap) {
            camPos.copy(camPosT);
            camLook.copy(camLookT);
            camera.fov = 76;
        }
        else {
            camPos.lerp(camPosT, 1 - Math.exp(-11 * dt));
            camLook.lerp(camLookT, 1 - Math.exp(-14 * dt));
            camera.fov = lerp(camera.fov, Math.max(c.supersonic ? 86 : c.boosting ? 81 : 76, 76 + 3 * camFlipBlend), 1 - Math.exp(-4 * dt));
        }
        updateShadow((c.pos.x + camLook.x) / 2, (c.pos.z + camLook.z) / 2, 110);
    }
    if (state !== 'replay' || !replay)
        camSnap = false;
    if (debugCam) {
        camPos.copy(debugCam.pos);
        camLook.copy(debugCam.look);
        camera.fov = debugCam.fov || 70;
        updateShadow(debugCam.look.x, debugCam.look.z, 110);
    }
    camera.updateProjectionMatrix();
    camera.position.copy(camPos);
    if (shake > 0) {
        shake = Math.max(0, shake - dt);
        const s = shake * (player && player.flipping ? .12 : 1.2);
        camera.position.x += rand(-s, s);
        camera.position.y += rand(-s, s);
        camera.position.z += rand(-s, s);
    }
    camera.lookAt(camLook);
    if (!attract && player) {
        $('clock').textContent = overtime ? '+' + fmt(otTime) : fmt(timeLeft);
        $('clock').classList.toggle('last-minute', !overtime && timeLeft <= 60);
        drawBoost(player.boost, player.boostIdle, player.boosting);
        const on = state !== 'ended' && !paused;
        sfx.engine(player.vel.length(), player.boosting, on && state !== 'replay');
    }
    if (centerTimer > 0) {
        centerTimer -= dt;
        if (centerTimer <= 0)
            $('center').classList.remove('show');
    }
    if (subTimer > 0) {
        subTimer -= dt;
        if (subTimer <= 0)
            $('sub').classList.remove('show');
    }
    renderer.render(scene, camera);
}
const bctx = $('boostC').getContext('2d');
let lastBoostKey = '';
function drawBoost(b, idle, boosting) {
    const v = Math.round(b), label = boosting || v >= 100 ? 'BOOST' : idle < REGEN_DELAY ? `RECHARGE ${Math.ceil(REGEN_DELAY - idle)}s` : 'RECHARGING';
    const key = v + label;
    if (key === lastBoostKey)
        return;
    lastBoostKey = key;
    const g = bctx, W = 340, cx = W / 2, r = 130;
    g.clearRect(0, 0, W, W);
    g.beginPath();
    g.arc(cx, cx, r + 22, 0, Math.PI * 2);
    g.fillStyle = 'rgba(8,12,26,.72)';
    g.fill();
    const a0 = Math.PI * .75, a1 = a0 + Math.PI * 1.5;
    g.lineCap = 'round';
    g.lineWidth = 26;
    g.beginPath();
    g.arc(cx, cx, r, a0, a1);
    g.strokeStyle = 'rgba(255,255,255,.12)';
    g.stroke();
    if (v > 0) {
        const gr = g.createLinearGradient(0, W, W, 0);
        gr.addColorStop(0, '#9fdcff');
        gr.addColorStop(1, '#2f6bff');
        g.beginPath();
        g.arc(cx, cx, r, a0, a0 + (a1 - a0) * v / 100);
        g.strokeStyle = gr;
        g.stroke();
    }
    g.fillStyle = '#fff';
    g.font = 'italic 900 96px Segoe UI, Arial';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(v, cx, cx - 6);
    g.font = `800 ${label.length > 6 ? 22 : 26}px Segoe UI, Arial`;
    g.fillStyle = label === 'BOOST' ? '#9cc8ff' : '#ffffff';
    g.fillText(label, cx, cx + 66);
}
let perfT = 0, perfN = 0, perfSum = 0, prChangedAt = 0, prNext = 0, perfHoldUntil = 0, prChanges = 0;
function perfHold(ms) { perfT = perfN = perfSum = 0; perfHoldUntil = performance.now() + ms; }
function governor(rawDt, now) {
    if (now < perfHoldUntil)
        return;
    perfT += rawDt;
    perfN++;
    perfSum += rawDt;
    if (perfT < 2)
        return;
    const avg = perfSum / perfN;
    perfT = perfN = perfSum = 0;
    if (avg > 1 / 48 && prCur > .8) {
        prNext = Math.max(.8, +(prCur - .15).toFixed(2));
        prChangedAt = now;
    }
    else if (avg < 1 / 58 && prCur < PR_MAX && now - prChangedAt > 6000) {
        prNext = Math.min(PR_MAX, +(prCur + .1).toFixed(2));
        prChangedAt = now;
    }
}
document.addEventListener('visibilitychange', () => { perfHold(1500); last = performance.now(); sfx.pause(document.hidden || paused); });
function frame(now) {
    requestAnimationFrame(frame);
    if (online.active && !online.isHost && online.lastPacket && Date.now() - online.lastPacket > 11000) {
        online.lost('Player disconnected. Match ended.', 'disconnect');
    }
    const raw = (now - last) / 1000, dt = Math.min(.1, raw);
    last = now;
    SKIN_TIME.value = now / 1000;
    if (storeUI.open && !online.active)
        return;
    if (!paused || online.active)
        update(dt);
    if (prNext) {
        prCur = prNext;
        prNext = 0;
        prChanges++;
        renderer.setPixelRatio(prCur);
    }
    if (online.active && online.isHost) {
        onlineSnapshotTimer += dt;
        if (onlineSnapshotTimer >= 1 / 30) {
            online.sendSnapshot(onlineSnapshot());
            onlineSnapshotTimer = 0;
        }
    }
    if (splashUp()) {
        const t = performance.now();
        if (t >= 3300 && t <= 5700) {
            if (!gameWarm)
                warmGame();
            else
                storeUI.prepare();
        }
        return;
    }
    if (!gameWarm)
        warmGame();
    render(paused && !online.active ? 0 : dt);
    governor(Math.min(raw, .25), now);
}
const splashEl = document.getElementById('playvoraSplash');
let gameWarm = false;
function splashUp() { return !!splashEl && splashEl.isConnected; }
function warmGame() {
    gameWarm = true;
    buildEnv();
    renderer.compile(scene, camera);
    render(0.016);
}
setupMatch(true);
if (!splashUp())
    warmGame();
$('loading').remove();
perfHold(4000);
requestAnimationFrame(frame);
window.__tcReady = true;
dispatchEvent(new Event('tc-ready'));
window.NITRO = {
    DIFF, goalLog, ball, settings, obbContact, carCar, arenaD, scene, camera, renderer, THREE,
    get state() { return state; }, get cars() { return cars; }, get score() { return scoreArr; },
    set freezeBots(v) { freezeBots = v; },
    set debugCam(v) { debugCam = v ? { pos: new V3(...v.pos), look: new V3(...v.look), fov: v.fov } : null; },
    get sfx() { return sfx; }, get camSnap() { return camSnap; }, get perf() { return { prCur, prNext, prChanges, holdLeft: Math.max(0, perfHoldUntil - performance.now()) }; },
    forcePR(v) { prNext = v; },
    get dbg() { return { timeLeft, overtime, paused, attract, exciteB, exciteR, tension, prCur, crowdCount, active: ball.active, replaying: !!replay, recCount: rec ? rec.count : 0 }; },
    info: () => ({ calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, crowd: crowdCount }),
    step: (s) => { for (let i = 0; i < s * 60; i++)
        update(1 / 60); },
};


  } catch (err) {
    console.error('TurboClash startup failed:', err);
    const box = document.getElementById('loading');
    if (box) {
      box.style.fontStyle = 'normal';
      box.style.letterSpacing = 'normal';
      box.style.padding = '24px';
      box.style.textAlign = 'center';
      box.innerHTML = '<div style="font:800 23px system-ui,Arial;color:#fff">TURBOCLASH</div><div style="font:600 19px system-ui,Arial;color:#ff8b8b">Game could not start</div><div style="font:400 14px system-ui,Arial;color:#d8e4ff;max-width:520px;line-height:1.5">Check your internet connection and make sure your browser supports WebGL. If you downloaded a ZIP, extract it first. You can also open the game from your GitHub Pages site.</div>';
    }
  }
})();
