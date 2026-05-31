import {
  Component,
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
import { LmKickerComponent } from '@lm/design';
import { LmCurvedSurfaceComponent } from '@lm/curved-surface';
import {
  CHAPTER_06_ROUTE_NUMBER,
  CHAPTER_06_TITLE,
  CHAPTER_06_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { STEP_03_CONE } from './step-03-cone';

@Component({
  selector: 'lm-ch6-step-03',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
        LmNarratorChatFeedComponent,
    LmCurvedSurfaceComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
      [prevStepUrl]="'/chapter/11/step/1'"
      [nextStepUrl]="'/chapter/11/step/3'"
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
          <lm-kicker [opacity]="0.55" class="mb-3.5">flat → cylinder → cone</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-curved-surface
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
              [fold]="1"
              [curvature]="curvature()"
              [time]="0.35"
              [showTrail]="false"
              [showAxisLabels]="true"
              worldlineMode="orbit"
            />
              </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step03Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_03_CONE;
  protected readonly chapterRoute = CHAPTER_06_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_06_TITLE;
  protected readonly stepsTotal = CHAPTER_06_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly curvature = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('surface.curvature', {
      get: () => this.curvature(),
      set: (v) => this.curvature.set(v),
      initial: 0
});
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, this.chapterRoute, 2);
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
