import {
  Component,
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
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { AudioService, LmFactLineComponent, LmKickerComponent } from '@lm/design';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneReception,
  type LightSceneSource,
} from '@lm/light-scene';
import {
  ANDROMEDA_DISTANCE_LY,
  formatMillionsOfYears,
} from '@lm/physics';
import {
  CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER,
  CHAPTER_02_SPEED_OF_LIGHT_TITLE,
  CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_03_NO_TIME } from './step-03-no-time';
import {
  STEP_03_M31_X,
  STEP_03_SCENE_EXTENT,
  STEP_03_YOU_X,
} from './step-03-layout';

const RECEPTION_SOUND_MAX_LAG = 0.15;

@Component({
  selector: 'lm-ch2-sol-step-03',
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
      [step]="3"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(3)"
      [prevStepUrl]="'/chapter/2/step/2'"
      [nextStepUrl]="'/chapter/2/step/4'"
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
          <div
            class="flex min-h-0 flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]"
          >
            <lm-kicker [opacity]="0.55" class="mb-3.5">
              M31 · Andromeda → you
            </lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-light-scene
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  [time]="time()"
                  [extent]="sceneExtent"
                  [fixedViewBox]="false"
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
            <lm-fact-line label="distance · M31" [value]="distanceLabel" />
            <lm-fact-line
              label="travel time · your clock"
              [value]="travelLabel"
              accent="accent-1"
            />
            <lm-fact-line
              label="proper time · on a light path"
              [value]="properTimeLabel"
              accent="accent-2"
            />
            <lm-fact-line label="pulse received" [value]="receivedLabel()" />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step03Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  readonly #audio = inject(AudioService);

  protected readonly step = STEP_03_NO_TIME;
  protected readonly chapterRoute = CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_02_SPEED_OF_LIGHT_TITLE;
  protected readonly stepsTotal = CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly distanceLabel = '≈ 2.5 million ly';
  protected readonly travelLabel = formatMillionsOfYears(ANDROMEDA_DISTANCE_LY);
  protected readonly properTimeLabel = '0';
  protected readonly sceneExtent = STEP_03_SCENE_EXTENT;

  protected readonly observers: LightSceneObserver[] = [
    { id: 'you', x: STEP_03_YOU_X, y: 0, label: 'You', color: 'accent-2' },
  ];
  protected readonly sources: LightSceneSource[] = [
    {
      id: 'm31',
      x: STEP_03_M31_X,
      y: 0,
      label: 'M31',
      emissions: [{ atTime: 0, pulseId: 'photon' }],
    },
  ];

  protected readonly time = signal(0);
  protected readonly received = signal(false);
  protected readonly receivedLabel = signal('—');

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('scene.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
      initial: 0,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, this.chapterRoute, 3);
    this.totalDurationMs = this.runner.getTotalDurationMs();
  }

  protected onReception(event: LightSceneReception): void {
    if (event.observerId !== 'you') return;
    this.received.set(true);
    this.receivedLabel.set('yes');
    if (this.time() - event.atTime > RECEPTION_SOUND_MAX_LAG) return;
    this.#audio.play('tick', { volume: 0.55, pan: 0.35 });
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
