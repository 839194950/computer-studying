/**
 * 用 Web Audio 现场合成的提示音，不需要任何音频文件。
 * 浏览器不支持或被策略拦下时静默跳过。
 */
export type SoundName = 'correct' | 'wrong' | 'finish' | 'step';

type Note = [freq: number, start: number, length: number];

const SCORES: Record<SoundName, { wave: OscillatorType; gain: number; notes: Note[] }> = {
  correct: { wave: 'triangle', gain: 0.18, notes: [[880, 0, 0.12], [1318.5, 0.09, 0.22]] },
  wrong: { wave: 'square', gain: 0.07, notes: [[220, 0, 0.14], [164.8, 0.12, 0.26]] },
  finish: {
    wave: 'triangle',
    gain: 0.16,
    notes: [[523.3, 0, 0.14], [659.3, 0.12, 0.14], [784, 0.24, 0.14], [1046.5, 0.36, 0.4]],
  },
  step: { wave: 'sine', gain: 0.08, notes: [[660, 0, 0.07]] },
};

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function playSound(name: SoundName, enabled = true): void {
  if (!enabled) return;
  try {
    const ac = context();
    if (!ac) return;
    const { wave, gain, notes } = SCORES[name];
    const t0 = ac.currentTime + 0.01;
    for (const [freq, start, length] of notes) {
      const osc = ac.createOscillator();
      const amp = ac.createGain();
      osc.type = wave;
      osc.frequency.value = freq;
      amp.gain.setValueAtTime(0, t0 + start);
      amp.gain.linearRampToValueAtTime(gain, t0 + start + 0.015);
      amp.gain.exponentialRampToValueAtTime(0.0001, t0 + start + length);
      osc.connect(amp).connect(ac.destination);
      osc.start(t0 + start);
      osc.stop(t0 + start + length + 0.02);
    }
  } catch {
    // 声音只是锦上添花，失败不影响学习
  }
}

/** 手机上答错时轻震一下。 */
export function buzz(enabled = true): void {
  if (!enabled) return;
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(60);
  }
}
