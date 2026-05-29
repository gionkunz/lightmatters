import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import {
  LmDiagramViewportComponent,
  LmNarratorChatFeedComponent,
  LmStepFrameComponent,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent, LmSliderComponent } from '@lm/design';
import { photonMomentum } from '@lm/physics';
import { PhotonBoxComponent } from '../visuals/photon-box.component';
import {
  SymbolLegendComponent,
  type SymbolLegendRow,
} from '../visuals/symbol-legend.component';
import { DEFAULT_PHOTON_ENERGY } from '../mass-energy.constants';
import {
  CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER,
  CHAPTER_09_MASS_ENERGY_TITLE,
  CHAPTER_09_MASS_ENERGY_TOTAL_STEPS,
  hasNextStep,
} from '../step-registry';
import { STEP_04_PHOTON_IN_A_BOX } from './step-04-photon-in-a-box';

@Component({
  selector: 'lm-ch9-mass-energy-step-04',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    PhotonBoxComponent,
    LmSliderComponent,
    LmFactLineComponent,
    LmKickerComponent,
    SymbolLegendComponent,
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
              isolated box · balance point can't move
            </lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-photon-box
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  [progress]="progress()"
                  [energy]="energy()"
                />
              </lm-diagram-viewport>
            </div>
          </div>
          <div class="mt-[22px] space-y-5 border-t border-ink-faint pt-[22px]">
            <lm-slider
              label="photon energy E"
              [value]="energy()"
              valueFormat="percent"
              accent="accent-2"
              [disabled]="!runner.atExplorationWait() && !runner.playbackActive()"
              (valueChange)="onEnergyChange($event)"
            />
            <lm-fact-line
              label="photon momentum p = E/c"
              [value]="momentumLabel()"
              accent="accent-2"
            />
            <div class="border-t border-ink-faint pt-3.5">
              <lm-symbol-legend [rows]="legend" />
            </div>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step04Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_04_PHOTON_IN_A_BOX;
  protected readonly chapterRoute = CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_09_MASS_ENERGY_TITLE;
  protected readonly stepsTotal = CHAPTER_09_MASS_ENERGY_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly progress = signal(0);
  protected readonly energy = signal(DEFAULT_PHOTON_ENERGY);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  protected readonly legend: readonly SymbolLegendRow[] = [
    { sym: 'E', desc: 'photon energy (J)' },
    { sym: 'p', desc: 'momentum (kg·m/s)' },
    { sym: 'c', desc: 'speed of light (m/s)' },
    { sym: 'M', desc: 'box mass (kg)' },
    { sym: 'L', desc: 'box length (m)' },
    { sym: 'Δx', desc: 'box left-shift (m)' },
  ];

  protected readonly momentumLabel = computed(
    () => photonMomentum(this.energy()).toFixed(2),
  );

  constructor() {
    this.registry.register('box.progress', {
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

  protected onEnergyChange(value: number): void {
    if (this.runner.atExplorationWait() || this.runner.playbackActive()) {
      this.energy.set(value);
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
