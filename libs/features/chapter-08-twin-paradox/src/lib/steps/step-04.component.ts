import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  LmDiagramViewportComponent,
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent } from '@lm/design';
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import { twinReadout } from '@lm/physics';
import {
  STAY_HOME_PROPER_YEARS,
  TRAVELLER_PROPER_YEARS,
  TWIN_TURNAROUND,
  TWIN_V_OVER_C,
} from '../twin.constants';
import {
  CHAPTER_08_TWIN_ROUTE_NUMBER,
  CHAPTER_08_TWIN_TITLE,
  CHAPTER_08_TWIN_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_04_DOPPLER_COUNT } from './step-04-doppler-count';

@Component({
  selector: 'lm-ch8-twin-step-04',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmSpacetimeDiagramComponent,
    LmFactLineComponent,
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
      [prevStepUrl]="'/chapter/9/step/3'"
      [nextStepUrl]="'/chapter/9/step/5'"
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
        <div class="flex min-h-0 flex-col">
          <div
            class="flex min-h-0 flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]"
          >
            <lm-kicker [opacity]="0.55" class="mb-3.5">
              light pulses · 45° null lines
            </lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="520 / 420">
                <lm-spacetime-diagram
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  variant="twin"
                  [twinVOverC]="vOverC"
                  [twinTurnaround]="turnaround"
                  [twinProgress]="1"
                  [twinShowPulses]="true"
                  [twinPulseCount]="6"
                />
              </lm-diagram-viewport>
            </div>
          </div>
          <div
            class="mt-[22px] grid grid-cols-3 gap-x-6 gap-y-2 border-t border-ink-faint pt-[22px]"
          >
            <lm-fact-line
              label="A · stay-at-home"
              [value]="readout.stayHomeLabel"
              accent="accent-1"
            />
            <lm-fact-line
              label="B · traveller"
              [value]="readout.travellerLabel"
              accent="accent-2"
            />
            <lm-fact-line
              label="age difference"
              [value]="readout.differenceLabel"
            />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_04_DOPPLER_COUNT;
  protected readonly chapterRoute = CHAPTER_08_TWIN_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_08_TWIN_TITLE;
  protected readonly stepsTotal = CHAPTER_08_TWIN_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly vOverC = TWIN_V_OVER_C;
  protected readonly turnaround = TWIN_TURNAROUND;
  protected readonly readout = twinReadout(
    STAY_HOME_PROPER_YEARS,
    TRAVELLER_PROPER_YEARS,
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
