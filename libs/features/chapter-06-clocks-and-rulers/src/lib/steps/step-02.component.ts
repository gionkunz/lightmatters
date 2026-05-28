import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
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
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent, LmSliderComponent } from '@lm/design';
import { LmLightClockComponent } from '@lm/light-clock';
import { lorentz, tickPeriod } from '@lm/physics';
import {
  CHAPTER_06_CLOCKS_TITLE,
  CHAPTER_06_CLOCKS_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_02_MOVING_CLOCK } from './step-02-moving-clock';

const REST_TICK = 1;

@Component({
  selector: 'lm-ch6-clocks-step-02',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmLightClockComponent,
    LmSliderComponent,
    LmFactLineComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="6"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
      [prevStepUrl]="'/chapter/6/step/1'"
      [nextStepUrl]="'/chapter/6/step/3'"
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
            <lm-kicker [opacity]="0.55" class="mb-3.5">moving clock · longer path</lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-light-clock
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  [velocity]="velocity()"
                  [progress]="progress()"
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
              <lm-fact-line label="rest tick period" [value]="restTickLabel()" accent="accent-1" />
              <lm-fact-line label="moving tick period" [value]="movingTickLabel()" accent="accent-2" />
              <lm-fact-line label="γ (Lorentz)" [value]="gammaLabel()" />
            </div>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step02Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly step = STEP_02_MOVING_CLOCK;
  protected readonly chapterTitle = CHAPTER_06_CLOCKS_TITLE;
  protected readonly stepsTotal = CHAPTER_06_CLOCKS_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly velocity = signal(0);
  protected readonly progress = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  protected readonly restTickLabel = computed(() => `${REST_TICK.toFixed(2)} t`);
  protected readonly movingTickLabel = computed(() => {
    const v = this.velocity();
    if (v >= 0.999) {
      return '∞ t';
    }
    const period = tickPeriod(REST_TICK, v);
    if (!Number.isFinite(period) || period > 1e4) {
      return '∞ t';
    }
    return `${period.toFixed(2)} t`;
  });
  protected readonly gammaLabel = computed(() => {
    const v = this.velocity();
    if (v >= 0.999) {
      return '∞';
    }
    return lorentz(v).toFixed(3);
  });

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
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    this.totalDurationMs = this.runner.getTotalDurationMs();

    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.startTickLoop();
      }
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
