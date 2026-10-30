/**
 * gifts.js - Mystery Gift Section with Three Clickable 3D Gift Boxes
 */

document.addEventListener('DOMContentLoaded', () => {
  const giftsContainer = document.getElementById('mystery-gifts-grid');
  if (!giftsContainer) return;

  const giftsData = window.BIRTHDAY_DATA?.mysteryGifts || [];

  giftsContainer.innerHTML = giftsData.map((gift, index) => `
    <div class="mystery-gift-col" id="gift-col-${gift.id}">
      <div class="gift-box-wrapper ${gift.boxClass}" id="${gift.id}" role="button" tabindex="0" aria-label="Open ${gift.title}">
        <div class="gift-box-shadow"></div>
        <div class="gift-box-base">
          <div class="ribbon-vertical ${gift.ribbonClass}"></div>
          <div class="ribbon-horizontal ${gift.ribbonClass}"></div>
        </div>
        <div class="gift-box-lid">
          <div class="lid-ribbon-v ${gift.ribbonClass}"></div>
          <div class="lid-ribbon-h ${gift.ribbonClass}"></div>
          <div class="gift-bow">
            <div class="bow-loop-left"></div>
            <div class="bow-loop-right"></div>
            <div class="bow-knot"></div>
          </div>
        </div>
      </div>

      <div class="gift-hint-label">
        <span class="gift-tag-badge">${gift.tag}</span>
        <h4 class="gift-tag-title">${gift.title}</h4>
        <span class="gift-tap-action">Tap to unwrap ✨</span>
      </div>

      <!-- Surprise Reveal Card -->
      <div class="mystery-reveal-card" id="reveal-${gift.id}" aria-hidden="true">
        <div class="reveal-badge-icon">${gift.icon}</div>
        <h3 class="reveal-card-title">${gift.revealTitle}</h3>
        
        ${gift.isCoupon ? `
          <div class="golden-ticket-card">
            <div class="ticket-notch-top"></div>
            <div class="ticket-notch-bottom"></div>
            <div class="ticket-header">✨ GOLDEN BIRTHDAY PASS ✨</div>
          <div class="ticket-body">${(window.personalizeBirthdayHtml?.(gift.revealBody) || gift.revealBody).replace(/\n/g, '<br>')}</div>
            <div class="ticket-code">PROMO: <strong>${gift.couponCode}</strong></div>
            <button class="btn btn-primary stamp-btn" id="stamp-coupon-btn" style="margin-top: 14px; padding: 8px 20px; font-size: 0.85rem;">
              <span>Redeem & Stamp Ticket 🎟️</span>
            </button>
            <div class="stamp-verified" id="stamp-verified-badge" style="display: none;">✓ REDEEMED FOR ${window.personalizeBirthdayHtml?.(window.BIRTHDAY_DATA?.recipientName || 'Husaina') || 'Husaina'}</div>
          </div>
        ` : `
          <p class="reveal-card-body">${gift.revealBody.replace(/\n/g, '<br>')}</p>
        `}

        ${gift.isMelodyAction ? `
          <div style="margin: 16px 0;">
            <button class="btn btn-primary" id="gift-play-melody-btn" style="padding: 10px 22px; font-size: 0.9rem;">
              <span>${gift.actionText}</span>
            </button>
          </div>
        ` : ''}

        <div class="reveal-signoff">${gift.signoff}</div>

        <button class="surprise-replay-btn close-gift-btn" data-target="${gift.id}">
          <span>↺</span> Pack Box Back Up
        </button>
      </div>
    </div>
  `).join('');

  // Add click handlers
  giftsData.forEach(gift => {
    const box = document.getElementById(gift.id);
    const card = document.getElementById(`reveal-${gift.id}`);
    const closeBtn = card.querySelector('.close-gift-btn');

    const openBox = () => {
      if (box.classList.contains('opened')) return;
      box.classList.add('opened');

      if (window.soundEngine) {
        window.soundEngine.playGiftOpenChime();
      }

      if (window.particleEngine) {
        const rect = box.getBoundingClientRect();
        window.particleEngine.burst(rect.left + rect.width / 2, rect.top + 30, 65);
      }

      setTimeout(() => {
        card.classList.add('visible');
        card.setAttribute('aria-hidden', 'false');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 450);
    };

    const closeBox = (e) => {
      if (e) e.stopPropagation();
      card.classList.remove('visible');
      card.setAttribute('aria-hidden', 'true');

      setTimeout(() => {
        box.classList.remove('opened');
        if (window.soundEngine) {
          window.soundEngine.playBellTone(523.25, 0.4, 0.05);
        }
      }, 250);
    };

    box.addEventListener('click', openBox);
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBox();
      }
    });

    closeBtn?.addEventListener('click', closeBox);
  });

  // Special coupon stamp action
  const stampBtn = document.getElementById('stamp-coupon-btn');
  const stampBadge = document.getElementById('stamp-verified-badge');
  if (stampBtn && stampBadge) {
    stampBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stampBtn.style.display = 'none';
      stampBadge.style.display = 'inline-block';
      stampBadge.classList.add('stamp-animation');
      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
      }
      if (window.particleEngine) {
        const rect = stampBadge.getBoundingClientRect();
        window.particleEngine.burst(rect.left + rect.width / 2, rect.top, 50);
      }
    });
  }

  // Melody action button
  const melodyBtn = document.getElementById('gift-play-melody-btn');
  if (melodyBtn) {
    melodyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.soundEngine) {
        window.soundEngine.startMusic();
        melodyBtn.innerHTML = '<span>Playing Harmonious Melody 🎵</span>';
      }
    });
  }
});
