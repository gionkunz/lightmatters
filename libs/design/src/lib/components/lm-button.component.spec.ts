import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmButtonComponent } from './lm-button.component';

describe('LmButtonComponent', () => {
  let fixture: ComponentFixture<LmButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmButtonComponent],
    }).compileComponents();
  });

  it('applies primary styling when primary is true', () => {
    fixture = TestBed.createComponent(LmButtonComponent);
    fixture.componentRef.setInput('primary', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('bg-ink')).toBe(true);
    expect(button.classList.contains('text-paper')).toBe(true);
  });

  it('uses outline styling when primary is false', () => {
    fixture = TestBed.createComponent(LmButtonComponent);
    fixture.componentRef.setInput('primary', false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('border')).toBe(true);
    expect(button.classList.contains('text-ink')).toBe(true);
  });
});
