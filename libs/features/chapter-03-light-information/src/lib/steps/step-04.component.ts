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
import { Router } from '@angular/router';
import {
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import {
  LmFactLineComponent,
  LmKickerComponent,
  LmPredictionChoiceComponent,
  type PredictionOption,
} from '@lm/design';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneReception,
  type LightSceneSource,
} from '@lm/light-scene';
import {
  CHAPTER_03_TITLE,
  CHAPTER_03_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_04_TWO_FLASHES_ONE_WITNESS } from './step-04-two-flashes-one-witness';

const ORDER_OPTIONS: PredictionOption[] = [
  { id: 'left', label: 'Left flash first' },
  { id: 'right', label: 'Right flash first' },
  { id: 'both', label: 'Both at once' },
];

@Component({
  selector: 'lm-ch3-step-04',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmLightSceneComponent,
    LmFactLineComponent,
    LmKickerComponent,
    LmPredictionChoiceComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="3"
      [chapterTitle]="chapterTitle"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(4)"
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
      (back)="goPrevStep()"
      (next)="goNextStep()"
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

        <div class="flex flex-col">
          <div class="flex flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]">
            <div class="mb-3.5 flex items-baseline justify-between gap-4">
              <lm-kicker [opacity]="0.55">{{ phaseKicker() }}</lm-kicker>
            </div>
            <div class="flex flex-1 items-center justify-center">
              <lm-light-scene
                [time]="time()"
                [extent]="0.95"
                [observers]="observers()"
                [sources]="sources"
                [width]="560"
                [height]="380"
                (reception)="onReception($event)"
              />
            </div>
          </div>

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
  private readonly router = inject(Router);
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_04_TWO_FLASHES_ONE_WITNESS;
  protected readonly chapterTitle = CHAPTER_03_TITLE;
  protected readonly stepsTotal = CHAPTER_03_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly orderOptions = ORDER_OPTIONS;

  protected readonly sources: LightSceneSource[] = [
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

  protected readonly time = signal(0);
  protected readonly prediction = signal<string | null>(null);
  protected readonly leftArrived = signal<number | null>(null);
  protected readonly rightArrived = signal<number | null>(null);

  /**
   * Latched once segment 2 has actually started running.
   *
   * Why latch instead of deriving from `completedNarrateTexts().length` alone:
   * the second animate event (which moves W rightward) only fires AFTER the
   * "Let us run it again…" narrate beat completes. At that exact moment
   * `scene.time` is still at the segment-1 endpoint (0.85). If we flipped phase
   * the instant beat 5 finishes typing, the freshly-introduced moving observer
   * would be evaluated against `scene.time = 0.85`, and its reception for
   * `S_right` (which lands at t ≈ 0.39) would fire *immediately* — corrupting
   * the FactLine before any animation plays.
   *
   * Latching on `scene.time < 0.05` ensures phase only flips once the second
   * animate has reset time toward zero, so the moving observer's pulses
   * expand from radius 0 in real time.
   */
  private readonly hasEnteredMoving = signal(false);

  protected readonly phase = computed<'still' | 'moving'>(() =>
    this.hasEnteredMoving() ? 'moving' : 'still',
  );

  /**
   * Use distinct observer IDs per phase so the light-scene primitive's "fire reception
   * event once per (observer, source, pulse)" guard treats segment 2 as fresh receptions.
   */
  protected readonly observers = computed<LightSceneObserver[]>(() =>
    this.phase() === 'still'
      ? [{ id: 'w-still', x: 0, y: 0, label: 'W' }]
      : [
          {
            id: 'w-moving',
            x: 0,
            y: 0,
            label: 'W',
            velocity: { x: 0.3, y: 0 },
          },
        ],
  );

  protected readonly showPrediction = computed(
    () =>
      this.runner.atExplorationWait() &&
      this.runner.completedNarrateTexts().length >= 4 &&
      this.phase() === 'still',
  );

  protected phaseKicker(): string {
    return this.phase() === 'still'
      ? 'witness W at rest'
      : 'witness W moving rightward at 0.3 c';
  }

  protected onPrediction(id: string): void {
    this.prediction.set(id);
    if (this.runner.waitingForUser()) {
      this.runner.advance();
    }
  }

  protected onReception(event: LightSceneReception): void {
    // Reset on phase change is done in an effect-like way: when phase moves to 'moving',
    // we want the second-run arrivals to populate fresh values. We track the latest event
    // per source-pulse pair, overwriting on the second run.
    if (event.sourceId === 's-left') {
      this.leftArrived.set(event.atTime);
    } else if (event.sourceId === 's-right') {
      this.rightArrived.set(event.atTime);
    }
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
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    this.totalDurationMs = this.runner.getTotalDurationMs();

    effect(() => {
      if (
        this.runner.waitingForUser() &&
        this.prediction() !== null &&
        this.runner.atExplorationWait() &&
        this.phase() === 'still' &&
        this.runner.completedNarrateTexts().length >= 4
      ) {
        this.runner.advance();
      }
    });

    effect(() => {
      const completed = this.runner.completedNarrateTexts().length;
      const t = this.time();
      // Beat 5 = "Let us run it again…" — once that is revealed AND the second
      // animate has reset scene.time toward 0, we are truly in segment 2.
      if (completed >= 5 && t < 0.05 && !this.hasEnteredMoving()) {
        this.hasEnteredMoving.set(true);
      }
    });
  }

  ngOnInit(): void {
    this.runner.start();
  }
  ngOnDestroy(): void {
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

  protected goPrevStep(): void {
    void this.router.navigateByUrl('/ch/03/step/3');
  }
  protected goNextStep(): void {
    void this.router.navigateByUrl('/ch/03/step/5');
  }
}
