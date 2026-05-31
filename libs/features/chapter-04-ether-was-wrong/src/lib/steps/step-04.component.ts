import {
  Component,
  computed,
  HostListener,
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
import { LmFactLineComponent, LmKickerComponent } from '@lm/design';
import { emissionPosition } from '@lm/physics';
import {
  LmLightSceneComponent,
  type LightSceneSource
} from '@lm/light-scene';
import {
  CHAPTER_04_TITLE,
  CHAPTER_04_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { STEP_04_MOVING_SOURCE } from './step-04-moving-source';

@Component({
  selector: 'lm-ch4-step-04',
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
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(4)"
      [prevStepUrl]="'/chapter/5/step/3'"
      [nextStepUrl]="'/chapter/5/step/5'"
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
            <div class="mb-3.5 flex items-baseline justify-between gap-4">
              <lm-kicker [opacity]="0.55">S moving at 0.4 c · pulse anchored at birth</lm-kicker>
              <div
                class="flex items-center gap-4 font-mono text-[length:var(--lm-text-mono-sm)] uppercase tracking-wider opacity-75"
              >
                <span class="flex items-center gap-1.5">
                  <svg width="22" height="6" aria-hidden="true">
                    <line
                      x1="0"
                      y1="3"
                      x2="22"
                      y2="3"
                      class="stroke-ink"
                      stroke-width="1.6"
                    />
                  </svg>
                  actual · c
                </span>
                <span class="flex items-center gap-1.5 text-accent-1">
                  <svg width="22" height="6" aria-hidden="true">
                    <line
                      x1="0"
                      y1="3"
                      x2="22"
                      y2="3"
                      class="stroke-accent-1"
                      stroke-width="1.6"
                      stroke-dasharray="4 4"
                    />
                  </svg>
                  emission theory · c + v
                </span>
              </div>
            </div>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-light-scene
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [time]="time()"
                [extent]="0.95"
                [observers]="[]"
                [sources]="sources"
                [showEmissionTheoryGhost]="true"
                [showSourceEmissionOrigins]="true"
              />
              </lm-diagram-viewport>
            </div>
          </div>
          <div
            class="mt-[22px] grid grid-cols-2 gap-x-6 gap-y-2 border-t border-ink-faint pt-[22px]"
          >
            <lm-fact-line
              label="source · position"
              [value]="sourcePosLabel()"
              accent="accent-2"
            />
            <lm-fact-line
              label="pulse origin · fixed at"
              [value]="emitPosLabel()"
              accent="accent-1"
            />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_04_MOVING_SOURCE;
  protected readonly chapterTitle = CHAPTER_04_TITLE;
  protected readonly stepsTotal = CHAPTER_04_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly sourceVelocity = { x: 0.4, y: 0 };
  protected readonly sources: LightSceneSource[] = [
    {
      id: 's',
      x: -0.35,
      y: 0,
      label: 'S',
      velocity: this.sourceVelocity,
      emissions: [{ atTime: 0, pulseId: 'p1' }]
},
  ];
  protected readonly time = signal(0);

  protected readonly sourcePosLabel = computed(() => {
    const t = this.time();
    const x = -0.35 + this.sourceVelocity.x * t;
    return t <= 0 ? '(−0.35, 0)' : `(${x.toFixed(2)}, 0)`;
  });

  protected readonly emitPosLabel = computed(() => {
    const p = emissionPosition(
      { x: -0.35, y: 0 },
      this.sourceVelocity,
      0,
    );
    return `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`;
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
    registerFeedbackStepContext(this.runner, 5, 4);
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
