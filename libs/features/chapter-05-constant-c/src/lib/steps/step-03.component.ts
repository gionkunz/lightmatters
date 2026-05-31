import {
  Component,
  computed,
  HostListener,
  OnDestroy,
  OnInit,
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
import { LmKickerComponent, LmSliderComponent } from '@lm/design';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneSource,
} from '@lm/light-scene';
import {
  B_SPEED,
  FLASH_EMISSION,
  SCENE_EXTENT,
} from '../light-sphere.constants';
import {
  CHAPTER_05_CONSTANT_C_ROUTE_NUMBER,
  CHAPTER_05_CONSTANT_C_TITLE,
  CHAPTER_05_CONSTANT_C_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_03_FRAME_SWITCH } from './step-03-frame-switch';

@Component({
  selector: 'lm-ch5-constant-c-step-03',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmLightSceneComponent,
    LmKickerComponent,
    LmSliderComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="3"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(3)"
      [prevStepUrl]="'/chapter/6/step/2'"
      [nextStepUrl]="'/chapter/6/step/4'"
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
          <div class="flex min-h-0 flex-1 flex-col bg-paper-alt px-[26px] py-[22px]">
            <lm-kicker [opacity]="0.55" class="mb-3.5">
              B's frame · centred on B
            </lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-light-scene
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  [time]="time()"
                  [extent]="extent"
                  [fixedViewBox]="true"
                  [observers]="observers()"
                  [sources]="sources"
                />
              </lm-diagram-viewport>
            </div>
          </div>
          <div class="mt-[22px] border-t border-ink-faint pt-[22px]">
            <lm-slider
              label="v / c"
              [value]="vOverC()"
              accent="accent-2"
              [disabled]="!runner.atExplorationWait()"
              (valueChange)="onVOverCChange($event)"
            />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step03Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_03_FRAME_SWITCH;
  protected readonly chapterRoute = CHAPTER_05_CONSTANT_C_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_05_CONSTANT_C_TITLE;
  protected readonly stepsTotal = CHAPTER_05_CONSTANT_C_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly extent = SCENE_EXTENT;

  protected readonly sources: LightSceneSource[] = [
    { id: 'flash', x: 0, y: 0, emissions: [FLASH_EMISSION] },
  ];

  protected readonly vOverC = signal(B_SPEED);
  protected readonly observers = computed<LightSceneObserver[]>(() => {
    const v = this.vOverC();
    return [
      { id: 'b', x: 0, y: 0, label: 'B', color: 'accent-2' },
      {
        id: 'a',
        x: 0,
        y: 0,
        label: 'A',
        color: 'accent-1',
        velocity: { x: -v, y: 0 },
      },
    ];
  });

  protected readonly time = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('scene.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
      initial: 0,
    });
    this.registry.register('B.vOverC', {
      get: () => this.vOverC(),
      set: (v) => this.vOverC.set(v),
      initial: B_SPEED,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, this.chapterRoute, 3);
    this.totalDurationMs = this.runner.getTotalDurationMs();
  }

  ngOnInit(): void {
    this.runner.start();
  }

  ngOnDestroy(): void {
    this.runner.destroy();
    this.registry.clear();
  }

  protected onVOverCChange(value: number): void {
    if (this.runner.atExplorationWait()) {
      this.vOverC.set(value);
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
