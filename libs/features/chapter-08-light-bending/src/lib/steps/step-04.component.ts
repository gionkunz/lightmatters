import {
  Component,
  computed,
  HostListener,
  OnDestroy,
  OnInit,
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
import { lightBend2DArcLength } from '@lm/physics';
import {
  CHAPTER_08_ROUTE_NUMBER,
  CHAPTER_08_TITLE,
  CHAPTER_08_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { LmLightBendDiagramComponent } from '../light-bend-diagram.component';
import { STEP_04_PATH_PUZZLE } from './step-04-path-puzzle';

@Component({
  selector: 'lm-ch8-step-04',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmLightBendDiagramComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(4)"
      [prevStepUrl]="'/chapter/13/step/3'"
      [nextStepUrl]="'/chapter/13/step/5'"
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
          <lm-kicker [opacity]="0.55">path lengths</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
              <lm-light-bend-diagram
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                mode="dual"
                [progress]="1"
                [showPathHints]="true"
              />
            </lm-diagram-viewport>
          </div>
          <p class="m-0 font-mono text-[10px] uppercase tracking-wider text-ink opacity-65">
            inner path {{ innerArcPct() }}% · outer path {{ outerArcPct().toFixed(1) }}%
            (outer is longer)
          </p>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_04_PATH_PUZZLE;
  protected readonly chapterRoute = CHAPTER_08_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_08_TITLE;
  protected readonly stepsTotal = CHAPTER_08_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly innerArcPct = computed(() => 100);
  protected readonly outerArcPct = computed(() =>
    (lightBend2DArcLength('outer') / lightBend2DArcLength('inner')) * 100,
  );
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, this.chapterRoute, 4);
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
