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
import { LmFactLineComponent, LmKickerComponent } from '@lm/design';
import {
  buildRelativisticPeriodicEmissions,
  meanPulseInterval,
  vec2
} from '@lm/physics';
import {
  LmLightSceneComponent,
  type LightSceneReception,
  type LightSceneSource,
  type LightSceneObserver
} from '@lm/light-scene';
import {
  CH5_OBSERVER_X,
  CH5_PULSE_COUNT,
  CH5_PULSE_INTERVAL
} from '../pulse-train.constants';
import {
  CHAPTER_05_TITLE,
  CHAPTER_05_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { STEP_02_RECEDING_REDSHIFT } from './step-02-receding-redshift';

@Component({
  selector: 'lm-ch5-step-02',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
        LmNarratorChatFeedComponent,
    LmLightSceneComponent,
    LmFactLineComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="5"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
      [prevStepUrl]="'/ch/05/step/1'"
      [nextStepUrl]="'/ch/05/step/3'"
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
      <div class="grid h-full min-h-0 grid-cols-[1fr_1.15fr] gap-14 px-16 pb-10 pt-[52px]">
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
            <lm-kicker [opacity]="0.55" class="mb-3.5">S receding at 0.5 c · redshift</lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-light-scene
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [time]="time()"
                [extent]="1.2"
                [fixedViewBox]="true"
                [observers]="observers"
                [sources]="sources"
                (reception)="onReception($event)"
              />
              </lm-diagram-viewport>
            </div>
          </div>
          <div class="mt-[22px] grid grid-cols-2 gap-x-6 gap-y-2 border-t border-ink-faint pt-[22px]">
            <lm-fact-line label="A · ticks heard" [value]="tickCount().toString()" accent="accent-1" />
            <lm-fact-line label="mean tick interval" [value]="meanIntervalLabel()" accent="accent-2" />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step02Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_02_RECEDING_REDSHIFT;
  protected readonly chapterTitle = CHAPTER_05_TITLE;
  protected readonly stepsTotal = CHAPTER_05_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  private readonly sourceStart = vec2(-0.15, 0);
  private readonly sourceVelocity = { x: 0.5, y: 0 };
  private readonly emissions = buildRelativisticPeriodicEmissions(
    CH5_PULSE_COUNT,
    CH5_PULSE_INTERVAL,
    0.5,
  );

  protected readonly observers: LightSceneObserver[] = [
    { id: 'a', x: CH5_OBSERVER_X, y: 0, label: 'A', color: 'accent-1' },
  ];
  protected readonly sources: LightSceneSource[] = [
    {
      id: 's',
      x: this.sourceStart.x,
      y: this.sourceStart.y,
      label: 'S',
      velocity: this.sourceVelocity,
      emissions: this.emissions
},
  ];

  protected readonly time = signal(0);
  protected readonly tickCount = signal(0);
  protected readonly arrivalTimes = signal<number[]>([]);

  protected readonly meanIntervalLabel = computed(() => {
    const mean = meanPulseInterval(this.arrivalTimes());
    return mean === null ? '—' : `${mean.toFixed(2)} t`;
  });

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('scene.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
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

  protected onReception(event: LightSceneReception): void {
    this.tickCount.update((n) => n + 1);
    this.arrivalTimes.update((times) => [...times, event.atTime]);
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
