import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  LmDiagramViewportComponent,
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmKickerComponent } from '@lm/design';
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import { TWIN_TURNAROUND, TWIN_V_OVER_C } from '../twin.constants';
import {
  CHAPTER_08_TWIN_ROUTE_NUMBER,
  CHAPTER_08_TWIN_TITLE,
  CHAPTER_08_TWIN_TOTAL_STEPS,
} from '../step-registry';
import { STEP_05_OUTRO } from './step-05-outro';

@Component({
  selector: 'lm-ch8-twin-step-05',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmSpacetimeDiagramComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="5"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="true"
      [nextChapter]="true"
      [prevStepUrl]="'/chapter/9/step/4'"
      [nextStepUrl]="'/chapter/10/step/1'"
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
        <div class="flex min-h-0 flex-col bg-paper-alt px-[26px] py-[22px]">
          <lm-kicker [opacity]="0.55" class="mb-3.5">
            proper time · the length of the path
          </lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="520 / 460">
              <lm-spacetime-diagram
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                variant="twin"
                [twinVOverC]="vOverC"
                [twinTurnaround]="turnaround"
                [twinProgress]="1"
              />
            </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step05Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_05_OUTRO;
  protected readonly chapterRoute = CHAPTER_08_TWIN_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_08_TWIN_TITLE;
  protected readonly stepsTotal = CHAPTER_08_TWIN_TOTAL_STEPS;
  protected readonly vOverC = TWIN_V_OVER_C;
  protected readonly turnaround = TWIN_TURNAROUND;

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, this.chapterRoute, 5);
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
