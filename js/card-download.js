/**
 * card-download.js - Digital Birthday Card with Clipboard Copy & High-Res Image Download
 */

document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy-card-text-btn');
  const downloadBtn = document.getElementById('download-card-img-btn');
  const cardData = window.BIRTHDAY_DATA?.birthdayCard;
  const personalize = window.personalizeBirthdayText || (text => text);

  if (!cardData) return;

  // 1. Copy Birthday Wish to Clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const fullText = `${personalize(cardData.heading)}\n\n${personalize(cardData.message)}\n\n${personalize(cardData.signoff)}`;
      navigator.clipboard.writeText(fullText).then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>Copied to Clipboard! ✓</span>';
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
        }, 3000);
      }).catch(() => {
        alert("Copied to clipboard!");
      });

      if (window.soundEngine) {
        window.soundEngine.playBellTone(880, 0.4, 0.05);
      }
    });
  }

  // 2. High-Res Canvas Image Generator & Downloader
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Create high-res canvas (1200 x 800)
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      // Background Cream & Soft Blush Radial Gradient
      const bgGrad = ctx.createRadialGradient(600, 400, 50, 600, 400, 700);
      bgGrad.addColorStop(0, '#FFFDF9');
      bgGrad.addColorStop(0.6, '#FCF5F7');
      bgGrad.addColorStop(1, '#F7E7EC');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 800);

      // Outer & Inner Gold Borders
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, 1128, 728);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 48, 1104, 704);

      // Corner Accents
      const drawCorner = (x, y) => {
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(48, 48);
      drawCorner(1152, 48);
      drawCorner(48, 752);
      drawCorner(1152, 752);

      // Top Tag
      ctx.fillStyle = '#A88620';
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '3px';
      ctx.fillText('✦ A SPECIAL BIRTHDAY KEEPSAKE ✦', 600, 140);

      // Main Heading
      ctx.fillStyle = '#2D1A2E';
      ctx.font = 'bold 54px "Playfair Display", Georgia, serif';
      ctx.fillText(personalize(cardData.heading), 600, 220);

      // Decorative divider
      ctx.strokeStyle = '#E598AB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(480, 260);
      ctx.lineTo(720, 260);
      ctx.stroke();

      ctx.fillStyle = '#D4AF37';
      ctx.font = '18px serif';
      ctx.fillText('✨', 600, 266);

      // Body Message - Word Wrapped
      ctx.fillStyle = '#4A2E4B';
      ctx.font = 'italic 25px "Playfair Display", Georgia, serif';
      const maxWidth = 840;
      const lineHeight = 44;
      const words = cardData.message.split(' ');
      let line = '';
      let y = 340;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), 600, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 600, y);

      // Signoff
      ctx.fillStyle = '#B84D72';
      ctx.font = 'italic 34px "Great Vibes", cursive, Georgia, serif';
      ctx.fillText(personalize(cardData.signoff).replace(/\s*\n\s*/g, ' '), 600, y + 90);

      // Date & Year
      ctx.fillStyle = '#8E7092';
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(personalize(`Created with love • Celebrating ${window.BIRTHDAY_DATA.recipientName}`), 600, 720);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safeName = personalize(window.BIRTHDAY_DATA.recipientName).replace(/[^a-z0-9_-]+/gi, '-');
        a.download = `${safeName}-Birthday-Card.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.soundEngine) {
          window.soundEngine.playSparkleChime();
        }
        if (window.particleEngine) {
          const rect = downloadBtn.getBoundingClientRect();
          window.particleEngine.burst(rect.left + rect.width / 2, rect.top, 60);
        }
      }, 'image/png');
    });
  }
});
