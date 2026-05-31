import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  LmDiagramViewportComponent,
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent, LmSliderComponent, AudioService } from '@lm/design';
import { lengthContraction, tickPeriod } from '@lm/physics';
import {
  CHAPTER_06_CLOCKS_TITLE,
  CHAPTER_06_CLOCKS_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { LightClockBounceSound } from '../light-clock-bounce-sound';
import { LmHorizontalLightClockComponent } from './lm-horizontal-light-clock.component';
import { STEP_03_LENGTH_CONTRACTION } from './step-03-length-contraction';

const PROPER_LENGTH = 1;
const REST_TICK = 1;

@Component({
  selector: 'lm-ch6-clocks-step-03',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmHorizontalLightClockComponent,
    LmSliderComponent,
    LmFactLineComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="7"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="3"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(3)"
      [prevStepUrl]="'/chapter/7/step/2'"
      [nextStepUrl]="'/chapter/7/step/4'"
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
        class="grid h-full min-h-0 grid-cols-[1fr_1.15fr] gap-14 px-16 pb-10 pt-[52px]"
      >
        <div class="flex min-h-0 h-full min-w-0 flex-col overflow-hidden">
          <lm-narrator-chat-feed
            [kicker]="step.kicker"
            [pastBeats]="runner.completedNarrateTexts()"
            [currentText]="runner.narrationText()"
            [visibleCount]="runner.narrationVisibleCount()"
          />
        </div>
        <div class="flex min-h-0 flex-col">
          <div class="flex min-h-0 flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]">
            <lm-kicker [opacity]="0.55" class="mb-3.5">motion along the path · length, not time</lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-horizontal-light-clock
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  [velocity]="velocity()"
                  [progress]="progress()"
                  [showGhostProper]="showGhost() >= 0.5"
                />
              </lm-diagram-viewport>
            </div>
          </div>
          <div class="mt-[22px] space-y-5 border-t border-ink-faint pt-[22px]">
            <lm-slider
              label="v / c"
              [value]="velocity()"
              [disabled]="false"
              (valueChange)="onVelocityChange($event)"
            />
            <div class="grid grid-cols-2 gap-x-6 gap-y-2">
              <lm-fact-line label="proper length L₀" [value]="properLengthLabel()" accent="accent-1" />
              <lm-fact-line label="contracted L" [value]="contractedLengthLabel()" accent="accent-2" />
            </div>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step03Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  private readonly platformId = inject(PLATFORM_ID);
  readonly #audio = inject(AudioService);
  readonly #bounceSound = new LightClockBounceSound(this.#audio);

  protected readonly step = STEP_03_LENGTH_CONTRACTION;
  protected readonly chapterTitle = CHAPTER_06_CLOCKS_TITLE;
  protected readonly stepsTotal = CHAPTER_06_CLOCKS_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly velocity = signal(0);
  protected readonly progress = signal(0);
  protected readonly showGhost = signal(0);

  protected readonly properLengthLabel = computed(() => `${PROPER_LENGTH.toFixed(2)} L₀`);
  protected readonly contractedLengthLabel = computed(() =>
    `${lengthContraction(PROPER_LENGTH, this.velocity()).toFixed(2)} L₀`,
  );

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('clock.velocity', {
      get: () => this.velocity(),
      set: (v) => this.velocity.set(v),
      initial: 0,
    });
    this.registry.register('clock.progress', {
      get: () => this.progress(),
      set: (v) => this.progress.set(v),
      initial: 0,
    });
    this.registry.register('clock.showGhost', {
      get: () => this.showGhost(),
      set: (v) => this.showGhost.set(v),
      initial: 0,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, 7, 3);
    this.totalDurationMs = this.runner.getTotalDurationMs();

    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.startTickLoop();
      }
    });

    effect(() => {
      this.#bounceSound.onProgress(this.progress());
    });
  }

  ngOnInit(): void {
    this.runner.start();
  }

  ngOnDestroy(): void {
    this.stopTickLoop();
    this.runner.destroy();
    this.registry.clear();
  }

  private rafId = 0;

  private startTickLoop(): void {
    this.stopTickLoop();
    let last = performance.now();
    let acc = 0;

    const tick = (now: number) => {
      const rawPeriodMs = tickPeriod(REST_TICK, this.velocity()) * 1200;
      const periodMs = Number.isFinite(rawPeriodMs)
        ? Math.min(60_000, Math.max(16, rawPeriodMs))
        : 60_000;
      const dt = (now - last) / periodMs;
      last = now;
      acc += dt;
      this.progress.set(acc);
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  private stopTickLoop(): void {
    if (this.rafId !== 0) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  protected onVelocityChange(value: number): void {
    if (this.runner.atExplorationWait() || this.runner.playbackActive()) {
      this.velocity.set(value);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
    event.preventDefault();
    if (this.runner.isPaused()) this.runner.resume();
    else if (this.runner.waitingForUser()) this.runner.advance();
    else if (this.runner.playbackActive()) this.runner.pause();
    else if (!this.runner.isComplete()) this.runner.goToNextCheckpoint();
  }
}
