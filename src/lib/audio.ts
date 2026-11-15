// Web Audio API Synthesizer for Discord UI & Soundboard Sounds
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Discord Message Notification Sound
  playNotification() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.setValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Voice Join Sound
  playVoiceJoin() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const notes = [329.63, 440, 659.25]; // E4, A4, E5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.26);
    });
  }

  // Voice Leave Sound
  playVoiceLeave() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const notes = [659.25, 440, 329.63]; // E5, A4, E4
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.23);
    });
  }

  // Mute Sound
  playMute() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Unmute Sound
  playUnmute() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.09);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Super Reaction / Nitro Sparkle sound
  playSparkle() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.04);
      gain.gain.setValueAtTime(0, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.22);
    });
  }

  // Soundboard: Airhorn
  playAirhorn() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    // Classic triplet airhorn blasts
    const blasts = [0, 0.14, 0.28, 0.44];
    blasts.forEach((blastOffset) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(466.16, now + blastOffset); // Bb4
      osc2.frequency.setValueAtTime(470.0, now + blastOffset);

      gain.gain.setValueAtTime(0, now + blastOffset);
      gain.gain.linearRampToValueAtTime(0.18, now + blastOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + blastOffset + 0.16);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now + blastOffset);
      osc2.start(now + blastOffset);
      osc1.stop(now + blastOffset + 0.17);
      osc2.stop(now + blastOffset + 0.17);
    });
  }

  // Soundboard: Vine Boom
  playVineBoom() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.7);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  }

  // Soundboard: Quack
  playQuack() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const biquad = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.15);

    biquad.type = 'bandpass';
    biquad.frequency.setValueAtTime(900, now);
    biquad.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(biquad);
    biquad.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Soundboard: Metal Pipe
  playMetalPipe() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const freqs = [840, 1340, 1890, 2600, 3100];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f * 0.85, now + 0.5);

      gain.gain.setValueAtTime(0.08 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  // Soundboard: "Um, actually..." (Nerdy Signature Sound)
  playNerdAlert() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Quirky bouncy 8-bit sequence
    const notes = [587.33, 659.25, 783.99, 1046.50, 880.00]; // D5, E5, G5, C6, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.18);
    });
  }

  // Soundboard: Ba Dum Tss
  playBaDumTss() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    // Ba (snare 1)
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.frequency.setValueAtTime(160, now);
    g1.gain.setValueAtTime(0.2, now);
    g1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc1.connect(g1);
    g1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.09);

    // Dum (snare 2)
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.frequency.setValueAtTime(140, now + 0.12);
    g2.gain.setValueAtTime(0.22, now + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.23);

    // Tsss (cymbal splash)
    const osc3 = ctx.createOscillator();
    const g3 = ctx.createGain();
    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(5000, now + 0.26);
    g3.gain.setValueAtTime(0.18, now + 0.26);
    g3.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc3.connect(g3);
    g3.connect(ctx.destination);
    osc3.start(now + 0.26);
    osc3.stop(now + 0.65);
  }

  // Soundboard generic trigger
  playSound(key: string) {
    switch (key) {
      case 'airhorn':
        this.playAirhorn();
        break;
      case 'boom':
        this.playVineBoom();
        break;
      case 'quack':
        this.playQuack();
        break;
      case 'metal':
        this.playMetalPipe();
        break;
      case 'nerd':
        this.playNerdAlert();
        break;
      case 'badumtss':
        this.playBaDumTss();
        break;
      case 'sparkle':
        this.playSparkle();
        break;
      default:
        this.playNotification();
        break;
    }
  }
}

export const soundManager = new SoundManager();
