import {
  Component,
  effect,
  HostListener,
  inject,
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
import { AudioService, LmFactLineComponent, LmKickerComponent } from '@lm/design';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneReception,
  type LightSceneSource
} from '@lm/light-scene';
import {
  CHAPTER_03_TITLE,
  CHAPTER_03_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import {
  playObserverReceptionSound,
  RECEPTION_SOUND_WINDOW,
} from '../reception-sound';
import { STEP_03_ONE_OF_THEM_MOVES } from './step-03-one-of-them-moves';

@Component({
  selector: 'lm-ch3-step-03',
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
      [chapter]="4"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="3"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(3)"
      [prevStepUrl]="'/chapter/4/step/2'"
      [nextStepUrl]="'/chapter/4/step/4'"
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
          <div class="flex min-h-0 flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]">
            <div class="mb-3.5 flex items-baseline justify-between gap-4">
              <lm-kicker [opacity]="0.55">B moving toward S at 0.4 c</lm-kicker>
            </div>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-light-scene
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [time]="time()"
                [extent]="0.95"
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
              label="A · arrived at"
              [value]="format(aArrived())"
              accent="accent-1"
            />
            <lm-fact-line
              label="B · arrived at"
              [value]="format(bArrived())"
              accent="accent-2"
            />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step03Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  readonly #audio = inject(AudioService);

  protected readonly step = STEP_03_ONE_OF_THEM_MOVES;
  protected readonly chapterTitle = CHAPTER_03_TITLE;
  protected readonly stepsTotal = CHAPTER_03_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly observers: LightSceneObserver[] = [
    { id: 'a', x: -0.6, y: 0, label: 'A', color: 'accent-1' },
    {
      id: 'b',
      x: 0.6,
      y: 0,
      label: 'B',
      color: 'accent-2',
      velocity: { x: -0.4, y: 0 }
},
  ];
  protected readonly sources: LightSceneSource[] = [
    { id: 's', x: 0, y: 0, label: 'S', emissions: [{ atTime: 0, pulseId: 'p1' }] },
  ];

  protected readonly time = signal(0);
  protected readonly aArrived = signal<number | null>(null);
  protected readonly bArrived = signal<number | null>(null);

  protected onReception(event: LightSceneReception): void {
    if (event.observerId === 'a' && this.aArrived() === null) {
      this.aArrived.set(event.atTime);
      playObserverReceptionSound(
        this.#audio,
        event,
        this.time(),
        this.observers,
      );
    } else if (event.observerId === 'b' && this.bArrived() === null) {
      this.bArrived.set(event.atTime);
      playObserverReceptionSound(
        this.#audio,
        event,
        this.time(),
        this.observers,
      );
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
      initial: 0
});
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    this.totalDurationMs = this.runner.getTotalDurationMs();

    effect(() => {
      if (this.time() < RECEPTION_SOUND_WINDOW) {
        this.aArrived.set(null);
        this.bArrived.set(null);
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
    if (this.runner.isPaused()) this.runner.resume();
    else if (this.runner.waitingForUser()) this.runner.advance();
    else if (this.runner.playbackActive()) this.runner.pause();
    else if (!this.runner.isComplete()) this.runner.goToNextCheckpoint();
  }
}
