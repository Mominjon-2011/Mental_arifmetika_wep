// audio.js - Web Audio API tovush effektlari va nutq sintezi
class SoundManager {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.speechEnabled = false;
        this.init();
    }

    init() {
        // Foydalanuvchi birinchi marta bosganda AudioContext yaratiladi
        const unlockAudio = () => {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('keydown', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleSpeech() {
        this.speechEnabled = !this.speechEnabled;
        return this.speechEnabled;
    }

    // Abakus munchoqlarining yog'och taqillashi (crisp wooden bead click)
    playBeadClick(isUpper = false, beadIndex = 0) {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Har xil munchoqlar uchun biroz farqli ton
        const baseFreq = isUpper ? 520 : (440 + beadIndex * 35);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

        // Yog'och rezonansi uchun filtr
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Abakusni tozalash tovushi (swipe / clear sound)
    playClearSound() {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const t = now + i * 0.03;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600 + i * 150, t);
            osc.frequency.exponentialRampToValueAtTime(200, t + 0.06);

            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.06);
        }
    }

    // To'g'ri javob - chiroyli quvnoq ohang (chime)
    playCorrect() {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const t = now + idx * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.3);
        });
    }

    // Noto'g'ri javob - yumshoq past tovush
    playWrong() {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(196, now); // G3
        osc.frequency.linearRampToValueAtTime(146.83, now + 0.22); // D3

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    // Sekundomer / Countdown chertish tovushi
    playTick() {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Flesh Anzan son chiqish tovushi (pop / beep)
    playPop() {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.06);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    // G'alaba / Yangi rekord tantanasi
    playFanfare() {
        if (!this.soundEnabled) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        const melody = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.12 }, // G5
            { f: 1046.50, d: 0.35 } // C6
        ];

        let t = ctx.currentTime;
        melody.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, t);

            gain.gain.setValueAtTime(0.24, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + note.d);
            t += note.d * 0.9;
        });
    }

    // Web Speech API orqali sonlarni talaffuz qilish
    speakNumber(num) {
        if (!this.speechEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // oldingi gapni to'xtatish
        const utterance = new SpeechSynthesisUtterance(String(num));
        utterance.rate = 1.3;
        utterance.pitch = 1.0;
        // O'zbek tili yoki umumiy mos til topish
        const voices = window.speechSynthesis.getVoices();
        const uzVoice = voices.find(v => v.lang.startsWith('uz') || v.lang.startsWith('tr') || v.lang.startsWith('ru') || v.lang.startsWith('en'));
        if (uzVoice) utterance.voice = uzVoice;
        window.speechSynthesis.speak(utterance);
    }
}

// Global tovush ob'ekti
const sound = new SoundManager();
