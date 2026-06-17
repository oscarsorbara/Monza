/* ============================================================================
 * draw-sport.mjs — Motor de dibujo del tablero (tema "Sport") foto-real.
 *
 * Portátil: corre igual en el navegador (canvas DOM) y en Node (@napi-rs/canvas).
 * No usa DOM, ni emojis, ni APIs específicas del browser. Todo lo externo entra
 * por `env`:  { makeCanvas(w,h), cache }.
 *
 * Pipeline foto-real (lo que hace que parezca FILMADO, no una animación):
 *   contenido de pantalla (vectorial nítido)
 *     → bloom (halo de luz en lo brillante)
 *     → glare/reflejos de vidrio
 *     → banda de refresco de LCD (rolling shutter al filmar una pantalla)
 *     → viñeteo
 *     → grano de cámara + aberración cromática
 *     → micro-temblor de cámara (handheld)
 *
 * El fondo SIEMPRE queda transparente (alfa real). Solo la carcasa + pantalla
 * son opacas; los efectos de cámara se aplican únicamente sobre el cluster.
 * ==========================================================================*/

export const BW = 1100, BH = 460;            // lienzo base (aspect ~2.4:1)
export const SX = 34, SY = 34, SW = BW - 68, SH = BH - 66;   // pantalla LCD
export const LOOP = 6.8;                      // duración del loop (s) — todo cierra sin salto

// osciladores periódicos respecto del loop → el WebM loopea perfecto
const ph = t => (t % LOOP) / LOOP;            // 0..1 dentro del loop
const osc = (t, k, phase = 0) => Math.sin(k * 2 * Math.PI * ph(t) + phase);

// ---- primitivas -----------------------------------------------------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function poly(ctx, pts) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.closePath();
}

// ---- íconos CarPlay (vectoriales, glossy, sin emoji) ----------------------
function squircle(ctx, x, y, s, r) { rr(ctx, x, y, s, s, r); }
function iconBG(ctx, x, y, s, c1, c2) {
  const r = s * 0.225;
  const g = ctx.createLinearGradient(x, y, x, y + s);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; squircle(ctx, x, y, s, r); ctx.fill();
  // gloss superior
  const gl = ctx.createLinearGradient(x, y, x, y + s * 0.5);
  gl.addColorStop(0, 'rgba(255,255,255,0.16)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gl; squircle(ctx, x, y, s, r); ctx.fill();
  // borde sutil
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 1; squircle(ctx, x, y, s, r); ctx.stroke();
}
const glyph = {
  phone: (ctx, x, y, s) => { iconBG(ctx, x, y, s, '#5fe07a', '#16b73c');
    ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.rotate(-0.18); ctx.fillStyle = '#fff';
    const u = s * 0.052; ctx.beginPath();
    ctx.moveTo(-3.2*u,-4.2*u); ctx.quadraticCurveTo(-4.4*u,-4.4*u,-4.4*u,-3.1*u);
    ctx.quadraticCurveTo(-4.4*u,3.4*u,1.6*u,4.4*u); ctx.quadraticCurveTo(4.4*u,4.4*u,4.4*u,2.6*u);
    ctx.quadraticCurveTo(4.4*u,1.5*u,3.0*u,1.2*u); ctx.quadraticCurveTo(1.7*u,1.0*u,1.4*u,1.9*u);
    ctx.quadraticCurveTo(0.2*u,1.2*u,-1.2*u,-0.4*u); ctx.quadraticCurveTo(-2.0*u,-1.9*u,-1.4*u,-2.3*u);
    ctx.quadraticCurveTo(-0.5*u,-2.9*u,-1.0*u,-4.0*u); ctx.closePath(); ctx.fill(); ctx.restore(); },
  messages: (ctx, x, y, s) => { iconBG(ctx, x, y, s, '#56e06a', '#2bbf4e');
    ctx.fillStyle = '#fff'; const p = s * 0.22; rr(ctx, x + p, y + p, s - 2*p, (s - 2*p) * 0.82, (s - 2*p) * 0.32); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + s*0.34, y + s*0.66); ctx.lineTo(x + s*0.30, y + s*0.80); ctx.lineTo(x + s*0.48, y + s*0.66); ctx.closePath(); ctx.fill(); },
  maps: (ctx, x, y, s) => { iconBG(ctx, x, y, s, '#8fd28a', '#57b06a');
    ctx.strokeStyle = '#f4f6f2'; ctx.lineWidth = s * 0.075; ctx.lineJoin = 'round'; ctx.beginPath();
    ctx.moveTo(x + s*0.22, y + s*0.70); ctx.lineTo(x + s*0.5, y + s*0.34); ctx.lineTo(x + s*0.78, y + s*0.70); ctx.stroke();
    ctx.fillStyle = '#ff4338'; ctx.beginPath(); ctx.arc(x + s*0.5, y + s*0.40, s*0.085, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + s*0.5, y + s*0.40, s*0.032, 0, 7); ctx.fill(); },
  music: (ctx, x, y, s) => { iconBG(ctx, x, y, s, '#fc6a80', '#fa2d48');
    ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = s * 0.05;
    const ax = x + s*0.62, ay = y + s*0.30;
    ctx.beginPath(); ctx.moveTo(x + s*0.40, y + s*0.66); ctx.lineTo(x + s*0.40, y + s*0.36);
    ctx.lineTo(ax, ay); ctx.lineTo(ax, y + s*0.60); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x + s*0.36, y + s*0.66, s*0.075, s*0.058, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ax - s*0.04, y + s*0.60, s*0.075, s*0.058, 0, 0, 7); ctx.fill(); },
  spotify: (ctx, x, y, s) => { iconBG(ctx, x, y, s, '#33d067', '#16a64a');
    ctx.strokeStyle = '#073b1c'; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { ctx.lineWidth = s * (0.075 - i*0.012); ctx.beginPath();
      ctx.arc(x + s/2, y + s*0.74, s * (0.18 + i*0.13), -Math.PI*0.86, -Math.PI*0.14); ctx.stroke(); } },
  settings: (ctx, x, y, s) => { iconBG(ctx, x, y, s, '#80868d', '#54595f');
    ctx.save(); ctx.translate(x + s/2, y + s/2); ctx.fillStyle = '#d6d9dd';
    const teeth = 8, ro = s*0.30, ri = s*0.20;
    ctx.beginPath(); for (let i = 0; i < teeth*2; i++) { const r = i%2 ? ri : ro; const a = i*Math.PI/teeth;
      const px = Math.cos(a)*r, py = Math.sin(a)*r; i ? ctx.lineTo(px,py) : ctx.moveTo(px,py); } ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6d7278'; ctx.beginPath(); ctx.arc(0, 0, s*0.10, 0, 7); ctx.fill(); ctx.restore(); },
  clock: (ctx, x, y, s) => { iconBG(ctx, x, y, s, '#1c1c1e', '#000');
    ctx.strokeStyle = '#fff'; ctx.lineWidth = s*0.035; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x + s/2, y + s/2, s*0.33, 0, 7); ctx.stroke();
    ctx.fillStyle = '#ff9f0a'; ctx.beginPath(); ctx.moveTo(x+s/2,y+s/2); ctx.lineTo(x+s/2,y+s*0.26); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x+s/2,y+s/2); ctx.lineTo(x+s*0.66,y+s*0.56); ctx.stroke(); },
  podcasts: (ctx, x, y, s) => { iconBG(ctx, x, y, s, '#c45cf2', '#9a30d6');
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + s/2, y + s*0.40, s*0.12, 0, 7); ctx.fill();
    for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,255,255,' + (0.9 - i*0.22) + ')'; ctx.lineWidth = s*0.05;
      ctx.beginPath(); ctx.arc(x + s/2, y + s*0.40, s*(0.20 + i*0.10), Math.PI*0.18, Math.PI*0.82); ctx.stroke(); }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x+s*0.42,y+s*0.58); ctx.lineTo(x+s*0.58,y+s*0.58);
    ctx.lineTo(x+s*0.54,y+s*0.80); ctx.lineTo(x+s*0.46,y+s*0.80); ctx.closePath(); ctx.fill(); },
};
const PAGES = [
  ['phone', 'messages', 'maps', 'music', 'spotify', 'settings', 'clock', 'podcasts'],
  ['music', 'spotify', 'podcasts', 'maps', 'phone', 'messages', 'clock', 'settings'],
];

// ---- gauge hexagonal vertical estilo BMW M Sport --------------------------
function drawHexGauge(ctx, o) {
  const { side, color, glow, value, min, max, label, ticks, bigEvery, bigPhase = 0 } = o;
  const bw = 270, bh = 318;
  const bx = side < 0 ? SX + 18 : SX + SW - 18 - bw;
  const by = SY + 24;
  const fx = side < 0 ? f => bx + f * bw : f => bx + (1 - f) * bw;
  const P = [
    [fx(0.95), by + bh*0.02], [fx(0.30), by + bh*0.09], [fx(0.00), by + bh*0.43],
    [fx(0.04), by + bh*0.62], [fx(0.42), by + bh*0.97], [fx(0.98), by + bh*0.90],
  ];
  ctx.save();
  ctx.shadowColor = glow; ctx.shadowBlur = 16;
  poly(ctx, P); ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.stroke();
  ctx.restore();
  const c = [fx(0.5), by + bh*0.5];
  poly(ctx, P.map(p => [lerp(p[0], c[0], 0.10), lerp(p[1], c[1], 0.10)]));
  ctx.strokeStyle = color + '55'; ctx.lineWidth = 1; ctx.stroke();

  const colX = fx(0.80), tickX0 = fx(0.94), tickX1 = fx(0.74);
  const yTop = by + bh*0.07, yBot = by + bh*0.86, n = ticks;
  ctx.textAlign = side < 0 ? 'right' : 'left'; ctx.textBaseline = 'middle';
  for (let i = 0; i <= n; i++) {
    const f = i / n, y = lerp(yBot, yTop, f), val = lerp(min, max, f);
    const big = Math.round(val) % bigEvery === bigPhase;
    ctx.strokeStyle = color + (big ? 'cc' : '55'); ctx.lineWidth = big ? 2 : 1;
    const x1 = lerp(tickX0, tickX1, big ? 0 : 0.45);
    ctx.beginPath(); ctx.moveTo(tickX0, y); ctx.lineTo(x1, y); ctx.stroke();
    if (big) { ctx.fillStyle = color; ctx.font = `600 ${max > 10 ? 15 : 18}px Arial, sans-serif`;
      ctx.fillText(String(Math.round(val)), colX, y); }
  }
  ctx.fillStyle = color; ctx.font = '600 14px Arial, sans-serif';
  ctx.textAlign = side < 0 ? 'left' : 'right'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, fx(0.32), by - 2);

  const vf = clamp((value - min) / (max - min), 0, 1), yVal = lerp(yBot, yTop, vf);
  ctx.save(); poly(ctx, P); ctx.clip();
  const bandX0 = fx(0.10), bandX1 = fx(0.70);
  const lg = ctx.createLinearGradient(0, yBot, 0, yTop);
  lg.addColorStop(0, glow); lg.addColorStop(1, color);
  ctx.globalAlpha = 0.85; ctx.fillStyle = lg;
  ctx.fillRect(Math.min(bandX0, bandX1), yVal, Math.abs(bandX1 - bandX0), yBot - yVal);
  ctx.globalAlpha = 1;
  ctx.shadowColor = '#fff'; ctx.shadowBlur = 10; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(fx(0.06), yVal); ctx.lineTo(fx(0.78), yVal); ctx.stroke();
  ctx.restore();
}

function drawCarPlay(ctx, t) {
  const px = SX + 278, py = SY + 18, pw = SW - 278*2, ph = SH - 30;
  ctx.save(); rr(ctx, px, py, pw, ph, 14); ctx.clip();
  let g = ctx.createLinearGradient(0, py, 0, py + ph);
  g.addColorStop(0, '#0f1218'); g.addColorStop(1, '#06080c');
  ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph);
  ctx.fillStyle = '#cfd6e0'; ctx.font = '600 13px Arial, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('CarPlay', px + 14, py + 16);

  const cols = 4, rows = 2, s = Math.min((pw - 40)/cols - 10, (ph - 70)/rows - 18);
  const gx = px + (pw - (cols*s + (cols - 1)*14))/2, gy = py + 30;
  const period = LOOP / PAGES.length, cyc = t % LOOP, idx = Math.floor(cyc / period), local = (cyc % period)/period;
  const slide = local > 0.82 ? easeIO((local - 0.82)/0.18) : 0;
  const cur = PAGES[idx], nxt = PAGES[(idx + 1) % PAGES.length];
  const page = (apps, dx) => apps.forEach((name, i) => {
    const cc = i % cols, r = Math.floor(i / cols);
    (glyph[name] || glyph.settings)(ctx, gx + cc*(s + 14) + dx, gy + r*(s + 16), s);
  });
  page(cur, -slide*pw); if (slide > 0) page(nxt, (1 - slide)*pw);

  const dotsY = py + ph - 14, n = PAGES.length, dw = 10;
  for (let i = 0; i < n; i++) { ctx.fillStyle = i === idx ? '#e8edf4' : '#5a626e';
    ctx.beginPath(); ctx.arc(px + pw/2 + (i - (n - 1)/2)*dw, dotsY, 2.6, 0, 7); ctx.fill(); }
  ctx.restore();
}

function drawTelltales(ctx, t) {
  const cx = BW/2, cy = SY + 20;
  ctx.save();
  ctx.globalAlpha = 0.85 + 0.15*osc(t, 3);
  ctx.strokeStyle = '#ff2e2e'; ctx.fillStyle = '#ff2e2e'; ctx.lineWidth = 2.4;
  ctx.shadowColor = '#ff2e2e'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(cx, cy, 11, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 11, Math.PI*0.25, Math.PI*0.75); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 11, Math.PI*1.25, Math.PI*1.75); ctx.stroke();
  ctx.font = '700 11px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('!', cx, cy + 0.5);
  ctx.restore();

  ctx.fillStyle = '#39d353'; ctx.beginPath();
  const lx = SX + 250, ly = SY + SH - 40;     // hoja eco (vectorial)
  ctx.moveTo(lx, ly + 7); ctx.quadraticCurveTo(lx - 8, ly - 6, lx + 8, ly - 8);
  ctx.quadraticCurveTo(lx + 6, ly + 6, lx, ly + 7); ctx.fill();
  ctx.strokeStyle = '#1f8f37'; ctx.lineWidth = 1; ctx.beginPath();
  ctx.moveTo(lx + 6, ly - 6); ctx.lineTo(lx - 2, ly + 4); ctx.stroke();

  ctx.fillStyle = '#dfe6ef'; ctx.font = '700 18px Arial, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('0', SX + 232, SY + SH - 66);
  ctx.font = '600 12px Arial, sans-serif'; ctx.fillStyle = '#9aa6b4'; ctx.fillText('km/h', SX + 232, SY + SH - 48);
  ctx.fillStyle = '#dfe6ef'; ctx.font = '700 26px Arial, sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('P', SX + SW - 238, SY + SH - 52);
}

// ---- contenido de pantalla (a un canvas offscreen) ------------------------
function renderScreenContent(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, SH);
  g.addColorStop(0, '#050608'); g.addColorStop(1, '#020303');
  ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH);
  ctx.save(); ctx.translate(-SX, -SY);             // coords absolutas → locales de pantalla
  drawHexGauge(ctx, { side: -1, color: '#1fd3ef', glow: 'rgba(31,211,239,.55)', value: 0, min: 0, max: 330, label: 'km/h', ticks: 11, bigEvery: 60, bigPhase: 30 });
  drawHexGauge(ctx, { side: 1, color: '#ff3b34', glow: 'rgba(255,59,52,.5)', value: 0.8, min: 0, max: 8, label: '1/min x1000', ticks: 8, bigEvery: 1 });
  drawCarPlay(ctx, t);
  drawTelltales(ctx, t);
  ctx.restore();
}

// ---- carcasa física -------------------------------------------------------
function drawBezel(ctx) {
  let g = ctx.createLinearGradient(0, 0, 0, 78);
  g.addColorStop(0, '#202329'); g.addColorStop(1, '#0a0b0e');
  ctx.fillStyle = g; rr(ctx, 8, 2, BW - 16, 74, 28); ctx.fill();
  g = ctx.createLinearGradient(0, 0, 0, BH);
  g.addColorStop(0, '#23262d'); g.addColorStop(.5, '#15171b'); g.addColorStop(1, '#0c0d10');
  ctx.fillStyle = g; rr(ctx, 10, 14, BW - 20, BH - 22, 30); ctx.fill();
  // highlight superior (luz de ambiente sobre el plástico)
  const hl = ctx.createLinearGradient(0, 14, 0, 30);
  hl.addColorStop(0, 'rgba(255,255,255,0.10)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hl; rr(ctx, 10, 14, BW - 20, 20, 30); ctx.fill();
  ctx.strokeStyle = '#2c313a'; ctx.lineWidth = 2; rr(ctx, 10, 14, BW - 20, BH - 22, 30); ctx.stroke();
  // marco interior negro alrededor de la pantalla
  ctx.fillStyle = '#000'; rr(ctx, SX - 6, SY - 6, SW + 12, SH + 12, 22); ctx.fill();
}

// ---- ruido (grano) cacheado ----------------------------------------------
function getNoise(env) {
  if (env.cache && env.cache.noise) return env.cache.noise;
  const N = 160, cv = env.makeCanvas(N, N), c = cv.getContext('2d');
  const img = c.createImageData(N, N), d = img.data;
  let seed = 1337;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let i = 0; i < d.length; i += 4) { const v = 90 + rnd() * 100; d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255; }
  c.putImageData(img, 0, 0);
  if (env.cache) env.cache.noise = cv;
  return cv;
}

// ---- aberración cromática (separa R y B sobre un canvas) ------------------
function chromatic(env, src, w, h, shift) {
  const out = env.makeCanvas(w, h), o = out.getContext('2d');
  const tint = (color, dx) => { const tc = env.makeCanvas(w, h), tx = tc.getContext('2d');
    tx.drawImage(src, 0, 0); tx.globalCompositeOperation = 'multiply'; tx.fillStyle = color; tx.fillRect(0, 0, w, h);
    tx.globalCompositeOperation = 'destination-in'; tx.drawImage(src, 0, 0); return tc; };
  o.drawImage(tint('#00ff00', 0), 0, 0);
  o.globalCompositeOperation = 'lighter';
  o.drawImage(tint('#ff0000', 0), -shift, 0);
  o.drawImage(tint('#0000ff', 0), shift, 0);
  return out;
}

/* ==========================================================================
 * drawSportCluster — punto de entrada. Dibuja un frame completo en `ctx`
 * (lienzo BW×BH ya escalado por el caller). t en segundos. env = {makeCanvas, cache}.
 * opts: { fx: 0..1 intensidad de efectos de cámara, shake: bool }
 * ==========================================================================*/
export function drawSportCluster(ctx, t, env, opts = {}) {
  const FX = opts.fx == null ? 1 : opts.fx;
  ctx.clearRect(0, 0, BW, BH);                       // fondo transparente (alfa)

  // 1) micro-temblor de cámara (handheld) — mueve TODO el cluster
  ctx.save();
  if (FX > 0 && opts.shake !== false) {
    const dx = (osc(t, 2, 0) + osc(t, 1, 1.3) * 0.6) * 1.6 * FX;
    const dy = (osc(t, 1, 0.5 + Math.PI/2) + osc(t, 3, 0) * 0.5) * 1.3 * FX;
    const rot = osc(t, 1, 0.4) * 0.0016 * FX;
    const sc = 1 + osc(t, 1, 0) * 0.0015 * FX;   // respiración de foco
    ctx.translate(BW / 2 + dx, BH / 2 + dy); ctx.rotate(rot); ctx.scale(sc, sc); ctx.translate(-BW / 2, -BH / 2);
  }

  // 2) carcasa
  drawBezel(ctx);

  // 3) contenido de pantalla a offscreen
  const screen = env.makeCanvas(SW, SH);
  renderScreenContent(screen.getContext('2d'), t);

  // 4) aberración cromática del contenido (sutil)
  const content = FX > 0 ? chromatic(env, screen, SW, SH, 0.7 * FX) : screen;

  // 5) componer pantalla + BLOOM dentro del recorte de la pantalla
  ctx.save(); rr(ctx, SX, SY, SW, SH, 16); ctx.clip();
  ctx.drawImage(content, SX, SY);
  if (FX > 0) {
    // bright-pass: solo los píxeles MÁS brillantes generan halo (no lava la UI)
    const bp = env.makeCanvas(SW, SH), b = bp.getContext('2d');
    b.drawImage(content, 0, 0);
    b.globalCompositeOperation = 'multiply'; b.fillStyle = '#3a3a3a'; b.fillRect(0, 0, SW, SH); // baja luces medias
    b.globalCompositeOperation = 'screen'; b.drawImage(content, 0, 0);                            // realza altas
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.filter = `blur(${5 * FX}px)`; ctx.globalAlpha = 0.45 * FX; ctx.drawImage(bp, SX, SY);
    ctx.filter = `blur(${13 * FX}px)`; ctx.globalAlpha = 0.30 * FX; ctx.drawImage(bp, SX, SY);
    ctx.restore();
  }

  // 6) banda de refresco de LCD (rolling shutter) + scanlines sutiles
  if (FX > 0) {
    const bandY = SY + (((ph(t) * 3) % 1) * (SH + 160)) - 80, bh = 150;
    const bg = ctx.createLinearGradient(0, bandY, 0, bandY + bh);
    bg.addColorStop(0, 'rgba(255,255,255,0)'); bg.addColorStop(0.5, `rgba(255,255,255,${0.05 * FX})`); bg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = bg; ctx.fillRect(SX, bandY, SW, bh);
    ctx.globalAlpha = 0.05 * FX; ctx.fillStyle = '#000';
    for (let y = SY; y < SY + SH; y += 3) ctx.fillRect(SX, y, SW, 1);
    ctx.globalAlpha = 1;
  }

  // 7) glare / reflejos de vidrio
  if (FX > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    const gg = ctx.createLinearGradient(SX, SY, SX + SW, SY + SH);
    gg.addColorStop(0, `rgba(120,150,190,${0.10 * FX})`); gg.addColorStop(0.35, 'rgba(120,150,190,0)');
    gg.addColorStop(0.55, `rgba(150,175,210,${0.06 * FX})`); gg.addColorStop(1, 'rgba(120,150,190,0)');
    ctx.fillStyle = gg; ctx.fillRect(SX, SY, SW, SH);
    // streak diagonal brillante
    ctx.translate(SX + SW * 0.62, SY); ctx.rotate(0.5);
    const st = ctx.createLinearGradient(-60, 0, 60, 0);
    st.addColorStop(0, 'rgba(255,255,255,0)'); st.addColorStop(0.5, `rgba(255,255,255,${0.07 * FX})`); st.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = st; ctx.fillRect(-60, -100, 120, SH + 300);
    ctx.restore();
  }

  // 8) viñeteo de la pantalla
  if (FX > 0) {
    const vg = ctx.createRadialGradient(SX + SW/2, SY + SH/2, SH*0.25, SX + SW/2, SY + SH/2, SW*0.62);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${0.45 * FX})`);
    ctx.fillStyle = vg; ctx.fillRect(SX, SY, SW, SH);
  }
  ctx.restore(); // fin recorte pantalla

  ctx.restore(); // fin temblor

  // 9) grano de cámara sobre TODO el cluster (recortado a la silueta del bezel)
  if (FX > 0) {
    const noise = getNoise(env), nstep = Math.floor(ph(t) * 48) % 9;
    ctx.save(); rr(ctx, 10, 14, BW - 20, BH - 22, 30); ctx.clip();
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.09 * FX;
    const ox = (nstep * 53) % 160, oy = (nstep * 97) % 160;
    for (let x = -ox; x < BW; x += 160) for (let y = -oy; y < BH; y += 160) ctx.drawImage(noise, x, y);
    ctx.restore();
  }
}

export default drawSportCluster;
