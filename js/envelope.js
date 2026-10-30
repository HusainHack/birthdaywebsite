/**
 * envelope.js - Animated 3D Envelopes for Birthday Letter and "Open When..." Notes
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Main 3D Animated Birthday Letter Envelope
  const mainEnvelope = document.getElementById('main-3d-envelope');
  const waxSeal = document.getElementById('letter-wax-seal');
  const letterSheet = document.getElementById('envelope-letter-sheet');
  const foldLetterBtn = document.getElementById('fold-letter-btn');

  if (mainEnvelope && waxSeal && letterSheet) {
    let isLetterOpen = false;

    const openLetterEnvelope = () => {
      if (isLetterOpen) return;
      isLetterOpen = true;

      // Flip flap open & unseal
      mainEnvelope.classList.add('is-unsealed');

      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
      }

      if (window.particleEngine) {
        const rect = waxSeal.getBoundingClientRect();
        window.particleEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
      }

      // Slide letter sheet out of pocket
      setTimeout(() => {
        letterSheet.classList.add('sheet-extracted');
        letterSheet.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 550);
    };

    const foldLetterEnvelope = (e) => {
      if (e) e.stopPropagation();
      isLetterOpen = false;

      letterSheet.classList.remove('sheet-extracted');

      setTimeout(() => {
        mainEnvelope.classList.remove('is-unsealed');
        if (window.soundEngine) {
          window.soundEngine.playBellTone(523.25, 0.4, 0.04);
        }
      }, 400);
    };

    waxSeal.addEventListener('click', openLetterEnvelope);
    waxSeal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLetterEnvelope();
      }
    });
    mainEnvelope.addEventListener('click', (e) => {
      if (!isLetterOpen && !e.target.closest('#fold-letter-btn')) {
        openLetterEnvelope();
      }
    });

    foldLetterBtn?.addEventListener('click', foldLetterEnvelope);
  }

  // 2. "Open When..." Section Envelopes
  const openWhenGrid = document.getElementById('open-when-grid');
  const openWhenModal = document.getElementById('open-when-modal');
  const modalIcon = document.getElementById('open-when-modal-icon');
  const modalTitle = document.getElementById('open-when-modal-title');
  const modalText = document.getElementById('open-when-modal-text');
  const modalClose = document.getElementById('open-when-modal-close');

  if (openWhenGrid) {
    const notes = window.BIRTHDAY_DATA?.openWhenNotes || [];

    openWhenGrid.innerHTML = notes.map((note) => `
      <div class="open-when-card" data-note-id="${note.id}" role="button" tabindex="0" aria-label="Open when ${note.trigger}">
        <div class="open-when-flap"></div>
        <div class="open-when-seal">${note.icon}</div>
        <div class="open-when-content-preview">
          <span class="open-when-tag">OPEN WHEN...</span>
          <h4 class="open-when-title">${note.trigger}</h4>
          <span class="open-when-hint">Tap to unseal 💌</span>
        </div>
      </div>
    `).join('');

    const openNote = (note) => {
      if (!openWhenModal) return;
      if (modalIcon) modalIcon.textContent = note.icon;
      if (modalTitle) modalTitle.textContent = note.title;
      if (modalText) modalText.textContent = note.content;

      openWhenModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
      }
    };

    const closeNoteModal = () => {
      if (!openWhenModal) return;
      openWhenModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    openWhenGrid.querySelectorAll('.open-when-card').forEach(card => {
      const noteId = card.getAttribute('data-note-id');
      const noteData = notes.find(n => n.id === noteId);

      card.addEventListener('click', () => {
        if (noteData) openNote(noteData);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (noteData) openNote(noteData);
        }
      });
    });

    modalClose?.addEventListener('click', closeNoteModal);
    openWhenModal?.addEventListener('click', (e) => {
      if (e.target === openWhenModal) {
        closeNoteModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && openWhenModal?.classList.contains('active')) {
        closeNoteModal();
      }
    });
  }
});
