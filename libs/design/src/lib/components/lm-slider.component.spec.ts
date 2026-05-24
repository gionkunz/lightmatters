import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmSliderComponent } from './lm-slider.component';

describe('LmSliderComponent', () => {
  let fixture: ComponentFixture<LmSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmSliderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmSliderComponent);
    fixture.componentRef.setInput('label', 'position');
    fixture.componentRef.setInput('value', 0.42);
    fixture.detectChanges();
  });

  it('renders label and formatted value', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('position');
    expect(el.textContent).toContain('0.42');
  });

  it('emits valueChange on pointer interaction', () => {
    const emitted: number[] = [];
    fixture.componentInstance.valueChange.subscribe((v) => emitted.push(v));

    const track = fixture.nativeElement.querySelector(
      '.relative.h-5',
    ) as HTMLElement;
    track.getBoundingClientRect = () =>
      ({
        left: 0,
        width: 100,
        top: 0,
        height: 20,
        right: 100,
        bottom: 20,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    track.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 50, bubbles: true }),
    );

    expect(emitted[0]).toBeCloseTo(0.5, 1);
  });
});
