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

  it('is false at exactly 1920×1080', () => {
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

  it('shows hint when viewport is undersized', fakeAsync(() => {
    setViewportSize(1919, 1080);
    tick(150);
    expect(service.visible()).toBe(true);
  }));

  it('hides hint at 1920×1080', fakeAsync(() => {
    setViewportSize(1920, 1080);
    tick(150);
    expect(service.visible()).toBe(false);
  }));

  it('hides hint after dismiss while still undersized', fakeAsync(() => {
    setViewportSize(1919, 1080);
    tick(150);
    expect(service.visible()).toBe(true);

    service.dismiss();
    expect(service.visible()).toBe(false);
  }));

  it('clears dismiss episode when viewport grows', fakeAsync(() => {
    setViewportSize(1919, 1080);
    tick(150);
    service.dismiss();
    expect(service.visible()).toBe(false);

    setViewportSize(1920, 1080);
    tick(150);
    expect(service.visible()).toBe(false);
  }));

  it('shows hint again after shrink following dismiss', fakeAsync(() => {
    setViewportSize(1919, 1080);
    tick(150);
    service.dismiss();

    setViewportSize(1920, 1080);
    tick(150);

    setViewportSize(1919, 1080);
    tick(150);
    expect(service.visible()).toBe(true);
  }));
});
