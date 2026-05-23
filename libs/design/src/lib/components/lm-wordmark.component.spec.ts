import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmWordmarkComponent } from './lm-wordmark.component';

describe('LmWordmarkComponent', () => {
  let fixture: ComponentFixture<LmWordmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmWordmarkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmWordmarkComponent);
    fixture.detectChanges();
  });

  it('renders the wordmark with accent dot', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Light Matters');
    expect(fixture.nativeElement.querySelector('.text-accent-1')).toBeTruthy();
  });
});
