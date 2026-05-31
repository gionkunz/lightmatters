import {
  Component,
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
import { LmKickerComponent } from '@lm/design';
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import {
  CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER,
  CHAPTER_02_SPEED_OF_LIGHT_TITLE,
  CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_02_CAUSAL_LIMIT } from './step-02-causal-limit';

@Component({
  selector: 'lm-ch2-sol-step-02',
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
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
      [prevStepUrl]="'/chapter/2/step/1'"
      [nextStepUrl]="'/chapter/2/step/3'"
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
            speed budget · the arc is the fence
          </lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="680 / 460">
              <lm-spacetime-diagram
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                variant="single"
                [velocity]="velocity()"
                [budgetArc]="true"
                [showTipLabel]="true"
              />
            </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step02Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_02_CAUSAL_LIMIT;
  protected readonly chapterRoute = CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_02_SPEED_OF_LIGHT_TITLE;
  protected readonly stepsTotal = CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly velocity = signal(0.15);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('diagram.velocity', {
      get: () => this.velocity(),
      set: (v) => this.velocity.set(v),
      initial: 0.15,
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
