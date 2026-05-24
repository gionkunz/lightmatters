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
} from '../step-registry';
import { STEP_01_POSITION } from './step-01-position';

@Component({
  selector: 'lm-step-01',
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
      [step]="1"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="false"
      [showPlayback]="!runner.isComplete()"
      [progress]="runner.progress()"
      [elapsedMs]="runner.elapsedMs()"
      [totalMs]="totalDurationMs"
      [beatMarkers]="runner.beatMarkers()"
      [playbackActive]="runner.playbackActive()"
      [playbackPaused]="runner.isPaused()"
      [canRewind]="!runner.isComplete()"
      [canFastForward]="runner.playbackActive() || runner.isPaused()"
      (back)="goHome()"
      (rewind)="runner.rewind()"
      (pauseRequested)="runner.pause()"
      (playRequested)="runner.resume()"
      (fastForward)="runner.fastForward()"
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
            variant="position-only"
            [position]="position()"
            [width]="680"
            [height]="200"
          />
        </div>

        <div class="mx-auto w-full max-w-[520px]">
          <lm-slider
            label="position"
            [value]="position()"
            [disabled]="!runner.atExplorationWait()"
            (valueChange)="onSliderChange($event)"
          />
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step01Component implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_01_POSITION;
  protected readonly chapterTitle = CHAPTER_01_TITLE;
  protected readonly stepsTotal = CHAPTER_01_TOTAL_STEPS;
  protected readonly position = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('diagram.position', {
      get: () => this.position(),
      set: (v) => this.position.set(v),
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
      this.runner.fastForward();
    }
  }

  protected onSliderChange(value: number): void {
    if (this.runner.atExplorationWait()) {
      this.position.set(value);
    }
  }

  protected goHome(): void {
    void this.router.navigateByUrl('/');
  }
}
