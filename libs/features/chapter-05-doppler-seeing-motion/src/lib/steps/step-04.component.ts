import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  LmDiagramViewportComponent,
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { AudioService, LmFactLineComponent, LmKickerComponent } from '@lm/design';
import { buildRelativisticPeriodicEmissions } from '@lm/physics';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneReception,
  type LightSceneSource
} from '@lm/light-scene';
import {
  CH5_OBSERVER_X,
  CH5_PULSE_INTERVAL
} from '../pulse-train.constants';
import {
  CHAPTER_05_ROUTE_NUMBER,
  CHAPTER_05_TITLE,
  CHAPTER_05_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { playObserverWaveCrossingSound } from '../wave-crossing-sound';
import { STEP_04_EXTREME_RECESSION } from './step-04-extreme-recession';

@Component({
  selector: 'lm-ch5-step-04',
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
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(4)"
      [prevStepUrl]="'/chapter/8/step/3'"
      [nextStepUrl]="'/chapter/8/step/5'"
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
            <lm-kicker [opacity]="0.55" class="mb-3.5">S receding at 0.9 c · clock nearly frozen</lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-light-scene
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [time]="time()"
                [extent]="1.8"
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
            <lm-fact-line label="since last tick" [value]="intervalLabel()" accent="accent-2" />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  readonly #audio = inject(AudioService);

  protected readonly step = STEP_04_EXTREME_RECESSION;
  protected readonly chapterRoute = CHAPTER_05_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_05_TITLE;
  protected readonly stepsTotal = CHAPTER_05_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly observers: LightSceneObserver[] = [
    { id: 'a', x: CH5_OBSERVER_X, y: 0, label: 'A', color: 'accent-1' },
  ];
  protected readonly sources: LightSceneSource[] = [
    {
      id: 's',
      x: -0.1,
      y: 0,
      label: 'S',
      velocity: { x: 0.9, y: 0 },
      emissions: buildRelativisticPeriodicEmissions(8, CH5_PULSE_INTERVAL, 0.9)
},
  ];

  protected readonly time = signal(0);
  protected readonly tickCount = signal(0);
  protected readonly lastInterval = signal<number | null>(null);
  private lastArrival: number | null = null;

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('scene.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
      initial: 0
});
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, this.chapterRoute, 4);
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
    if (this.lastArrival !== null) {
      this.lastInterval.set(event.atTime - this.lastArrival);
    }
    this.lastArrival = event.atTime;
    playObserverWaveCrossingSound(
      this.#audio,
      event,
      this.time(),
      this.observers,
    );
  }

  protected intervalLabel(): string {
    const dt = this.lastInterval();
    return dt === null ? '—' : `${dt.toFixed(2)} t`;
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
