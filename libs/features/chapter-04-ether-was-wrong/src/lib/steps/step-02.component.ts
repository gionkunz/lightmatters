import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  signal
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
  CHAPTER_04_TITLE,
  CHAPTER_04_TOTAL_STEPS,
  hasNextStep
} from '../step-registry';
import { LmEtherFieldSceneComponent } from './lm-ether-field-scene.component';
import { STEP_02_MICHELSON_MORLEY } from './step-02-michelson-morley';

const PHASE_KICKERS = [
  'at rest in ether',
  'ether wind',
  'circular path',
  'ether prediction · dragged light',
  '1887 · null result',
] as const;

/** Phase 2 stops three-quarters around so phase 3 continues without looping back to the start. */
const ORBIT_END_PHASE2 = (3 * Math.PI) / 2;
const ORBIT_ARC_PHASE3 = Math.PI / 2;

@Component({
  selector: 'lm-ch4-step-02',
  imports: [
    LmStepFrameComponent,
    LmNarratorChatFeedComponent,
    LmDiagramViewportComponent,
    LmKickerComponent,
    LmEtherFieldSceneComponent,
  ],
  template: `
    <lm-step-frame
      [chapter]="5"
      [chapterTitle]="chapterTitle"
      [stepTitle]="step.title"
      [step]="2"
      [stepsTotal]="stepsTotal"
      [hasNextStep]="hasNextStep(2)"
      [prevStepUrl]="'/chapter/5/step/1'"
      [nextStepUrl]="'/chapter/5/step/3'"
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
      <div class="grid h-full min-h-0 grid-cols-[1fr_1.15fr] gap-14 px-16 pb-10 pt-[52px]">
        <div class="flex min-h-0 h-full min-w-0 flex-col overflow-hidden">
          <lm-narrator-chat-feed
            [kicker]="step.kicker"
            [pastBeats]="runner.completedNarrateTexts()"
            [currentText]="runner.narrationText()"
            [visibleCount]="runner.narrationVisibleCount()"
          />
        </div>
        <div class="flex min-h-0 flex-col bg-paper-alt px-[26px] pb-[18px] pt-[22px]">
          <lm-kicker [opacity]="0.55" class="mb-3.5">{{ phaseKicker() }}</lm-kicker>
          <div class="flex min-h-0 flex-1 items-center justify-center">
            <lm-diagram-viewport #diagramVp [aspectRatio]="560 / 380">
              <lm-ether-field-scene
                [width]="diagramVp.size().width"
                [height]="diagramVp.size().height"
                [phase]="phase()"
                [frameSpeed]="frameSpeed()"
                [orbitAngle]="orbitAngle()"
                [phase3OrbitOrigin]="phase3OrbitOrigin()"
                [time]="time()"
                [earthOrbitIndex]="earthOrbitIndex()"
              />
            </lm-diagram-viewport>
          </div>
        </div>
      </div>
    </lm-step-frame>
  `
})
export class Step02Component implements OnInit, OnDestroy {
  private readonly registry = new TargetRegistry();

  protected readonly step = STEP_02_MICHELSON_MORLEY;
  protected readonly chapterTitle = CHAPTER_04_TITLE;
  protected readonly stepsTotal = CHAPTER_04_TOTAL_STEPS;
  protected readonly hasNextStep = hasNextStep;

  protected readonly phase = signal(0);
  protected readonly frameSpeed = signal(0);
  protected readonly orbitAngle = signal(0);
  protected readonly time = signal(0);
  protected readonly earthOrbitIndex = signal(0);
  protected readonly phase3OrbitOrigin = signal(ORBIT_END_PHASE2);

  protected readonly phaseKicker = computed(
    () => PHASE_KICKERS[Math.min(4, Math.max(0, Math.round(this.phase())))] ?? PHASE_KICKERS[0],
  );

  protected readonly runner: TimelineRunner;
  protected readonly totalDurationMs: number;

  constructor() {
    this.registry.register('ether.phase', {
      get: () => this.phase(),
      set: (v) => this.phase.set(Math.round(v)),
      initial: 0,
    });
    this.registry.register('ether.frameSpeed', {
      get: () => this.frameSpeed(),
      set: (v) => {
        this.frameSpeed.set(v);
        if (v > 0) this.phase.set(1);
      },
      initial: 0,
    });
    this.registry.register('ether.orbitAngle', {
      get: () => this.orbitAngle(),
      set: (v) => {
        this.orbitAngle.set(v);
        if (v > 0 && this.phase() < 3) {
          this.phase.set(2);
        }
      },
      initial: 0,
    });
    this.registry.register('ether.dragScene', {
      get: () => this.time(),
      set: (v) => {
        this.time.set(v);
        if (v > 0 && this.phase() < 3) {
          this.phase3OrbitOrigin.set(this.orbitAngle());
          this.phase.set(3);
        }
        if (this.phase() >= 3 || v > 0) {
          this.orbitAngle.set(this.phase3OrbitOrigin() + v * ORBIT_ARC_PHASE3);
        }
      },
      initial: 0,
    });
    this.registry.register('ether.earthOrbitIndex', {
      get: () => this.earthOrbitIndex(),
      set: (v) => {
        this.earthOrbitIndex.set(v);
        if (v > 0) {
          this.phase.set(4);
        }
      },
      initial: 0,
    });
    this.runner = new TimelineRunner(this.step.timeline, this.registry);
    registerFeedbackStepContext(this.runner, 5, 2);
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
