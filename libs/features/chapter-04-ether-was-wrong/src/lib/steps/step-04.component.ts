import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent } from '@lm/design';
import { emissionPosition } from '@lm/physics';
import {
  LmLightSceneComponent,
  type LightSceneSource,
} from '@lm/light-scene';
import {
  CHAPTER_04_TITLE,
  CHAPTER_04_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_04_MOVING_SOURCE } from './step-04-moving-source';

@Component({
  selector: 'lm-ch4-step-04',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmLightSceneComponent,
    LmFactLineComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="4"
      [chapterTitle]="chapterTitle"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(4)"
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
      (back)="goPrevStep()"
      (next)="goNextStep()"
      (goPrevious)="runner.goToPreviousCheckpoint()"
      (pauseRequested)="runner.pause()"
      (playRequested)="runner.resume()"
      (goNext)="runner.goToNextCheckpoint()"
      (checkpointSeek)="runner.goToCheckpoint($event)"
    >
      <div class="grid h-full grid-cols-[1fr_1.15fr] gap-14 px-16 pb-10 pt-[52px]">
        <lm-narrator-chat-feed
          [kicker]="step.kicker"
          [pastBeats]="runner.completedNarrateTexts()"
          [currentText]="runner.narrationText()"
          [visibleCount]="runner.narrationVisibleCount()"
        />
        <div class="flex flex-col">
          <div class="flex flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]">
            <lm-kicker [opacity]="0.55" class="mb-3.5">S moving at 0.4 c · pulse anchored at birth</lm-kicker>
            <div class="flex flex-1 items-center justify-center">
              <lm-light-scene
                [time]="time()"
                [extent]="0.95"
                [observers]="[]"
                [sources]="sources"
                [width]="560"
                [height]="380"
              />
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
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly router = inject(Router);
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
      emissions: [{ atTime: 0, pulseId: 'p1' }],
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

  protected goPrevStep(): void {
    void this.router.navigateByUrl('/ch/04/step/3');
  }
  protected goNextStep(): void {
    void this.router.navigateByUrl('/ch/04/step/5');
  }
}
