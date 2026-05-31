import {
  Component,
  effect,
  HostListener,
  inject,
  Injector,
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
import { LmKickerComponent } from '@lm/design';
import {
  CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER,
  CHAPTER_02_SPEED_OF_LIGHT_TITLE,
  CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS,
} from '../step-registry';
import { LmEmSpectrumBandReadoutComponent } from './lm-em-spectrum-band-readout.component';
import { LmEmSpectrumSceneComponent } from './lm-em-spectrum-scene.component';
import {
  STEP_08_BAND_FOR_NARRATE,
  STEP_08_NARRATE_TEXTS,
  STEP_08_SPECTRUM,
} from './step-08-spectrum';

@Component({
  selector: 'lm-ch2-sol-step-08',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmEmSpectrumSceneComponent,
    LmEmSpectrumBandReadoutComponent,
    LmKickerComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="8"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="true"
      [nextChapter]="true"
      [prevStepUrl]="'/chapter/2/step/7'"
      [nextStepUrl]="'/chapter/3/step/1'"
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
        <div class="flex min-h-0 flex-col justify-center bg-paper-alt px-[26px] py-[22px]">
          <lm-kicker [opacity]="0.55" class="mb-3.5">
            electromagnetic spectrum · all at $c$
          </lm-kicker>
          <div class="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div class="relative w-full max-w-full">
              <lm-diagram-viewport #diagramVp [aspectRatio]="640 / 210">
                <lm-em-spectrum-scene
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  [highlightIndex]="highlightIndex()"
                />
              </lm-diagram-viewport>
              <lm-em-spectrum-band-readout
                class="mt-5 block w-full"
                [bandIndex]="highlightIndex()"
              />
            </div>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step08Component implements OnInit, OnDestroy {
  private readonly injector = inject(Injector);

  protected readonly step = STEP_08_SPECTRUM;
  protected readonly chapterRoute = CHAPTER_02_SPEED_OF_LIGHT_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_02_SPEED_OF_LIGHT_TITLE;
  protected readonly stepsTotal = CHAPTER_02_SPEED_OF_LIGHT_TOTAL_STEPS;

  /** -1 = overview (no band selected); 0–6 = active band. */
  protected readonly highlightIndex = signal(-1);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.runner = new TimelineRunner(this.step.timeline, new TargetRegistry());
    this.totalDurationMs = this.runner.getTotalDurationMs();
    registerFeedbackStepContext(this.runner, this.chapterRoute, 8);

    effect(
      () => {
        const text = this.runner.narrationText();
        const narrateIndex = STEP_08_NARRATE_TEXTS.indexOf(text);
        const band =
          narrateIndex >= 0 ? STEP_08_BAND_FOR_NARRATE[narrateIndex] : null;
        this.highlightIndex.set(band ?? -1);
      },
      { injector: this.injector },
    );
  }

  ngOnInit(): void {
    this.runner.start();
  }
  ngOnDestroy(): void {
    this.runner.destroy();
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
