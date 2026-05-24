import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmSpacetimeDiagramComponent } from './lm-spacetime-diagram.component';

describe('LmSpacetimeDiagramComponent', () => {
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
