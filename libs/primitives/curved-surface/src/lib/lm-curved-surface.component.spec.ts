jest.mock('./curved-surface-renderer', () => ({
  CurvedSurfaceRenderer: jest.fn().mockImplementation(() => ({
    resize: jest.fn(),
    setThemeColors: jest.fn(),
    update: jest.fn(),
    animateReset: jest.fn(),
    dispose: jest.fn(),
  })),
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmCurvedSurfaceComponent } from './lm-curved-surface.component';

describe('LmCurvedSurfaceComponent', () => {
  let fixture: ComponentFixture<LmCurvedSurfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmCurvedSurfaceComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LmCurvedSurfaceComponent);
    fixture.componentRef.setInput('width', 400);
    fixture.componentRef.setInput('height', 300);
  });

  it('renders a canvas element', () => {
    fixture.detectChanges();
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('accepts fold, curvature, and time inputs', () => {
    fixture.componentRef.setInput('fold', 0.5);
    fixture.componentRef.setInput('curvature', 0.65);
    fixture.componentRef.setInput('time', 0.25);
    fixture.componentRef.setInput('showTrail', true);
    fixture.detectChanges();
    expect(fixture.componentInstance.fold()).toBe(0.5);
    expect(fixture.componentInstance.curvature()).toBe(0.65);
    expect(fixture.componentInstance.time()).toBe(0.25);
  });

  it('renders a reset view button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      'button[aria-label="Reset view"]',
    );
    expect(button).toBeTruthy();
  });
});
