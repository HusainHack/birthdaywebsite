/**
 * easter-egg.js - Hidden Easter Egg & Secret VIP Surprise
 */

document.addEventListener('DOMContentLoaded', () => {
  const secretSparkle = document.querySelector('.nav-sparkle');
  const secretKey = document.getElementById('footer-secret-key');
  const easterModal = document.getElementById('easter-egg-modal');
  const easterClose = document.getElementById('easter-egg-close');
  const celebrateBtn = document.getElementById('easter-celebrate-btn');

  let sparkleClicks = 0;
  let clickTimer = null;

  const unlockEasterEgg = () => {
    if (!easterModal) return;

    easterModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.soundEngine) {
      window.soundEngine.playSparkleChime();
    }

    if (window.particleEngine) {
      window.particleEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 100);
    }
  };

  if (secretSparkle) {
    secretSparkle.style.cursor = 'pointer';
    secretSparkle.addEventListener('click', () => {
      sparkleClicks++;
      clearTimeout(clickTimer);

      if (window.soundEngine) {
        window.soundEngine.playBellTone(600 + (sparkleClicks * 120), 0.3, 0.05);
      }

      if (sparkleClicks >= 3) {
        sparkleClicks = 0;
        unlockEasterEgg();
      } else {
        clickTimer = setTimeout(() => {
          sparkleClicks = 0;
        }, 1500);
      }
    });
  }

  if (secretKey) {
    secretKey.addEventListener('click', unlockEasterEgg);
  }

  const closeEasterModal = () => {
    if (!easterModal) return;
    easterModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  easterClose?.addEventListener('click', closeEasterModal);
  celebrateBtn?.addEventListener('click', () => {
    if (window.particleEngine) {
      window.particleEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 90);
    }
    if (window.soundEngine) {
      window.soundEngine.playSparkleChime();
    }
    closeEasterModal();
  });

  easterModal?.addEventListener('click', (e) => {
    if (e.target === easterModal) {
      closeEasterModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && easterModal?.classList.contains('active')) {
      closeEasterModal();
    }
  });
});
