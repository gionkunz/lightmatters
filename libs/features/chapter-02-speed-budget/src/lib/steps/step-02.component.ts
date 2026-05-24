import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import {
  LmFactLineComponent,
  LmKickerComponent,
  LmLegendComponent,
  LmSliderComponent,
} from '@lm/design';
import { travellerReadout } from '@lm/physics';
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import {
  CHAPTER_02_TITLE,
  CHAPTER_02_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_02_TWO_TRAVELLERS } from './step-02-two-travellers';

@Component({
  selector: 'lm-step-02',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmSpacetimeDiagramComponent,
    LmSliderComponent,
    LmFactLineComponent,
    LmLegendComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="2"
      [chapterTitle]="chapterTitle"
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
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
        class="grid h-full box-border grid-cols-[1fr_1.15fr] gap-14 px-16 pb-10 pt-[52px]"
      >
        <div class="flex flex-col">
          <lm-narrator-chat-feed
            [kicker]="step.kicker"
            [pastBeats]="runner.completedNarrateTexts()"
            [currentText]="runner.narrationText()"
            [visibleCount]="runner.narrationVisibleCount()"
          />

          <div
            class="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-ink-faint pt-[22px]"
          >
            <lm-fact-line
              label="traveller A"
              [value]="readoutA().vOverCLabel"
              accent="accent-1"
            />
            <lm-fact-line
              label="traveller B"
              [value]="readoutB().vOverCLabel"
              accent="accent-2"
            />
            <lm-fact-line label="A's clock" [value]="readoutA().clockLabel" />
            <lm-fact-line label="B's clock" [value]="readoutB().clockLabel" />
          </div>
        </div>

        <div class="flex flex-col">
          <div
            class="flex flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px] transition-colors duration-400"
          >
            <div
              class="mb-3.5 flex items-baseline justify-between gap-4"
            >
              <lm-kicker [opacity]="0.55">spacetime · normalized to c</lm-kicker>
              <div class="flex gap-3.5">
                <lm-legend color="accent-1" label="A" />
                <lm-legend color="accent-2" label="B" />
              </div>
            </div>
            <div class="flex flex-1 items-center justify-center">
              <lm-spacetime-diagram
                variant="pair"
                [velocityA]="velocityA()"
                [velocityB]="velocityB()"
                [budgetArc]="true"
                [width]="560"
                [height]="460"
                [showDot]="false"
                [showTipLabel]="true"
                [tipProperYears]="1"
              />
            </div>
          </div>

          <div class="mt-[22px] grid grid-cols-2 gap-7">
            <lm-slider
              label="A · v / c"
              accent="accent-1"
              [value]="velocityA()"
              [disabled]="true"
            />
            <lm-slider
              label="B · v / c"
              accent="accent-2"
              [value]="velocityB()"
              [disabled]="!runner.atExplorationWait()"
              (valueChange)="onVelocityBChange($event)"
            />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step02Component implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_02_TWO_TRAVELLERS;
  protected readonly chapterTitle = CHAPTER_02_TITLE;
  protected readonly stepsTotal = CHAPTER_02_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly velocityA = signal(0.01);
  protected readonly velocityB = signal(0);
  protected readonly readoutA = computed(() =>
    travellerReadout(this.velocityA(), 1),
  );
  protected readonly readoutB = computed(() =>
    travellerReadout(this.velocityB(), 1),
  );
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('diagram.velocityA', {
      get: () => this.velocityA(),
      set: (v) => this.velocityA.set(v),
      initial: 0.01,
    });
    this.registry.register('diagram.velocityB', {
      get: () => this.velocityB(),
      set: (v) => this.velocityB.set(v),
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

  protected onVelocityBChange(value: number): void {
    if (this.runner.atExplorationWait()) {
      this.velocityB.set(value);
    }
  }

  protected goPrevStep(): void {
    void this.router.navigateByUrl('/ch/02/step/1');
  }
}
