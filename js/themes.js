/**
 * themes.js - Theme Switcher (Sakura, Lavender, Midnight, Strawberry)
 */

document.addEventListener('DOMContentLoaded', () => {
  const themeButtons = document.querySelectorAll('[data-set-theme]');
  const defaultTheme = window.BIRTHDAY_DATA?.defaultTheme || 'sakura';
  const savedTheme = localStorage.getItem('birthday_theme') || defaultTheme;

  const setTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('birthday_theme', themeName);

    themeButtons.forEach(btn => {
      const isSelected = btn.getAttribute('data-set-theme') === themeName;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      btn.classList.toggle('active-theme', isSelected);
    });

    if (window.soundEngine) {
      window.soundEngine.playBellTone(659.25, 0.4, 0.04);
    }
  };

  // Initialize
  setTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-set-theme');
      setTheme(theme);
    });
  });
});
