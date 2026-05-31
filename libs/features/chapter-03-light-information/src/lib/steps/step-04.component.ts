import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  AudioService,
  LmFactLineComponent,
  LmInteractiveDirective,
  LmKickerComponent,
  LmPredictionChoiceComponent,
  type PredictionOption,
} from '@lm/design';
import {
  LmDiagramViewportComponent,
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneReception,
  type LightSceneSource,
} from '@lm/light-scene';
import {
  playSourceReceptionSound,
  RECEPTION_SOUND_WINDOW,
} from '../reception-sound';
import {
  CHAPTER_03_TITLE,
  CHAPTER_03_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_04_TWO_FLASHES_ONE_WITNESS } from './step-04-two-flashes-one-witness';

const SOURCE_ARRIVAL_PAN: Record<string, number> = {
  's-left': -0.75,
  's-right': 0.75,
};

const W_SPEED = 0.3;
const HALF_SEPARATION = 0.5;
/** Time-dilation / length-contraction factor √(1 − v²/c²) at W's speed (c = 1). */
const LORENTZ = Math.sqrt(1 - W_SPEED * W_SPEED);
const GAMMA = 1 / LORENTZ;
/**
 * In W's rest frame the two sources are length-contracted toward W, so their
 * half-separation shrinks by the Lorentz factor.
 */
const WITNESS_HALF_SEPARATION = HALF_SEPARATION * LORENTZ;
/**
 * Relativity of simultaneity: emissions that are simultaneous in the ground frame
 * are staggered by γ·v·Δx/c² in W's frame. W drifts rightward in the ground frame,
 * so the right flash (the one W moves toward) is received first; the arrival order
 * at W's worldline is frame-invariant, so the right source must emit *earlier* in
 * W's own frame. These constants are the exact Lorentz transforms of the
 * ground-frame emission events, so each frame-2 arrival readout equals its frame-1
 * counterpart scaled by √(1 − v²/c²) (W's clock runs slow).
 */
const WITNESS_FLASH_STAGGER = GAMMA * W_SPEED * HALF_SEPARATION;
const WITNESS_LEFT_FLASH = WITNESS_FLASH_STAGGER;
const WITNESS_RIGHT_FLASH = -WITNESS_FLASH_STAGGER;
const EXPLORATION_TIME = 0.95;
/** Duration of a learner-triggered frame replay (ms). */
const REPLAY_DURATION_MS = 3800;

const ORDER_OPTIONS: PredictionOption[] = [
  { id: 'left', label: 'Left flash first' },
  { id: 'right', label: 'Right flash first' },
  { id: 'both', label: 'Both at once' },
];

const GROUND_SOURCES: LightSceneSource[] = [
  {
    id: 's-left',
    x: -0.5,
    y: 0,
    label: 'S_L',
    emissions: [{ atTime: 0, pulseId: 'p-left' }],
  },
  {
    id: 's-right',
    x: 0.5,
    y: 0,
    label: 'S_R',
    emissions: [{ atTime: 0, pulseId: 'p-right' }],
  },
];

const WITNESS_SOURCES: LightSceneSource[] = [
  {
    id: 's-left',
    x: -WITNESS_HALF_SEPARATION,
    y: 0,
    label: 'S_L',
    velocity: { x: -W_SPEED, y: 0 },
    emissions: [{ atTime: WITNESS_LEFT_FLASH, pulseId: 'p-left' }],
  },
  {
    id: 's-right',
    x: WITNESS_HALF_SEPARATION,
    y: 0,
    label: 'S_R',
    velocity: { x: -W_SPEED, y: 0 },
    emissions: [{ atTime: WITNESS_RIGHT_FLASH, pulseId: 'p-right' }],
  },
];

/**
 * The physically *wrong* picture used as a foil: both sources fire at the same
 * instant in W's frame. Since W sits exactly between two equidistant sources, both
 * flashes would reach W together — contradicting the ground frame, which already
 * showed the right flash arriving first. Toggling to {@link WITNESS_SOURCES}
 * resolves the contradiction.
 */
const NAIVE_WITNESS_SOURCES: LightSceneSource[] = [
  {
    id: 's-left',
    x: -WITNESS_HALF_SEPARATION,
    y: 0,
    label: 'S_L',
    velocity: { x: -W_SPEED, y: 0 },
    emissions: [{ atTime: 0, pulseId: 'p-left' }],
  },
  {
    id: 's-right',
    x: WITNESS_HALF_SEPARATION,
    y: 0,
    label: 'S_R',
    velocity: { x: -W_SPEED, y: 0 },
    emissions: [{ atTime: 0, pulseId: 'p-right' }],
  },
];

@Component({
  selector: 'lm-ch3-step-04',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmLightSceneComponent,
    LmFactLineComponent,
    LmKickerComponent,
    LmPredictionChoiceComponent,
    LmInteractiveDirective,
  ],
  template: `
    <lm-step-frame
      [chapter]="4"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(4)"
      [prevStepUrl]="'/chapter/4/step/3'"
      [nextStepUrl]="'/chapter/4/step/5'"
      [advanceDisabled]="!runner.allowsStepExit()"
      [showPlayback]="true"
      [progress]="runner.progress()"
      [elapsedMs]="runner.elapsedMs()"
      [totalMs]="totalDurationMs"
      [checkpoints]="runner.checkpoints()"
      [activeCheckpointIndex]="runner.activeCheckpointIndex()"
      [playbackActive]="runner.playbackActive()"
      [playbackPaused]="runner.isPaused()"
      [canGoPrevious]="runner.canGoToPreviousCheckpoint()"
      [canGoNext]="runner.canGoToNextCheckpoint()"
      (goPrevious)="runner.goToPreviousCheckpoint()"
      (pauseRequested)="runner.pause()"
      (playRequested)="runner.resume()"
      (goNext)="runner.goToNextCheckpoint()"
      (checkpointSeek)="runner.goToCheckpoint($event)"
    >
      <div
        class="grid h-full min-h-0 box-border grid-cols-[1fr_1.15fr] gap-14 px-16 pb-10 pt-[52px]"
      >
        <div class="flex min-h-0 h-full flex-col">
          <lm-narrator-chat-feed
            [kicker]="step.kicker"
            [pastBeats]="runner.completedNarrateTexts()"
            [currentText]="runner.narrationText()"
            [visibleCount]="runner.narrationVisibleCount()"
          />

          @if (showPrediction()) {
            <div class="mt-6 border-t border-ink-faint pt-[22px]">
              <lm-prediction-choice
                kicker="your prediction"
                question="If W is drifting rightward when both flashes go off, which one reaches them first?"
                [options]="orderOptions"
                [selectedId]="prediction()"
                (selectedIdChange)="onPrediction($event)"
              />
            </div>
          }
        </div>

        <div class="flex min-h-0 flex-col">
          <div
            class="relative flex min-h-0 flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px] transition-shadow duration-200"
            [class.shadow-[inset_0_0_0_2px_var(--lm-accent-1)]]="showNaiveVerdict()"
            [class.shadow-[inset_0_0_0_2px_var(--lm-accent-2)]]="showActualVerdict()"
          >
            <div class="mb-3.5 flex items-baseline justify-between gap-4">
              <lm-kicker [opacity]="0.55">{{ phaseKicker() }}</lm-kicker>
            </div>

            @if (showNaiveVerdict()) {
              <div
                class="pointer-events-none absolute right-[18px] top-[16px] z-10 flex items-center gap-2 border-2 border-accent-1 bg-paper px-3 py-1.5 shadow-[0_0_0_4px_var(--lm-glow-1)]"
              >
                <span class="text-accent-1 text-base leading-none">✕</span>
                <span
                  class="font-mono text-[length:var(--lm-text-mono-md)] uppercase tracking-[0.16em] text-accent-1"
                  >impossible · can't happen</span
                >
              </div>
            }
            @if (showActualVerdict()) {
              <div
                class="pointer-events-none absolute right-[18px] top-[16px] z-10 flex items-center gap-2 border border-accent-2 bg-paper px-3 py-1.5"
              >
                <span class="text-accent-2 text-base leading-none">✓</span>
                <span
                  class="font-mono text-[length:var(--lm-text-mono-md)] uppercase tracking-[0.16em] text-accent-2"
                  >consistent</span
                >
              </div>
            }

            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                @for (sceneKey of [lightSceneKey()]; track sceneKey) {
                  <lm-light-scene
                    [time]="displayTime()"
                    [extent]="1.1"
                    [fixedViewBox]="true"
                    [observers]="observers()"
                    [sources]="sources()"
                    [showObserverOrigins]="true"
                    [showSourceEmissionOrigins]="true"
                    [width]="diagramVp.size().width"
                    [height]="diagramVp.size().height"
                    (reception)="onReception($event)"
                  />
                }
              </lm-diagram-viewport>
            </div>
          </div>

          @if (showFrameToggle()) {
            <div class="mt-[22px] border-t border-ink-faint pt-[22px]">
              <lm-kicker [opacity]="0.55" class="mb-3">frame of view</lm-kicker>
              <div class="flex gap-2.5">
                <button
                  type="button"
                  lmInteractive
                  class="flex-1 cursor-pointer border px-3 py-2.5 text-left font-serif text-[length:var(--lm-text-button-sm)] italic leading-snug transition-colors duration-200"
                  [class.border-accent-2]="witnessFrame() < 0.5"
                  [class.border-ink-faint]="witnessFrame() >= 0.5"
                  [class.shadow-[0_0_0_4px_var(--lm-glow-2)]]="witnessFrame() < 0.5"
                  [disabled]="!frameToggleEnabled()"
                  (click)="setWitnessFrame(0)"
                >
                  ground · W moving
                </button>
                <button
                  type="button"
                  lmInteractive
                  class="flex-1 cursor-pointer border px-3 py-2.5 text-left font-serif text-[length:var(--lm-text-button-sm)] italic leading-snug transition-colors duration-200"
                  [class.border-accent-2]="witnessFrame() >= 0.5"
                  [class.border-ink-faint]="witnessFrame() < 0.5"
                  [class.shadow-[0_0_0_4px_var(--lm-glow-2)]]="witnessFrame() >= 0.5"
                  [disabled]="!frameToggleEnabled()"
                  (click)="setWitnessFrame(1)"
                >
                  W at rest
                </button>
              </div>

              @if (inWitnessRestFrame()) {
                <lm-kicker [opacity]="0.55" class="mb-3 mt-[18px]"
                  >emission timing</lm-kicker
                >
                <div class="flex gap-2.5">
                  <button
                    type="button"
                    lmInteractive
                    class="flex-1 cursor-pointer border px-3 py-2.5 text-left font-serif text-[length:var(--lm-text-button-sm)] italic leading-snug transition-colors duration-200"
                    [class.border-accent-1]="naiveEmission()"
                    [class.border-ink-faint]="!naiveEmission()"
                    [class.shadow-[0_0_0_4px_var(--lm-glow-1)]]="naiveEmission()"
                    [disabled]="!frameToggleEnabled()"
                    (click)="setNaiveEmission(true)"
                  >
                    emit together · naïve
                  </button>
                  <button
                    type="button"
                    lmInteractive
                    class="flex-1 cursor-pointer border px-3 py-2.5 text-left font-serif text-[length:var(--lm-text-button-sm)] italic leading-snug transition-colors duration-200"
                    [class.border-accent-2]="!naiveEmission()"
                    [class.border-ink-faint]="naiveEmission()"
                    [class.shadow-[0_0_0_4px_var(--lm-glow-2)]]="!naiveEmission()"
                    [disabled]="!frameToggleEnabled()"
                    (click)="setNaiveEmission(false)"
                  >
                    emit staggered · actual
                  </button>
                </div>
              }

              @if (witnessCaption(); as caption) {
                <p
                  class="mt-3.5 font-serif text-[length:var(--lm-text-button-sm)] italic leading-relaxed opacity-70"
                >
                  {{ caption }}
                </p>
              }
            </div>
          }

          <div
            class="mt-[22px] grid grid-cols-2 gap-x-6 gap-y-2 border-t border-ink-faint pt-[22px]"
          >
            <lm-fact-line
              label="left flash · arrived at"
              [value]="format(leftArrived())"
              accent="accent-1"
            />
            <lm-fact-line
              label="right flash · arrived at"
              [value]="format(rightArrived())"
              accent="accent-2"
            />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  readonly #audio = inject(AudioService);

  protected readonly step = STEP_04_TWO_FLASHES_ONE_WITNESS;
  protected readonly chapterTitle = CHAPTER_03_TITLE;
  protected readonly stepsTotal = CHAPTER_03_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly orderOptions = ORDER_OPTIONS;

  protected readonly time = signal(0);
  protected readonly prediction = signal<string | null>(null);
  protected readonly leftArrived = signal<number | null>(null);
  protected readonly rightArrived = signal<number | null>(null);
  protected readonly witnessFrame = signal(0);
  /**
   * Within W's rest frame: whether the two flashes are (wrongly) assumed to fire at
   * the same instant. Starts `true` so the learner first meets the broken picture,
   * then flips to the staggered (correct) timing.
   */
  protected readonly naiveEmission = signal(true);
  /** Bumps when the learner toggles frames so the light scene remounts and re-emits receptions. */
  protected readonly lightSceneKey = signal(0);

  /**
   * Learner-driven replay clock. While a frame replay is running this drives the
   * scene instead of the timeline's `scene.time`, animating 0 → EXPLORATION_TIME so
   * the progression can be compared between frames.
   */
  protected readonly replayTime = signal(0);
  protected readonly replaying = signal(false);
  private replayHandle: number | null = null;

  private readonly hasEnteredMoving = signal(false);

  protected readonly atPredictionPause = computed(() => {
    const text = this.runner.narrationText();
    const onPrompt =
      text.includes('Predict') ||
      (this.runner.waitingForUser() &&
        this.runner.completedNarrateTexts().some((t) => t.includes('Predict')));
    if (!onPrompt || text.includes('Let us run it again')) {
      return false;
    }
    return this.runner.waitingForUser() || this.runner.atExplorationWait();
  });

  protected readonly inSecondSegment = computed(() => {
    const text = this.runner.narrationText();
    const past = this.runner.completedNarrateTexts();
    return (
      text.includes('Let us run it again') ||
      text.includes('relativity of simultaneity') ||
      text.includes('Flip the frame toggle') ||
      text.includes('depends on who is moving') ||
      past.some(
        (t) =>
          t.includes('Let us run it again') ||
          t.includes('relativity of simultaneity') ||
          t.includes('Flip the frame toggle'),
      )
    );
  });

  protected readonly showFrameToggle = computed(
    () => this.hasEnteredMoving() && this.inSecondSegment(),
  );

  /** True once the second-segment animation has finished and the toggle prompt has appeared. */
  protected readonly frameToggleEnabled = computed(() => {
    if (!this.showFrameToggle() || this.time() < EXPLORATION_TIME - 0.01) {
      return false;
    }
    const current = this.runner.narrationText();
    const past = this.runner.completedNarrateTexts();
    return (
      current.includes('Flip the frame toggle') ||
      past.some((t) => t.includes('Flip the frame toggle')) ||
      past.some((t) => t.includes('relativity of simultaneity')) ||
      current.includes('relativity of simultaneity')
    );
  });

  protected readonly inWitnessRestFrame = computed(
    () => this.showFrameToggle() && this.witnessFrame() >= 0.5,
  );

  protected readonly observers = computed<LightSceneObserver[]>(() => {
    if (!this.hasEnteredMoving() || this.inWitnessRestFrame()) {
      return [{ id: 'w-still', x: 0, y: 0, label: 'W' }];
    }
    return [
      {
        id: 'w-moving',
        x: 0,
        y: 0,
        label: 'W',
        velocity: { x: W_SPEED, y: 0 },
      },
    ];
  });

  protected readonly sources = computed<LightSceneSource[]>(() => {
    if (this.inWitnessRestFrame()) {
      return this.naiveEmission() ? NAIVE_WITNESS_SOURCES : WITNESS_SOURCES;
    }
    return GROUND_SOURCES;
  });

  protected readonly displayTime = computed(() => {
    if (this.replaying()) {
      return this.replayTime();
    }
    if (this.frameToggleEnabled()) {
      return EXPLORATION_TIME;
    }
    return this.time();
  });

  protected readonly showPrediction = computed(
    () => !this.hasEnteredMoving() && this.atPredictionPause(),
  );

  protected phaseKicker(): string {
    if (!this.hasEnteredMoving()) {
      return 'witness W at rest';
    }
    if (this.inWitnessRestFrame()) {
      return this.naiveEmission()
        ? 'W\'s frame · flashes fired together · naïve'
        : 'W\'s frame · flashes staggered · actual';
    }
    return 'ground frame · W moving rightward at 0.3 c';
  }

  /** True while the learner is looking at the physically impossible (naïve) picture. */
  protected readonly showNaiveVerdict = computed(
    () => this.inWitnessRestFrame() && this.naiveEmission(),
  );
  /** True while the learner is looking at the consistent (staggered) picture. */
  protected readonly showActualVerdict = computed(
    () => this.inWitnessRestFrame() && !this.naiveEmission(),
  );

  /** Short reactive explanation tied to the naive/actual sub-toggle. */
  protected readonly witnessCaption = computed<string | null>(() => {
    if (!this.inWitnessRestFrame()) {
      return null;
    }
    return this.naiveEmission()
      ? 'Incorrect — if both fired together, the equidistant light reaches W at once: one merged flash. But the ground frame already showed the right flash first, and a single witness cannot both merge them and not. This picture cannot happen.'
      : 'The only escape: the right flash fired earlier. Now W receives right-then-left — the same order every frame agrees on.';
  });

  protected setWitnessFrame(frame: 0 | 1): void {
    if (!this.frameToggleEnabled()) {
      return;
    }
    this.witnessFrame.set(frame);
    if (frame === 1) {
      this.naiveEmission.set(true);
    }
    this.replayFromStart();
  }

  protected setNaiveEmission(naive: boolean): void {
    if (!this.frameToggleEnabled() || !this.inWitnessRestFrame()) {
      return;
    }
    this.naiveEmission.set(naive);
    this.replayFromStart();
  }

  /** Restart the scene from t = 0 in the current frame and animate to the end. */
  private replayFromStart(): void {
    this.cancelReplay();
    this.leftArrived.set(null);
    this.rightArrived.set(null);
    this.lightSceneKey.update((k) => k + 1);
    this.replayTime.set(0);
    this.replaying.set(true);

    if (typeof requestAnimationFrame === 'undefined') {
      this.replayTime.set(EXPLORATION_TIME);
      return;
    }

    const start = performance.now();
    const tick = (now: number): void => {
      const fraction = Math.min(1, (now - start) / REPLAY_DURATION_MS);
      this.replayTime.set(fraction * EXPLORATION_TIME);
      if (fraction < 1) {
        this.replayHandle = requestAnimationFrame(tick);
      } else {
        this.replayHandle = null;
      }
    };
    this.replayHandle = requestAnimationFrame(tick);
  }

  private cancelReplay(): void {
    if (this.replayHandle !== null) {
      cancelAnimationFrame(this.replayHandle);
      this.replayHandle = null;
    }
  }

  protected onPrediction(id: string): void {
    this.prediction.set(id);
    if (this.runner.waitingForUser()) {
      this.runner.advance();
    }
  }

  protected onReception(event: LightSceneReception): void {
    if (event.sourceId === 's-left') {
      this.leftArrived.set(event.atTime);
    } else if (event.sourceId === 's-right') {
      this.rightArrived.set(event.atTime);
    }

    playSourceReceptionSound(
      this.#audio,
      event,
      this.displayTime(),
      SOURCE_ARRIVAL_PAN,
    );
  }

  protected format(t: number | null): string {
    return t === null ? '—' : `${t.toFixed(2)} t`;
  }

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('scene.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
      initial: 0,
    });
    this.registry.register('witness.frame', {
      get: () => this.witnessFrame(),
      set: (v) => this.witnessFrame.set(v >= 0.5 ? 1 : 0),
      initial: 0,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, 4, 4);
    this.totalDurationMs = this.runner.getTotalDurationMs();

    effect(() => {
      if (
        this.atPredictionPause() &&
        this.prediction() !== null &&
        this.runner.waitingForUser()
      ) {
        this.runner.advance();
      }
    });

    effect(() => {
      const t = this.time();
      if (t < RECEPTION_SOUND_WINDOW && !this.hasEnteredMoving()) {
        this.leftArrived.set(null);
        this.rightArrived.set(null);
      }
      if (this.inSecondSegment()) {
        if (!this.hasEnteredMoving() && t < 0.05) {
          this.hasEnteredMoving.set(true);
          this.leftArrived.set(null);
          this.rightArrived.set(null);
        }
      } else {
        this.hasEnteredMoving.set(false);
        this.witnessFrame.set(0);
        if (this.replaying()) {
          this.cancelReplay();
          this.replaying.set(false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.runner.start();
  }

  ngOnDestroy(): void {
    this.cancelReplay();
    this.runner.destroy();
    this.registry.clear();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
    event.preventDefault();
    if (this.runner.isPaused()) {
      this.runner.resume();
    } else if (this.runner.waitingForUser()) {
      this.runner.advance();
    } else if (this.runner.playbackActive()) {
      this.runner.pause();
    } else if (!this.runner.isComplete()) {
      this.runner.goToNextCheckpoint();
    }
  }
}
