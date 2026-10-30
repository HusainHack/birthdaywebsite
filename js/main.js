/**
 * main.js - Core application controller & personalization
 */

const defaultName = window.BIRTHDAY_DATA?.recipientName || 'Husaina';
const urlParams = new URLSearchParams(window.location.search);
let currentName = urlParams.get('name') || localStorage.getItem('birthday_name') || defaultName;
window.personalizeBirthdayText = (text) => String(text ?? '').replace(new RegExp(defaultName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), () => currentName);
window.personalizeBirthdayHtml = (text) => window.personalizeBirthdayText(text).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

document.addEventListener('DOMContentLoaded', () => {
  // 1. Personalization Handler (URL Parameter or LocalStorage)

  const updateNameInDom = (name) => {
    currentName = name;
    document.querySelectorAll('.recipient-name').forEach(el => {
      el.textContent = name;
    });
    document.querySelectorAll('[data-personalized-name]').forEach(el => {
      el.textContent = name;
    });
    document.title = `Happy Birthday, ${name} ✨`;
  };

  updateNameInDom(currentName);

  // 2. Personalization Settings Modal
  const settingsModal = document.getElementById('settings-modal');
  const openSettingsBtn = document.getElementById('open-settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const nameInput = document.getElementById('custom-name-input');
  const shareLinkBtn = document.getElementById('copy-share-link-btn');

  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener('click', () => {
      if (nameInput) nameInput.value = currentName;
      settingsModal.classList.add('active');
    });

    closeSettingsBtn?.addEventListener('click', () => {
      settingsModal.classList.remove('active');
    });

    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
      }
    });

    saveSettingsBtn?.addEventListener('click', () => {
      const newName = nameInput.value.trim() || defaultName;
      localStorage.setItem('birthday_name', newName);
      updateNameInDom(newName);
      settingsModal.classList.remove('active');
      showToast(`Personalized for ${newName}! 💖`);
    });

    shareLinkBtn?.addEventListener('click', () => {
      const newName = nameInput.value.trim() || currentName;
      const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(newName)}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Sharable link copied to clipboard! 📋');
      }).catch(() => {
        showToast(`URL: ?name=${encodeURIComponent(newName)}`);
      });
    });
  }

  // 3. Audio Controller (Always-on ambient background music)
  const audioBtn = document.getElementById('audio-toggle-btn');
  const startBackgroundMusic = () => {
    if (window.soundEngine && !window.soundEngine.isPlayingMusic) {
      window.soundEngine.startMusic(audioBtn);
    }
  };

  // Attempt autoplay immediately
  startBackgroundMusic();

  // Mobile & browser policy autoplay unlock on very first touch/click anywhere
  const enableAudioOnGesture = () => {
    startBackgroundMusic();
    window.removeEventListener('click', enableAudioOnGesture);
    window.removeEventListener('touchstart', enableAudioOnGesture);
    window.removeEventListener('scroll', enableAudioOnGesture);
  };
  window.addEventListener('click', enableAudioOnGesture, { passive: true });
  window.addEventListener('touchstart', enableAudioOnGesture, { passive: true });
  window.addEventListener('scroll', enableAudioOnGesture, { passive: true });

  if (audioBtn && window.soundEngine) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.soundEngine.toggleMusic(audioBtn);
    });
  }

  // 4. Hero Action: "A Little Birthday Magic ✨"
  const magicBtn = document.getElementById('magic-btn');
  const magicToast = document.getElementById('magic-toast');
  const heroFlame = document.getElementById('hero-candle-flame');
  const heroGlow = document.getElementById('hero-cake-glow');
  const heroCake = document.getElementById('hero-cake-centerpiece');
  let toastTimer = null;

  const showToast = (message) => {
    if (!magicToast) return;
    if (message) {
      const toastText = magicToast.querySelector('.toast-text');
      if (toastText) toastText.textContent = message;
    }
    magicToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      magicToast.classList.remove('show');
    }, 4500);
  };

  const lightHeroCandle = () => {
    if (heroFlame) {
      heroFlame.classList.add('is-lit');
    }
    if (heroGlow) {
      heroGlow.classList.add('is-lit');
    }
  };

  // Keep the decorative sign's button-like behavior available to keyboard users.
  const magicSign = document.getElementById('magic-sign-badge');
  magicSign?.addEventListener('click', () => magicBtn?.click());
  magicSign?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      magicBtn?.click();
    }
  });

  // Also let tapping the cake centerpiece light it up directly
  if (heroCake) {
    const lightCake = () => {
      lightHeroCandle();
      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
        startBackgroundMusic();
      }
      if (window.particleEngine) {
        const rect = heroCake.getBoundingClientRect();
        window.particleEngine.burst(rect.left + rect.width / 2, rect.top + 30, 50);
      }
    };
    heroCake.addEventListener('click', lightCake);
    heroCake.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lightCake();
      }
    });
  }

  if (magicBtn) {
    magicBtn.addEventListener('click', () => {
      // 1. Ensure background music is on
      startBackgroundMusic();

      // 2. Light up the hero candle flame & warm glow!
      lightHeroCandle();

      // 3. Play magical chime chord
      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
      }

      // 4. Confetti & sparkle shower across hero and cake
      if (window.particleEngine) {
        if (heroCake) {
          const cakeRect = heroCake.getBoundingClientRect();
          window.particleEngine.burst(cakeRect.left + cakeRect.width / 2, cakeRect.top + 30, 65);
        }
        const rect = magicBtn.getBoundingClientRect();
        window.particleEngine.burst(rect.left + rect.width / 2, rect.top, 85);
        window.particleEngine.burst(window.innerWidth / 2, window.innerHeight * 0.35, 60);
      }

      // 5. Show celebratory toast
      showToast(`You brought the magic to life! Happy Birthday, ${currentName}! ✨🕯️`);
    });
  }

  // 5. Scroll-to-Surprise button
  const scrollSurpriseBtn = document.getElementById('btn-to-surprise');
  if (scrollSurpriseBtn) {
    scrollSurpriseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('surprise');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 6. IntersectionObserver for Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // 7. Full Experience Replay Handler
  const replayButtons = document.querySelectorAll('.replay-experience-trigger');
  replayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Reset mystery gifts
      document.querySelectorAll('.gift-box-wrapper').forEach(box => box.classList.remove('opened'));
      document.querySelectorAll('.mystery-reveal-card').forEach(card => card.classList.remove('visible'));

      // 2. Reseal main envelope
      document.getElementById('main-3d-envelope')?.classList.remove('is-unsealed');
      document.getElementById('envelope-letter-sheet')?.classList.remove('sheet-extracted');

      // 3. Reset hero candle
      const heroFlame = document.getElementById('hero-candle-flame');
      const heroGlow = document.getElementById('hero-cake-glow');
      heroFlame?.classList.remove('is-lit');
      heroGlow?.classList.remove('is-lit');

      // 4. Reset muffin candle
      const muffinFlame = document.getElementById('interactive-flame');
      const muffinReveal = document.getElementById('wish-reveal');
      const blowCandleBtn = document.getElementById('blow-candle-btn');
      const wishPrompt = document.querySelector('.wish-prompt');
      muffinFlame?.classList.remove('extinguished');
      muffinReveal?.classList.remove('show');
      if (blowCandleBtn) blowCandleBtn.style.display = 'inline-flex';
      if (wishPrompt) wishPrompt.textContent = 'Tap the flame or button below to blow out your candle ✨';

      // 5. Reset starry constellation
      if (typeof window.resetStarryConstellation === 'function') {
        window.resetStarryConstellation();
      } else {
        document.querySelectorAll('.clickable-star').forEach(s => s.classList.remove('star-discovered'));
      }
      const starryWishDisplay = document.getElementById('starry-wish-display');
      if (starryWishDisplay) {
        starryWishDisplay.innerHTML = `
          <div class="constellation-wish-card">
            <p style="font-size: 0.95rem; color: var(--text-plum-600); font-style: italic;">
              ✦ Touch any twinkling star in the midnight sky above to read its blessing for you.
            </p>
          </div>
        `;
      }
      const progressText = document.getElementById('stars-progress-tracker');
      if (progressText) progressText.textContent = 'Discovered: 0 / 7 Constellation Stars ✨';

      // 6. Scroll smoothly to hero
      const hero = document.getElementById('hero');
      hero?.scrollIntoView({ behavior: 'smooth' });

      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
      }

      showToast('Surprise journey reset! Enjoy every moment again ✨');
    });
  });
});
