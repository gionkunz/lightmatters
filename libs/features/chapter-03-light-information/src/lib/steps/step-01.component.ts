import {
  Component,
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
  LmKickerComponent
} from '@lm/design';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneSource,
  type LightSceneReception
} from '@lm/light-scene';
import {
  CHAPTER_03_TITLE,
  CHAPTER_03_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { STEP_01_LIGHT_THROUGH_SPACE } from './step-01-light-through-space';

@Component({
  selector: 'lm-ch3-step-01',
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
      [chapter]="3"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="1"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(1)"
      [prevStepUrl]="'/ch/02/step/3'"
      [nextStepUrl]="'/ch/03/step/2'"
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
              <lm-kicker [opacity]="0.55"
                >space · top-down · light expands at $c$</lm-kicker
              >
            </div>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 420">
                <lm-light-scene
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [time]="time()"
                [extent]="1"
                [observers]="observers"
                [sources]="sources"
                (reception)="onReception($event)"
              />
              </lm-diagram-viewport>
            </div>
          </div>

          <div
            class="mt-[22px] grid grid-cols-2 gap-x-6 gap-y-2 border-t border-ink-faint pt-[22px]"
          >
            <lm-fact-line
              label="A · pulses received"
              [value]="aReceivedLabel()"
              accent="accent-1"
            />
            <lm-fact-line label="elapsed · scene time" [value]="timeLabel()" />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step01Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_01_LIGHT_THROUGH_SPACE;
  protected readonly chapterTitle = CHAPTER_03_TITLE;
  protected readonly stepsTotal = CHAPTER_03_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly observers: LightSceneObserver[] = [
    { id: 'a', x: -0.6, y: 0.2, label: 'A', color: 'accent-1' },
  ];
  protected readonly sources: LightSceneSource[] = [
    {
      id: 's',
      x: 0,
      y: 0,
      label: 'S',
      emissions: [{ atTime: 0, pulseId: 'p1' }]
},
  ];

  protected readonly time = signal(0);
  protected readonly aReceived = signal(0);

  protected aReceivedLabel(): string {
    return this.aReceived().toString();
  }
  protected timeLabel(): string {
    const t = this.time();
    return t > 0 ? `${t.toFixed(2)} t` : '—';
  }

  protected onReception(event: LightSceneReception): void {
    if (event.observerId === 'a') {
      this.aReceived.update((v) => v + 1);
    }
  }

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
