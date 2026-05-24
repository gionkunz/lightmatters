import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmSpacetimeDiagramComponent } from './lm-spacetime-diagram.component';

describe('LmSpacetimeDiagramComponent', () => {
  describe('position-only', () => {
    let fixture: ComponentFixture<LmSpacetimeDiagramComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LmSpacetimeDiagramComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LmSpacetimeDiagramComponent);
      fixture.componentRef.setInput('variant', 'position-only');
      fixture.componentRef.setInput('position', 0.5);
      fixture.detectChanges();
    });

    it('renders axis and point', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg.querySelector('line')).toBeTruthy();
      expect(svg.querySelector('circle')).toBeTruthy();
      expect(svg.textContent).toContain('x');
    });

    it('moves point when position input changes', () => {
      fixture.componentRef.setInput('position', 0.25);
      fixture.detectChanges();
      const circle = fixture.nativeElement.querySelector('circle');
      const cx = Number.parseFloat(circle.getAttribute('cx'));
      expect(cx).toBeLessThan(400);
    });
  });

  describe('time-only', () => {
    let fixture: ComponentFixture<LmSpacetimeDiagramComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LmSpacetimeDiagramComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LmSpacetimeDiagramComponent);
      fixture.componentRef.setInput('variant', 'time-only');
      fixture.componentRef.setInput('time', 0.5);
      fixture.componentRef.setInput('height', 320);
      fixture.detectChanges();
    });

    it('renders vertical axis and point', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg.querySelector('line')).toBeTruthy();
      expect(svg.querySelector('circle')).toBeTruthy();
      expect(svg.textContent).toContain('t');
    });

    it('moves point when time input changes', () => {
      fixture.componentRef.setInput('time', 0.25);
      fixture.detectChanges();
      const circle = fixture.nativeElement.querySelector('circle');
      const cy = Number.parseFloat(circle.getAttribute('cy'));
      expect(cy).toBeGreaterThan(160);
    });
  });

  describe('full', () => {
    let fixture: ComponentFixture<LmSpacetimeDiagramComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LmSpacetimeDiagramComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LmSpacetimeDiagramComponent);
      fixture.componentRef.setInput('variant', 'full');
      fixture.componentRef.setInput('position', 0.4);
      fixture.componentRef.setInput('time', 0.5);
      fixture.componentRef.setInput('height', 460);
      fixture.detectChanges();
    });

    it('renders both axes, labels, light cone, worldline, and point', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg.querySelectorAll('line').length).toBeGreaterThanOrEqual(4);
      expect(svg.textContent).toContain('x');
      expect(svg.textContent).toContain('t');
      expect(svg.querySelector('circle')).toBeTruthy();

      const dashed = svg.querySelector('[stroke-dasharray="3 4"]');
      expect(dashed).toBeTruthy();
    });

    it('updates point and worldline when position changes', () => {
      fixture.componentRef.setInput('position', 0.8);
      fixture.detectChanges();
      const circle = fixture.nativeElement.querySelector('circle');
      const cx = Number.parseFloat(circle.getAttribute('cx'));
      expect(cx).toBeGreaterThan(400);
    });

    it('updates point when time changes', () => {
      fixture.componentRef.setInput('time', 0.2);
      fixture.detectChanges();
      const circle = fixture.nativeElement.querySelector('circle');
      const cy = Number.parseFloat(circle.getAttribute('cy'));
      expect(cy).toBeGreaterThan(250);
    });
  });

  describe('single', () => {
    let fixture: ComponentFixture<LmSpacetimeDiagramComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LmSpacetimeDiagramComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LmSpacetimeDiagramComponent);
      fixture.componentRef.setInput('variant', 'single');
      fixture.componentRef.setInput('height', 460);
      fixture.detectChanges();
    });

    it('renders axes, labels, light cone, vector, and arrowhead', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg.textContent).toContain('x');
      expect(svg.textContent).toContain('t');
      expect(svg.querySelector('[stroke-dasharray="3 4"]')).toBeTruthy();
      expect(svg.querySelector('polyline')).toBeTruthy();
      expect(svg.querySelector('circle')).toBeTruthy();
    });

    it('renders a vertical vector at velocity 0', () => {
      fixture.componentRef.setInput('velocity', 0);
      fixture.detectChanges();
      const line = fixture.nativeElement.querySelector('line[stroke-linecap="round"]');
      expect(line.getAttribute('x1')).toBe(line.getAttribute('x2'));
      expect(Number.parseFloat(line.getAttribute('y2'))).toBeLessThan(
        Number.parseFloat(line.getAttribute('y1')),
      );
    });

    it('tilts vector toward the light cone at velocity 1', () => {
      fixture.componentRef.setInput('velocity', 1);
      fixture.detectChanges();
      const line = fixture.nativeElement.querySelector('line[stroke-linecap="round"]');
      const x1 = Number.parseFloat(line.getAttribute('x1'));
      const x2 = Number.parseFloat(line.getAttribute('x2'));
      const y1 = Number.parseFloat(line.getAttribute('y1'));
      const y2 = Number.parseFloat(line.getAttribute('y2'));
      expect(x2).toBeGreaterThan(x1);
      expect(y2).toBeLessThan(y1);
      expect(x2 - x1).toBeCloseTo(y1 - y2, 0);
    });

    it('updates vector angle when velocity changes', () => {
      fixture.componentRef.setInput('velocity', 0);
      fixture.detectChanges();
      const vertical = fixture.nativeElement.querySelector('line[stroke-linecap="round"]');
      const verticalX2 = vertical.getAttribute('x2');

      fixture.componentRef.setInput('velocity', 0.5);
      fixture.detectChanges();
      const tilted = fixture.nativeElement.querySelector('line[stroke-linecap="round"]');
      expect(tilted.getAttribute('x2')).not.toBe(verticalX2);
    });
  });

  describe('pair', () => {
    let fixture: ComponentFixture<LmSpacetimeDiagramComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LmSpacetimeDiagramComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LmSpacetimeDiagramComponent);
      fixture.componentRef.setInput('variant', 'pair');
      fixture.componentRef.setInput('budgetArc', true);
      fixture.componentRef.setInput('height', 460);
      fixture.detectChanges();
    });

    it('renders twin accent vectors', () => {
      fixture.componentRef.setInput('velocityA', 0.01);
      fixture.componentRef.setInput('velocityB', 0.5);
      fixture.detectChanges();
      const vectors = fixture.nativeElement.querySelectorAll(
        'line[stroke-linecap="round"]',
      );
      expect(vectors.length).toBeGreaterThanOrEqual(2);
      expect(vectors[0].getAttribute('stroke')).toBe('var(--lm-accent-1)');
      expect(vectors[1].getAttribute('stroke')).toBe('var(--lm-accent-2)');
    });

    it('places half light speed vector at 30 degrees on the budget arc', () => {
      fixture.componentRef.setInput('velocityB', 0.5);
      fixture.detectChanges();
      const vectorLen = 240;
      const left = 70;
      const fullBottom = 360;
      const expectedX = left + vectorLen * Math.sin(Math.asin(0.5));
      const expectedY = fullBottom - vectorLen * Math.cos(Math.asin(0.5));
      const lines = fixture.nativeElement.querySelectorAll(
        'line[stroke-linecap="round"]',
      );
      const traveller = lines[lines.length - 1];
      expect(Number.parseFloat(traveller.getAttribute('x2'))).toBeCloseTo(
        expectedX,
        0,
      );
      expect(Number.parseFloat(traveller.getAttribute('y2'))).toBeCloseTo(
        expectedY,
        0,
      );
    });

    it('renders accent tip labels for both travellers', () => {
      fixture.componentRef.setInput('showTipLabel', true);
      fixture.componentRef.setInput('velocityA', 0.01);
      fixture.componentRef.setInput('velocityB', 0.5);
      fixture.componentRef.setInput('tipProperYears', 1);
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent ?? '';
      expect(text).toContain('time passed');
      expect(text).toContain('traveled');
      expect(text).toContain('0.87');
      expect(text).toContain('149,896 km/s');
      expect(fixture.nativeElement.querySelectorAll('rect[fill-opacity="0.6"]').length).toBe(2);
    });
  });

  describe('single with budgetArc', () => {
    let fixture: ComponentFixture<LmSpacetimeDiagramComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LmSpacetimeDiagramComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LmSpacetimeDiagramComponent);
      fixture.componentRef.setInput('variant', 'single');
      fixture.componentRef.setInput('budgetArc', true);
      fixture.componentRef.setInput('showTipLabel', true);
      fixture.componentRef.setInput('height', 460);
      fixture.detectChanges();
    });

    it('renders the budget arc and tip label', () => {
      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg.querySelector('path')).toBeTruthy();
      expect(svg.textContent).toContain('time passed');
      expect(svg.textContent).toContain('traveled');
    });

    it('renders a horizontal vector at velocity 1', () => {
      fixture.componentRef.setInput('velocity', 1);
      fixture.detectChanges();
      const line = fixture.nativeElement.querySelector('line[stroke-linecap="round"]');
      const y1 = Number.parseFloat(line.getAttribute('y1'));
      const y2 = Number.parseFloat(line.getAttribute('y2'));
      expect(y1).toBeCloseTo(y2, 0);
      expect(Number.parseFloat(line.getAttribute('x2'))).toBeGreaterThan(
        Number.parseFloat(line.getAttribute('x1')),
      );
    });

    it('shows pure-time label at velocity 0', () => {
      fixture.componentRef.setInput('velocity', 0);
      fixture.componentRef.setInput('tipProperYears', 1);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('1 year time passed');
      expect(fixture.nativeElement.textContent).toContain('0 km traveled (0 km/s)');
    });

    it('places half light speed vector at 30 degrees with Lorentz readout', () => {
      fixture.componentRef.setInput('velocity', 0.5);
      fixture.componentRef.setInput('tipProperYears', 1);
      fixture.detectChanges();
      const line = fixture.nativeElement.querySelector('line[stroke-linecap="round"]');
      const vectorLen = 240;
      const left = 70;
      const expectedX = left + vectorLen * Math.sin(Math.asin(0.5));
      expect(Number.parseFloat(line.getAttribute('x2'))).toBeCloseTo(
        expectedX,
        0,
      );
      expect(fixture.nativeElement.textContent).toContain('0.87');
      expect(fixture.nativeElement.textContent).toContain('149,896 km/s');
    });

    it('renders a label background panel', () => {
      fixture.componentRef.setInput('velocity', 0);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('rect[fill-opacity="0.6"]')).toBeTruthy();
    });
  });
});
