import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmKickerComponent } from '@lm/design';
import { MassEnergyEquationComponent } from '../visuals/mass-energy-equation.component';
import {
  CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER,
  CHAPTER_09_MASS_ENERGY_TITLE,
  CHAPTER_09_MASS_ENERGY_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_01_HOOK } from './step-01-hook';

@Component({
  selector: 'lm-ch9-mass-energy-step-01',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmKickerComponent,
    MassEnergyEquationComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="1"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(1)"
      [prevStepUrl]="'/chapter/9/step/5'"
      [nextStepUrl]="'/chapter/10/step/2'"
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
        <div class="flex min-h-0 flex-col bg-paper-alt px-[26px] py-[22px]">
          <lm-kicker [opacity]="0.55" class="mb-3.5">the famous equation</lm-kicker>
          <div
            class="flex min-h-0 flex-1 items-center justify-center"
            style="container-type: inline-size"
          >
            <lm-mass-energy-equation />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step01Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_01_HOOK;
  protected readonly chapterRoute = CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_09_MASS_ENERGY_TITLE;
  protected readonly stepsTotal = CHAPTER_09_MASS_ENERGY_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

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
