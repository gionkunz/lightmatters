import { TimelineRunner } from './timeline-runner';
import { TargetRegistry } from './target-registry';
import {
  setTimelineSoundSink,
  type TimelineSoundSink,
} from './timeline-sound-sink';
import type { TimelineEvent } from './types';

describe('TimelineRunner', () => {
  let sink: jest.Mocked<TimelineSoundSink>;

  beforeEach(() => {
    jest.useFakeTimers();
    sink = { play: jest.fn() };
    setTimelineSoundSink(sink);
  });

  afterEach(() => {
    jest.useRealTimers();
    setTimelineSoundSink(null);
  });

  it('reveals narration character by character', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Hi', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    expect(runner.narrationVisibleCount()).toBe(1);
    jest.advanceTimersByTime(10);
    expect(runner.narrationVisibleCount()).toBe(2);
    jest.advanceTimersByTime(10);
    await Promise.resolve();
    expect(runner.waitingForUser()).toBe(true);
  });

  it('holds at checkpoint after narration until user continues', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Hi', speed: 10, pauseAfter: 500 },
      { type: 'narrate', text: 'Explore.', speed: 10 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(20);
    await Promise.resolve();
    expect(runner.narrationVisibleCount()).toBe(2);
    expect(runner.atCheckpointHold()).toBe(true);
    expect(runner.isPaused()).toBe(true);
    expect(runner.atExplorationWait()).toBe(false);

    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    expect(runner.atCheckpointHold()).toBe(true);
    expect(runner.narrationText()).toBe('Hi');

    runner.advanceFromCheckpointHold();
    await Promise.resolve();
    expect(runner.atCheckpointHold()).toBe(false);
    expect(runner.narrationText()).toBe('Explore.');
    expect(runner.atExplorationWait()).toBe(true);
    expect(runner.narrationVisibleCount()).toBe(1);
  });

  it('unlocks exploration controls when pre-exploration narrate starts', () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Drag the slider.', speed: 10, pauseAfter: 5000 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    expect(runner.atExplorationWait()).toBe(true);
    expect(runner.narrationVisibleCount()).toBe(1);
    expect(runner.waitingForUser()).toBe(false);
  });

  it('unlocks exploration controls when pre-exploration animate starts', async () => {
    const registry = new TargetRegistry();
    let value = 0;
    registry.register('diagram.position', {
      get: () => value,
      set: (v) => {
        value = v;
      },
    });

    const events: TimelineEvent[] = [
      {
        type: 'animate',
        target: 'diagram.position',
        from: 0,
        to: 0.5,
        duration: 0.05,
      },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    expect(runner.atExplorationWait()).toBe(true);
    expect(runner.waitingForUser()).toBe(false);

    jest.advanceTimersByTime(100);
    await Promise.resolve();
    await Promise.resolve();
    expect(runner.waitingForUser()).toBe(true);
  });

  it('clears exploration flag after advance and re-arms for a second segment', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'First explore.', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
      { type: 'narrate', text: 'Second explore.', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(160);
    await Promise.resolve();
    await Promise.resolve();
    expect(runner.waitingForUser()).toBe(true);
    expect(runner.atExplorationWait()).toBe(true);

    runner.advance();
    await Promise.resolve();
    expect(runner.waitingForUser()).toBe(false);
    expect(runner.atExplorationWait()).toBe(true);
    expect(runner.narrationText()).toBe('Second explore.');

    jest.advanceTimersByTime(160);
    await Promise.resolve();
    await Promise.resolve();
    expect(runner.atExplorationWait()).toBe(true);
    expect(runner.waitingForUser()).toBe(true);
  });

  it('skips checkpoint hold before exploration userAdvance wait', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Drag the slider.', speed: 10, pauseAfter: 5000 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(180);
    await Promise.resolve();
    await Promise.resolve();

    expect(runner.narrationVisibleCount()).toBe(16);
    expect(runner.atCheckpointHold()).toBe(false);
    expect(runner.atExplorationWait()).toBe(true);
    expect(runner.waitingForUser()).toBe(true);
  });

  it('resume advances from checkpoint hold', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Hi', speed: 10 },
      { type: 'narrate', text: 'Go', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(20);
    await Promise.resolve();
    expect(runner.atCheckpointHold()).toBe(true);

    runner.resume();
    await Promise.resolve();
    expect(runner.atCheckpointHold()).toBe(false);
    expect(runner.narrationText()).toBe('Go');
  });

  it('skipReadPause alias advances from checkpoint hold', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Hi', speed: 10 },
      { type: 'narrate', text: 'Go', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(20);
    await Promise.resolve();
    expect(runner.atCheckpointHold()).toBe(true);

    runner.skipReadPause();
    await Promise.resolve();
    expect(runner.atCheckpointHold()).toBe(false);
    expect(runner.narrationText()).toBe('Go');
  });

  it('holds at checkpoint after animate until user continues', async () => {
    const registry = new TargetRegistry();
    let value = 0;
    registry.register('diagram.position', {
      get: () => value,
      set: (v) => {
        value = v;
      },
    });

    const events: TimelineEvent[] = [
      {
        type: 'animate',
        target: 'diagram.position',
        from: 0,
        to: 0.5,
        duration: 0.05,
      },
      { type: 'narrate', text: 'Done.', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(100);
    await Promise.resolve();
    await Promise.resolve();

    expect(value).toBe(0.5);
    expect(runner.atCheckpointHold()).toBe(true);
    expect(runner.isPaused()).toBe(true);

    runner.resume();
    await Promise.resolve();
    expect(runner.atCheckpointHold()).toBe(false);
    expect(runner.narrationText()).toBe('Done.');
  });

  it('skip completes narration and jumps to wait', () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Long text here', speed: 50 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.skip();

    expect(runner.narrationVisibleCount()).toBe(14);
    expect(runner.waitingForUser()).toBe(true);
  });

  it('types inline math as atomic units', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Hi $\\gamma$', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    expect(runner.narrationVisibleCount()).toBe(1);
    jest.advanceTimersByTime(20);
    expect(runner.narrationVisibleCount()).toBe(3);
    jest.advanceTimersByTime(60);
    await Promise.resolve();
    await Promise.resolve();
    expect(runner.narrationVisibleCount()).toBe(8);
    expect(runner.waitingForUser()).toBe(true);
  });

  it('skip sets animate target to final value', () => {
    const registry = new TargetRegistry();
    let value = 0;
    registry.register('diagram.position', {
      get: () => value,
      set: (v) => {
        value = v;
      },
    });

    const events: TimelineEvent[] = [
      {
        type: 'animate',
        target: 'diagram.position',
        from: 0,
        to: 0.5,
        duration: 2,
      },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.skip();

    expect(value).toBe(0.5);
    expect(runner.waitingForUser()).toBe(true);
  });

  it('reset clears state on restart', () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'A', speed: 10 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.skip();
    runner.reset();

    expect(runner.waitingForUser()).toBe(false);
    expect(runner.narrationText()).toBe('');
    expect(runner.isComplete()).toBe(false);
  });

  it('marks the final userAdvance wait as allowing step exit', () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Done.', pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.skip();

    expect(runner.waitingForUser()).toBe(true);
    expect(runner.allowsStepExit()).toBe(true);
    expect(runner.isComplete()).toBe(false);
  });

  it('uses the checkpoint before a mid-step userAdvance wait on the scrubber', () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'A', speed: 10, pauseAfter: 0 },
      { type: 'narrate', text: 'B', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
      { type: 'narrate', text: 'C', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.skip();
    expect(runner.waitingForUser()).toBe(true);
    expect(runner.activeCheckpointIndex()).toBe(1);
  });

  it('can rewind from a completed timeline', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'First', speed: 10, pauseAfter: 0 },
      { type: 'narrate', text: 'Second', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.skip();
    runner.advance();
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    expect(runner.isComplete()).toBe(true);
    expect(runner.canGoToPreviousCheckpoint()).toBe(true);

    runner.goToPreviousCheckpoint();
    jest.advanceTimersByTime(100);
    await Promise.resolve();

    expect(runner.isComplete()).toBe(false);
    expect(runner.narrationText()).toBe('Second');
  });

  it('canGoToNextCheckpoint while waiting for user at exploration pause', () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Predict?', pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
      { type: 'narrate', text: 'After.', pauseAfter: 0 },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.skip();
    expect(runner.waitingForUser()).toBe(true);
    expect(runner.canGoToNextCheckpoint()).toBe(true);

    runner.goToNextCheckpoint();
    expect(runner.waitingForUser()).toBe(false);
    expect(runner.narrationText()).toBe('After.');
  });

  it('advance unblocks userAdvance wait', () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [{ type: 'wait', for: 'userAdvance' }];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    expect(runner.waitingForUser()).toBe(true);
    runner.advance();
    expect(runner.isComplete()).toBe(true);
  });

  it('pause and resume narration mid-typewriter', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Hello', speed: 100, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    expect(runner.narrationVisibleCount()).toBe(1);
    jest.advanceTimersByTime(100);
    expect(runner.narrationVisibleCount()).toBe(2);

    runner.pause();
    expect(runner.isPaused()).toBe(true);
    expect(runner.narrationVisibleCount()).toBe(2);

    jest.advanceTimersByTime(500);
    expect(runner.narrationVisibleCount()).toBe(2);

    runner.resume();
    jest.advanceTimersByTime(300);
    await Promise.resolve();
    expect(runner.narrationVisibleCount()).toBe(5);
  });

  it('goToNextCheckpoint jumps to the next narrate beat', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'First', speed: 10, pauseAfter: 0 },
      { type: 'narrate', text: 'Second', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    expect(runner.narrationText()).toBe('First');
    runner.goToNextCheckpoint();
    await Promise.resolve();

    expect(runner.narrationText()).toBe('Second');
    expect(runner.narrationVisibleCount()).toBe(1);
  });

  it('goToPreviousCheckpoint returns to the prior beat', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'First', speed: 10, pauseAfter: 0 },
      { type: 'narrate', text: 'Second', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.goToNextCheckpoint();
    await Promise.resolve();
    jest.advanceTimersByTime(30);
    await Promise.resolve();

    runner.goToPreviousCheckpoint();
    await Promise.resolve();
    await Promise.resolve();

    expect(runner.narrationText()).toBe('First');
    expect(runner.narrationVisibleCount()).toBe(1);
  });

  it('goToCheckpoint seeks from marker click', async () => {
    const registry = new TargetRegistry();
    let value = 0;
    registry.register('diagram.position', {
      get: () => value,
      set: (v) => {
        value = v;
      },
      initial: 0,
    });

    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Intro', speed: 10, pauseAfter: 0 },
      {
        type: 'animate',
        target: 'diagram.position',
        from: 0,
        to: 1,
        duration: 1,
      },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.goToCheckpoint(1);
    await Promise.resolve();

    expect(runner.narrationText()).toBe('Intro');
    expect(value).toBe(0);
    expect(runner.activeCheckpointIndex()).toBe(1);
  });

  it('keeps the last narrate line current during a following animate', async () => {
    const registry = new TargetRegistry();
    let value = 0;
    registry.register('diagram.value', {
      get: () => value,
      set: (v) => {
        value = v;
      },
      initial: 0,
    });

    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'First beat', speed: 10, pauseAfter: 0 },
      { type: 'narrate', text: 'Second beat', speed: 10, pauseAfter: 0 },
      {
        type: 'animate',
        target: 'diagram.value',
        from: 0,
        to: 1,
        duration: 0.1,
      },
      { type: 'narrate', text: 'Third beat', speed: 10, pauseAfter: 0 },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(220);
    await Promise.resolve();
    await Promise.resolve();

    expect(runner.completedNarrateTexts()).toEqual(['First beat']);
    expect(runner.narrationText()).toBe('Second beat');

    jest.advanceTimersByTime(200);
    await Promise.resolve();
    await Promise.resolve();

    expect(runner.completedNarrateTexts()).toEqual(['First beat']);
    expect(runner.narrationText()).toBe('Second beat');
  });

  it('includes completed narrate beats in the stack before the next beat starts', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'First beat', speed: 10 },
      { type: 'narrate', text: 'Second beat', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(120);
    await Promise.resolve();
    expect(runner.atCheckpointHold()).toBe(true);
    expect(runner.activeCheckpointIndex()).toBe(0);
    expect(runner.canGoToPreviousCheckpoint()).toBe(false);

    runner.advanceFromCheckpointHold();
    await Promise.resolve();
    await Promise.resolve();

    expect(runner.completedNarrateTexts()).toEqual(['First beat']);
    expect(runner.narrationText()).toBe('Second beat');
  });

  it('goToPreviousCheckpoint from exploration returns to last beat', async () => {
    const registry = new TargetRegistry();
    let value = 0;
    registry.register('diagram.position', {
      get: () => value,
      set: (v) => {
        value = v;
      },
      initial: 0,
    });

    const events: TimelineEvent[] = [
      {
        type: 'animate',
        target: 'diagram.position',
        from: 0,
        to: 1,
        duration: 1,
      },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    runner.skip();
    expect(value).toBe(1);

    runner.goToPreviousCheckpoint();
    expect(value).toBe(0);
    expect(runner.narrationVisibleCount()).toBe(0);
    expect(runner.isComplete()).toBe(false);
  });

  it('plays sound events during forward playback with volume and pan', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'sound', sound: 'expand', volume: 0.5, pan: -0.3 },
      { type: 'narrate', text: 'Hi', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    await Promise.resolve();

    expect(sink.play).toHaveBeenCalledWith('expand', {
      volume: 0.5,
      pan: -0.3,
    });
  });

  it('excludes sound events from checkpoints and total duration', () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'A', speed: 10, pauseAfter: 0 },
      { type: 'sound', sound: 'tick' },
      { type: 'narrate', text: 'B', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    expect(runner.checkpoints().length).toBe(2);
    expect(runner.getTotalDurationMs()).toBe(20);
  });

  it('does not replay sound events on skip but plays leading sounds on checkpoint seek', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'sound', sound: 'tilt' },
      { type: 'narrate', text: 'First', speed: 10, pauseAfter: 0 },
      { type: 'sound', sound: 'snap' },
      { type: 'narrate', text: 'Second', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();
    await Promise.resolve();
    expect(sink.play).toHaveBeenCalledTimes(1);
    expect(sink.play).toHaveBeenCalledWith('tilt', {
      volume: undefined,
      pan: undefined,
    });

    runner.skip();
    expect(sink.play).toHaveBeenCalledTimes(1);

    sink.play.mockClear();
    runner.goToCheckpoint(3);
    await Promise.resolve();
    expect(sink.play).toHaveBeenCalledTimes(1);
    expect(sink.play).toHaveBeenCalledWith('snap', {
      volume: undefined,
      pan: undefined,
    });
  });

  it('goToNextCheckpoint plays sound leading into the next beat', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'First', speed: 10, pauseAfter: 0 },
      { type: 'sound', sound: 'expand', volume: 0.6 },
      {
        type: 'animate',
        target: 'diagram.value',
        from: 0,
        to: 1,
        duration: 0.05,
      },
      { type: 'wait', for: 'userAdvance' },
    ];

    registry.register('diagram.value', {
      get: () => 0,
      set: () => undefined,
    });

    const runner = new TimelineRunner(events, registry);
    runner.start();
    await Promise.resolve();
    sink.play.mockClear();

    runner.goToNextCheckpoint();
    await Promise.resolve();

    expect(sink.play).toHaveBeenCalledWith('expand', {
      volume: 0.6,
      pan: undefined,
    });
  });
});
