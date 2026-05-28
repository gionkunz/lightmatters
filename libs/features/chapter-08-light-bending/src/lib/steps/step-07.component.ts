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
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmKickerComponent, LmSliderComponent } from '@lm/design';
import {
  CHAPTER_08_ROUTE_NUMBER,
  CHAPTER_08_TITLE,
  CHAPTER_08_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { LmLightBendDiagramComponent } from '../light-bend-diagram.component';
import { LmBumpPlaneComponent } from '../bump-plane.component';
import { STEP_07_STRAIGHT_LINES } from './step-07-straight-lines';

@Component({
  selector: 'lm-ch8-step-07',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmLightBendDiagramComponent,
    LmBumpPlaneComponent,
    LmKickerComponent,
    LmSliderComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="7"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="true"
      [nextChapter]="true"
      [prevStepUrl]="'/chapter/12/step/6'"
      [nextStepUrl]="'/chapter/13/step/1'"
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
        <div class="flex min-h-0 flex-col gap-3 bg-paper-alt px-[26px] py-[22px]">
          <lm-kicker [opacity]="0.55">side view</lm-kicker>
          <div class="flex min-h-[42%] flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 220">
              <lm-light-bend-diagram
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                mode="dual"
                [progress]="1"
                [deflection]="mass()"
              />
            </lm-diagram-viewport>
          </div>
          <lm-slider
            label="mass"
            [value]="mass()"
            [valueFormat]="'percent'"
            (valueChange)="onMassChange($event)"
          />
          <lm-kicker [opacity]="0.45" class="mt-1">bump on a plane</lm-kicker>
          <div class="flex min-h-[42%] items-center justify-center">
            <lm-diagram-viewport #wellVp [aspectRatio]="560 / 260">
              <lm-bump-plane
                [width]="wellVp.size().width"
                [height]="wellVp.size().height"
                [mass]="mass()"
                [unfold]="unfold()"
              />
            </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step07Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_07_STRAIGHT_LINES;
  protected readonly chapterRoute = CHAPTER_08_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_08_TITLE;
  protected readonly stepsTotal = CHAPTER_08_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly mass = signal(0.55);
  protected readonly unfold = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('bend.mass', {
      get: () => this.mass(),
      set: (v) => this.mass.set(v),
      initial: 0.55,
    });
    this.registry.register('bump.unfold', {
      get: () => this.unfold(),
      set: (v) => this.unfold.set(v),
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

  protected onMassChange(value: number): void {
    if (this.runner.playbackActive()) {
      return;
    }
    this.mass.set(value);
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
