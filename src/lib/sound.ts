let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  startOffset = 0,
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, ctx.currentTime + startOffset);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startOffset + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration);
}

export type SoundType = 'set-complete' | 'rest-end' | 'exercise-transition' | 'workout-complete';

export function playSound(type: SoundType, volume = 0.5): void {
  if (volume <= 0) return;
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const vol = Math.min(volume, 1) * 0.4;

  switch (type) {
    case 'set-complete':
      playTone(ctx, 660, 0.15, vol);
      break;
    case 'rest-end':
      playTone(ctx, 880, 0.12, vol);
      playTone(ctx, 880, 0.12, vol, 0.15);
      break;
    case 'exercise-transition':
      playTone(ctx, 523, 0.12, vol);
      playTone(ctx, 659, 0.12, vol, 0.12);
      playTone(ctx, 784, 0.18, vol, 0.24);
      break;
    case 'workout-complete':
      playTone(ctx, 523, 0.15, vol);
      playTone(ctx, 659, 0.15, vol, 0.15);
      playTone(ctx, 784, 0.15, vol, 0.3);
      playTone(ctx, 1047, 0.3, vol, 0.45);
      break;
  }
}
