import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  LmDiagramViewportComponent,
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent } from '@lm/design';
import { SolarSailComponent } from '../visuals/solar-sail.component';
import {
  SymbolLegendComponent,
  type SymbolLegendRow,
} from '../visuals/symbol-legend.component';
import {
  CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER,
  CHAPTER_09_MASS_ENERGY_TITLE,
  CHAPTER_09_MASS_ENERGY_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_03_LIGHT_MOMENTUM } from './step-03-light-momentum';

@Component({
  selector: 'lm-ch9-mass-energy-step-03',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    SolarSailComponent,
    LmFactLineComponent,
    LmKickerComponent,
    SymbolLegendComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="3"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(3)"
      [prevStepUrl]="'/chapter/10/step/2'"
      [nextStepUrl]="'/chapter/10/step/4'"
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
              radiation pressure · light pushes
            </lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-solar-sail
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  [progress]="progress()"
                />
              </lm-diagram-viewport>
            </div>
          </div>
          <div class="mt-[22px] space-y-3.5 border-t border-ink-faint pt-[22px]">
            <lm-fact-line
              label="light momentum"
              value="p = E / c"
              accent="accent-2"
            />
            <lm-symbol-legend [rows]="legend" />
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step03Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_03_LIGHT_MOMENTUM;
  protected readonly chapterRoute = CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_09_MASS_ENERGY_TITLE;
  protected readonly stepsTotal = CHAPTER_09_MASS_ENERGY_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly progress = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  protected readonly legend: readonly SymbolLegendRow[] = [
    { sym: 'p', desc: 'momentum (kg·m/s)' },
    { sym: 'E', desc: 'energy (joules, J)' },
    { sym: 'c', desc: 'speed of light (≈ 3×10⁸ m/s)' },
  ];

  constructor() {
    this.registry.register('sail.progress', {
      get: () => this.progress(),
      set: (v) => this.progress.set(v),
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
