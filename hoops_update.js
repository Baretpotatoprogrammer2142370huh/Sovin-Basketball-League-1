/* ============================================================
   HOOPS ARENA — AKTUALIZACJA
   Ładuj ten plik ZARAZ PRZED </body> w hoops HTML, po głównym <script>:
   <script src="hoops_update.js"></script>
   Plik nadpisuje funkcje: drawBackdrop, drawFloor, drawCourtLines,
   renderMaps, giveBall, endMatch oraz dodaje nowe elementy.
   ============================================================ */

// ============================ BOISKA ============================
const NEW_MAPS = [
  { id:'hoops', name:'Hoops Arena', sub:'Parkiet neonowy · arena domowa', kind:'arena', crowd:'auto',
    top:'#05060b', bot:'#1d0f14', banner:['#e0231b','#ffd34e'],
    fA:'#b77a43', fB:'#e3a866', paint:'rgba(224,35,27,.32)', line:'#ffffff', glow:'#ff3b30',
    logo:'HA', logoCol:'#e0231b', wood:true },
  { id:'lakers', name:'Lakers', sub:'Fioletowo-złote Staples Center', kind:'arena', crowd:'auto',
    top:'#06040d', bot:'#1f0f33', banner:['#552583','#fdb927'],
    fA:'#a86f3a', fB:'#d89a57', paint:'rgba(85,37,131,.55)', line:'#fdb927', glow:'#fdb927',
    logo:'LAL', logoCol:'#552583', wood:true },
  { id:'celtics', name:'Celtics', sub:'Zielony parkiet TD Garden', kind:'arena', crowd:'auto',
    top:'#020a06', bot:'#0f2a1a', banner:['#007a33','#ffffff'],
    fA:'#b98352', fB:'#e0a86c', paint:'rgba(0,122,51,.55)', line:'#ffffff', glow:'#2ee07a',
    logo:'BOS', logoCol:'#007a33', wood:true },
  { id:'raptors', name:'Raptors', sub:'Czerwień i czerń, Scotiabank', kind:'arena', crowd:'auto',
    top:'#0a0203', bot:'#2a0a0c', banner:['#ce1141','#a1a1a4'],
    fA:'#c28a55', fB:'#e5b070', paint:'rgba(206,17,65,.6)', line:'#ffffff', glow:'#ff4d6a',
    logo:'TOR', logoCol:'#ce1141', wood:true },
  { id:'legends', name:'Stadion Legend', sub:'Złota hala · zawsze pełna widownia', kind:'arena', crowd:'full',
    top:'#050403', bot:'#2a1f08', banner:['#f5c451','#ffffff'],
    fA:'#5e4426', fB:'#8a6a3c', paint:'rgba(245,196,81,.35)', line:'#f5c451', glow:'#ffd84d',
    logo:'★', logoCol:'#f5c451', wood:true, spotlights:true },
  { id:'park', name:'Park', sub:'Asfalt, drzewa, ławki', kind:'park', crowd:'zero',
    top:'#8fd0f2', bot:'#dff3ff', fA:'#3d4246', fB:'#585e63', paint:'rgba(180,80,40,.25)',
    line:'#f2f2f2', logo:'', logoCol:'#f2f2f2', wood:false },
  { id:'orlik', name:'Orlik', sub:'Gumowa nawierzchnia, siatka', kind:'orlik', crowd:'zero',
    top:'#1b2a44', bot:'#4d6b9a', fA:'#1d4f9c', fB:'#2f6fc4', paint:'rgba(255,255,255,.12)',
    line:'#ffffff', logo:'', logoCol:'#ffffff', wood:false },
];

// ============================ WIDOWNIA ============================
const CROWD2_LVL = { zero:0, low:1, mid:2, full:3 };
const CROWD2_FILL = [0, .3, .6, 1];
const CROWD2_NAME = { auto:'Auto (waga meczu)', zero:'Zerowa', low:'Niska', mid:'Średnia', full:'Pełna' };
let CROWD2_SET = 'auto';

const CROWD2 = (() => {
  let s = 11;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647), out = [];
  for (let i = 0; i < 620; i++) out.push({
    u: r(), v: .25 + r() * .75, r: .8 + r() * 1.9,
    c: `hsl(${Math.floor(r() * 360)},${Math.floor(35 + r() * 30)}%,${Math.floor(35 + r() * 25)}%)`,
    lamp: r() < .025, ph: r() * 6, k: r()
  });
  return out;
})();

const SPECK2 = Array.from({ length: 140 }, (_, i) =>
  [Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, Math.abs(Math.sin(i * 78.233) * 12345.678) % 1]);

function matchWeight2() {
  if (!G) return 1;
  switch (G.mode) {
    case '1v1': case '2v2': case 'train': return 1;
    case '3v3': case 'nba': return 2;
    case 'tour': return (TOUR && TOUR.cur === 2) ? 3 : 2;
    case 'career': return (career && career.stage === 'goat') ? 3 : 2;
    case 'goat': return 3;
  }
  return 1;
}
function crowdLevel2() {
  if (CROWD2_SET !== 'auto') return CROWD2_LVL[CROWD2_SET];
  if (MAP.crowd === 'full') return 3;
  if (MAP.crowd === 'zero') return 0;
  return matchWeight2();
}

// ============================ RYSOWANIE BOISKA ============================
function drawBackdrop() {
  const w = CW;
  const g = ctx.createLinearGradient(0, 0, 0, HY);
  g.addColorStop(0, MAP.top); g.addColorStop(1, MAP.bot);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, HY + 2);

  if (MAP.kind === 'park') {
    ctx.fillStyle = 'rgba(255,236,160,.85)';
    ctx.beginPath(); ctx.arc(w * .82, HY * .28, HY * .12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2f5d2a';
    for (let i = 0; i < 16; i++) { const x = (i / 15) * w, rr = HY * (.16 + (i % 3) * .05); ctx.beginPath(); ctx.arc(x, HY - rr * .4, rr, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#3d7a36';
    for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.arc((i / 15) * w + 20, HY - 6, HY * .2, Math.PI, 0); ctx.fill(); }
    ctx.fillStyle = '#6b4a2b'; ctx.fillRect(w * .12, HY - 6, w * .08, 6);
  } else if (MAP.kind === 'orlik') {
    ctx.strokeStyle = 'rgba(220,230,240,.4)'; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 22) { ctx.beginPath(); ctx.moveTo(x, HY * .25); ctx.lineTo(x, HY); ctx.stroke(); }
    for (let y = HY * .25; y < HY; y += 18) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    for (const x of [.08, .92]) {
      ctx.fillStyle = '#222'; ctx.fillRect(w * x, HY * .1, 5, HY * .6);
      ctx.fillStyle = 'rgba(255,250,220,.95)'; ctx.fillRect(w * x - 12, HY * .07, 28, 9);
    }
  } else {
    const lvl = crowdLevel2(), fill = CROWD2_FILL[lvl], [b1, b2] = MAP.banner;
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 ? b1 + 'bb' : b2 + '66';
      ctx.fillRect(w * (.07 + i * .16), HY * .2, w * .05, HY * .45);
    }
    for (const c of CROWD2) {
      const x = c.u * w, y = c.v * HY;
      if (c.k < fill) {
        const bob = Math.sin(TT * 2.2 + c.ph) * 1.2;
        ctx.fillStyle = c.c; ctx.beginPath(); ctx.arc(x, y + bob, c.r, 0, Math.PI * 2); ctx.fill();
        if (c.lamp) {
          const fl = .6 + .4 * Math.sin(TT * 5 + c.ph);
          const lg = ctx.createRadialGradient(x, y * .4, 0, x, y * .4, 46);
          lg.addColorStop(0, `rgba(255,240,200,${.7 * fl})`); lg.addColorStop(1, 'rgba(255,240,200,0)');
          ctx.fillStyle = lg; ctx.fillRect(x - 46, y * .4 - 46, 92, 92);
        }
      } else {
        ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(x - c.r, y, c.r * 2, 1.4);
      }
    }
    if (MAP.spotlights) for (const sx of [.2, .8]) {
      const bg = ctx.createLinearGradient(w * sx, 0, w * .5, HY);
      bg.addColorStop(0, 'rgba(255,241,184,.35)'); bg.addColorStop(1, 'rgba(255,241,184,0)');
      ctx.fillStyle = bg; ctx.beginPath();
      ctx.moveTo(w * sx - 30, 0); ctx.lineTo(w * sx + 30, 0); ctx.lineTo(w * .5 + 140, HY); ctx.lineTo(w * .5 - 140, HY);
      ctx.closePath(); ctx.fill();
    }
  }
  ctx.fillStyle = MAP.kind === 'park' ? '#4a4d50' : '#120e0a';
  ctx.fillRect(0, HY, w, CHh - HY);
}

function paintKey2(z0) {
  const zEnd = z0 === 0 ? 5.8 : LEN - 5.8;
  ctx.fillStyle = MAP.paint;
  path3(flat([[-2.45, z0], [2.45, z0], [2.45, zEnd], [-2.45, zEnd]]), true); ctx.fill();
}

function drawFloor() {
  const g = ctx.createLinearGradient(0, HY, 0, CHh);
  g.addColorStop(0, MAP.fA); g.addColorStop(1, MAP.fB);
  ctx.fillStyle = g;
  path3(flat([[-COURT_W, 0], [COURT_W, 0], [COURT_W, LEN], [-COURT_W, LEN]]), true); ctx.fill();

  if (MAP.wood) {
    for (let x = -COURT_W, i = 0; x < COURT_W; x += .9, i++) {
      ctx.fillStyle = i % 2 ? 'rgba(255,230,190,.06)' : 'rgba(0,0,0,.08)';
      path3(flat([[x, 0], [x + .9, 0], [x + .9, LEN], [x, LEN]]), true); ctx.fill();
    }
  } else if (MAP.kind === 'park') {
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    for (const [u, v] of SPECK2) { const q = proj((u * 2 - 1) * COURT_W, 0, v * LEN); if (q) ctx.fillRect(q.x, q.y, 2.5, 2.5); }
  } else if (MAP.kind === 'orlik') {
    ctx.fillStyle = 'rgba(255,255,255,.05)';
    for (let z = 0; z < LEN; z += 2) { path3(flat([[-COURT_W, z], [COURT_W, z], [COURT_W, z + 1], [-COURT_W, z + 1]]), true); ctx.fill(); }
  }

  ctx.fillStyle = 'rgba(70,140,255,.05)';
  path3(flat([[-COURT_W, 0], [COURT_W, 0], [COURT_W, MID], [-COURT_W, MID]]), true); ctx.fill();
  ctx.fillStyle = 'rgba(224,35,27,.05)';
  path3(flat([[-COURT_W, MID], [COURT_W, MID], [COURT_W, LEN], [-COURT_W, LEN]]), true); ctx.fill();

  if (MAP.paint) { paintKey2(0); paintKey2(LEN); }
}

function drawCourtLines() {
  ctx.lineWidth = 2; ctx.strokeStyle = MAP.line;
  if (MAP.glow) { ctx.shadowColor = MAP.glow; ctx.shadowBlur = 10; }
  const line = (pts, close) => { path3(flat(pts), close); ctx.stroke(); };
  line([[-COURT_W, 0], [COURT_W, 0], [COURT_W, LEN], [-COURT_W, LEN]], true);
  line([[-COURT_W, MID], [COURT_W, MID]]);
  line(circ(0, MID, 1.8), true);
  line([[-2.45, 0], [-2.45, 5.8], [2.45, 5.8], [2.45, 0]]);
  line([[-2.45, LEN], [-2.45, LEN - 5.8], [2.45, LEN - 5.8], [2.45, LEN]]);
  line(threeLine(HOOP_NEAR, 1));
  line(threeLine(HOOP_FAR, -1));
  ctx.shadowBlur = 0;

  if (MAP.logo) {
    ctx.fillStyle = MAP.logoCol; ctx.globalAlpha = .55;
    path3(flat(circ(0, MID, 1.5, 36)), true); ctx.fill();
    ctx.globalAlpha = 1;
    const q = proj(0, 0, MID);
    if (q) {
      ctx.fillStyle = '#fff'; ctx.font = `700 ${q.s * .9}px Oswald,sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(MAP.logo, q.x, q.y);
    }
  }
}

// ============================ MENU MAP ============================
function drawMapPreview2(c, m) {
  const g = c.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, m.top); g.addColorStop(1, m.bot);
  c.fillStyle = g; c.fillRect(0, 0, 420, 180);
  const x0 = 40, y0 = 14, x1 = 380, y1 = 166, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  c.fillStyle = m.fA; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.fillStyle = m.fB; c.globalAlpha = .45; c.fillRect(x0, my, x1 - x0, (y1 - y0) / 2); c.globalAlpha = 1;
  if (m.paint) { c.fillStyle = m.paint; c.fillRect(mx - 36, y0, 72, 46); c.fillRect(mx - 36, y1 - 46, 72, 46); }
  c.strokeStyle = m.line; c.lineWidth = 2.5; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
  c.beginPath(); c.moveTo(x0, my); c.lineTo(x1, my); c.stroke();
  c.beginPath(); c.arc(mx, my, 24, 0, Math.PI * 2); c.stroke();
  if (m.logo) {
    c.fillStyle = m.logoCol; c.beginPath(); c.arc(mx, my, 20, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fff'; c.font = '700 14px Oswald,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(m.logo, mx, my + 1);
  }
}

function renderMaps() {
  const box = document.getElementById('mapGrid'); box.innerHTML = '';
  for (const m of NEW_MAPS) {
    const d = document.createElement('div');
    d.className = 'mcard' + (MAP.id === m.id ? ' on' : '');
    const cvs = document.createElement('canvas'); cvs.width = 420; cvs.height = 180;
    drawMapPreview2(cvs.getContext('2d'), m);
    d.appendChild(cvs);
    const t = document.createElement('div'); t.className = 't';
    t.innerHTML = `<h3>${m.name}</h3><p>${m.sub}</p>`;
    d.appendChild(t);
    d.onclick = () => { MAP = m; renderMaps(); };
    box.appendChild(d);
  }
  const cs = document.getElementById('crowdSel');
  if (cs) cs.value = CROWD2_SET;
}

// ============================ PRZEŁĄCZANIE STEROWANIA ============================
const SW_MODES = ['3v3', 'tour', 'career', 'goat'];

function switchHuman2(p) {
  if (!p || G.H === p) return;
  if (G.H) G.H.chg = false;
  G.ents.filter(x => x.team === 0).forEach(x => { x.human = (x === p); });
  G.H = p;
  G.params.humanIdx = p.slot;
  G.charging = false; G.charge = 0;
}
function nearestMine2(e) {
  return nearest(G.ents.filter(x => x.team === 0 && !x.down), e);
}

function giveBall(e, label) {
  const b = G.ball;
  G.poss = e.team;
  G.ents.forEach(x => { x.holding = false; });
  // Piłka u mnie: sterujesz nosicielem. Piłka u rywala: sterujesz najbliższym swoim zawodnikiem.
  if (SW_MODES.includes(G.mode)) switchHuman2(e.team === 0 ? e : nearestMine2(e));
  b.carrier = e; b.mode = 'hold'; b.flight = null;
  e.holding = true;
  G.charging = false; G.pause = Math.max(G.pause, .2);
  if (label && !SW_MODES.includes(G.mode)) showMsg(e.human ? label : 'AI: ' + label, 600);
}

// ============================ CUTSCENA ============================
function playCutscene2(winner, ents, done) {
  const won = winner === 0;
  const cut = document.getElementById('cut'), cv2 = document.getElementById('cutCv');
  const cx = cv2.getContext('2d');
  cv2.width = innerWidth; cv2.height = innerHeight;
  const W = cv2.width, Hh = cv2.height, ground = Hh * .95;

  const win = ents.filter(e => e.team === winner).slice(0, 3);
  const lose = ents.filter(e => e.team !== winner).slice(0, 3);
  const spread = (n, a, b) => Array.from({ length: n }, (_, i) => n === 1 ? (a + b) / 2 : a + (b - a) * i / (n - 1));

  // przegrani w tle (mniejsi, przygaszeni), zwycięzcy na pierwszym planie (duzi)
  const sprites = [];
  spread(lose.length, .14, .86).forEach((x, i) =>
    sprites.push({ e: lose[i], pose: 'sad', x: W * x, gy: ground - Hh * .04, px: Hh * .44, alpha: .5, ph: i }));
  spread(win.length, .3, .7).forEach((x, i) =>
    sprites.push({ e: win[i], pose: 'cheer', x: W * x, gy: ground, px: Hh * .8, alpha: 1, ph: i * .9 }));

  const drawSprite = (s, t) => {
    const e = s.e, cheer = s.pose === 'cheer';
    const bob = cheer ? -Math.abs(Math.sin(t * 7 + s.ph)) * Hh * .02 : 0;
    // cheer: blockT>0 podnosi obie ręce; sad: stance daje zgarbioną, opuszczoną sylwetkę
    const sp = Object.assign({}, e, {
      preview: true, facing: 1, down: false, grounded: true, y: 0, vx: 0, vz: 0, walk: 0,
      stance: !cheer, blockT: cheer ? 2 : 0, holding: false, holdMode: false, chg: false, chgV: 0,
      shootT: 0, reachT: 0, pendingDunk: 0, jumpWin: 0, spinT: 0, landT: 0, dribT: 0, stunT: 0,
      tic: 0, human: false
    });
    const fp = { x: s.x, y: s.gy + bob, s: s.px / (e.p.body.height / 100) };
    const prev = ctx; ctx = cx; cx.save(); cx.globalAlpha = s.alpha;
    drawBody(sp, fp);
    cx.restore(); ctx = prev;
  };

  const COL = ['#ff68b6', '#ffd84d', '#ffffff', '#ff3b1f', '#5ec8ff'];
  const conf = won ? Array.from({ length: 180 }, () => ({
    x: Math.random() * W, y: -Math.random() * Hh, vx: (Math.random() - .5) * 120,
    vy: 140 + Math.random() * 220, c: COL[(Math.random() * COL.length) | 0], s: 5 + Math.random() * 7, ph: Math.random() * 6
  })) : [];

  const DUR = 4.2, dt = 1 / 60;
  let t0 = null, raf = 0, finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    cancelAnimationFrame(raf);
    cut.style.display = 'none'; cut.onclick = null;
    done();
  };
  cut.onclick = finish;
  cut.style.display = 'block';

  const frame = now => {
    if (t0 === null) t0 = now;
    const t = (now - t0) / 1000;
    const bg = cx.createRadialGradient(W / 2, Hh * .45, Hh * .05, W / 2, Hh * .45, Hh * .9);
    bg.addColorStop(0, won ? '#4a2d6b' : '#1c1f2e'); bg.addColorStop(1, '#05050a');
    cx.fillStyle = bg; cx.fillRect(0, 0, W, Hh);

    if (won) {
      cx.save(); cx.globalAlpha = .12; cx.fillStyle = '#ffd84d';
      for (let i = 0; i < 12; i++) {
        const a = t * .4 + i * Math.PI / 6;
        cx.beginPath(); cx.moveTo(W / 2, Hh * .45);
        cx.lineTo(W / 2 + Math.cos(a) * W, Hh * .45 + Math.sin(a) * W);
        cx.lineTo(W / 2 + Math.cos(a + .12) * W, Hh * .45 + Math.sin(a + .12) * W);
        cx.closePath(); cx.fill();
      }
      cx.restore();
    }

    sprites.filter(s => s.pose === 'sad').forEach(s => drawSprite(s, t));
    sprites.filter(s => s.pose === 'cheer').forEach(s => drawSprite(s, t));

    if (won) for (const c of conf) {
      c.y += c.vy * dt; c.x += (c.vx + Math.sin(t * 3 + c.ph) * 40) * dt;
      if (c.y > Hh) c.y = -10;
      cx.fillStyle = c.c; cx.fillRect(c.x, c.y, c.s, c.s * .5);
    }

    cx.globalAlpha = Math.min(1, t / .5);
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.shadowColor = '#000'; cx.shadowBlur = 14;
    cx.font = `700 ${Hh * .1}px Oswald,sans-serif`;
    cx.fillStyle = won ? '#ffd84d' : '#8fa0c8';
    cx.fillText(won ? 'WYGRANA!' : 'PRZEGRANA', W / 2, Hh * .12);
    cx.font = `500 ${Hh * .028}px Inter,sans-serif`;
    cx.fillStyle = '#f7f5ff';
    cx.fillText(won ? 'Mistrzowie! Drużyna świętuje.' : 'Tym razem nie wyszło…', W / 2, Hh * .12 + Hh * .09);
    cx.shadowBlur = 0; cx.globalAlpha = 1;

    if (t >= DUR) return finish();
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
}

function endMatch(winner) {
  G.over = true;
  showMsg(winner === 0 ? 'WYGRANA!' : 'PRZEGRANA', 1800);
  if (winner === 0) for (let i = 0; i < 3; i++)
    setTimeout(() => burst(CW / 2, CHh * .4, 60, ['#ff3b1f', '#fff', '#ffd166'], 420), i * 250);
  const ents = G.ents.slice();
  setTimeout(() => { if (G) playCutscene2(winner, ents, () => finishMatch(winner)); }, 2000);
}

// ============================ START ============================
(function injectUI2() {
  MAP = NEW_MAPS[0];

  const grid = document.getElementById('mapGrid');
  if (grid && !document.getElementById('crowdSel')) {
    const bar = document.createElement('div');
    bar.className = 'btns';
    bar.style.cssText = 'margin:0 0 22px;align-items:center';
    bar.innerHTML = '<label style="font-size:13px;color:var(--dim);display:flex;gap:10px;align-items:center">Widownia ' +
      '<select class="dark" id="crowdSel"></select></label>' +
      '<span style="font-size:12px;color:var(--dim);max-width:460px;line-height:1.5">Auto: 1v1, 2v2, trening = niska · ' +
      '3v3, NBA, turniej = średnia · finał turnieju i GOAT = pełna</span>';
    grid.parentNode.insertBefore(bar, grid);
  }
  const cs = document.getElementById('crowdSel');
  if (cs && !cs.options.length) {
    Object.keys(CROWD2_NAME).forEach(k => cs.add(new Option(CROWD2_NAME[k], k)));
    cs.value = CROWD2_SET;
    cs.onchange = () => { CROWD2_SET = cs.value; };
  }

  if (!document.getElementById('cut')) {
    const cut = document.createElement('div');
    cut.id = 'cut';
    cut.style.cssText = 'position:fixed;inset:0;z-index:40;display:none;background:#000;cursor:pointer';
    cut.innerHTML = '<canvas id="cutCv" style="width:100%;height:100%;display:block"></canvas>';
    document.body.appendChild(cut);
  }
})();
