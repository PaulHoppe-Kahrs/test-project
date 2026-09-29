const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const healthEl = document.getElementById('health');
const ammoEl = document.getElementById('ammo');
const weaponEl = document.getElementById('weapon');
const aliveEl = document.getElementById('alive');
const weaponSelector = document.getElementById('weaponSelector');
const loadoutButtons = {
  sword: document.getElementById('loadout-sword'),
  shield: document.getElementById('loadout-shield')
};

const WEAPONS = {
  rifle: {
    name: 'RIFLE',
    damage: 18,
    fireRate: 0.12,
    speed: 9,
    color: '#ffd75a',
    clipSize: 30,
    pellets: 1,
    spread: 0.02,
    radius: 4,
    style: 'tracer',
    label: 'Allrounder',
    desc: 'stabil'
  },
  smg: {
    name: 'SMG',
    damage: 10,
    fireRate: 0.07,
    speed: 10,
    color: '#69d9ff',
    clipSize: 42,
    pellets: 1,
    spread: 0.08,
    radius: 4,
    style: 'spark',
    label: 'Rush',
    desc: 'schnell'
  },
  shotgun: {
    name: 'SHOTGUN',
    damage: 11,
    fireRate: 0.46,
    speed: 8,
    color: '#ff9b5e',
    clipSize: 8,
    pellets: 6,
    spread: 0.25,
    radius: 4,
    style: 'burst',
    label: 'Close',
    desc: 'Nahkampf'
  },
  sniper: {
    name: 'SNIPER',
    damage: 46,
    fireRate: 0.68,
    speed: 13,
    color: '#d8ff75',
    clipSize: 5,
    pellets: 1,
    spread: 0.01,
    radius: 5,
    style: 'beam',
    label: 'Precision',
    desc: 'lang'
  },
  dmr: {
    name: 'DMR',
    damage: 28,
    fireRate: 0.2,
    speed: 11,
    color: '#8fb3ff',
    clipSize: 15,
    pellets: 1,
    spread: 0.04,
    radius: 4,
    style: 'pulse',
    label: 'Tactical',
    desc: 'Mittel'
  },
  pulse: {
    name: 'PULSE',
    damage: 21,
    fireRate: 0.11,
    speed: 9.5,
    color: '#7ef29a',
    clipSize: 24,
    pellets: 3,
    spread: 0.12,
    radius: 4,
    style: 'nova',
    label: 'Spread',
    desc: 'Mehrfach'
  },
  launcher: {
    name: 'LAUNCHER',
    damage: 36,
    fireRate: 0.85,
    speed: 7.2,
    color: '#ff6a7a',
    clipSize: 4,
    pellets: 1,
    spread: 0.04,
    radius: 6,
    explosive: true,
    style: 'explosive',
    label: 'Heavy',
    desc: 'Explosion'
  }
};

const world = {
  width: canvas.width,
  height: canvas.height,
  keys: {},
  mouse: { x: canvas.width / 2, y: canvas.height / 2, down: false },
  lastTime: 0,
  status: 'menu',
  particles: [],
  projectiles: [],
  enemies: [],
  loot: [],
  zone: { x: canvas.width / 2, y: canvas.height / 2, radius: 310, shrinkRate: 0.15 },
  shake: 0,
  weaponOrder: ['rifle', 'smg', 'shotgun', 'sniper', 'dmr', 'pulse', 'launcher'],
  weaponIndex: 0,
  rounds: 0
};

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  speed: 3.4,
  health: 100,
  shield: 0,
  ammo: 30,
  maxAmmo: 30,
  fireCooldown: 0,
  reloadTimer: 0,
  weaponKey: 'rifle',
  loadout: 'sword',
  boostTimer: 0,
  meleeCooldown: 0,
  color: '#8cf7b1'
};

function buildWeaponSelector() {
  const entries = Object.entries(WEAPONS);
  weaponSelector.innerHTML = entries.map(([key, weapon]) => `
    <button class="weapon-card ${player.weaponKey === key ? 'active' : ''}" data-weapon="${key}">
      <strong>${weapon.name}</strong>
      <small>${weapon.label}</small>
    </button>
  `).join('');

  weaponSelector.querySelectorAll('.weapon-card').forEach((button) => {
    button.addEventListener('click', () => {
      setWeapon(button.dataset.weapon);
      updateWeaponSelector();
    });
  });
}

function updateWeaponSelector() {
  weaponSelector.querySelectorAll('.weapon-card').forEach((button) => {
    button.classList.toggle('active', button.dataset.weapon === player.weaponKey);
  });
}

function selectLoadout(loadout) {
  player.loadout = loadout;
  if (loadout === 'shield') {
    player.shield = clamp(player.shield + 25, 0, 80);
  }
  Object.entries(loadoutButtons).forEach(([key, button]) => {
    button.classList.toggle('active', key === loadout);
  });
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getWeapon() {
  return WEAPONS[player.weaponKey];
}

function setWeapon(key) {
  if (!WEAPONS[key]) return;
  player.weaponKey = key;
  const weapon = getWeapon();
  player.maxAmmo = weapon.clipSize;
  if (player.ammo <= 0 || player.ammo > weapon.clipSize) {
    player.ammo = weapon.clipSize;
  }
  updateHud();
}

function cycleWeapon(step) {
  const currentIndex = world.weaponOrder.indexOf(player.weaponKey);
  const nextIndex = (currentIndex + step + world.weaponOrder.length) % world.weaponOrder.length;
  setWeapon(world.weaponOrder[nextIndex]);
}

function spawnParticles(x, y, color, amount = 10, speed = 2.4) {
  for (let i = 0; i < amount; i++) {
    world.particles.push({
      x,
      y,
      vx: rand(-speed, speed),
      vy: rand(-speed, speed),
      size: rand(2, 5),
      life: rand(16, 38),
      color
    });
  }
}

function spawnLoot() {
  world.loot = [];
  const types = ['med', 'ammo', 'shield', 'boost', 'grenade'];

  for (let i = 0; i < 16; i++) {
    world.loot.push({
      x: rand(60, world.width - 60),
      y: rand(60, world.height - 60),
      radius: 9,
      type: types[Math.floor(Math.random() * types.length)]
    });
  }
}

function enemyTypeForIndex(index) {
  const roll = index % 5;
  if (roll === 0) return 'scout';
  if (roll === 1) return 'tank';
  if (roll === 2) return 'rusher';
  if (roll === 3) return 'sniper';
  return 'runner';
}

function spawnEnemies(count = 9) {
  world.enemies = [];

  for (let i = 0; i < count; i++) {
    const type = enemyTypeForIndex(i + world.rounds);
    let x = 0;
    let y = 0;
    let valid = false;

    while (!valid) {
      x = rand(50, world.width - 50);
      y = rand(50, world.height - 50);
      if (distance({ x, y }, player) > 180) valid = true;
    }

    const stats = {
      scout: { radius: 12, speed: 1.5, health: 42, color: '#ffb067' },
      tank: { radius: 16, speed: 1.0, health: 78, color: '#ff6b57' },
      rusher: { radius: 12, speed: 2.0, health: 48, color: '#ff5d73' },
      sniper: { radius: 13, speed: 1.3, health: 52, color: '#b089ff' },
      runner: { radius: 11, speed: 1.8, health: 40, color: '#7dd3fc' }
    }[type];

    world.enemies.push({
      x,
      y,
      ...stats,
      cooldown: rand(0.7, 1.8),
      dir: rand(0, Math.PI * 2),
      type
    });
  }
}

function setOverlay(content) {
  overlay.innerHTML = content;
  overlay.classList.add('visible');
}

function resetGame() {
  player.x = world.width / 2;
  player.y = world.height / 2;
  player.health = 100;
  player.shield = 0;
  player.boostTimer = 0;
  player.weaponKey = 'rifle';
  player.ammo = WEAPONS.rifle.clipSize;
  player.maxAmmo = WEAPONS.rifle.clipSize;
  player.fireCooldown = 0;
  player.reloadTimer = 0;
  world.zone.radius = 310;
  world.status = 'running';
  world.shake = 0;
  world.projectiles = [];
  world.particles = [];
  world.rounds = 0;
  spawnLoot();
  spawnEnemies(9);
  overlay.classList.remove('visible');
  updateHud();
}

function fireWeapon(targetX, targetY) {
  if (world.status !== 'running') return;
  if (player.reloadTimer > 0) return;
  if (player.fireCooldown > 0) return;
  const weapon = getWeapon();

  if (player.ammo <= 0) {
    player.reloadTimer = 0.8;
    spawnParticles(player.x, player.y, weapon.color, 12, 2.2);
    return;
  }

  const baseX = targetX - player.x;
  const baseY = targetY - player.y;
  const len = Math.hypot(baseX, baseY) || 1;

  const pellets = weapon.pellets;

  for (let i = 0; i < pellets; i++) {
    const angleOffset = (Math.random() - 0.5) * weapon.spread;
    const angle = Math.atan2(baseY, baseX) + angleOffset;
    const vx = Math.cos(angle) * weapon.speed;
    const vy = Math.sin(angle) * weapon.speed;

    world.projectiles.push({
      x: player.x,
      y: player.y,
      vx,
      vy,
      radius: weapon.radius,
      life: weapon.explosive ? 52 : 72,
      from: 'player',
      color: weapon.color,
      damage: weapon.damage,
      explosive: !!weapon.explosive,
      style: weapon.style || 'tracer'
    });
  }

  player.ammo -= 1;
  player.fireCooldown = weapon.fireRate;
  world.shake = 5;
  spawnParticles(player.x + (baseX / len) * 12, player.y + (baseY / len) * 12, weapon.color, pellets * 3, 3);

  if (player.ammo <= 0) {
    player.reloadTimer = 0.9;
  }

  updateHud();
}

function performMeleeStrike() {
  if (player.meleeCooldown > 0 || world.status !== 'running') return;
  player.meleeCooldown = player.loadout === 'sword' ? 0.45 : 0.7;
  const damage = player.loadout === 'sword' ? 34 : 18;

  for (const enemy of world.enemies) {
    if (distance(player, enemy) <= 58) {
      enemy.health -= damage;
      spawnParticles(enemy.x, enemy.y, player.loadout === 'sword' ? '#facc15' : '#7dd3fc', 14, 2.8);
    }
  }
}

function updateHud() {
  healthEl.textContent = `HP: ${Math.max(0, Math.ceil(player.health))}`;
  ammoEl.textContent = `AMMO: ${player.ammo}`;
  weaponEl.textContent = `WEAPON: ${getWeapon().name}`;
  aliveEl.textContent = `ALIVE: ${world.enemies.length}`;
}

function handleMovement(dt) {
  const left = !!world.keys.a || !!world.keys.arrowleft;
  const right = !!world.keys.d || !!world.keys.arrowright;
  const up = !!world.keys.w || !!world.keys.arrowup;
  const down = !!world.keys.s || !!world.keys.arrowdown;

  let dx = (right ? 1 : 0) - (left ? 1 : 0);
  let dy = (down ? 1 : 0) - (up ? 1 : 0);

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const speedBoost = player.boostTimer > 0 ? 1.35 : 1;
    player.x += dx * player.speed * speedBoost * 60 * dt;
    player.y += dy * player.speed * speedBoost * 60 * dt;
  }

  player.x = clamp(player.x, player.radius, world.width - player.radius);
  player.y = clamp(player.y, player.radius, world.height - player.radius);

  if (world.mouse.down && world.status === 'running') {
    fireWeapon(world.mouse.x, world.mouse.y);
  }
}

function updatePlayerTimers(dt) {
  if (player.fireCooldown > 0) {
    player.fireCooldown -= dt;
  }

  if (player.reloadTimer > 0) {
    player.reloadTimer -= dt;
    if (player.reloadTimer <= 0) {
      player.ammo = player.maxAmmo;
      updateHud();
    }
  }

  if (player.boostTimer > 0) {
    player.boostTimer -= dt;
  }

  if (player.meleeCooldown > 0) {
    player.meleeCooldown -= dt;
  }
}

function applyExplosion(x, y, damage, radius) {
  for (const enemy of world.enemies) {
    const d = distance({ x, y }, enemy);
    if (d <= radius) {
      const falloff = 1 - d / radius;
      enemy.health -= damage * falloff;
      spawnParticles(enemy.x, enemy.y, '#ff6a7a', 12, 4);
    }
  }
}

function updateProjectiles(dt) {
  for (const bullet of world.projectiles) {
    bullet.x += bullet.vx * 60 * dt;
    bullet.y += bullet.vy * 60 * dt;
    bullet.life -= 1;

    if (bullet.from === 'player') {
      for (const enemy of world.enemies) {
        if (distance(bullet, enemy) <= bullet.radius + enemy.radius) {
          if (bullet.explosive) {
            applyExplosion(bullet.x, bullet.y, 42, 55);
            spawnParticles(bullet.x, bullet.y, '#ff6a7a', 18, 4.5);
          } else {
            enemy.health -= bullet.damage;
            spawnParticles(bullet.x, bullet.y, '#ffd75a', 10, 2.8);
          }
          bullet.life = 0;
          world.shake = 10;
          break;
        }
      }
    } else {
      if (distance(bullet, player) <= bullet.radius + player.radius) {
        const actualDamage = bullet.damage || 12;
        let reducedDamage = actualDamage;

        if (player.loadout === 'shield') {
          reducedDamage *= 0.65;
        }

        if (player.shield > 0) {
          const absorbed = Math.min(player.shield, reducedDamage);
          player.shield -= absorbed;
          reducedDamage -= absorbed;
        }

        player.health -= reducedDamage;
        bullet.life = 0;
        spawnParticles(bullet.x, bullet.y, '#ff5d73', 12, 2.8);
      }
    }
  }

  world.projectiles = world.projectiles.filter((bullet) => bullet.life > 0 && bullet.x > -20 && bullet.x < world.width + 20 && bullet.y > -20 && bullet.y < world.height + 20);

  for (const enemy of world.enemies) {
    enemy.cooldown -= dt;
    const dist = distance(player, enemy);

    if (dist < 220) {
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      enemy.x += Math.cos(angle) * enemy.speed * 60 * dt;
      enemy.y += Math.sin(angle) * enemy.speed * 60 * dt;

      if (dist < 190 && enemy.cooldown <= 0) {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const len = Math.hypot(dx, dy) || 1;
        const enemyDamage = enemy.type === 'tank' ? 20 : enemy.type === 'sniper' ? 18 : enemy.type === 'scout' ? 13 : 12;
        world.projectiles.push({
          x: enemy.x,
          y: enemy.y,
          vx: (dx / len) * (enemy.type === 'sniper' ? 7.4 : 5.9),
          vy: (dy / len) * (enemy.type === 'sniper' ? 7.4 : 5.9),
          radius: enemy.type === 'sniper' ? 5 : 4,
          life: 90,
          from: 'enemy',
          color: enemy.type === 'sniper' ? '#b089ff' : '#ff5d73',
          damage: enemyDamage,
          style: enemy.type === 'sniper' ? 'beam' : 'spark'
        });
        enemy.cooldown = rand(0.8, 1.5);
      }
    } else {
      enemy.dir += rand(-0.3, 0.3);
      enemy.x += Math.cos(enemy.dir) * 0.8 * 60 * dt;
      enemy.y += Math.sin(enemy.dir) * 0.8 * 60 * dt;
    }

    enemy.x = clamp(enemy.x, enemy.radius, world.width - enemy.radius);
    enemy.y = clamp(enemy.y, enemy.radius, world.height - enemy.radius);
  }

  world.enemies = world.enemies.filter((enemy) => enemy.health > 0);
}

function updateLoot() {
  for (const item of world.loot) {
    if (distance(player, item) <= player.radius + item.radius + 6) {
      if (item.type === 'med') {
        player.health = clamp(player.health + 32, 0, 100);
        spawnParticles(item.x, item.y, '#8cf7b1', 18, 3);
      } else if (item.type === 'ammo') {
        player.ammo = clamp(player.ammo + 12, 0, player.maxAmmo);
        spawnParticles(item.x, item.y, '#ffd75a', 18, 3);
      } else if (item.type === 'shield') {
        player.shield = clamp(player.shield + 25, 0, 60);
        spawnParticles(item.x, item.y, '#69d9ff', 20, 3.2);
      } else if (item.type === 'boost') {
        player.boostTimer = 5;
        spawnParticles(item.x, item.y, '#7ef29a', 20, 3.4);
      } else {
        for (const enemy of world.enemies) {
          enemy.health -= 20;
        }
        spawnParticles(item.x, item.y, '#ff6a7a', 20, 3.5);
      }
      item.collected = true;
      updateHud();
    }
  }

  world.loot = world.loot.filter((item) => !item.collected);
}

function updateZone(dt) {
  world.zone.radius -= world.zone.shrinkRate * 60 * dt;
  if (world.zone.radius < 72) world.zone.radius = 72;

  const distToCenter = distance(player, world.zone);
  if (distToCenter > world.zone.radius) {
    player.health -= 18 * dt * 60;
  }
}

function updateParticles(dt) {
  for (const particle of world.particles) {
    particle.x += particle.vx * 60 * dt;
    particle.y += particle.vy * 60 * dt;
    particle.life -= 1;
  }
  world.particles = world.particles.filter((particle) => particle.life > 0);
}

function checkState() {
  if (player.health <= 0) {
    world.status = 'lost';
    setOverlay(`
      <div class="panel">
        <span class="tag">ROUND OVER</span>
        <h1>Du bist raus</h1>
        <p>Der letzte Match war zu knapp. Versuch's noch einmal.</p>
        <button id="restartBtn">Neu starten</button>
      </div>
    `);
    document.getElementById('restartBtn').addEventListener('click', resetGame);
    return;
  }

  if (world.enemies.length === 0 && world.status === 'running') {
    world.status = 'won';
    world.rounds += 1;
    setOverlay(`
      <div class="panel">
        <span class="tag">VICTORY</span>
        <h1>Winner Winner</h1>
        <p>Du hast die Zone kontrolliert und alle Gegner eliminiert. Neue Welle startet bald.</p>
        <button id="restartBtn">Nächste Runde</button>
      </div>
    `);
    document.getElementById('restartBtn').addEventListener('click', () => {
      world.status = 'running';
      spawnEnemies(9 + world.rounds);
      world.zone.radius = Math.max(220, 310 - world.rounds * 10);
      overlay.classList.remove('visible');
      updateHud();
    });
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, world.width, world.height);

  const gradient = ctx.createRadialGradient(world.width / 2, world.height / 2, 30, world.width / 2, world.height / 2, world.width * 0.9);
  gradient.addColorStop(0, '#1a3d57');
  gradient.addColorStop(0.5, '#11314a');
  gradient.addColorStop(1, '#071824');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, world.width, world.height);

  for (let i = 0; i < 80; i++) {
    const x = (i * 79) % world.width;
    const y = (i * 61) % world.height;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, y, 3, 3);
  }

  ctx.beginPath();
  ctx.arc(world.zone.x, world.zone.y, world.zone.radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(105, 217, 255, 0.9)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(world.zone.x, world.zone.y, world.zone.radius - 16, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(138, 247, 178, 0.32)';
  ctx.setLineDash([8, 10]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPlayer() {
  const angle = Math.atan2(world.mouse.y - player.y, world.mouse.x - player.x);

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(angle);

  if (player.loadout === 'shield') {
    ctx.strokeStyle = 'rgba(105, 217, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 9, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (player.loadout === 'sword') {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(42, 0);
    ctx.stroke();
  }

  ctx.fillStyle = '#0d2e24';
  ctx.fillRect(0, -5, 22, 10);

  if (player.shield > 0) {
    ctx.strokeStyle = 'rgba(105, 217, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#8cf7b1';
  ctx.beginPath();
  ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(10, -3, 14, 6);
  ctx.restore();
}

function drawEnemies() {
  for (const enemy of world.enemies) {
    ctx.beginPath();
    ctx.fillStyle = enemy.color;
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.fillRect(enemy.x - 18, enemy.y - 26, 36, 7);
    ctx.fillStyle = enemy.type === 'tank' ? '#ff6b57' : '#ff5d73';
    ctx.fillRect(enemy.x - 18, enemy.y - 26, (enemy.health / (enemy.type === 'tank' ? 78 : 52)) * 36, 7);
  }
}

function drawLoot() {
  for (const item of world.loot) {
    const color = {
      med: '#8cf7b1',
      ammo: '#ffd75a',
      shield: '#69d9ff',
      boost: '#7ef29a',
      grenade: '#ff6a7a'
    }[item.type] || '#ddd';

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawProjectiles() {
  for (const bullet of world.projectiles) {
    ctx.beginPath();
    ctx.fillStyle = bullet.color;

    if (bullet.style === 'beam') {
      ctx.fillRect(bullet.x - 3, bullet.y - 1, 12, 2);
    } else if (bullet.style === 'burst') {
      ctx.arc(bullet.x, bullet.y, bullet.radius + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radius - 1, 0, Math.PI * 2);
      ctx.fillStyle = '#fff5d6';
      ctx.fill();
    } else if (bullet.style === 'nova') {
      ctx.arc(bullet.x, bullet.y, bullet.radius + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = '#d9ffe9';
      ctx.arc(bullet.x, bullet.y, bullet.radius - 1, 0, Math.PI * 2);
      ctx.fill();
    } else if (bullet.style === 'explosive') {
      ctx.arc(bullet.x, bullet.y, bullet.radius + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = '#ffd6d9';
      ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (bullet.style === 'spark') {
      ctx.fillRect(bullet.x - 5, bullet.y - 1, 10, 2);
      ctx.fillRect(bullet.x - 1, bullet.y - 5, 2, 10);
    } else {
      ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawParticles() {
  for (const particle of world.particles) {
    ctx.beginPath();
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = Math.max(0, particle.life / 35);
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function render() {
  const shakeX = world.shake > 0 ? rand(-world.shake, world.shake) : 0;
  const shakeY = world.shake > 0 ? rand(-world.shake, world.shake) : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawBackground();
  drawLoot();
  drawProjectiles();
  drawEnemies();
  drawPlayer();
  drawParticles();
  ctx.restore();

  if (world.shake > 0) world.shake *= 0.85;
}

function gameLoop(ts) {
  const dt = Math.min((ts - world.lastTime) / 1000 || 0.016, 0.033);
  world.lastTime = ts;

  if (world.status === 'running') {
    handleMovement(dt);
    updatePlayerTimers(dt);
    updateProjectiles(dt);
    updateLoot();
    updateZone(dt);
    updateParticles(dt);
    checkState();
    updateHud();
  }

  render();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  world.keys[key] = true;

  if (key === '1') setWeapon('rifle');
  if (key === '2') setWeapon('smg');
  if (key === '3') setWeapon('shotgun');
  if (key === '4') setWeapon('sniper');
  if (key === '5') setWeapon('dmr');
  if (key === '6') setWeapon('pulse');
  if (key === '7') setWeapon('launcher');
  if (key === 'q') selectLoadout('sword');
  if (key === 'e') selectLoadout('shield');
  if (key === 'f') performMeleeStrike();

  if (key === 'r' && player.reloadTimer <= 0 && player.ammo < player.maxAmmo) {
    player.reloadTimer = 0.9;
  }
  if (event.code === 'Space') event.preventDefault();
});

window.addEventListener('keyup', (event) => {
  world.keys[event.key.toLowerCase()] = false;
});

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  world.mouse.x = (event.clientX - rect.left) * scaleX;
  world.mouse.y = (event.clientY - rect.top) * scaleY;
});

canvas.addEventListener('mousedown', () => {
  world.mouse.down = true;
  if (world.status === 'running') fireWeapon(world.mouse.x, world.mouse.y);
});

canvas.addEventListener('mouseup', () => {
  world.mouse.down = false;
});

startBtn.addEventListener('click', resetGame);
document.getElementById('heroStart').addEventListener('click', resetGame);
document.getElementById('matchStart').addEventListener('click', resetGame);
Object.entries(loadoutButtons).forEach(([key, button]) => {
  button.addEventListener('click', () => selectLoadout(key));
});
buildWeaponSelector();
selectLoadout('sword');
updateHud();
requestAnimationFrame(gameLoop);
