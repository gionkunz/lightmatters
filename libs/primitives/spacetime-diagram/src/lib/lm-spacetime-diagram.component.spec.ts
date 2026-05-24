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
});
