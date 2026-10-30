/**
 * particles.js - Multi-Layer Canvas Particle System
 * Includes: Ambient bokeh, drifting petals, twinkling stars, and burst confetti.
 */

class ParticleEngine {
  constructor() {
    this.bgCanvas = document.getElementById('particle-canvas');
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (!this.bgCanvas || !this.confettiCanvas) return;

    this.bgCtx = this.bgCanvas.getContext('2d');
    this.confettiCtx = this.confettiCanvas.getContext('2d');

    this.particles = [];
    this.confetti = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.initBackgroundParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    this.bgCanvas.width = this.width * dpr;
    this.bgCanvas.height = this.height * dpr;
    this.bgCtx.scale(dpr, dpr);

    this.confettiCanvas.width = this.width * dpr;
    this.confettiCanvas.height = this.height * dpr;
    this.confettiCtx.scale(dpr, dpr);
  }

  initBackgroundParticles() {
    this.particles = [];
    // 1. Drifting Petals (25 count)
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        type: 'petal',
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 8 + 8,
        speedX: Math.random() * 0.8 - 0.2,
        speedY: Math.random() * 0.9 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        color: Math.random() > 0.45 ? 'rgba(215, 68, 114, 0.75)' : 'rgba(235, 95, 142, 0.68)'
      });
    }

    // 2. Bokeh Light Orbs (15 count)
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        type: 'bokeh',
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 35 + 20,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.18 + 0.08,
        alphaDir: (Math.random() - 0.5) * 0.003,
        color: Math.random() > 0.5 ? '244, 186, 201' : '247, 236, 199'
      });
    }

    // 3. Twinkling Tiny Gold Stars (35 count)
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        type: 'star',
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.02,
        baseAlpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  // Trigger bursting confetti & sparkles from an origin point
  burst(originX, originY, count = 70) {
    const colors = [
      '#F4BAC9', '#E89BAE', '#D4AF37', '#F7ECC7', '#D8D0F0', '#B84D72', '#FAF4EE'
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      const size = Math.random() * 7 + 4;

      this.confetti.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        gravity: 0.22,
        friction: 0.96,
        size: size,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
        alpha: 1,
        fadeSpeed: Math.random() * 0.012 + 0.008
      });
    }
  }

  animate() {
    // 1. Draw Background Ambient Canvas
    this.bgCtx.clearRect(0, 0, this.width, this.height);

    for (const p of this.particles) {
      if (p.type === 'petal') {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.6;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > this.height + 20) {
          p.y = -20;
          p.x = Math.random() * this.width;
        }
        if (p.x > this.width + 20) p.x = -20;
        if (p.x < -20) p.x = this.width + 20;

        this.bgCtx.save();
        this.bgCtx.translate(p.x, p.y);
        this.bgCtx.rotate(p.rotation);
        this.bgCtx.fillStyle = p.color;
        this.bgCtx.beginPath();
        this.bgCtx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        this.bgCtx.fill();
        this.bgCtx.restore();

      } else if (p.type === 'bokeh') {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.alphaDir;

        if (p.alpha > 0.25 || p.alpha < 0.05) p.alphaDir *= -1;
        if (p.x < -p.radius) p.x = this.width + p.radius;
        if (p.x > this.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = this.height + p.radius;
        if (p.y > this.height + p.radius) p.y = -p.radius;

        this.bgCtx.save();
        const grad = this.bgCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        this.bgCtx.fillStyle = grad;
        this.bgCtx.beginPath();
        this.bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.bgCtx.fill();
        this.bgCtx.restore();

      } else if (p.type === 'star') {
        p.twinkle += p.twinkleSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.twinkle) * 0.35;
        this.bgCtx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, Math.min(1, currentAlpha))})`;
        this.bgCtx.beginPath();
        this.bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.bgCtx.fill();
      }
    }

    // 2. Draw Confetti & Sparkles
    this.confettiCtx.clearRect(0, 0, this.width, this.height);

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.vy += c.gravity;
      c.vx *= c.friction;
      c.vy *= c.friction;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotSpeed;
      c.alpha -= c.fadeSpeed;

      if (c.alpha <= 0 || c.y > this.height + 50) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.confettiCtx.save();
      this.confettiCtx.translate(c.x, c.y);
      this.confettiCtx.rotate((c.rotation * Math.PI) / 180);
      this.confettiCtx.globalAlpha = Math.max(0, c.alpha);
      this.confettiCtx.fillStyle = c.color;

      if (c.shape === 'rect') {
        this.confettiCtx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size * 0.6);
      } else {
        this.confettiCtx.beginPath();
        this.confettiCtx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
        this.confettiCtx.fill();
      }
      this.confettiCtx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Global instance
window.particleEngine = new ParticleEngine();
