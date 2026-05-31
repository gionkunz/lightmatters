import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  LmDiagramViewportComponent,
  LmNarratorComponent,
  LmStepFrameComponent,
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmSliderComponent } from '@lm/design';
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import {
  CHAPTER_01_TITLE,
  CHAPTER_01_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { STEP_03_SPACETIME } from './step-03-spacetime';

@Component({
  selector: 'lm-step-03',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
        LmNarratorComponent,
    LmSpacetimeDiagramComponent,
    LmSliderComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="1"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="3"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(3)"
      [prevStepUrl]="'/chapter/1/step/2'"
      [nextStepUrl]="'/chapter/1/step/4'"
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
        class="mx-auto grid h-full max-w-[1100px] w-full grid-rows-[auto_1fr_auto] gap-6 px-20 pb-10 pt-16"
      >
        <lm-narrator
          [kicker]="step.kicker"
          [text]="runner.narrationText()"
          [visibleCount]="runner.narrationVisibleCount()"
        />

        <div class="flex min-h-0 flex-1 items-center justify-center">
          <lm-diagram-viewport #diagramVp [aspectRatio]="680 / 460">
            <lm-spacetime-diagram
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
            variant="full"
            [position]="position()"
            [time]="time()"
          />
              </lm-diagram-viewport>
        </div>

        <div class="mx-auto flex w-full max-w-[520px] flex-col gap-4">
          <lm-slider
            label="position"
            [value]="position()"
            [disabled]="!runner.atExplorationWait()"
            (valueChange)="onPositionChange($event)"
          />
          <lm-slider
            label="time"
            [value]="time()"
            [disabled]="!runner.atExplorationWait()"
            (valueChange)="onTimeChange($event)"
          />
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step03Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_03_SPACETIME;
  protected readonly chapterTitle = CHAPTER_01_TITLE;
  protected readonly stepsTotal = CHAPTER_01_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly position = signal(0);
  protected readonly time = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('diagram.position', {
      get: () => this.position(),
      set: (v) => this.position.set(v),
      initial: 0
});
    this.registry.register('diagram.time', {
      get: () => this.time(),
      set: (v) => this.time.set(v),
      initial: 0
});
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, 1, 3);
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
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    const tag = (event.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') {
      return;
    }
    event.preventDefault();
    if (this.runner.isPaused()) {
      this.runner.resume();
    } else if (this.runner.waitingForUser()) {
      this.runner.advance();
    } else if (this.runner.playbackActive()) {
      this.runner.pause();
    } else if (!this.runner.isComplete()) {
      this.runner.goToNextCheckpoint();
    }
  }

  protected onPositionChange(value: number): void {
    if (this.runner.atExplorationWait()) {
      this.position.set(value);
    }
  }

  protected onTimeChange(value: number): void {
    if (this.runner.atExplorationWait()) {
      this.time.set(value);
    }
  }

}
