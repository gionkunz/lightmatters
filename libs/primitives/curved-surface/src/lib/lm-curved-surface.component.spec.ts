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

  it('accepts well profile inputs', () => {
    fixture.componentRef.setInput('surfaceProfile', 'well');
    fixture.componentRef.setInput('wellReveal', 0.5);
    fixture.componentRef.setInput('wellMorph', 0.25);
    fixture.componentRef.setInput('energy', 0.8);
    fixture.detectChanges();
    expect(fixture.componentInstance.surfaceProfile()).toBe('well');
    expect(fixture.componentInstance.wellReveal()).toBe(0.5);
    expect(fixture.componentInstance.wellMorph()).toBe(0.25);
    expect(fixture.componentInstance.energy()).toBe(0.8);
  });

  it('accepts wellUnfold input for the paper-unfold demo', () => {
    fixture.componentRef.setInput('surfaceProfile', 'well');
    fixture.componentRef.setInput('wellMorph', 0);
    fixture.componentRef.setInput('wellUnfold', 0.7);
    fixture.detectChanges();
    expect(fixture.componentInstance.wellUnfold()).toBe(0.7);
  });

  it('accepts light beam inputs on well profile', () => {
    fixture.componentRef.setInput('surfaceProfile', 'well');
    fixture.componentRef.setInput('wellDepth', 'deep');
    fixture.componentRef.setInput('showLightBeam', true);
    fixture.componentRef.setInput('lightBeamProgress', 0.5);
    fixture.componentRef.setInput('lightBeamMode', 'dual');
    fixture.detectChanges();
    expect(fixture.componentInstance.wellDepth()).toBe('deep');
    expect(fixture.componentInstance.showLightBeam()).toBe(true);
    expect(fixture.componentInstance.lightBeamProgress()).toBe(0.5);
    expect(fixture.componentInstance.lightBeamMode()).toBe('dual');
  });

  it('renders a reset view button', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      'button[aria-label="Reset view"]',
    );
    expect(button).toBeTruthy();
  });
});
