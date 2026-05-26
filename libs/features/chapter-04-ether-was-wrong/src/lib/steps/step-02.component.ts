import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmKickerComponent } from '@lm/design';
import {
  CHAPTER_04_TITLE,
  CHAPTER_04_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { LmMichelsonMorleySchematicComponent } from './lm-michelson-morley-schematic.component';
import { STEP_02_MICHELSON_MORLEY } from './step-02-michelson-morley';

@Component({
  selector: 'lm-ch4-step-02',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmKickerComponent,
    LmMichelsonMorleySchematicComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="4"
      [chapterTitle]="chapterTitle"
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
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
      (back)="goPrevStep()"
      (next)="goNextStep()"
      (goPrevious)="runner.goToPreviousCheckpoint()"
      (pauseRequested)="runner.pause()"
      (playRequested)="runner.resume()"
      (goNext)="runner.goToNextCheckpoint()"
      (checkpointSeek)="runner.goToCheckpoint($event)"
    >
      <div class="grid h-full grid-cols-[1fr_1.15fr] gap-14 px-16 pb-10 pt-[52px]">
        <lm-narrator-chat-feed
          [kicker]="step.kicker"
          [pastBeats]="runner.completedNarrateTexts()"
          [currentText]="runner.narrationText()"
          [visibleCount]="runner.narrationVisibleCount()"
        />
        <div class="flex flex-col bg-paper-alt px-8 py-10">
          <lm-kicker [opacity]="0.5" class="mb-4">1887 · null result</lm-kicker>
          <div class="flex flex-1 items-center justify-center">
            <lm-michelson-morley-schematic />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step02Component implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_02_MICHELSON_MORLEY;
  protected readonly chapterTitle = CHAPTER_04_TITLE;
  protected readonly stepsTotal = CHAPTER_04_TOTAL_STEPS;
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

  protected goPrevStep(): void {
    void this.router.navigateByUrl('/ch/04/step/1');
  }
  protected goNextStep(): void {
    void this.router.navigateByUrl('/ch/04/step/3');
  }
}
