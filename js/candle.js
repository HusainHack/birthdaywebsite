/**
 * candle.js - Interactive Candle Blowout & Birthday Wish
 */

document.addEventListener('DOMContentLoaded', () => {
  const candleStage = document.getElementById('candle-stage');
  const flame = document.getElementById('interactive-flame');
  const smoke = document.getElementById('smoke-puff');
  const wishReveal = document.getElementById('wish-reveal');
  const relightBtn = document.getElementById('relight-btn');
  const blowCandleBtn = document.getElementById('blow-candle-btn');
  const wishPrompt = document.querySelector('.wish-prompt');

  if (!candleStage || !flame) return;

  let isBlownOut = false;

  const blowOutCandle = (e) => {
    if (e) e.preventDefault();
    if (isBlownOut) return;
    isBlownOut = true;

    // 1. Extinguish flame
    flame.classList.add('extinguished');

    // 2. Trigger Smoke puff
    if (smoke) {
      smoke.classList.remove('smoke-active');
      void smoke.offsetWidth; // trigger reflow
      smoke.classList.add('smoke-active');
    }

    // 3. Audio effect (wind whoosh + dreamy bells)
    if (window.soundEngine) {
      window.soundEngine.playCandleBlow();
    }

    // 4. Confetti & Star sparkles burst
    if (window.particleEngine) {
      const rect = candleStage.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + 30;
      window.particleEngine.burst(originX, originY, 70);
    }

    // 5. Update prompt and hide blow button
    if (wishPrompt) {
      wishPrompt.innerHTML = '✨ <em>Your candle is blown out! Your wish has flown to the stars...</em>';
    }
    if (blowCandleBtn) {
      blowCandleBtn.style.display = 'none';
    }

    // 6. Reveal wish text
    if (wishReveal) {
      setTimeout(() => {
        wishReveal.classList.add('show');
        wishReveal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 400);
    }
  };

  const relightCandle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isBlownOut = false;

    flame.classList.remove('extinguished');
    if (smoke) smoke.classList.remove('smoke-active');
    if (wishReveal) wishReveal.classList.remove('show');
    if (blowCandleBtn) blowCandleBtn.style.display = 'inline-flex';
    if (wishPrompt) {
      wishPrompt.textContent = 'Tap the flame or button below to blow out your candle ✨';
    }

    if (window.soundEngine) {
      window.soundEngine.playSparkleChime();
    }
  };

  // Support both tap/click on stage, flame, and the button
  candleStage.addEventListener('click', blowOutCandle);
  flame.addEventListener('click', blowOutCandle);
  if (blowCandleBtn) {
    blowCandleBtn.addEventListener('click', blowOutCandle);
  }

  if (relightBtn) {
    relightBtn.addEventListener('click', relightCandle);
  }
});
