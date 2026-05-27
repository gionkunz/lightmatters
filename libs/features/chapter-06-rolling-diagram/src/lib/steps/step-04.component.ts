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
import { LmKickerComponent } from '@lm/design';
import { LmCurvedSurfaceComponent } from '@lm/curved-surface';
import {
  CHAPTER_06_TITLE,
  CHAPTER_06_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { STEP_04_GEODESICS } from './step-04-geodesics';

@Component({
  selector: 'lm-ch6-step-04',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
        LmNarratorChatFeedComponent,
    LmCurvedSurfaceComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="6"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(4)"
      [prevStepUrl]="'/ch/06/step/3'"
      [nextStepUrl]="'/ch/06/step/5'"
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
        <div class="flex min-h-0 flex-col bg-paper-alt px-[26px] py-[22px]">
          <lm-kicker [opacity]="0.55" class="mb-3.5">gravity, geometrically</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-curved-surface
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
              [fold]="1"
              [curvature]="0.4"
              [time]="time()"
              [unfold]="unfold()"
              [showTrail]="true"
              [trailLength]="120"
              [trailSpan]="1"
              [showGeodesic]="true"
              [showAxisLabels]="true"
              worldlineMode="geodesic-fall"
            />
              </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_04_GEODESICS;
  protected readonly chapterTitle = CHAPTER_06_TITLE;
  protected readonly stepsTotal = CHAPTER_06_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly time = signal(0);
  protected readonly unfold = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('surface.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
      initial: 0
});
    this.registry.register('surface.unfold', {
      get: () => this.unfold(),
      set: (v) => this.unfold.set(v),
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
