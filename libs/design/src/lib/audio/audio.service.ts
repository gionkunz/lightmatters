import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { SOUND_PRESETS } from './sound-presets';
import type { SoundPlayOptions, SoundType } from './sound-types';

const STORAGE_KEY = 'lm-audio-muted';
const BG_MUSIC_PATH = '/bg-music.mp3';
const BG_GAIN_LEVEL = 0.06;
/** Global multiplier for synthesized effect voices (timeline + direct play). */
const EFFECT_GAIN = 2.25;
const WET_GAIN_LEVEL = 0.4;
const DRY_GAIN_LEVEL = 1;
const MUTE_RAMP_S = 0.05;
const MAX_CONCURRENT_VOICES = 8;
const IR_DURATION_S = 4.5;
const IR_DECAY_EXPONENT = 1.65;
/** Sidechain duck: bg level multiplier when an effect fires (1 = no duck). */
const SIDECHAIN_DEPTH = 0.42;
const SIDECHAIN_ATTACK_S = 0.025;
const SIDECHAIN_RELEASE_S = 0.65;

interface VoiceNodes {
  oscillator: OscillatorNode;
  envelope: GainNode;
  panner: StereoPannerNode;
}

/**
 * Root Web Audio graph: ambient bed, synthesized effect voices, compressor,
 * and parallel convolution reverb. Guarded for SSR/SSG.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);

  readonly muted = signal(false);

  #context: AudioContext | null = null;
  #busGain: GainNode | null = null;
  #masterGain: GainNode | null = null;
  #bgGain: GainNode | null = null;
  #bgSidechainGain: GainNode | null = null;
  #bgElement: HTMLAudioElement | null = null;
  #bgStarted = false;
  #graphBuilt = false;
  #gestureListenersActive = false;
  #activeVoices: VoiceNodes[] = [];
  readonly #gestureHandler = (event: Event): void => {
    if ('isTrusted' in event && !event.isTrusted) {
      return;
    }
    void this.unlockFromUserGesture().then((unlocked) => {
      if (unlocked) {
        this.#removeGestureListeners();
      }
    });
  };

  constructor() {
    if (!isPlatformBrowser(this.#platformId)) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.muted.set(stored === 'true');
    this.#registerGestureListener();
  }

  toggle(): void {
    this.setMuted(!this.muted());
  }

  setMuted(value: boolean): void {
    this.muted.set(value);

    if (isPlatformBrowser(this.#platformId)) {
      localStorage.setItem(STORAGE_KEY, String(value));
    }

    this.#applyMuteRamp(value);
  }

  play(type: SoundType, options: SoundPlayOptions = {}): void {
    if (!isPlatformBrowser(this.#platformId) || this.muted()) {
      return;
    }

    if (!this.#isAudioRunning()) {
      return;
    }

    const ctx = this.#context;
    if (!ctx || !this.#busGain) {
      return;
    }

    const recipe = SOUND_PRESETS[type];
    if (!recipe) {
      return;
    }

    while (this.#activeVoices.length >= MAX_CONCURRENT_VOICES) {
      const oldest = this.#activeVoices.shift();
      if (oldest) {
        this.#disconnectVoice(oldest);
      }
    }

    const volume = options.volume ?? 1;
    const pan = Math.max(-1, Math.min(1, options.pan ?? 0));
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    oscillator.type = recipe.oscillatorType;
    oscillator.frequency.setValueAtTime(recipe.startFreq, now);
    if (recipe.startFreq !== recipe.endFreq) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(1, recipe.endFreq),
        now + recipe.duration * 0.85,
      );
    }

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(
      recipe.peak * volume * EFFECT_GAIN,
      now + recipe.attack,
    );
    envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      now + recipe.attack + recipe.decay,
    );

    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, now);

    oscillator.connect(envelope);
    envelope.connect(panner);
    panner.connect(this.#busGain);

    const voice: VoiceNodes = { oscillator, envelope, panner };
    this.#activeVoices.push(voice);

    oscillator.onended = () => {
      this.#disconnectVoice(voice);
    };

    oscillator.start(now);
    oscillator.stop(now + recipe.duration);
    this.#triggerSidechainDuck(now);
  }

  /** Resume the audio context and start the ambient bed after a user gesture. */
  async unlockFromUserGesture(): Promise<boolean> {
    const ctx = this.#ensureContext();
    if (!ctx) {
      return false;
    }

    this.#buildGraph(ctx);

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }

    if (ctx.state !== 'running') {
      return false;
    }

    if (!this.muted() && !this.#bgStarted) {
      await this.#startBackgroundMusic();
    }

    return true;
  }

  #registerGestureListener(): void {
    if (this.#gestureListenersActive) {
      return;
    }

    window.addEventListener('pointerdown', this.#gestureHandler, {
      capture: true,
    });
    window.addEventListener('keydown', this.#gestureHandler, { capture: true });
    this.#gestureListenersActive = true;
  }

  #removeGestureListeners(): void {
    if (!this.#gestureListenersActive) {
      return;
    }

    window.removeEventListener('pointerdown', this.#gestureHandler, {
      capture: true,
    });
    window.removeEventListener('keydown', this.#gestureHandler, {
      capture: true,
    });
    this.#gestureListenersActive = false;
  }

  #isAudioRunning(): boolean {
    return this.#context?.state === 'running' && this.#graphBuilt;
  }

  #ensureContext(): AudioContext | null {
    if (!isPlatformBrowser(this.#platformId)) {
      return null;
    }

    if (!this.#context) {
      const AudioContextCtor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextCtor) {
        return null;
      }
      this.#context = new AudioContextCtor();
    }

    return this.#context;
  }

  #buildGraph(ctx: AudioContext): void {
    if (this.#graphBuilt) {
      return;
    }

    this.#busGain = ctx.createGain();
    this.#busGain.gain.value = 1;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    const dryGain = ctx.createGain();
    dryGain.gain.value = DRY_GAIN_LEVEL;

    const wetGain = ctx.createGain();
    wetGain.gain.value = WET_GAIN_LEVEL;

    const convolver = ctx.createConvolver();
    convolver.buffer = this.#createImpulseResponse(ctx);
    convolver.normalize = true;

    this.#masterGain = ctx.createGain();
    this.#masterGain.gain.value = this.muted() ? 0 : 1;

    this.#bgGain = ctx.createGain();
    this.#bgGain.gain.value = BG_GAIN_LEVEL;

    this.#bgSidechainGain = ctx.createGain();
    this.#bgSidechainGain.gain.value = 1;

    this.#busGain.connect(compressor);
    compressor.connect(dryGain);
    compressor.connect(convolver);
    convolver.connect(wetGain);
    dryGain.connect(this.#masterGain);
    wetGain.connect(this.#masterGain);
    this.#masterGain.connect(ctx.destination);

    this.#bgElement = this.#document.createElement('audio');
    this.#bgElement.src = BG_MUSIC_PATH;
    this.#bgElement.loop = true;
    this.#bgElement.preload = 'auto';
    this.#bgElement.style.display = 'none';
    this.#document.body.appendChild(this.#bgElement);

    const bgSource = ctx.createMediaElementSource(this.#bgElement);
    bgSource.connect(this.#bgGain);
    this.#bgGain.connect(this.#bgSidechainGain);
    this.#bgSidechainGain.connect(this.#busGain);

    this.#graphBuilt = true;
    this.#applyMuteRamp(this.muted());
  }

  #createImpulseResponse(ctx: AudioContext): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * IR_DURATION_S);
    const buffer = ctx.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const t = i / length;
        const decay = Math.pow(1 - t, IR_DECAY_EXPONENT);
        const noise = (Math.random() * 2 - 1) * decay;
        data[i] = channel === 0 ? noise : noise * (0.85 + Math.random() * 0.3);
      }
    }

    return buffer;
  }

  async #startBackgroundMusic(): Promise<void> {
    if (!this.#bgElement || this.#bgStarted) {
      return;
    }

    try {
      await this.#bgElement.play();
      this.#bgStarted = true;
    } catch {
      // Browser blocked playback; leave #bgStarted false so a later gesture can retry.
    }
  }

  #triggerSidechainDuck(triggerTime: number): void {
    const duck = this.#bgSidechainGain;
    if (!duck) {
      return;
    }

    duck.gain.cancelScheduledValues(triggerTime);
    duck.gain.setValueAtTime(duck.gain.value, triggerTime);
    duck.gain.linearRampToValueAtTime(
      SIDECHAIN_DEPTH,
      triggerTime + SIDECHAIN_ATTACK_S,
    );
    duck.gain.linearRampToValueAtTime(
      1,
      triggerTime + SIDECHAIN_ATTACK_S + SIDECHAIN_RELEASE_S,
    );
  }

  #applyMuteRamp(muted: boolean): void {
    const ctx = this.#context;
    const master = this.#masterGain;
    if (!ctx || !master) {
      return;
    }

    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(muted ? 0 : 1, now + MUTE_RAMP_S);
  }

  #disconnectVoice(voice: VoiceNodes): void {
    voice.oscillator.onended = null;
    voice.oscillator.disconnect();
    voice.envelope.disconnect();
    voice.panner.disconnect();

    const idx = this.#activeVoices.indexOf(voice);
    if (idx >= 0) {
      this.#activeVoices.splice(idx, 1);
    }
  }
}
