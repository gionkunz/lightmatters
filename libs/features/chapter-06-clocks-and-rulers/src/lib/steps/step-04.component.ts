import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
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
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { AudioService, LmKickerComponent } from '@lm/design';
import { LmLightClockComponent } from '@lm/light-clock';
import { tickPeriod } from '@lm/physics';
import {
  CHAPTER_06_CLOCKS_TITLE,
  CHAPTER_06_CLOCKS_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { LightClockBounceSound } from '../light-clock-bounce-sound';
import { STEP_04_OUTRO } from './step-04-outro';

const REST_TICK = 1;
const OUTRO_VELOCITY = 0.5;

@Component({
  selector: 'lm-ch6-clocks-step-04',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmLightClockComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="6"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="true"
      [nextChapter]="true"
      [prevStepUrl]="'/chapter/6/step/3'"
      [nextStepUrl]="'/chapter/7/step/1'"
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
        <div class="flex min-h-0 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]">
          <lm-kicker [opacity]="0.55" class="mb-3.5">one geometry · constant c</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
              <lm-light-clock
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [velocity]="outroVelocity"
                [progress]="progress()"
              />
            </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  private readonly platformId = inject(PLATFORM_ID);
  readonly #audio = inject(AudioService);
  readonly #bounceSound = new LightClockBounceSound(this.#audio);

  protected readonly step = STEP_04_OUTRO;
  protected readonly chapterTitle = CHAPTER_06_CLOCKS_TITLE;
  protected readonly stepsTotal = CHAPTER_06_CLOCKS_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly progress = signal(0);
  protected readonly outroVelocity = OUTRO_VELOCITY;
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
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
      const rawPeriodMs = tickPeriod(REST_TICK, OUTRO_VELOCITY) * 1200;
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
