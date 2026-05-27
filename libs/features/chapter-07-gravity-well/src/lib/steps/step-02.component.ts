import {
  Component,
  computed,
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
import { LmKickerComponent } from '@lm/design';
import { LmCurvedSurfaceComponent } from '@lm/curved-surface';
import {
  CHAPTER_07_TITLE,
  CHAPTER_07_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_02_PIECEWISE } from './step-02-piecewise';

@Component({
  selector: 'lm-ch7-step-02',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmCurvedSurfaceComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="7"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
      [prevStepUrl]="'/ch/07/step/1'"
      [nextStepUrl]="'/ch/07/step/3'"
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
        <div class="relative flex min-h-0 flex-col bg-paper-alt px-[26px] py-[22px]">
          <lm-kicker [opacity]="0.55" class="mb-3.5">narrow → wide → narrow</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
              <lm-curved-surface
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                surfaceProfile="well"
                [wellReveal]="wellReveal()"
                [wellMorph]="0"
                [showTrail]="false"
                [showEarthSphere]="showEarth()"
                [showAxisLabels]="true"
              />
            </lm-diagram-viewport>
          </div>
          <div
            class="pointer-events-none absolute left-[14%] top-[36%] font-mono text-[10px] uppercase leading-tight tracking-wider text-ink opacity-50"
          >
            outer space
          </div>
          <div
            class="pointer-events-none absolute left-[26%] top-[28%] font-mono text-[10px] uppercase leading-tight tracking-wider text-ink opacity-50"
          >
            <span class="block">near earth gravity field</span>
            <span class="block opacity-75">/ surface</span>
          </div>
          <div
            class="pointer-events-none absolute left-1/2 top-[16%] -translate-x-1/2 text-center font-mono text-[10px] uppercase leading-tight tracking-wider text-ink opacity-55"
          >
            earth center · weightless
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step02Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_02_PIECEWISE;
  protected readonly chapterTitle = CHAPTER_07_TITLE;
  protected readonly stepsTotal = CHAPTER_07_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly wellReveal = signal(0);
  protected readonly showEarth = computed(() => this.wellReveal() >= 0.38);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('surface.wellReveal', {
      get: () => this.wellReveal(),
      set: (v) => this.wellReveal.set(v),
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
}
