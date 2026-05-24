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
      { type: 'wait', for: 'userAdvance' },
    ];

    const runner = new TimelineRunner(events, registry);
    runner.start();

    jest.advanceTimersByTime(20);
    await Promise.resolve();
    expect(runner.narrationVisibleCount()).toBe(2);
    expect(runner.atReadPause()).toBe(true);
    expect(runner.waitingForUser()).toBe(false);

    jest.advanceTimersByTime(500);
    await Promise.resolve();
    expect(runner.atReadPause()).toBe(false);
    expect(runner.waitingForUser()).toBe(true);
  });

  it('skipReadPause continues without waiting', async () => {
    const registry = new TargetRegistry();
    const events: TimelineEvent[] = [
      { type: 'narrate', text: 'Hi', speed: 10, pauseAfter: 5000 },
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
    expect(runner.waitingForUser()).toBe(true);
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

    expect(runner.narrationVisibleCount()).toBe('Long text here'.length);
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

  it('rewind resets targets and replays from the start', async () => {
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

    runner.rewind();
    expect(value).toBe(0);
    expect(runner.narrationVisibleCount()).toBe(0);
    expect(runner.isComplete()).toBe(false);
  });
});
