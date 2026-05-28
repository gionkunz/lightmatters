import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmLightClockComponent } from './lm-light-clock.component';

describe('LmLightClockComponent', () => {
  let fixture: ComponentFixture<LmLightClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmLightClockComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LmLightClockComponent);
    fixture.componentRef.setInput('width', 400);
    fixture.componentRef.setInput('height', 320);
  });

  function photonPos(): { cx: number; cy: number } {
    const photon = fixture.nativeElement.querySelector('circle.fill-accent-2');
    return {
      cx: Number.parseFloat(photon?.getAttribute('cx') ?? '0'),
      cy: Number.parseFloat(photon?.getAttribute('cy') ?? '0'),
    };
  }

  function mirrorLines(): SVGLineElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('line.light-clock-mirror'),
    );
  }

  function viewBoxWidth(): number {
    const raw = fixture.nativeElement.querySelector('svg')?.getAttribute('viewBox');
    if (!raw) {
      return 0;
    }
    return Number.parseFloat(raw.split(/\s+/)[2] ?? '0');
  }

  it('renders two mirror lines and a photon', () => {
    fixture.detectChanges();
    expect(mirrorLines().length).toBe(2);
    expect(fixture.nativeElement.querySelector('circle.fill-accent-2')).toBeTruthy();
  });

  it('keeps the photon on a vertical path at rest', () => {
    fixture.componentRef.setInput('velocity', 0);
    fixture.componentRef.setInput('progress', 0.1);
    fixture.detectChanges();
    const early = photonPos();

    fixture.componentRef.setInput('progress', 0.4);
    fixture.detectChanges();
    const late = photonPos();

    expect(early.cx).toBeCloseTo(late.cx, 0);
    expect(late.cy).not.toBeCloseTo(early.cy, 0);
  });

  it('tilts the photon path when moving', () => {
    fixture.componentRef.setInput('velocity', 0.6);
    fixture.componentRef.setInput('progress', 0);
    fixture.detectChanges();
    const start = photonPos();

    fixture.componentRef.setInput('progress', 0.5);
    fixture.detectChanges();
    const midTick = photonPos();

    expect(midTick.cx).toBeGreaterThan(start.cx);
    expect(midTick.cy).not.toBeCloseTo(start.cy, 0);
  });

  it('drifts mirrors sideways over a tick when moving', () => {
    fixture.componentRef.setInput('velocity', 0.6);
    fixture.componentRef.setInput('progress', 0.05);
    fixture.detectChanges();
    const xEarly = Number.parseFloat(mirrorLines()[0]?.getAttribute('x1') ?? '0');

    fixture.componentRef.setInput('progress', 0.55);
    fixture.detectChanges();
    const xLate = Number.parseFloat(mirrorLines()[0]?.getAttribute('x1') ?? '0');

    expect(xLate).toBeGreaterThan(xEarly);
  });

  it('shows clock-frame vertical path when moving', () => {
    fixture.componentRef.setInput('velocity', 0.6);
    fixture.componentRef.setInput('progress', 0.25);
    fixture.detectChanges();
    const clockPath = fixture.nativeElement.querySelector('line.stroke-accent-1');
    expect(clockPath).toBeTruthy();
    expect(clockPath.getAttribute('x1')).toBe(clockPath.getAttribute('x2'));
  });

  it('expands viewBox width at high speed so zigzag is not clipped', () => {
    fixture.componentRef.setInput('velocity', 0);
    fixture.componentRef.setInput('progress', 0);
    fixture.detectChanges();
    const restWidth = viewBoxWidth();

    fixture.componentRef.setInput('velocity', 0.9);
    fixture.detectChanges();
    const fastWidth = viewBoxWidth();

    expect(restWidth).toBeGreaterThan(0);
    expect(fastWidth).toBeGreaterThan(restWidth * 1.5);
  });

  it('emits tickComplete when progress wraps', () => {
    const emitted: number[] = [];
    fixture.componentInstance.tickComplete.subscribe(() => emitted.push(1));
    fixture.componentRef.setInput('progress', 0.9);
    fixture.detectChanges();
    fixture.componentRef.setInput('progress', 0.05);
    fixture.detectChanges();
    expect(emitted.length).toBe(1);
  });

  it('does not hang at v/c = 1 (bounded lab grid)', () => {
    fixture.componentRef.setInput('velocity', 1);
    fixture.componentRef.setInput('progress', 0.25);
    fixture.detectChanges();
    const gridLines = fixture.nativeElement.querySelectorAll(
      'line.light-clock-lab-grid',
    );
    expect(gridLines.length).toBeLessThanOrEqual(12);
  });
});
