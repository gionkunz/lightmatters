import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  MIN_VIEWPORT_HEIGHT,
  MIN_VIEWPORT_WIDTH,
  ViewportResolutionHintService,
  isViewportUndersized,
} from './viewport-resolution-hint.service';

function setViewportSize(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
}

describe('isViewportUndersized', () => {
  it('is true when width is below minimum', () => {
    expect(isViewportUndersized(MIN_VIEWPORT_WIDTH - 1, MIN_VIEWPORT_HEIGHT)).toBe(
      true,
    );
  });

  it('is true when height is below minimum', () => {
    expect(isViewportUndersized(MIN_VIEWPORT_WIDTH, MIN_VIEWPORT_HEIGHT - 1)).toBe(
      true,
    );
  });

  it('is false at exactly the minimum dimensions', () => {
    expect(isViewportUndersized(MIN_VIEWPORT_WIDTH, MIN_VIEWPORT_HEIGHT)).toBe(
      false,
    );
  });
});

describe('ViewportResolutionHintService', () => {
  let service: ViewportResolutionHintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    setViewportSize(MIN_VIEWPORT_WIDTH, MIN_VIEWPORT_HEIGHT);
    service = TestBed.inject(ViewportResolutionHintService);
  });

  afterEach(() => {
    setViewportSize(MIN_VIEWPORT_WIDTH, MIN_VIEWPORT_HEIGHT);
  });

  it('shows modal when viewport is undersized', fakeAsync(() => {
    setViewportSize(MIN_VIEWPORT_WIDTH - 1, MIN_VIEWPORT_HEIGHT);
    tick(150);
    expect(service.visible()).toBe(true);
  }));

  it('hides modal at minimum dimensions', fakeAsync(() => {
    setViewportSize(MIN_VIEWPORT_WIDTH, MIN_VIEWPORT_HEIGHT);
    tick(150);
    expect(service.visible()).toBe(false);
  }));

  it('hides modal when viewport grows from undersized', fakeAsync(() => {
    setViewportSize(MIN_VIEWPORT_WIDTH - 1, MIN_VIEWPORT_HEIGHT);
    tick(150);
    expect(service.visible()).toBe(true);

    setViewportSize(MIN_VIEWPORT_WIDTH, MIN_VIEWPORT_HEIGHT);
    tick(150);
    expect(service.visible()).toBe(false);
  }));

  it('shows modal again when viewport shrinks below minimum', fakeAsync(() => {
    setViewportSize(MIN_VIEWPORT_WIDTH, MIN_VIEWPORT_HEIGHT);
    tick(150);
    expect(service.visible()).toBe(false);

    setViewportSize(MIN_VIEWPORT_WIDTH - 1, MIN_VIEWPORT_HEIGHT);
    tick(150);
    expect(service.visible()).toBe(true);
  }));
});
