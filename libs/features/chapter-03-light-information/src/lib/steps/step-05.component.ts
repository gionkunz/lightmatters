import {
  Component,
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
import { LmKickerComponent } from '@lm/design';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneSource,
} from '@lm/light-scene';
import {
  CHAPTER_03_TITLE,
  CHAPTER_03_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_05_OUTRO } from './step-05-outro';

@Component({
  selector: 'lm-ch3-step-05',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmLightSceneComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="3"
      [chapterTitle]="chapterTitle"
      [step]="5"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="true"
      [nextChapter]="true"
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
      (next)="goNextChapter()"
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
        </div>

        <div class="flex flex-col">
          <div class="flex flex-1 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]">
            <div class="mb-3.5 flex items-baseline justify-between gap-4">
              <lm-kicker [opacity]="0.55">light · information · simultaneity</lm-kicker>
            </div>
            <div class="flex flex-1 items-center justify-center">
              <lm-light-scene
                [time]="0.85"
                [extent]="0.95"
                [observers]="observers"
                [sources]="sources"
                [width]="560"
                [height]="380"
              />
            </div>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step05Component implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_05_OUTRO;
  protected readonly chapterTitle = CHAPTER_03_TITLE;
  protected readonly stepsTotal = CHAPTER_03_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly observers: LightSceneObserver[] = [
    { id: 'w', x: 0, y: 0, label: 'W', velocity: { x: 0.3, y: 0 } },
  ];
  protected readonly sources: LightSceneSource[] = [
    {
      id: 's-left',
      x: -0.6,
      y: 0,
      label: 'S_L',
      emissions: [{ atTime: 0, pulseId: 'p-left' }],
    },
    {
      id: 's-right',
      x: 0.6,
      y: 0,
      label: 'S_R',
      emissions: [{ atTime: 0, pulseId: 'p-right' }],
    },
  ];

  protected readonly time = signal(0.85);

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
    void this.router.navigateByUrl('/ch/03/step/4');
  }
  protected goNextChapter(): void {
    void this.router.navigateByUrl('/ch/04/step/1');
  }
}
