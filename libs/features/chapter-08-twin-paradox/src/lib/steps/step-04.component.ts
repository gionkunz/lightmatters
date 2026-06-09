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
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent, LmSliderComponent } from '@lm/design';
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import {
  twinProperTimes,
  twinReadout,
} from '@lm/physics';
import {
  TWIN_TURNAROUND,
  TWIN_TOTAL_YEARS,
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
    LmSliderComponent,
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
              doppler counting · proper-time totals
            </lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="520 / 420">
                <lm-spacetime-diagram
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  variant="twin"
                  [twinVOverC]="vOverC()"
                  [twinTurnaround]="turnaround"
                  [twinProgress]="1"
                />
              </lm-diagram-viewport>
            </div>
          </div>
          <div class="mt-[22px] space-y-5 border-t border-ink-faint pt-[22px]">
            <lm-slider
              label="v / c"
              [value]="vOverC()"
              accent="accent-2"
              [disabled]="!runner.atExplorationWait()"
              (valueChange)="onVOverCChange($event)"
            />
            <div class="grid grid-cols-2 gap-x-6 gap-y-2">
              <lm-fact-line
                label="A · stay-at-home"
                [value]="readout().stayHomeLabel"
                accent="accent-1"
              />
              <lm-fact-line
                label="B · traveller"
                [value]="readout().travellerLabel"
                accent="accent-2"
              />
              <lm-fact-line
                label="age difference"
                [value]="readout().differenceLabel"
              />
              <lm-fact-line
                label="pulses counted"
                [value]="pulseCountLabel()"
              />
            </div>
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
  protected readonly turnaround = TWIN_TURNAROUND;

  protected readonly vOverC = signal(TWIN_V_OVER_C);
  protected readonly readout = computed(() => {
    const { stayHomeYears, travellerYears } = twinProperTimes(
      TWIN_TOTAL_YEARS,
      this.vOverC(),
    );
    return twinReadout(stayHomeYears, travellerYears);
  });
  protected readonly pulseCountLabel = computed(() => {
    const { stayHomeYears, travellerYears } = twinProperTimes(
      TWIN_TOTAL_YEARS,
      this.vOverC(),
    );
    return `A←${Math.round(travellerYears)} · B←${Math.round(stayHomeYears)}`;
  });

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('turnaround.vOverC', {
      get: () => this.vOverC(),
      set: (v) => this.vOverC.set(v),
      initial: TWIN_V_OVER_C,
    });
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

  protected onVOverCChange(value: number): void {
    if (this.runner.atExplorationWait()) {
      this.vOverC.set(value);
    }
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
