import {
  Component,
  computed,
  HostListener,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  LmDiagramViewportComponent,
    TargetRegistry,
  TimelineRunner
} from '@lm/engine';
import {
  LmFactLineComponent,
  LmKickerComponent,
  LmLegendComponent
} from '@lm/design';
import {
  observerProperTimeAtCoordinate,
  signalClockLabel,
  STEP3_BRIDGE_LAYOUT,
  STEP3_BRIDGE_MAX_TIME,
  STEP3_BRIDGE_TIME_AT_A
} from '@lm/physics';
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import {
  CHAPTER_02_TITLE,
  CHAPTER_02_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { STEP_03_BRIDGE_TO_LIGHT } from './step-03-bridge-to-light';

@Component({
  selector: 'lm-step-03',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
        LmNarratorChatFeedComponent,
    LmSpacetimeDiagramComponent,
    LmFactLineComponent,
    LmLegendComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="2"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="3"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="true"
      [nextChapter]="true"
      [prevStepUrl]="'/ch/02/step/2'"
      [nextStepUrl]="'/ch/03/step/1'"
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
        </div>

        <div class="flex min-h-0 flex-col">
          <div
            class="flex min-h-0 flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px] transition-colors duration-400"
          >
            <div class="mb-3.5 flex items-baseline justify-between gap-4">
              <lm-kicker [opacity]="0.55">light = pure spatial motion</lm-kicker>
              <div class="flex gap-3.5">
                <lm-legend color="accent-1" label="A" />
                <lm-legend color="neutral" label="B" />
              </div>
            </div>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 460">
                <lm-spacetime-diagram
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                variant="wavefront"
                wavefrontSignal="ring"
                [wavefrontShowObserverC]="false"
                [wavefrontTime]="wavefrontTime()"
                [observerXA]="layout.xA"
                [observerXB]="layout.xB"
                [wavefrontTimeAtA]="timeAtA"
                [wavefrontTMax]="timeMax"
              />
              </lm-diagram-viewport>
            </div>
          </div>

          <div
            class="mt-[22px] grid grid-cols-2 gap-x-6 gap-y-2 border-t border-ink-faint pt-[22px]"
          >
            <lm-fact-line
              label="A · proper time"
              [value]="clockA()"
              accent="accent-1"
            />
            <lm-fact-line label="B · proper time" [value]="clockB()" />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step03Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_03_BRIDGE_TO_LIGHT;
  protected readonly chapterTitle = CHAPTER_02_TITLE;
  protected readonly stepsTotal = CHAPTER_02_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly layout = STEP3_BRIDGE_LAYOUT;
  protected readonly timeAtA = STEP3_BRIDGE_TIME_AT_A;
  protected readonly timeMax = STEP3_BRIDGE_MAX_TIME;

  protected readonly wavefrontTime = signal(0);

  protected readonly clockA = computed(() =>
    this.clockAtRest(this.wavefrontTime(), STEP3_BRIDGE_TIME_AT_A),
  );

  protected readonly clockB = computed(() =>
    this.clockAtRest(this.wavefrontTime(), STEP3_BRIDGE_TIME_AT_A),
  );

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('wavefront.time', {
      get: () => this.wavefrontTime(),
      set: (v) => this.wavefrontTime.set(v),
      initial: 0
});
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    this.totalDurationMs = this.runner.getTotalDurationMs();
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
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') {
      return;
    }
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


  private clockAtRest(t: number, freezeAt: number): string {
    if (t <= 0) {
      return '—';
    }
    return signalClockLabel(
      observerProperTimeAtCoordinate(Math.min(t, freezeAt), 0),
    );
  }
}
