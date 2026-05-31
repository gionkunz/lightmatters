import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  LmDiagramViewportComponent,
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmKickerComponent } from '@lm/design';
import {
  LmLightSceneComponent,
  type LightSceneObserver,
  type LightSceneSource,
} from '@lm/light-scene';
import { FLASH_EMISSION, SCENE_EXTENT } from '../light-sphere.constants';
import {
  CHAPTER_05_CONSTANT_C_ROUTE_NUMBER,
  CHAPTER_05_CONSTANT_C_TITLE,
  CHAPTER_05_CONSTANT_C_TOTAL_STEPS,
} from '../step-registry';
import { STEP_04_OUTRO } from './step-04-outro';

@Component({
  selector: 'lm-ch5-constant-c-step-04',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmLightSceneComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="4"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="true"
      [nextChapter]="true"
      [prevStepUrl]="'/chapter/6/step/3'"
      [nextStepUrl]="'/chapter/7/step/1'"
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
          <lm-kicker [opacity]="0.55" class="mb-3.5">
            same c · every frame
          </lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
              <lm-light-scene
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [time]="0.85"
                [extent]="extent"
                [fixedViewBox]="true"
                [observers]="observers"
                [sources]="sources"
              />
            </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_04_OUTRO;
  protected readonly chapterRoute = CHAPTER_05_CONSTANT_C_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_05_CONSTANT_C_TITLE;
  protected readonly stepsTotal = CHAPTER_05_CONSTANT_C_TOTAL_STEPS;
  protected readonly extent = SCENE_EXTENT;

  protected readonly observers: LightSceneObserver[] = [
    { id: 'a', x: 0, y: 0, label: 'A', color: 'accent-1' },
  ];
  protected readonly sources: LightSceneSource[] = [
    { id: 'flash', x: 0, y: 0, emissions: [FLASH_EMISSION] },
  ];

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
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
