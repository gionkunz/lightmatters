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
import { lightTravelTimeSeconds, speedFromFlight } from '@lm/physics';
import {
  CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER,
  CHAPTER_02_SPEED_OF_LIGHT_TITLE,
  CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_04_MEASURE_C } from './step-04-measure-c';

/** Baseline between the two stations, in km. */
const BASELINE_KM = 1;
const RECEPTION_SOUND_MAX_LAG = 0.2;

@Component({
  selector: 'lm-ch2-sol-step-04',
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
      [prevStepUrl]="'/chapter/2/step/3'"
      [nextStepUrl]="'/chapter/2/step/5'"
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
            class="flex min-h-0 flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]"
          >
            <div class="mb-3.5 flex items-baseline justify-between gap-4">
              <lm-kicker [opacity]="0.55"
                >emitter → detector · 1 km baseline</lm-kicker
              >
            </div>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-light-scene
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  [time]="time()"
                  [extent]="1"
                  [fixedViewBox]="true"
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
            <lm-fact-line label="baseline · d" [value]="baselineLabel" />
            <lm-fact-line
              label="flight time · t"
              [value]="flightLabel()"
              accent="accent-2"
            />
            <lm-fact-line
              label="measured · c = d / t"
              [value]="speedLabel()"
              accent="accent-1"
            />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  readonly #audio = inject(AudioService);

  protected readonly step = STEP_04_MEASURE_C;
  protected readonly chapterRoute = CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_02_SPEED_OF_LIGHT_TITLE;
  protected readonly stepsTotal = CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly baselineLabel = `${BASELINE_KM} km`;

  protected readonly observers: LightSceneObserver[] = [
    { id: 'detector', x: 0.85, y: 0, label: 'detector', color: 'accent-2' },
  ];
  protected readonly sources: LightSceneSource[] = [
    {
      id: 'emitter',
      x: -0.85,
      y: 0,
      label: 'emitter',
      emissions: [{ atTime: 0, pulseId: 'flash' }],
    },
  ];

  protected readonly time = signal(0);
  protected readonly detected = signal(false);

  protected flightLabel(): string {
    if (!this.detected()) return '—';
    const micros = lightTravelTimeSeconds(BASELINE_KM) * 1e6;
    return `${micros.toFixed(2)} µs`;
  }

  protected speedLabel(): string {
    if (!this.detected()) return '—';
    const seconds = lightTravelTimeSeconds(BASELINE_KM);
    const speed = speedFromFlight(BASELINE_KM, seconds);
    return `${Math.round(speed).toLocaleString('en-US')} km/s`;
  }

  protected onReception(event: LightSceneReception): void {
    if (event.observerId !== 'detector') return;
    this.detected.set(true);
    if (this.time() - event.atTime > RECEPTION_SOUND_MAX_LAG) return;
    this.#audio.play('tick', { volume: 0.55, pan: 0.75 });
  }

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('scene.time', {
      get: () => this.time(),
      set: (v) => {
        this.time.set(v);
        if (v < 0.02) this.detected.set(false);
      },
      initial: 0,
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
