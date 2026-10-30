/**
 * gallery.js - Interactive Polaroid Scrapbook with Lightbox Navigation & Filters
 */

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const modalCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('modal-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  const cards = Array.from(document.querySelectorAll('.polaroid-card'));

  if (!modal || !cards.length) return;

  let currentIndex = 0;
  let visibleCards = [...cards];

  const updateModalContent = (index) => {
    if (index < 0) index = visibleCards.length - 1;
    if (index >= visibleCards.length) index = 0;
    currentIndex = index;

    const card = visibleCards[currentIndex];
    const img = card.querySelector('.polaroid-img');
    const title = card.querySelector('.polaroid-title');
    const text = card.querySelector('.polaroid-text');

    if (img && modalImg) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalImg.classList.toggle('photo-focus-lower', img.classList.contains('photo-focus-lower'));
    }
    if (title && modalTitle) {
      modalTitle.textContent = title.textContent;
    }
    if (text && modalDesc) {
      modalDesc.textContent = text.getAttribute('data-full') || text.textContent;
    }
    if (modalCounter) {
      modalCounter.textContent = `${currentIndex + 1} of ${visibleCards.length}`;
    }
  };

  const openLightbox = (card) => {
    const idx = visibleCards.indexOf(card);
    if (idx !== -1) {
      updateModalContent(idx);
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.soundEngine) {
      window.soundEngine.playSparkleChime();
    }
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => updateModalContent(currentIndex - 1));
  nextBtn?.addEventListener('click', () => updateModalContent(currentIndex + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateModalContent(currentIndex - 1);
    if (e.key === 'ArrowRight') updateModalContent(currentIndex + 1);
  });

  // Scrapbook category filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');

      const filter = btn.getAttribute('data-gallery-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      visibleCards = cards.filter(card => card.style.display !== 'none');
    });
  });
});
