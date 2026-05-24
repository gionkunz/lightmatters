import { TimelineRunner } from './timeline-runner';
import { TargetRegistry } from './target-registry';
import type { TimelineEvent } from './types';

describe('TimelineRunner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
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

  it('holds after narration for a read pause', async () => {
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
    expect(runner.atReadPause()).toBe(true);
    expect(runner.atExplorationWait()).toBe(false);

    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(runner.atReadPause()).toBe(false);
    expect(runner.atExplorationWait()).toBe(false);
  });

  it('skips read pause and unlocks exploration before userAdvance wait', async () => {
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
    expect(runner.atReadPause()).toBe(false);
    expect(runner.atExplorationWait()).toBe(true);
    expect(runner.waitingForUser()).toBe(true);
  });

  it('skipReadPause continues without waiting', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Hi', speed: 10, pauseAfter: 5000 },
      { type: 'narrate', text: 'Go', speed: 10 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(20);
    await Promise.resolve();
    expect(runner.atReadPause()).toBe(true);

    runner.skipReadPause();
    await Promise.resolve();
    expect(runner.atReadPause()).toBe(false);
    expect(runner.atExplorationWait()).toBe(false);
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

  it('includes completed narrate beats in the stack before the next beat starts', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'First beat', speed: 10, pauseAfter: 0 },
      { type: 'narrate', text: 'Second beat', speed: 10, pauseAfter: 0 },
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(120);
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
});
