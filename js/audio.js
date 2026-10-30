/**
 * audio.js - Web Audio API Procedural Synthesizer
 * No external files required. Works 100% offline, crystal clear and reliable.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.musicStep = 0;

    // Music Box Note Frequencies for a gentle celebratory music box lullaby
    // (Frequencies in Hz: C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, G5)
    this.melody = [
      { note: 523.25, dur: 0.35, pause: 0.4 }, // C5
      { note: 523.25, dur: 0.35, pause: 0.4 }, // C5
      { note: 587.33, dur: 0.6, pause: 0.7 },  // D5
      { note: 523.25, dur: 0.6, pause: 0.7 },  // C5
      { note: 698.46, dur: 0.6, pause: 0.7 },  // F5
      { note: 659.25, dur: 1.1, pause: 1.2 },  // E5
      
      { note: 523.25, dur: 0.35, pause: 0.4 }, // C5
      { note: 523.25, dur: 0.35, pause: 0.4 }, // C5
      { note: 587.33, dur: 0.6, pause: 0.7 },  // D5
      { note: 523.25, dur: 0.6, pause: 0.7 },  // C5
      { note: 783.99, dur: 0.6, pause: 0.7 },  // G5
      { note: 698.46, dur: 1.2, pause: 1.3 },  // F5

      { note: 523.25, dur: 0.35, pause: 0.4 }, // C5
      { note: 523.25, dur: 0.35, pause: 0.4 }, // C5
      { note: 1046.50, dur: 0.6, pause: 0.7 }, // C6
      { note: 880.00, dur: 0.6, pause: 0.7 },  // A5
      { note: 698.46, dur: 0.6, pause: 0.7 },  // F5
      { note: 659.25, dur: 0.6, pause: 0.7 },  // E5
      { note: 587.33, dur: 0.9, pause: 1.0 },  // D5

      { note: 932.33, dur: 0.35, pause: 0.4 }, // Bb5
      { note: 932.33, dur: 0.35, pause: 0.4 }, // Bb5
      { note: 880.00, dur: 0.6, pause: 0.7 },  // A5
      { note: 698.46, dur: 0.6, pause: 0.7 },  // F5
      { note: 783.99, dur: 0.6, pause: 0.7 },  // G5
      { note: 698.46, dur: 1.6, pause: 2.2 }   // F5
    ];
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single soft music box chime note
  playBellTone(freq, duration = 0.8, volume = 0.12) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Soft attack, crystalline decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // Magic Sparkle Chord (Pentatonic sweep)
  playSparkleChime() {
    this.ensureContext();
    const notes = [587.33, 659.25, 880.00, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBellTone(freq, 1.2, 0.14);
      }, idx * 70);
    });
  }

  // Gift Box Open Sound (Harmonic ascending chime)
  playGiftOpenChime() {
    this.ensureContext();
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBellTone(freq, 1.4, 0.15);
      }, idx * 90);
    });
  }

  // Soft Firework Pop & Twinkle
  playFireworkPop() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      this.playBellTone(800 + Math.random() * 400, 0.6, 0.05);
    } catch(e) {}
  }

  // Soft Candle Extinguish / Wind Whoosh
  playCandleBlow() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.5);

    // Followed by a gentle dreamy bell
    setTimeout(() => {
      this.playBellTone(880, 1.5, 0.12);
      this.playBellTone(1174.66, 1.8, 0.10);
    }, 450);
  }

  // Ambient Music Box Play/Stop Toggle
  toggleMusic(buttonEl) {
    this.ensureContext();

    if (this.isPlayingMusic) {
      this.stopMusic(buttonEl);
    } else {
      this.startMusic(buttonEl);
    }
  }

  startMusic(buttonEl) {
    if (this.isPlayingMusic) return;
    this.ensureContext();
    this.isPlayingMusic = true;
    this.musicStep = 0;
    const btn = buttonEl || document.getElementById('audio-toggle-btn');
    if (btn) {
      btn.classList.add('audio-playing');
      btn.setAttribute('aria-label', 'Pause Music');
    }

    const playNext = () => {
      if (!this.isPlayingMusic) return;
      const current = this.melody[this.musicStep];
      // Keep volume low and gentle for ambient background (0.038)
      this.playBellTone(current.note, current.dur * 1.8, 0.038);

      this.musicStep = (this.musicStep + 1) % this.melody.length;
      this.musicTimer = setTimeout(playNext, current.pause * 1000);
    };

    playNext();
  }

  stopMusic(buttonEl) {
    this.isPlayingMusic = false;
    clearTimeout(this.musicTimer);
    const btn = buttonEl || document.getElementById('audio-toggle-btn');
    if (btn) {
      btn.classList.remove('audio-playing');
      btn.setAttribute('aria-label', 'Play Music');
    }
  }
}

// Global instance
window.soundEngine = new SoundEngine();
