import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmPredictionChoiceComponent } from './lm-prediction-choice.component';

describe('LmPredictionChoiceComponent', () => {
  let fixture: ComponentFixture<LmPredictionChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmPredictionChoiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmPredictionChoiceComponent);
    fixture.componentRef.setInput('question', 'Do they agree?');
    fixture.componentRef.setInput('options', [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' },
    ]);
    fixture.detectChanges();
  });

  it('renders question and options', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Do they agree?');
    expect(el.querySelectorAll('button').length).toBe(2);
  });

  it('emits selected option id', () => {
    const emitted: string[] = [];
    fixture.componentInstance.selectedIdChange.subscribe((id) =>
      emitted.push(id),
    );
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    expect(emitted).toEqual(['no']);
  });
});
