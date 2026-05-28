import {
  Component,
  computed,
  effect,
  HostListener,
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
import { LmKickerComponent, LmSliderComponent } from '@lm/design';
import { LmCurvedSurfaceComponent } from '@lm/curved-surface';
import {
  isEscapeSpatialBudget,
  spatialBudgetPassThroughDurationScale,
  wellStartXNormFromPositionFraction,
} from '@lm/physics';
import {
  CHAPTER_07_ROUTE_NUMBER,
  CHAPTER_07_TITLE,
  CHAPTER_07_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_06_ESCAPE } from './step-06-escape';

/** Reference pass-through duration from far outer space (shorter trips scale down). */
const PASS_THROUGH_BASE_MS = 22_000;

@Component({
  selector: 'lm-ch7-step-06',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmCurvedSurfaceComponent,
    LmKickerComponent,
    LmSliderComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="6"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="true"
      [nextChapter]="true"
      [prevStepUrl]="'/chapter/11/step/5'"
      [nextStepUrl]="'/chapter/12/step/1'"
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
        <div class="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
          <lm-narrator-chat-feed
            [kicker]="step.kicker"
            [pastBeats]="runner.completedNarrateTexts()"
            [currentText]="runner.narrationText()"
            [visibleCount]="runner.narrationVisibleCount()"
          />
        </div>
        <div class="flex min-h-0 flex-col gap-4 bg-paper-alt px-[26px] py-[22px]">
          <lm-kicker [opacity]="0.55">space ↔ time</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
              <lm-curved-surface
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                surfaceProfile="well"
                [wellReveal]="1"
                [wellMorph]="1"
                wellLaunchMode="spatial-budget"
                [spatialFraction]="spatialFraction()"
                [wellStartXNorm]="wellStartXNorm()"
                [time]="time()"
                [showTrail]="true"
                [trailLength]="256"
                [trailSpan]="0.35"
                [showEarthSphere]="true"
                worldlineMode="well-trajectory"
                wellTrajectoryMode="pass-through"
                [showAxisLabels]="true"
              />
            </lm-diagram-viewport>
          </div>
          <lm-slider
            label="spatial motion"
            [value]="spatialFraction()"
            [valueFormat]="'percent'"
            (valueChange)="onSpatialFractionChange($event)"
          />
          <lm-slider
            label="starting position"
            [value]="startPositionFraction()"
            [valueFormat]="'percent'"
            (valueChange)="onStartPositionChange($event)"
          />
          <p class="m-0 font-mono text-[10px] uppercase tracking-wider text-ink opacity-55">
            {{ launchLabel() }}
          </p>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step06Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();
  private replayRaf: number | null = null;
  private loopGeneration = 0;

  protected readonly step = STEP_06_ESCAPE;
  protected readonly chapterRoute = CHAPTER_07_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_07_TITLE;
  protected readonly stepsTotal = CHAPTER_07_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly spatialFraction = signal(0.22);
  protected readonly startPositionFraction = signal(0);
  protected readonly wellStartXNorm = computed(() =>
    wellStartXNormFromPositionFraction(this.startPositionFraction()),
  );
  protected readonly passThroughDurationMs = computed(() =>
    PASS_THROUGH_BASE_MS *
    spatialBudgetPassThroughDurationScale(
      this.spatialFraction(),
      this.wellStartXNorm(),
      1,
    ),
  );
  protected readonly time = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('surface.spatialFraction', {
      get: () => this.spatialFraction(),
      set: (v) => this.spatialFraction.set(v),
      initial: 0.22,
    });
    this.registry.register('surface.startPositionFraction', {
      get: () => this.startPositionFraction(),
      set: (v) => this.startPositionFraction.set(v),
      initial: 0,
    });
    this.registry.register('surface.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
      initial: 0,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    this.totalDurationMs = this.runner.getTotalDurationMs();

    effect(() => {
      const interactive =
        this.runner.waitingForUser() && !this.runner.playbackActive();
      if (interactive) {
        this.startTrajectoryLoop();
      } else if (this.runner.playbackActive()) {
        this.stopTrajectoryLoop();
      }
    });
  }

  ngOnInit(): void {
    this.runner.start();
  }

  ngOnDestroy(): void {
    this.stopTrajectoryLoop();
    this.runner.destroy();
    this.registry.clear();
  }

  protected launchLabel(): string {
    const s = this.spatialFraction();
    const start = this.wellStartXNorm();
    const mirror = -start;
    const startPct = Math.round(this.startPositionFraction() * 100);
    const timePct = Math.round((1 - s) * 100);
    const startLabel =
      startPct === 0
        ? 'far outer space'
        : startPct === 100
          ? 'weightless center'
          : `${startPct}% toward center`;
    if (startPct === 100) {
      return `${timePct}% time budget — circling at the weightless center`;
    }
    if (s >= 0.99) {
      return `from ${startLabel} — pure spatial motion (light-like)`;
    }
    if (isEscapeSpatialBudget(s)) {
      return `from ${startLabel} — arrives at +${mirror.toFixed(2)}`;
    }
    return `${timePct}% time budget — from ${startLabel}, arrives at +${mirror.toFixed(2)}`;
  }

  protected onSpatialFractionChange(value: number): void {
    if (this.runner.playbackActive()) {
      return;
    }
    this.spatialFraction.set(value);
    if (this.runner.waitingForUser()) {
      this.startTrajectoryLoop();
    }
  }

  protected onStartPositionChange(value: number): void {
    if (this.runner.playbackActive()) {
      return;
    }
    this.startPositionFraction.set(value);
    if (this.runner.waitingForUser()) {
      this.startTrajectoryLoop();
    }
  }

  private startTrajectoryLoop(): void {
    this.stopTrajectoryLoop();
    const generation = ++this.loopGeneration;
    const cycleStart = performance.now();

    const tick = (now: number) => {
      if (generation !== this.loopGeneration) {
        return;
      }
      if (this.runner.playbackActive()) {
        this.replayRaf = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - cycleStart;
      const duration = this.passThroughDurationMs();
      const t = Math.min(1, elapsed / duration);
      this.time.set(t);
      if (t < 1) {
        this.replayRaf = requestAnimationFrame(tick);
      }
    };

    this.time.set(0);
    this.replayRaf = requestAnimationFrame(tick);
  }

  private stopTrajectoryLoop(): void {
    this.loopGeneration++;
    if (this.replayRaf !== null) {
      cancelAnimationFrame(this.replayRaf);
      this.replayRaf = null;
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
