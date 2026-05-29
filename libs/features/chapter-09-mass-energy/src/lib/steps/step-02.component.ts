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
import { LmSpacetimeDiagramComponent } from '@lm/spacetime-diagram';
import { kineticEnergy, lorentz, totalEnergy } from '@lm/physics';
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
import { STEP_02_REST_ENERGY } from './step-02-rest-energy';

@Component({
  selector: 'lm-ch9-mass-energy-step-02',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    LmSpacetimeDiagramComponent,
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
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
      [prevStepUrl]="'/chapter/9/step/1'"
      [nextStepUrl]="'/chapter/9/step/3'"
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
              budget spent through time &amp; space
            </lm-kicker>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 420">
                <lm-spacetime-diagram
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
                  variant="single"
                  [velocity]="velocity()"
                  [budgetArc]="true"
                  [showTipLabel]="false"
                />
              </lm-diagram-viewport>
            </div>
          </div>
          <div class="mt-[22px] space-y-5 border-t border-ink-faint pt-[22px]">
            <lm-slider
              label="v / c"
              [value]="velocity()"
              [disabled]="!runner.atExplorationWait() && !runner.playbackActive()"
              (valueChange)="onVelocityChange($event)"
            />
            <div class="grid grid-cols-2 gap-x-6 gap-y-2">
              <lm-fact-line
                label="rest energy"
                value="1.00 mc²"
                accent="accent-1"
              />
              <lm-fact-line label="+ kinetic energy" [value]="kineticLabel()" />
              <lm-fact-line
                label="= total energy"
                [value]="totalLabel()"
                accent="accent-2"
              />
              <lm-fact-line label="γ · speed-up factor" [value]="gammaLabel()" />
            </div>
            <lm-fact-line
              label="rest energy of 1 g"
              value="≈ 9.0×10¹³ J  (≈ 25 GWh)"
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
export class Step02Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_02_REST_ENERGY;
  protected readonly chapterRoute = CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_09_MASS_ENERGY_TITLE;
  protected readonly stepsTotal = CHAPTER_09_MASS_ENERGY_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly velocity = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  protected readonly legend: readonly SymbolLegendRow[] = [
    { sym: 'E', desc: 'energy (joules, J)' },
    { sym: 'm', desc: 'mass (kilograms, kg)' },
    { sym: 'c', desc: 'speed of light (≈ 3×10⁸ m/s)' },
    { sym: 'γ', desc: 'speed-up factor (no units, ≥ 1)' },
  ];

  protected readonly gammaLabel = computed(() => {
    const v = this.velocity();
    return v >= 0.999 ? '∞' : lorentz(v).toFixed(3);
  });
  protected readonly totalLabel = computed(() => {
    const v = this.velocity();
    if (v >= 0.999) return '∞';
    return `${totalEnergy(1, v).toFixed(2)} mc²`;
  });
  protected readonly kineticLabel = computed(() => {
    const v = this.velocity();
    if (v >= 0.999) return '∞';
    return `${kineticEnergy(1, v).toFixed(2)} mc²`;
  });

  constructor() {
    this.registry.register('rest.velocity', {
      get: () => this.velocity(),
      set: (v) => this.velocity.set(v),
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

  protected onVelocityChange(value: number): void {
    if (this.runner.atExplorationWait() || this.runner.playbackActive()) {
      this.velocity.set(value);
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
