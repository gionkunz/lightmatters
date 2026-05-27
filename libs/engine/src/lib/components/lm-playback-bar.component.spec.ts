import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmPlaybackBarComponent } from './lm-playback-bar.component';

describe('LmPlaybackBarComponent', () => {
  let fixture: ComponentFixture<LmPlaybackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmPlaybackBarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LmPlaybackBarComponent);
    fixture.componentRef.setInput('visible', true);
  });

  it('renders transport controls when visible', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-label="Previous checkpoint"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[aria-label="Next checkpoint"]')).toBeTruthy();
  });

  it('shows boundary hints beside transport buttons', () => {
    fixture.componentRef.setInput('previousHint', 'step 2');
    fixture.componentRef.setInput('nextHint', 'next chapter');
    fixture.detectChanges();
    const previous = fixture.nativeElement.querySelector(
      '[data-lm-transport-hint="previous"] lm-kicker',
    );
    const next = fixture.nativeElement.querySelector(
      '[data-lm-transport-hint="next"] lm-kicker',
    );
    expect(previous?.textContent?.trim()).toBe('step 2');
    expect(next?.textContent?.trim()).toBe('next chapter');
  });

  it('keeps hint slots reserved when hints are empty', () => {
    fixture.detectChanges();
    const slots = fixture.nativeElement.querySelectorAll(
      '[data-lm-transport-hint]',
    );
    expect(slots.length).toBe(2);
    expect(slots[0].classList.contains('invisible')).toBe(true);
    expect(slots[1].classList.contains('invisible')).toBe(true);
  });
});
