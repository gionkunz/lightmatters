import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmLightSceneComponent } from './lm-light-scene.component';

describe('LmLightSceneComponent', () => {
  let fixture: ComponentFixture<LmLightSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmLightSceneComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LmLightSceneComponent);
    fixture.componentRef.setInput('width', 400);
    fixture.componentRef.setInput('height', 400);
    fixture.componentRef.setInput('extent', 1);
  });

  it('does not render time-axis ticks or worldlines', () => {
    fixture.componentRef.setInput('observers', [
      { id: 'a', x: -0.5, y: 0, label: 'A' },
    ]);
    fixture.componentRef.setInput('sources', [
      { id: 's', x: 0, y: 0, label: 'S', emissions: [{ atTime: 0, pulseId: 'p1' }] },
    ]);
    fixture.detectChanges();
    const html = fixture.nativeElement.outerHTML;
    expect(html).not.toContain('worldline');
    expect(html).not.toContain('proper time');
  });

  it('renders one circle per active emission', () => {
    fixture.componentRef.setInput('observers', []);
    fixture.componentRef.setInput('sources', [
      { id: 's', x: 0, y: 0, emissions: [{ atTime: 0, pulseId: 'p1' }, { atTime: 0.3, pulseId: 'p2' }] },
    ]);
    fixture.componentRef.setInput('time', 0.4);
    fixture.detectChanges();
    const pulses = fixture.nativeElement.querySelectorAll(
      'circle[stroke-width="1.4"]',
    );
    expect(pulses.length).toBe(2);
  });

  it('does not render a circle before its emission time', () => {
    fixture.componentRef.setInput('sources', [
      { id: 's', x: 0, y: 0, emissions: [{ atTime: 0.5, pulseId: 'p1' }] },
    ]);
    fixture.componentRef.setInput('time', 0.2);
    fixture.detectChanges();
    const pulses = fixture.nativeElement.querySelectorAll(
      'circle[stroke-width="1.4"]',
    );
    expect(pulses.length).toBe(0);
  });

  it('renders observers as labeled dots', () => {
    fixture.componentRef.setInput('observers', [
      { id: 'a', x: -0.5, y: 0, label: 'A' },
      { id: 'b', x: 0.5, y: 0, label: 'B' },
    ]);
    fixture.detectChanges();
    const dots = fixture.nativeElement.querySelectorAll(
      'circle[r="5"]',
    );
    expect(dots.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('A');
    expect(fixture.nativeElement.textContent).toContain('B');
  });

  it('moves observer along uniform velocity at current time', () => {
    fixture.componentRef.setInput('observers', [
      { id: 'b', x: -0.5, y: 0, velocity: { x: 0.4, y: 0 } },
    ]);
    fixture.componentRef.setInput('time', 0);
    fixture.detectChanges();
    const dotEarly = fixture.nativeElement.querySelector('circle[r="5"]');
    const xEarly = Number.parseFloat(dotEarly?.getAttribute('cx') ?? '0');

    fixture.componentRef.setInput('time', 1);
    fixture.detectChanges();
    const dotLate = fixture.nativeElement.querySelector('circle[r="5"]');
    const xLate = Number.parseFloat(dotLate?.getAttribute('cx') ?? '0');
    expect(xLate).toBeGreaterThan(xEarly);
  });

  it('emits a reception event when pulse reaches stationary observer', () => {
    const events: { observerId: string; atTime: number }[] = [];
    fixture.componentRef.setInput('observers', [
      { id: 'a', x: -0.5, y: 0 },
    ]);
    fixture.componentRef.setInput('sources', [
      { id: 's', x: 0, y: 0, emissions: [{ atTime: 0, pulseId: 'p1' }] },
    ]);
    fixture.componentInstance.reception.subscribe((e) => events.push(e));
    fixture.componentRef.setInput('time', 0.4);
    fixture.detectChanges();
    expect(events).toHaveLength(0);
    fixture.componentRef.setInput('time', 0.6);
    fixture.detectChanges();
    expect(events).toHaveLength(1);
    expect(events[0].observerId).toBe('a');
    expect(events[0].atTime).toBeCloseTo(0.5);
  });

  it('re-emits reception after scene time rewinds before arrival', () => {
    const events: { observerId: string }[] = [];
    fixture.componentRef.setInput('observers', [
      { id: 'a', x: -0.5, y: 0 },
    ]);
    fixture.componentRef.setInput('sources', [
      { id: 's', x: 0, y: 0, emissions: [{ atTime: 0, pulseId: 'p1' }] },
    ]);
    fixture.componentInstance.reception.subscribe((e) => events.push(e));
    fixture.componentRef.setInput('time', 0.6);
    fixture.detectChanges();
    expect(events).toHaveLength(1);

    fixture.componentRef.setInput('time', 0.2);
    fixture.detectChanges();
    fixture.componentRef.setInput('time', 0.6);
    fixture.detectChanges();
    expect(events).toHaveLength(2);
  });

  it('keeps pulse center at emission point when source moves', () => {
    fixture.componentRef.setInput('observers', []);
    fixture.componentRef.setInput('sources', [
      {
        id: 's',
        x: 0,
        y: 0,
        velocity: { x: 0.4, y: 0 },
        emissions: [{ atTime: 0, pulseId: 'p1' }],
      },
    ]);
    fixture.componentRef.setInput('time', 0.5);
    fixture.detectChanges();
    const pulse = fixture.nativeElement.querySelector(
      'circle[stroke-width="1.4"]',
    );
    const sourceDot = fixture.nativeElement.querySelector('circle[r="3.5"]');
    const pulseCx = Number.parseFloat(pulse?.getAttribute('cx') ?? '0');
    const sourceCx = Number.parseFloat(sourceDot?.getAttribute('cx') ?? '0');
    // Source moved right; pulse stayed at origin (center of viewbox ≈ 200)
    expect(sourceCx).toBeGreaterThan(pulseCx);
  });

  it('keeps viewBox fixed when fixedViewBox is true and time advances', () => {
    fixture.componentRef.setInput('fixedViewBox', true);
    fixture.componentRef.setInput('observers', [
      { id: 'a', x: -0.55, y: 0, label: 'A' },
    ]);
    fixture.componentRef.setInput('sources', [
      {
        id: 's',
        x: 0,
        y: 0,
        label: 'S',
        emissions: [
          { atTime: 0, pulseId: 'p1' },
          { atTime: 0.45, pulseId: 'p2' },
          { atTime: 0.9, pulseId: 'p3' },
        ],
      },
    ]);
    fixture.componentRef.setInput('extent', 1.1);
    fixture.componentRef.setInput('time', 0);
    fixture.detectChanges();

    const viewBoxAtStart =
      fixture.nativeElement.querySelector('svg')?.getAttribute('viewBox') ?? '';

    fixture.componentRef.setInput('time', 3.2);
    fixture.detectChanges();

    const viewBoxAfter =
      fixture.nativeElement.querySelector('svg')?.getAttribute('viewBox') ?? '';
    expect(viewBoxAfter).toBe(viewBoxAtStart);
  });

  it('uses a square-ish viewBox tighter than the layout slot', () => {
    fixture.componentRef.setInput('observers', [
      { id: 'w', x: 0, y: 0, label: 'W' },
    ]);
    fixture.componentRef.setInput('sources', [
      { id: 's-left', x: -0.5, y: 0, label: 'S_L', emissions: [{ atTime: 0, pulseId: 'p1' }] },
      { id: 's-right', x: 0.5, y: 0, label: 'S_R', emissions: [{ atTime: 0, pulseId: 'p2' }] },
    ]);
    fixture.componentRef.setInput('width', 560);
    fixture.componentRef.setInput('height', 380);
    fixture.detectChanges();

    const viewBox = fixture.nativeElement.querySelector('svg')?.getAttribute('viewBox') ?? '';
    const [, , vbW, vbH] = viewBox.split(/\s+/).map(Number);
    expect(vbW).toBeLessThan(560);
    expect(vbH).toBeLessThan(380);
    expect(Math.abs(vbW - vbH)).toBeLessThan(80);
  });

  it('re-emits reception when time rewinds before arrival then crosses again', () => {
    const events: unknown[] = [];
    fixture.componentRef.setInput('observers', [
      { id: 'a', x: -0.3, y: 0 },
    ]);
    fixture.componentRef.setInput('sources', [
      { id: 's', x: 0, y: 0, emissions: [{ atTime: 0, pulseId: 'p1' }] },
    ]);
    fixture.componentInstance.reception.subscribe((e) => events.push(e));
    fixture.componentRef.setInput('time', 0.4);
    fixture.detectChanges();
    fixture.componentRef.setInput('time', 0.0);
    fixture.detectChanges();
    fixture.componentRef.setInput('time', 0.5);
    fixture.detectChanges();
    expect(events).toHaveLength(2);
  });
});
