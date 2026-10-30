/**
 * fireworks.js - Interactive Star & Bloom Fireworks Finale
 * Real-time canvas fireworks launched by the visitor and shaped as stars or blooms.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('fireworks-canvas');
  const container = document.getElementById('fireworks-container');
  const launchBtn = document.getElementById('launch-show-btn');
  const countBadge = document.getElementById('fireworks-count');

  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let fireworksCount = 0;
  let rockets = [];
  let particles = [];
  let animationFrameId = null;
  let isGrandFinaleRunning = false;

  // Curated elegant color palettes
  const PALETTES = [
    // 1. Champagne Gold & Radiant Warmth
    ['#FFE484', '#FFD700', '#FFA726', '#FFF8E7', '#FFFFFF'],
    // 2. Sakura Blush & Rose Quartz
    ['#FF8DA1', '#FF69B4', '#FFB6C1', '#FFE4E1', '#FFD700'],
    // 3. Dreamy Lavender & Amethyst
    ['#D4A5FF', '#BA55D3', '#9370DB', '#E6E6FA', '#FFF0F5'],
    // 4. Starlight Rainbow Shimmer
    ['#FFD700', '#FF80AB', '#82B1FF', '#B388FF', '#B9F6CA'],
    // 5. Golden Amber & Ruby
    ['#FFB300', '#FF5252', '#FFD54F', '#FFE082', '#FFFFFF']
  ];

  // Responsive Canvas Sizing
  const resizeCanvas = () => {
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Helper: Random in range
  const random = (min, max) => Math.random() * (max - min) + min;

  // Rocket class: travels from bottom to target coordinate
  class Rocket {
    constructor(targetX, targetY, palette) {
      const rect = container.getBoundingClientRect();
      this.x = targetX + random(-30, 30);
      this.y = rect.height + 10;
      this.targetX = targetX;
      this.targetY = targetY;
      this.palette = palette || PALETTES[Math.floor(Math.random() * PALETTES.length)];
      
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = random(9, 13);
      
      this.vx = (dx / dist) * speed;
      this.vy = (dy / dist) * speed;
      this.trail = [];
      this.maxTrail = 6;
      this.color = this.palette[0];
      this.alive = true;
    }

    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrail) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;

      // Check if reached or passed target
      if (this.y <= this.targetY || (this.vy > 0 && this.y >= this.targetY)) {
        this.alive = false;
        explodeBurst(this.targetX, this.targetY, this.palette);
      }
    }

    draw() {
      // Draw sparkling tail
      for (let i = 0; i < this.trail.length; i++) {
        const pt = this.trail[i];
        const alpha = (i + 1) / this.trail.length * 0.7;
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 130, ${alpha})`;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Draw rocket head
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
  }

  // Star Particle class: forms a 5-pointed star burst geometry
  class StarParticle {
    constructor(x, y, vx, vy, color) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.alpha = 1.0;
      this.decay = random(0.012, 0.02);
      this.gravity = 0.045;
      this.friction = 0.965;
      this.size = random(2.0, 3.2);
      this.trail = [];
      this.maxTrail = 4;
      this.flickerSpeed = random(0.15, 0.3);
      this.flickerOffset = Math.random() * Math.PI;
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
      if (this.trail.length > this.maxTrail) this.trail.shift();

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      if (this.alpha <= 0) return;

      // Draw particle trail
      for (let i = 0; i < this.trail.length; i++) {
        const pt = this.trail[i];
        const trailAlpha = (i + 1) / this.trail.length * this.alpha * 0.45;
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, this.size * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = trailAlpha;
        ctx.fill();
        ctx.restore();
      }

      // Draw twinkling star core
      const flicker = 0.8 + 0.2 * Math.sin(Date.now() * this.flickerSpeed * 0.01 + this.flickerOffset);
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.alpha * flicker);
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  // Alternate five-pointed stars with soft, round dahlia blooms.
  const explodeBurst = (x, y, palette) => {
    // A quiet pop and a soft high chime; this does not start the background music.
    if (window.soundEngine && typeof window.soundEngine.playFireworkPop === 'function') {
      window.soundEngine.playFireworkPop();
    }

    fireworksCount++;
    if (countBadge) {
      countBadge.textContent = `${fireworksCount} Fireworks Launched ✨`;
    }

    const isStarPattern = fireworksCount % 2 === 1;
    const numPoints = 5;
    const totalParticles = isStarPattern ? 95 : 90;
    const baseSpeed = random(3.2, 4.8);
    const rotation = random(0, Math.PI * 2); // Random star rotation

    for (let i = 0; i < totalParticles; i++) {
      const angle = (i / totalParticles) * Math.PI * 2;
      
      const relativeAngle = angle - rotation;
      const starRadius = isStarPattern
        ? 1.0 + 0.65 * Math.cos(numPoints * relativeAngle) + 0.16 * Math.cos(numPoints * 2 * relativeAngle)
        : random(0.88, 1.12);
      
      const speed = baseSpeed * starRadius * random(0.92, 1.08);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const color = palette[Math.floor(Math.random() * palette.length)];

      particles.push(new StarParticle(x, y, vx, vy, color));
    }

    // Add a few bright glittering center embers
    for (let j = 0; j < 14; j++) {
      const emberAngle = Math.random() * Math.PI * 2;
      const emberSpeed = random(0.4, 1.6);
      particles.push(new StarParticle(
        x, y, 
        Math.cos(emberAngle) * emberSpeed, 
        Math.sin(emberAngle) * emberSpeed, 
        '#FFFFFF'
      ));
    }
  };

  // Launch firework to coordinate
  const launchFirework = (targetX, targetY) => {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    rockets.push(new Rocket(targetX, targetY, palette));
  };

  // Main Canvas Render Loop
  const loop = () => {
    const rect = container.getBoundingClientRect();
    
    // Soft transparent trail wipe creates radiant motion blur
    ctx.save();
    ctx.fillStyle = 'rgba(10, 13, 28, 0.22)';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.restore();

    // Update and draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.update();
      if (r.alive) {
        r.draw();
      } else {
        rockets.splice(i, 1);
      }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.alpha > 0) {
        p.draw();
      } else {
        particles.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(loop);
  };

  animationFrameId = requestAnimationFrame(loop);

  // User Click & Touch Handlers
  const handleInteraction = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Keep target reasonably within upper 75% of sky
    const clampedY = Math.max(40, Math.min(y, rect.height * 0.75));
    launchFirework(x, clampedY);
  };

  canvas.addEventListener('click', (e) => {
    handleInteraction(e.clientX, e.clientY);
  });

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      handleInteraction(e.touches[i].clientX, e.touches[i].clientY);
    }
  }, { passive: false });

  // Grand Finale Button Cascade
  const triggerGrandFinale = () => {
    if (isGrandFinaleRunning) return;
    isGrandFinaleRunning = true;

    if (launchBtn) {
      launchBtn.disabled = true;
      launchBtn.innerHTML = `<span>🎆 Sky Show In Progress... 🎆</span>`;
    }

    const rect = container.getBoundingClientRect();
    const totalVolley = 12;

    for (let i = 0; i < totalVolley; i++) {
      setTimeout(() => {
        const x = random(rect.width * 0.15, rect.width * 0.85);
        const y = random(rect.height * 0.15, rect.height * 0.6);
        const palette = PALETTES[i % PALETTES.length];
        rockets.push(new Rocket(x, y, palette));

        // When volley finishes
        if (i === totalVolley - 1) {
          setTimeout(() => {
            isGrandFinaleRunning = false;
            if (launchBtn) {
              launchBtn.disabled = false;
              launchBtn.innerHTML = `<span>Launch Grand Finale 🎇</span>`;
            }
          }, 1800);
        }
      }, i * 220); // Rapid, rhythmic stagger
    }
  };

  if (launchBtn) {
    launchBtn.addEventListener('click', triggerGrandFinale);
  }

  // Expose global trigger so constellation celebration can also trigger fireworks
  window.triggerBirthdayFireworks = triggerGrandFinale;
});
