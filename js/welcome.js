/**
 * welcome.js - Animated Welcome Screen & Surprise Gate
 */

document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const enterBtn = document.getElementById('enter-surprise-btn');

  if (!welcomeScreen || !enterBtn) return;

  const enterExperience = () => {
    // 1. Start audio engine
    if (window.soundEngine) {
      window.soundEngine.startMusic();
      window.soundEngine.playSparkleChime();
    }

    // 2. Burst welcoming confetti
    if (window.particleEngine) {
      const rect = enterBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      window.particleEngine.burst(x, y, 75);
    }

    // 3. Fade out welcome screen
    welcomeScreen.classList.add('fade-out');

    setTimeout(() => {
      welcomeScreen.style.display = 'none';
      // Smooth scroll to top of hero
      const hero = document.getElementById('hero');
      hero?.scrollIntoView({ behavior: 'smooth' });
    }, 850);
  };

  enterBtn.addEventListener('click', enterExperience);
  enterBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      enterExperience();
    }
  });
});
