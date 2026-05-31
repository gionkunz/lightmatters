import {
  Component,
  effect,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
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
import {
  CHAPTER_06_CLOCKS_TITLE,
  CHAPTER_06_CLOCKS_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { LightClockBounceSound } from '../light-clock-bounce-sound';
import { STEP_01_LIGHT_CLOCK_AT_REST } from './step-01-light-clock-at-rest';

@Component({
  selector: 'lm-ch6-clocks-step-01',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmLightClockComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="7"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="1"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(1)"
      [prevStepUrl]="'/chapter/6/step/4'"
      [nextStepUrl]="'/chapter/7/step/2'"
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
          <lm-kicker [opacity]="0.55" class="mb-3.5">clock at rest · v = 0</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
              <lm-light-clock
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [velocity]="0"
                [progress]="progress()"
              />
            </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step01Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  readonly #audio = inject(AudioService);
  readonly #bounceSound = new LightClockBounceSound(this.#audio);

  protected readonly step = STEP_01_LIGHT_CLOCK_AT_REST;
  protected readonly chapterTitle = CHAPTER_06_CLOCKS_TITLE;
  protected readonly stepsTotal = CHAPTER_06_CLOCKS_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly progress = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('clock.progress', {
      get: () => this.progress(),
      set: (v) => this.progress.set(v),
      initial: 0,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    this.totalDurationMs = this.runner.getTotalDurationMs();

    effect(() => {
      this.#bounceSound.onProgress(this.progress());
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
    if (this.runner.isPaused()) this.runner.resume();
    else if (this.runner.waitingForUser()) this.runner.advance();
    else if (this.runner.playbackActive()) this.runner.pause();
    else if (!this.runner.isComplete()) this.runner.goToNextCheckpoint();
  }
}
