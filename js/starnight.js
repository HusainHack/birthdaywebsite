/**
 * starnight.js - Dreamy Starry-Night Constellation in the shape of 'H'
 * Premium interactive H-shaped constellation with thin SVG golden strokes,
 * progressive segment illumination, traveling light pulses, and celebratory finale.
 */

document.addEventListener('DOMContentLoaded', () => {
  const skyContainer = document.getElementById('starry-sky-container');
  const wishDisplay = document.getElementById('starry-wish-display');
  const progressText = document.getElementById('stars-progress-tracker');

  if (!skyContainer) return;

  const starWishes = window.BIRTHDAY_DATA?.starWishes || [];
  const discoveredStars = new Set();
  let celebrated = false;

  // The 6 exact line segments that form the capital letter 'H'
  // 1. Left top → left middle (Star 1 → Star 2)
  // 2. Left middle → left bottom (Star 2 → Star 3)
  // 3. Right top → right middle (Star 4 → Star 5)
  // 4. Right middle → right bottom (Star 5 → Star 6)
  // 5. Left middle → center (Star 2 → Star 7)
  // 6. Center → right middle (Star 7 → Star 5)
  const CONSTELLATION_SEGMENTS = [
    { id: "left-top",     start: "star-1", end: "star-2" },
    { id: "left-bottom",  start: "star-2", end: "star-3" },
    { id: "right-top",    start: "star-4", end: "star-5" },
    { id: "right-bottom", start: "star-5", end: "star-6" },
    { id: "cross-left",   start: "star-2", end: "star-7" },
    { id: "cross-right",  start: "star-7", end: "star-5" }
  ];

  const getStarById = (id) => starWishes.find(s => s.id === id);

  // Find all segments attached to a given star
  const getAttachedSegments = (starId) => {
    return CONSTELLATION_SEGMENTS.filter(seg => seg.start === starId || seg.end === starId);
  };

  const updateProgress = () => {
    if (!progressText) return;
    if (discoveredStars.size === starWishes.length) {
      progressText.innerHTML = `<strong>✨ Golden 'H' Constellation Fully Formed! (7 / 7 Stars Connected) ✨</strong>`;
    } else {
      progressText.textContent = `Discovered: ${discoveredStars.size} / ${starWishes.length} Constellation Stars ✨`;
    }
  };

  // Launch a traveling golden spark along an attached segment
  const launchTravelingSpark = (fromStar, toStar) => {
    const sparksGroup = document.getElementById('constellation-sparks-group');
    if (!sparksGroup || !fromStar || !toStar) return;

    const spark = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    spark.setAttribute('x1', `${fromStar.coord.x}`);
    spark.setAttribute('y1', `${fromStar.coord.y}`);
    spark.setAttribute('x2', `${toStar.coord.x}`);
    spark.setAttribute('y2', `${toStar.coord.y}`);
    spark.setAttribute('pathLength', '100');
    spark.setAttribute('class', 'traveling-spark');

    sparksGroup.appendChild(spark);

    setTimeout(() => {
      if (spark.parentNode) {
        spark.parentNode.removeChild(spark);
      }
    }, 850);
  };

  // Check and illuminate a segment if both endpoints are discovered
  const checkAndIlluminateSegment = (seg, animateDirectionFrom = null) => {
    const segEl = document.getElementById(`seg-${seg.id}`);
    if (!segEl) return;

    const bothDiscovered = discoveredStars.has(seg.start) && discoveredStars.has(seg.end);

    if (bothDiscovered && !segEl.classList.contains('is-illuminated')) {
      // If we know which star just triggered it, orient the draw stroke accordingly
      if (animateDirectionFrom) {
        const coreLine = segEl.querySelector('.seg-core');
        const startStar = getStarById(seg.start);
        const endStar = getStarById(seg.end);

        if (coreLine && startStar && endStar) {
          if (animateDirectionFrom === seg.end) {
            // Draw from end toward start
            coreLine.setAttribute('x1', `${endStar.coord.x}`);
            coreLine.setAttribute('y1', `${endStar.coord.y}`);
            coreLine.setAttribute('x2', `${startStar.coord.x}`);
            coreLine.setAttribute('y2', `${startStar.coord.y}`);
          } else {
            // Draw from start toward end
            coreLine.setAttribute('x1', `${startStar.coord.x}`);
            coreLine.setAttribute('y1', `${startStar.coord.y}`);
            coreLine.setAttribute('x2', `${endStar.coord.x}`);
            coreLine.setAttribute('y2', `${endStar.coord.y}`);
          }
        }
      }

      segEl.classList.add('is-illuminated');
    }
  };

  const triggerCelebration = () => {
    if (celebrated) return;
    celebrated = true;

    // Ensure all 6 segments are visually illuminated
    CONSTELLATION_SEGMENTS.forEach(seg => {
      const segEl = document.getElementById(`seg-${seg.id}`);
      if (segEl) segEl.classList.add('is-illuminated');
    });

    skyContainer.classList.add('constellation-h-completed');
    updateProgress();

    setTimeout(() => {
      if (wishDisplay) {
        wishDisplay.innerHTML = `
          <div class="constellation-complete-toast">
            <span style="font-size: 2.2rem; display: block; margin-bottom: 6px; color: var(--gold-primary);">✨ ℍ ✨</span>
            <strong style="font-size: 1.2rem; color: var(--text-plum-900);">The Golden 'H' Constellation is Complete!</strong><br>
            <span style="color: var(--text-plum-800); line-height: 1.6; display: block; margin-top: 8px;">
              All seven celestial stars have united to illuminate your initial across the heavens. May your path always be guided by joy, peace, and starlight, ${window.personalizeBirthdayHtml?.('Husaina') || 'Husaina'}.
            </span>
          </div>
        `;
        wishDisplay.classList.remove('wish-pop');
        void wishDisplay.offsetWidth;
        wishDisplay.classList.add('wish-pop');
      }

      if (window.soundEngine) {
        window.soundEngine.playSparkleChime();
      }

      if (window.particleEngine) {
        window.particleEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 90);
      }

      if (typeof window.triggerBirthdayFireworks === 'function') {
        window.triggerBirthdayFireworks();
      }
    }, 500);
  };

  const renderSky = () => {
    discoveredStars.clear();
    celebrated = false;
    skyContainer.classList.remove('constellation-h-completed');

    // Generate SVG markup for the 6 connecting segments (without background dotted lines)
    const segmentsMarkup = CONSTELLATION_SEGMENTS.map(seg => {
      const startStar = getStarById(seg.start);
      const endStar = getStarById(seg.end);
      if (!startStar || !endStar) return '';

      return `
        <g class="constellation-segment" id="seg-${seg.id}" data-start="${seg.start}" data-end="${seg.end}">
          <!-- Soft Warm Golden Glow Underlay -->
          <line class="seg-glow" 
                x1="${startStar.coord.x}" y1="${startStar.coord.y}" 
                x2="${endStar.coord.x}" y2="${endStar.coord.y}" />
          <!-- Defined Warm Deep Golden Core Beam -->
          <line class="seg-core" 
                x1="${startStar.coord.x}" y1="${startStar.coord.y}" 
                x2="${endStar.coord.x}" y2="${endStar.coord.y}" 
                pathLength="100" />
        </g>
      `;
    }).join('');

    // Generate HTML for the 7 interactive stars with collision-free label placements
    const starsMarkup = starWishes.map(star => `
      <div class="clickable-star star-pillar-${star.pillar}" id="${star.id}" 
           style="left: ${star.coord.x}%; top: ${star.coord.y}%;" 
           role="button" tabindex="0" aria-label="Discover ${star.name}">
        <div class="star-halo"></div>
        <div class="star-core">✦</div>
        <span class="star-label">${star.name}</span>
      </div>
    `).join('');

    skyContainer.innerHTML = `
      <svg class="constellation-svg" id="constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="h-gold-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <!-- Rich Warm Gold Gradient (Deeper golden tone after formation) -->
          <linearGradient id="gold-beam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E5A620" />
            <stop offset="50%" stop-color="#D4941A" />
            <stop offset="100%" stop-color="#B87B0E" />
          </linearGradient>
        </defs>

        <g id="constellation-segments-group">
          ${segmentsMarkup}
        </g>
        <g id="constellation-sparks-group"></g>
      </svg>
      ${starsMarkup}
    `;

    bindStarInteractions();
    updateProgress();
  };

  const bindStarInteractions = () => {
    starWishes.forEach(star => {
      const starEl = document.getElementById(star.id);
      if (!starEl) return;

      const onStarSelected = () => {
        const isNewDiscovery = !discoveredStars.has(star.id);

        if (isNewDiscovery) {
          discoveredStars.add(star.id);
          starEl.classList.add('star-discovered');

          // Audio bell tone with ascending pitch per discovery
          if (window.soundEngine) {
            window.soundEngine.playBellTone(900 + (discoveredStars.size * 70), 1.2, 0.09);
          }

          // Gentle starlight burst from star center
          if (window.particleEngine) {
            const rect = starEl.getBoundingClientRect();
            window.particleEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
          }

          // Process attached segments
          const attachedSegments = getAttachedSegments(star.id);
          attachedSegments.forEach(seg => {
            const neighborId = seg.start === star.id ? seg.end : seg.start;
            const neighborStar = getStarById(neighborId);

            // 1. Send traveling starlight pulse toward neighbor
            if (neighborStar) {
              launchTravelingSpark(star, neighborStar);
            }

            // 2. If neighbor is already discovered, illuminate this connection fully!
            if (discoveredStars.has(neighborId)) {
              checkAndIlluminateSegment(seg, star.id);
            }
          });

          updateProgress();

          // Check for final completion of the entire 'H'
          if (discoveredStars.size === starWishes.length) {
            triggerCelebration();
          }
        } else {
          // Already discovered: subtle pulse & gentle audio chime
          if (window.soundEngine) {
            window.soundEngine.playBellTone(1050, 0.8, 0.04);
          }
        }

        // Show star's personal blessing quote in card
        if (wishDisplay) {
          wishDisplay.innerHTML = `
            <div class="constellation-wish-card">
              <span class="constellation-star-badge">✦ ${star.name} ✦</span>
              <p class="constellation-wish-quote">“${star.wish}”</p>
            </div>
          `;
          wishDisplay.classList.remove('wish-pop');
          void wishDisplay.offsetWidth;
          wishDisplay.classList.add('wish-pop');
        }
      };

      starEl.addEventListener('click', onStarSelected);
      starEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onStarSelected();
        }
      });
    });
  };

  renderSky();

  // Expose reset handler for the global Replay Experience button
  window.resetStarryConstellation = renderSky;
});
