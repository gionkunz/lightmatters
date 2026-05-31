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
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import {
  AudioService,
  LmFactLineComponent,
  LmKickerComponent,
} from '@lm/design';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneReception,
  type LightSceneSource,
} from '@lm/light-scene';
import {
  EARTH_MOON_DISTANCE_KM,
  EARTH_SUN_DISTANCE_KM,
  earthLapsPerSecond,
  lightTravelTimeSeconds,
  SPEED_OF_LIGHT_KMS,
} from '@lm/physics';
import {
  CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER,
  CHAPTER_02_SPEED_OF_LIGHT_TITLE,
  CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_01_HOW_FAST } from './step-01-how-fast';

/** Scene-time lag beyond which an arrival is treated as a seek (silent). */
const RECEPTION_SOUND_MAX_LAG = 0.15;

@Component({
  selector: 'lm-ch2-sol-step-01',
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
      [step]="1"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(1)"
      [prevStepUrl]="'/chapter/1/step/4'"
      [nextStepUrl]="'/chapter/2/step/2'"
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
                >space · one flash · expands at $c$</lm-kicker
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
            <lm-fact-line label="speed of light · c" [value]="cLabel" />
            <lm-fact-line label="Earth laps · per second" [value]="lapsLabel" />
            <lm-fact-line label="Moon → Earth" [value]="moonLabel" />
            <lm-fact-line label="Sun → Earth" [value]="sunLabel" />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step01Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  readonly #audio = inject(AudioService);

  protected readonly step = STEP_01_HOW_FAST;
  protected readonly chapterRoute = CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_02_SPEED_OF_LIGHT_TITLE;
  protected readonly stepsTotal = CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly cLabel = `${Math.round(SPEED_OF_LIGHT_KMS).toLocaleString('en-US')} km/s`;
  protected readonly lapsLabel = `${earthLapsPerSecond().toFixed(1)} ×`;
  protected readonly moonLabel = `${lightTravelTimeSeconds(EARTH_MOON_DISTANCE_KM).toFixed(1)} s`;
  protected readonly sunLabel = this.formatSunTime();

  protected readonly observers: LightSceneObserver[] = [
    { id: 'a', x: -0.6, y: 0.2, label: 'A', color: 'accent-1' },
  ];
  protected readonly sources: LightSceneSource[] = [
    {
      id: 's',
      x: 0,
      y: 0,
      label: 'S',
      emissions: [{ atTime: 0, pulseId: 'p1' }],
    },
  ];

  protected readonly time = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('scene.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
      initial: 0,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    this.totalDurationMs = this.runner.getTotalDurationMs();
  }

  private formatSunTime(): string {
    const seconds = lightTravelTimeSeconds(EARTH_SUN_DISTANCE_KM);
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.round(seconds - minutes * 60);
    return `${minutes} min ${remainder} s`;
  }

  protected onReception(event: LightSceneReception): void {
    if (event.observerId !== 'a') return;
    if (this.time() - event.atTime > RECEPTION_SOUND_MAX_LAG) return;
    const observer = this.observers.find((o) => o.id === event.observerId);
    const pan = observer ? Math.max(-1, Math.min(1, observer.x / 0.75)) : 0;
    this.#audio.play('tick', { volume: 0.55, pan });
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
