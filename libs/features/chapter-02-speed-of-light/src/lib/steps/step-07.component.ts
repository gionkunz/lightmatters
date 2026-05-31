import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmKickerComponent } from '@lm/design';
import {
  CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER,
  CHAPTER_02_SPEED_OF_LIGHT_TITLE,
  CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_07_REALITY } from './step-07-reality';

@Component({
  selector: 'lm-ch2-sol-step-07',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="7"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(7)"
      [prevStepUrl]="'/chapter/2/step/6'"
      [nextStepUrl]="'/chapter/2/step/8'"
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
        <div class="flex flex-col justify-center gap-10 bg-paper-alt px-10 py-12">
          <lm-kicker [opacity]="0.55">information · vs · causality</lm-kicker>
          <div class="grid grid-cols-2 gap-8">
            <div class="border-r border-ink-faint pr-8">
              <p
                class="m-0 font-mono text-[length:var(--lm-text-mono-md)] uppercase tracking-[0.14em] text-ink opacity-55"
              >
                sound
              </p>
              <p
                class="mt-4 mb-0 font-serif text-[length:var(--lm-text-button)] leading-[1.45] opacity-80"
              >
                Needs a medium. Carries news. Speed depends on air, water, steel.
              </p>
            </div>
            <div>
              <p
                class="m-0 font-mono text-[length:var(--lm-text-mono-md)] uppercase tracking-[0.14em]"
                style="color: var(--lm-accent-1)"
              >
                light · at c
              </p>
              <p
                class="mt-4 mb-0 font-serif text-[length:var(--lm-text-button)] leading-[1.45] opacity-90"
              >
                No medium required. The fastest any cause can travel. The speed of
                reality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step07Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_07_REALITY;
  protected readonly chapterRoute = CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_02_SPEED_OF_LIGHT_TITLE;
  protected readonly stepsTotal = CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS;
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
