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
  registerFeedbackStepContext,
  TargetRegistry,
  TimelineRunner,
} from '@lm/engine';
import { LmFactLineComponent, LmKickerComponent, LmSliderComponent, LmDerivationComponent } from '@lm/design';
import { massEnergyEquivalent } from '@lm/physics';
import { BalanceBeamComponent } from '../visuals/balance-beam.component';
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
import { STEP_05_BALANCE, STEP_05_DERIVATION_FRAMES } from './step-05-balance';

@Component({
  selector: 'lm-ch9-mass-energy-step-05',
  imports: [
    LmStepFrameComponent,
    LmDiagramViewportComponent,
    LmNarratorChatFeedComponent,
    BalanceBeamComponent,
    LmSliderComponent,
    LmFactLineComponent,
    LmKickerComponent,
    SymbolLegendComponent,
    LmDerivationComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="chapterRoute"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="5"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(5)"
      [prevStepUrl]="'/chapter/10/step/4'"
      [nextStepUrl]="'/chapter/10/step/6'"
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
              moments balance · M·Δx = m·L
            </lm-kicker>
            <div class="mb-4 flex justify-center">
              <lm-derivation
                [frames]="derivationFrames"
                [playhead]="derivationFrame()"
              />
            </div>
            <div class="flex min-h-0 flex-1 items-center justify-center">
              <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
                <lm-balance-beam
                  [width]="diagramVp.size().width"
                  [height]="diagramVp.size().height"
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
            <div class="grid grid-cols-2 gap-x-6 gap-y-2">
              <lm-fact-line
                label="box moment M·Δx"
                [value]="momentLabel()"
                accent="accent-1"
              />
              <lm-fact-line
                label="light moment m·L"
                [value]="momentLabel()"
                accent="accent-2"
              />
            </div>
            <div class="border-t border-ink-faint pt-3.5">
              <lm-symbol-legend [rows]="legend" />
            </div>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `,
})
export class Step05Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_05_BALANCE;
  protected readonly derivationFrames = STEP_05_DERIVATION_FRAMES;
  protected readonly chapterRoute = CHAPTER_09_MASS_ENERGY_ROUTE_NUMBER;
  protected readonly chapterTitle = CHAPTER_09_MASS_ENERGY_TITLE;
  protected readonly stepsTotal = CHAPTER_09_MASS_ENERGY_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;
  protected readonly energy = signal(DEFAULT_PHOTON_ENERGY);
  protected readonly derivationFrame = signal(0);
  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  protected readonly legend: readonly SymbolLegendRow[] = [
    { sym: 'E', desc: 'photon energy (J)' },
    { sym: 'm', desc: 'mass carried by light (kg)' },
    { sym: 'M', desc: 'box mass (kg)' },
    { sym: 'L', desc: 'box length (m)' },
    { sym: 'Δx', desc: 'box left-shift (m)' },
    { sym: 'moment', desc: 'mass × distance (kg·m)' },
  ];

  // In natural units (c = 1, L = 1) both moments equal E — the beam is level.
  protected readonly momentLabel = computed(
    () => massEnergyEquivalent(this.energy()).toFixed(2),
  );

  constructor() {
    this.registry.register('derivation.frame', {
      get: () => this.derivationFrame(),
      set: (v) => this.derivationFrame.set(v),
      initial: 0,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, this.chapterRoute, 5);
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
