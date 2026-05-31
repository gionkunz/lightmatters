import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent } from '@lm/design';
import {
  cFromMaxwellConstantsKms,
  SPEED_OF_LIGHT_KMS,
  VACUUM_PERMEABILITY,
  VACUUM_PERMITTIVITY,
} from '@lm/physics';
import {
  CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER,
  CHAPTER_02_SPEED_OF_LIGHT_TITLE,
  CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_06_MAXWELL } from './step-06-maxwell-outro';

@Component({
  selector: 'lm-ch2-sol-step-06',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmFactLineComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="6"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(6)"
      [prevStepUrl]="'/chapter/2/step/5'"
      [nextStepUrl]="'/chapter/2/step/7'"
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
        <div class="flex flex-col justify-center bg-paper-alt px-10 py-12">
          <lm-kicker [opacity]="0.5" class="mb-6">c from the fields</lm-kicker>
          <p
            class="m-0 font-serif text-[28px] italic leading-snug text-ink opacity-90"
          >
            c = 1 / √(ε₀ · µ₀)
          </p>
          <div class="mt-9 flex flex-col gap-2.5 border-t border-ink-faint pt-7">
            <lm-fact-line
              label="permittivity · ε₀ (epsilon nought)"
              [value]="epsilonLabel"
            />
            <lm-fact-line
              label="permeability · µ₀ (mu nought)"
              [value]="muLabel"
            />
            <lm-fact-line
              label="c from Maxwell"
              [value]="maxwellLabel"
              accent="accent-2"
            />
            <lm-fact-line
              label="c measured by hand"
              [value]="measuredLabel"
              accent="accent-1"
            />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step06Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_06_MAXWELL;
  protected readonly chapterRoute = CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_02_SPEED_OF_LIGHT_TITLE;
  protected readonly stepsTotal = CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly epsilonLabel = `${VACUUM_PERMITTIVITY.toExponential(3)} F/m`;
  protected readonly muLabel = `${VACUUM_PERMEABILITY.toExponential(3)} H/m`;
  protected readonly maxwellLabel = `${Math.round(cFromMaxwellConstantsKms()).toLocaleString('en-US')} km/s`;
  protected readonly measuredLabel = `${Math.round(SPEED_OF_LIGHT_KMS).toLocaleString('en-US')} km/s`;

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, this.chapterRoute, 6);
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
