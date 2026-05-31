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
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmKickerComponent } from '@lm/design';
import {
  CHAPTER_08_ROUTE_NUMBER,
  CHAPTER_08_TITLE,
  CHAPTER_08_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { LmLightBendDiagramComponent } from '../light-bend-diagram.component';
import { STEP_05_TIME_DILATION } from './step-05-time-dilation';

function clockFactorForEdge(edge: 'inner' | 'outer'): number {
  // Inner edge sits in the deeper time-dilation; outer edge ticks closer to
  // proper rate. Anchor the two readouts to authored bounds so layout tweaks
  // never propagate into nonsensical numbers.
  return edge === 'inner' ? 0.74 : 0.94;
}

@Component({
  selector: 'lm-ch8-step-05',
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
      [step]="5"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(5)"
      [prevStepUrl]="'/chapter/13/step/4'"
      [nextStepUrl]="'/chapter/13/step/6'"
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
          <lm-kicker [opacity]="0.55">clock rates</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
              <lm-light-bend-diagram
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                mode="dual"
                [progress]="1"
              />
            </lm-diagram-viewport>
          </div>
          <div class="mt-1 grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1 border border-accent-1/40 bg-paper px-4 py-3">
              <span class="font-mono text-[10px] uppercase tracking-wider text-accent-1 opacity-80">
                inner clock
              </span>
              <span class="text-3xl tabular-nums text-accent-1">
                {{ innerClockLabel() }}
              </span>
            </div>
            <div class="flex flex-col gap-1 border border-accent-2/40 bg-paper px-4 py-3">
              <span class="font-mono text-[10px] uppercase tracking-wider text-accent-2 opacity-80">
                outer clock
              </span>
              <span class="text-3xl tabular-nums text-accent-2">
                {{ outerClockLabel() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step05Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_05_TIME_DILATION;
  protected readonly chapterRoute = CHAPTER_08_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_08_TITLE;
  protected readonly stepsTotal = CHAPTER_08_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly innerClockLabel = computed(
    () => `${Math.round(clockFactorForEdge('inner') * 100)}%`,
  );
  protected readonly outerClockLabel = computed(
    () => `${Math.round(clockFactorForEdge('outer') * 100)}%`,
  );
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
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
