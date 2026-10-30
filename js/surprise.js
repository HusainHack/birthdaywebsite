/**
 * surprise.js - Interactive 3D Gift Box Animation & Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  const giftBox = document.getElementById('gift-box');
  const surpriseCard = document.getElementById('surprise-card');
  const replayBtn = document.getElementById('replay-gift-btn');

  if (!giftBox || !surpriseCard) return;

  let isOpened = false;

  const openGift = () => {
    if (isOpened) return;
    isOpened = true;

    // 1. Mark box as opened (triggers 3D lid tilt & ribbon dissolve)
    giftBox.classList.add('opened');

    // 2. Play Audio chime
    if (window.soundEngine) {
      window.soundEngine.playGiftOpenChime();
    }

    // 3. Trigger Particle & Confetti Burst from box coordinates
    if (window.particleEngine) {
      const rect = giftBox.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 3;
      window.particleEngine.burst(originX, originY, 80);

      // Second wave of sparkles
      setTimeout(() => {
        window.particleEngine.burst(originX, originY - 40, 45);
      }, 250);
    }

    // 4. Reveal Letter Card smoothly after lid lifts
    setTimeout(() => {
      surpriseCard.classList.add('visible');
      surpriseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  };

  const resetGift = (e) => {
    if (e) e.stopPropagation();
    isOpened = false;

    // Hide letter first
    surpriseCard.classList.remove('visible');

    // Reset box lid
    setTimeout(() => {
      giftBox.classList.remove('opened');
      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
      }
    }, 300);
  };

  giftBox.addEventListener('click', openGift);
  if (replayBtn) {
    replayBtn.addEventListener('click', resetGift);
  }
});
