/**
 * compliments.js - Non-Repeating Compliment & Affirmation Generator (Shuffle Deck)
 */

document.addEventListener('DOMContentLoaded', () => {
  const drawBtn = document.getElementById('draw-compliment-btn');
  const cardBody = document.getElementById('compliment-text');
  const cardCounter = document.getElementById('compliment-counter');
  const cardContainer = document.getElementById('compliment-card-box');

  if (!drawBtn || !cardBody) return;

  const allCompliments = window.BIRTHDAY_DATA?.compliments || [];
  let availableDeck = [...allCompliments];
  let drawnCount = 0;

  // Shuffle array using Fisher-Yates
  const shuffleDeck = () => {
    availableDeck = [...allCompliments];
    for (let i = availableDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableDeck[i], availableDeck[j]] = [availableDeck[j], availableDeck[i]];
    }
  };

  shuffleDeck();

  const drawNextCompliment = () => {
    if (availableDeck.length === 0) {
      // All exhausted - celebrate and reset!
      cardBody.innerHTML = `
        <span style="display: block; font-size: 1.6rem; margin-bottom: 8px;">🌟</span>
        <strong>You've drawn all ${allCompliments.length} reasons!</strong><br>
        <span style="font-size: 0.95rem; opacity: 0.9;">Truthfully, there are endless more reasons why you are deeply valued, ${window.personalizeBirthdayHtml?.('Husaina') || 'Husaina'}.</span>
      `;
      if (cardCounter) cardCounter.textContent = `Completed all ${allCompliments.length}! (Reshuffling deck ✨)`;
      drawBtn.innerHTML = '<span>Reshuffle & Draw Again ✨</span>';

      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
      }
      if (window.particleEngine) {
        const rect = drawBtn.getBoundingClientRect();
        window.particleEngine.burst(rect.left + rect.width / 2, rect.top, 80);
      }

      shuffleDeck();
      drawnCount = 0;
      return;
    }

    const nextCompliment = availableDeck.pop();
    drawnCount++;

    // Card animation
    cardContainer?.classList.remove('card-pop');
    void cardContainer?.offsetWidth; // reflow
    cardContainer?.classList.add('card-pop');

    cardBody.textContent = `“${nextCompliment}”`;
    if (cardCounter) {
      cardCounter.textContent = `Quality #${drawnCount} • ${availableDeck.length} more in the jar`;
    }
    drawBtn.innerHTML = '<span>Draw Another Reason ✨</span>';

    if (window.soundEngine) {
      window.soundEngine.playBellTone(783.99, 0.45, 0.06);
    }

    if (window.particleEngine) {
      const rect = cardContainer.getBoundingClientRect();
      window.particleEngine.burst(rect.left + rect.width / 2, rect.top + 20, 25);
    }
  };

  drawBtn.addEventListener('click', drawNextCompliment);
});
