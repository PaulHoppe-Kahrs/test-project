const canvas = document.querySelector("#gameCanvas"),
  ctx = canvas.getContext("2d"),
  mapCanvas = document.querySelector("#mapCanvas"),
  mapCtx = mapCanvas.getContext("2d"),
  $ = (s) => document.querySelector(s),
  clamp = (n, a, b) => Math.max(a, Math.min(b, n)),
  rnd = (a, b) => Math.random() * (b - a) + a,
  dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const weapons = [
  {
    id: "pulse",
    name: "PULSE RIFLE",
    key: "1",
    damage: 24,
    rate: 0.18,
    speed: 720,
    mag: 24,
    color: "#c5f35a",
    spread: 0.025,
  },
  {
    id: "stinger",
    name: "STINGER SMG",
    key: "2",
    damage: 11,
    rate: 0.075,
    speed: 800,
    mag: 42,
    color: "#5bd2ff",
    spread: 0.1,
  },
  {
    id: "breach",
    name: "BREACHER",
    key: "3",
    damage: 14,
    rate: 0.55,
    speed: 650,
    mag: 8,
    color: "#ffb84d",
    spread: 0.24,
    pellets: 6,
  },
  {
    id: "rail",
    name: "RAIL DMR",
    key: "4",
    damage: 65,
    rate: 0.85,
    speed: 1100,
    mag: 5,
    color: "#e8f0ed",
    spread: 0.006,
  },
];
const state = {
  running: false,
  paused: false,
  over: false,
  time: 360,
  zoneTime: 42,
  zone: { x: 480, y: 300, r: 245, target: 245 },
  phase: 1,
  weapon: 0,
  ammo: 24,
  health: 100,
  shield: 100,
  loot: 0,
  kills: 0,
  shots: [],
  enemyShots: [],
  enemies: [],
  items: [],
  particles: [],
  keys: {},
  mouse: { x: 480, y: 300, down: false },
  last: 0,
  shake: 0,
  muted: false,
  cool: 0,
  dash: 0,
};
const player = { x: 480, y: 300, r: 13, speed: 225 };
function addFeed(text) {
  const el = $("#feed"),
    row = document.createElement("div");
  row.innerHTML = `<i class="feed-dot"></i><span>${text}</span><small>NOW</small>`;
  el.prepend(row);
  while (el.children.length > 3) el.lastElementChild.remove();
}
function formatTime(t) {
  t = Math.max(0, Math.ceil(t));
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}
function setBar(id, value) {
  $(id).style.width = `${clamp(value, 0, 100)}%`;
}
function updateHud() {
  const w = weapons[state.weapon];
  $("#healthValue").textContent = Math.ceil(state.health);
  $("#shieldValue").textContent = Math.ceil(state.shield);
  setBar("#healthBar", state.health);
  setBar("#shieldBar", state.shield);
  $("#ammoValue").textContent = `${state.ammo} / ∞`;
  $("#lootCount").textContent = String(state.loot).padStart(2, "0");
  $("#timer").textContent = formatTime(state.time);
  $("#zoneTimer").textContent = formatTime(state.zoneTime);
  $("#zoneText").textContent =
    `ZONE ${String(state.phase).padStart(2, "0")} // ${Math.round((state.zone.r / state.zone.target) * 100)}%`;
  $("#zonePhase").textContent = String(state.phase).padStart(2, "0");
  document
    .querySelectorAll(".weapon-item")
    .forEach((el, i) => el.classList.toggle("active", i === state.weapon));
}
function buildWeapons() {
  $("#weaponList").innerHTML = weapons
    .map(
      (w, i) =>
        `<button class="weapon-item ${i === 0 ? "active" : ""}" data-i="${i}"><span>${w.key}</span><b>${w.name}</b><small>${w.mag}</small></button>`,
    )
    .join("");
  document
    .querySelectorAll(".weapon-item")
    .forEach((b) => (b.onclick = () => selectWeapon(+b.dataset.i)));
}
function selectWeapon(i) {
  state.weapon = i;
  state.ammo = Math.min(state.ammo, weapons[i].mag);
  if (state.ammo <= 0) state.ammo = weapons[i].mag;
  updateHud();
}
function reset() {
  Object.assign(state, {
    running: true,
    paused: false,
    over: false,
    time: 360,
    zoneTime: 42,
    phase: 1,
    weapon: 0,
    ammo: 24,
    health: 100,
    shield: 100,
    loot: 0,
    kills: 0,
    shots: [],
    enemyShots: [],
    enemies: [],
    items: [],
    particles: [],
    dash: 0,
    shake: 0,
  });
  Object.assign(player, { x: 480, y: 300 });
  state.zone = { x: 480, y: 300, r: 245, target: 245 };
  for (let i = 0; i < 8; i++) spawnEnemy(i);
  for (let i = 0; i < 16; i++) spawnItem();
  $("#lobby").classList.add("hidden");
  $("#game").classList.remove("hidden");
  $("#matchLabel").textContent = "MATCH // LIVE";
  $("#gameMessage").classList.add("hidden");
  addFeed("Drop confirmed. Hunt begins.");
  updateHud();
}
function spawnEnemy(i) {
  const types = [
      ["SCOUT", "#ff6870", 28, 70, 110],
      ["HUNTER", "#ffb84d", 42, 95, 75],
      ["WRAITH", "#b79cff", 32, 150, 90],
    ],
    t = types[i % types.length];
  let x, y;
  do {
    x = rnd(35, 925);
    y = rnd(35, 565);
  } while (Math.hypot(x - player.x, y - player.y) < 170);
  state.enemies.push({
    x,
    y,
    r: 11 + (i % 3),
    kind: t[0],
    color: t[1],
    health: t[2],
    max: t[2],
    speed: t[3],
    cool: rnd(0.4, 1.8),
    damage: t[4],
    wander: rnd(0, 7),
  });
}
function spawnItem() {
  const kinds = [
      ["MEDKIT", "#c5f35a"],
      ["SHIELD", "#5bd2ff"],
      ["AMMO", "#ffb84d"],
      ["BOOST", "#ff6870"],
    ],
    k = kinds[Math.floor(Math.random() * kinds.length)];
  state.items.push({
    x: rnd(30, 930),
    y: rnd(30, 570),
    r: 8,
    kind: k[0],
    color: k[1],
    pulse: rnd(0, 7),
  });
}
function start() {
  reset();
  requestAnimationFrame(loop);
}
function fire() {
  const w = weapons[state.weapon];
  if (!state.running || state.paused || state.ammo <= 0 || state.cool > 0)
    return;
  state.cool = w.rate;
  state.ammo--;
  const base = Math.atan2(state.mouse.y - player.y, state.mouse.x - player.x);
  for (let i = 0; i < (w.pellets || 1); i++) {
    const a = base + rnd(-w.spread, w.spread);
    state.shots.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(a) * w.speed,
      vy: Math.sin(a) * w.speed,
      damage: w.damage,
      life: 1.3,
      color: w.color,
      r: 3,
    });
  }
  burst(player.x, player.y, w.color, 4);
  state.shake = 3;
  updateHud();
}
function reload() {
  if (state.running) {
    state.ammo = weapons[state.weapon].mag;
    addFeed(`${weapons[state.weapon].name} reloaded.`);
    updateHud();
  }
}
function burst(x, y, color, n = 8) {
  for (let i = 0; i < n; i++)
    state.particles.push({
      x,
      y,
      vx: rnd(-100, 100),
      vy: rnd(-100, 100),
      life: rnd(0.25, 0.6),
      color,
      r: rnd(1, 3),
    });
}
function update(dt) {
  if (!state.running || state.paused) return;
  state.time -= dt;
  state.zoneTime -= dt;
  state.cool = Math.max(0, state.cool - dt);
  state.dash = Math.max(0, state.dash - dt);
  if (state.time <= 0) return finish(true);
  if (state.zoneTime <= 0) {
    state.phase++;
    state.zoneTime = Math.max(22, 42 - state.phase * 3);
    state.zone.target = Math.max(72, state.zone.target - 32);
    addFeed(`Zone ${String(state.phase).padStart(2, "0")} is collapsing.`);
  }
  state.zone.r += (state.zone.target - state.zone.r) * dt * 0.65;
  move(dt);
  if (state.mouse.down) fire();
  updateShots(dt);
  updateEnemies(dt);
  updateItems();
  updateParticles(dt);
  const outside = dist(player, state.zone) > state.zone.r;
  if (outside) {
    state.health -= 13 * dt;
    $(".damage-vignette").style.boxShadow =
      "inset 0 0 90px rgba(255,50,60,.55)";
  } else
    $(".damage-vignette").style.boxShadow = "inset 0 0 90px rgba(255,50,60,0)";
  if (state.health <= 0) return finish(false);
  if (!state.enemies.length) return finish(true);
  updateHud();
}
function move(dt) {
  let x = (state.keys.d ? 1 : 0) - (state.keys.a ? 1 : 0),
    y = (state.keys.s ? 1 : 0) - (state.keys.w ? 1 : 0);
  if (x || y) {
    const l = Math.hypot(x, y),
      speed = state.dash > 0 ? player.speed * 2.8 : player.speed;
    player.x += (x / l) * speed * dt;
    player.y += (y / l) * speed * dt;
  }
  player.x = clamp(player.x, 18, 942);
  player.y = clamp(player.y, 18, 582);
}
function updateShots(dt) {
  for (const s of state.shots) {
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.life -= dt;
    for (const e of state.enemies)
      if (dist(s, e) < e.r + s.r) {
        e.health -= s.damage;
        s.life = 0;
        burst(e.x, e.y, s.color, 7);
        if (e.health <= 0) {
          state.kills++;
          addFeed(`${e.kind} eliminated.`);
          burst(e.x, e.y, e.color, 18);
        }
      }
  }
  for (const s of state.enemyShots) {
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.life -= dt;
    if (dist(s, player) < player.r + s.r) {
      let d = s.damage;
      if (state.shield) {
        const soak = Math.min(state.shield, d);
        state.shield -= soak;
        d -= soak;
      }
      state.health -= d;
      s.life = 0;
      burst(player.x, player.y, "#ff6870", 8);
    }
  }
  state.shots = state.shots.filter(
    (s) => s.life > 0 && s.x > -30 && s.x < 990 && s.y > -30 && s.y < 630,
  );
  state.enemyShots = state.enemyShots.filter(
    (s) => s.life > 0 && s.x > -30 && s.x < 990 && s.y > -30 && s.y < 630,
  );
  state.enemies = state.enemies.filter((e) => e.health > 0);
}
function updateEnemies(dt) {
  for (const e of state.enemies) {
    e.cool -= dt;
    const d = dist(player, e);
    if (d < 360) {
      const a = Math.atan2(player.y - e.y, player.x - e.x);
      if (d > 120) {
        e.x += Math.cos(a) * e.speed * dt;
        e.y += Math.sin(a) * e.speed * dt;
      }
      if (e.cool <= 0) {
        state.enemyShots.push({
          x: e.x,
          y: e.y,
          vx: Math.cos(a) * 260,
          vy: Math.sin(a) * 260,
          damage: e.damage / 24,
          life: 2,
          r: 4,
          color: e.color,
        });
        e.cool = e.kind === "WRAITH" ? 2.2 : 1.45;
      }
    } else {
      e.wander += dt;
      e.x += Math.cos(e.wander) * e.speed * 0.2 * dt;
      e.y += Math.sin(e.wander * 0.8) * e.speed * 0.2 * dt;
    }
    e.x = clamp(e.x, 18, 942);
    e.y = clamp(e.y, 18, 582);
  }
}
function updateItems() {
  for (const it of state.items) {
    it.pulse += 0.05;
    if (dist(player, it) < 23) {
      state.loot++;
      if (it.kind === "MEDKIT") state.health = clamp(state.health + 25, 0, 100);
      if (it.kind === "SHIELD") state.shield = clamp(state.shield + 35, 0, 100);
      if (it.kind === "AMMO") state.ammo = weapons[state.weapon].mag;
      if (it.kind === "BOOST") state.dash = 4;
      addFeed(`${it.kind} collected.`);
      it.gone = true;
      burst(it.x, it.y, it.color, 12);
    }
  }
  state.items = state.items.filter((i) => !i.gone);
}
function updateParticles(dt) {
  for (const p of state.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  }
  state.particles = state.particles.filter((p) => p.life > 0);
}
function finish(win) {
  state.running = false;
  state.over = true;
  const box = $("#gameMessage");
  box.innerHTML = `<div><p class="kicker">${win ? "EXTRACTION COMPLETE" : "SIGNAL LOST"}</p><h2>${win ? "RIFT SECURED" : "YOU WERE ELIMINATED"}</h2><p>${win ? `Match clear. ${state.kills} targets removed.` : "The circle closed around you."}</p><button class="button button-primary" id="againBtn">↻ PLAY AGAIN</button></div>`;
  box.classList.remove("hidden");
  $("#againBtn").onclick = reset;
  $("#matchLabel").textContent = win
    ? "MATCH // VICTORY"
    : "MATCH // ELIMINATED";
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  if (state.shake) {
    ctx.translate(
      rnd(-state.shake, state.shake),
      rnd(-state.shake, state.shake),
    );
    state.shake *= 0.9;
  }
  ctx.fillStyle = "#071318";
  ctx.fillRect(0, 0, 960, 600);
  ctx.strokeStyle = "rgba(91,210,255,.08)";
  for (let x = 0; x < 960; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  for (let y = 0; y < 600; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(960, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,104,112,.07)";
  ctx.beginPath();
  ctx.rect(0, 0, 960, 600);
  ctx.arc(state.zone.x, state.zone.y, state.zone.r, 0, Math.PI * 2, true);
  ctx.fill("evenodd");
  ctx.beginPath();
  ctx.arc(state.zone.x, state.zone.y, state.zone.r, 0, Math.PI * 2);
  ctx.strokeStyle = "#c5f35a";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.setLineDash([4, 10]);
  ctx.strokeStyle = "rgba(91,210,255,.7)";
  ctx.beginPath();
  ctx.arc(state.zone.x, state.zone.y, state.zone.r - 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  for (const it of state.items) {
    ctx.globalAlpha = 0.7 + Math.sin(it.pulse) * 0.2;
    ctx.fillStyle = it.color;
    ctx.fillRect(it.x - 7, it.y - 7, 14, 14);
    ctx.fillStyle = "#071318";
    ctx.font = "9px DM Mono";
    ctx.textAlign = "center";
    ctx.fillText(it.kind[0], it.x, it.y + 3);
  }
  ctx.globalAlpha = 1;
  for (const s of [...state.shots, ...state.enemyShots]) {
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const e of state.enemies) {
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#172229";
    ctx.fillRect(e.x - 15, e.y - e.r - 9, 30, 3);
    ctx.fillStyle = "#c5f35a";
    ctx.fillRect(e.x - 15, e.y - e.r - 9, 30 * (e.health / e.max), 3);
    ctx.fillStyle = "#d4dfe0";
    ctx.font = "8px DM Mono";
    ctx.textAlign = "center";
    ctx.fillText(e.kind, e.x, e.y - e.r - 14);
  }
  for (const p of state.particles) {
    ctx.globalAlpha = p.life * 2;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const a = Math.atan2(state.mouse.y - player.y, state.mouse.x - player.x);
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(a);
  ctx.fillStyle = "#c5f35a";
  ctx.fillRect(2, -4, 25, 8);
  ctx.fillStyle = "#e8f0ed";
  ctx.beginPath();
  ctx.arc(0, 0, player.r, 0, Math.PI * 2);
  ctx.fill();
  if (state.shield) {
    ctx.strokeStyle = "rgba(91,210,255,.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, player.r + 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
  drawMap();
}
function drawMap() {
  mapCtx.fillStyle = "#09151a";
  mapCtx.fillRect(0, 0, 180, 180);
  mapCtx.strokeStyle = "rgba(91,210,255,.14)";
  for (let i = 0; i < 180; i += 30) {
    mapCtx.beginPath();
    mapCtx.moveTo(i, 0);
    mapCtx.lineTo(i, 180);
    mapCtx.stroke();
    mapCtx.beginPath();
    mapCtx.moveTo(0, i);
    mapCtx.lineTo(180, i);
    mapCtx.stroke();
  }
  mapCtx.strokeStyle = "#c5f35a";
  mapCtx.beginPath();
  mapCtx.arc(
    (state.zone.x / 960) * 180,
    (state.zone.y / 600) * 180,
    (state.zone.r / 960) * 180,
    0,
    Math.PI * 2,
  );
  mapCtx.stroke();
  for (const e of state.enemies) {
    mapCtx.fillStyle = "#ff6870";
    mapCtx.fillRect((e.x / 960) * 180 - 2, (e.y / 600) * 180 - 2, 4, 4);
  }
  mapCtx.fillStyle = "#c5f35a";
  mapCtx.fillRect((player.x / 960) * 180 - 3, (player.y / 600) * 180 - 3, 6, 6);
}
function loop(t) {
  const dt = Math.min(0.033, (t - state.last) / 1000 || 0.016);
  state.last = t;
  update(dt);
  draw();
  if (state.running || !state.over) requestAnimationFrame(loop);
}
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  state.keys[k] = true;
  if (k >= "1" && k <= "4") selectWeapon(+k - 1);
  if (k === "r") reload();
  if (k === " ") {
    e.preventDefault();
    state.dash = 0.22;
  }
});
window.addEventListener(
  "keyup",
  (e) => (state.keys[e.key.toLowerCase()] = false),
);
canvas.addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  state.mouse.x = ((e.clientX - r.left) * canvas.width) / r.width;
  state.mouse.y = ((e.clientY - r.top) * canvas.height) / r.height;
});
canvas.addEventListener("mousedown", () => (state.mouse.down = true));
window.addEventListener("mouseup", () => (state.mouse.down = false));
$("#startBtn").onclick = start;
$("#reloadBtn").onclick = reload;
$("#howBtn").onclick = () => $("#modal").classList.remove("hidden");
$("#modalClose").onclick = () => $("#modal").classList.add("hidden");
$("#pauseBtn").onclick = () => {
  if (state.running && !state.over) {
    state.paused = !state.paused;
    $("#pauseBtn").textContent = state.paused ? "▶" : "Ⅱ";
    addFeed(state.paused ? "Match paused." : "Match resumed.");
  }
};
$("#soundBtn").onclick = () => {
  state.muted = !state.muted;
  $("#soundBtn").textContent = state.muted ? "◌" : "◒";
};
buildWeapons();
draw();
