import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  LmNarratorComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmSliderComponent } from '@lm/design';
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import {
  CHAPTER_01_TITLE,
  CHAPTER_01_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_04_MOVING_SPACETIME } from './step-04-moving-spacetime';

@Component({
  selector: 'lm-step-04',
  imports: [
    LmStepFrameComponent,
    LmNarratorComponent,
    LmSpacetimeDiagramComponent,
    LmSliderComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="1"
      [chapterTitle]="chapterTitle"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(4)"
      [showPlayback]="!runner.isComplete()"
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

        <div class="flex items-center justify-center">
          <lm-spacetime-diagram
            variant="single"
            [velocity]="velocity()"
            [width]="680"
            [height]="460"
          />
        </div>

        <div class="mx-auto w-full max-w-[520px]">
          <lm-slider
            label="v / c"
            [value]="velocity()"
            [disabled]="!runner.atExplorationWait()"
            (valueChange)="onVelocityChange($event)"
          />
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_04_MOVING_SPACETIME;
  protected readonly chapterTitle = CHAPTER_01_TITLE;
  protected readonly stepsTotal = CHAPTER_01_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly velocity = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('diagram.velocity', {
      get: () => this.velocity(),
      set: (v) => this.velocity.set(v),
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
    } else if (this.runner.atReadPause()) {
      this.runner.skipReadPause();
    } else if (this.runner.waitingForUser()) {
      this.runner.advance();
    } else if (this.runner.playbackActive()) {
      this.runner.pause();
    } else if (!this.runner.isComplete()) {
      this.runner.goToNextCheckpoint();
    }
  }

  protected onVelocityChange(value: number): void {
    if (this.runner.atExplorationWait()) {
      this.velocity.set(value);
    }
  }

  protected goPrevStep(): void {
    void this.router.navigateByUrl('/ch/01/step/3');
  }
}
