import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LmStepFrameComponent } from './lm-step-frame.component';

const THREE_CHECKPOINTS = [
  { eventIndex: 0, position: 0 },
  { eventIndex: 2, position: 0.5 },
  { eventIndex: 4, position: 1 },
];

describe('LmStepFrameComponent', () => {
  let fixture: ComponentFixture<LmStepFrameComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmStepFrameComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(LmStepFrameComponent);
    router = TestBed.inject(Router);
    fixture.componentRef.setInput('chapter', 1);
    fixture.componentRef.setInput('chapterTitle', 'Test chapter');
    fixture.componentRef.setInput('stepTitle', 'Test step');
    fixture.componentRef.setInput('step', 2);
    fixture.componentRef.setInput('stepsTotal', 4);
    fixture.componentRef.setInput('showPlayback', true);
    fixture.componentRef.setInput('prevStepUrl', '/chapter/1/step/1');
    fixture.componentRef.setInput('nextStepUrl', '/chapter/1/step/3');
    fixture.componentRef.setInput('hasNextStep', true);
    fixture.componentRef.setInput('checkpoints', THREE_CHECKPOINTS);
  });

  it('does not render a footer', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('footer')).toBeNull();
  });

  it('renders breadcrumb chrome with chapter and step titles', () => {
    fixture.componentRef.setInput('chapter', 2);
    fixture.componentRef.setInput('chapterTitle', 'The speed budget');
    fixture.componentRef.setInput('stepTitle', 'Before we send more signals');
    fixture.componentRef.setInput('step', 3);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.textContent?.toLowerCase()).toContain('chapter');
    expect(nav.textContent).toContain('02');
    expect(nav.textContent).toContain('The speed budget');
    expect(nav.textContent?.toLowerCase()).toContain('step');
    expect(nav.textContent).toContain('03');
    expect(nav.textContent).toContain('Before we send more signals');
  });

  it('links the wordmark to home', () => {
    fixture.detectChanges();
    const homeLink = fixture.nativeElement.querySelector(
      'a[aria-label="Light Matters home"]',
    );
    expect(homeLink).toBeTruthy();
  });

  it('emits goPrevious when seeking within a non-first checkpoint', () => {
    fixture.componentRef.setInput('activeCheckpointIndex', 1);
    fixture.componentRef.setInput('canGoPrevious', true);
    fixture.detectChanges();
    const spy = jest.spyOn(fixture.componentInstance.goPrevious, 'emit');
    fixture.componentInstance.transportPrevious();
    expect(spy).toHaveBeenCalled();
  });

  it('navigates to prevStepUrl at the first checkpoint even while animation plays', () => {
    fixture.componentRef.setInput('activeCheckpointIndex', 0);
    fixture.componentRef.setInput('canGoPrevious', true);
    fixture.detectChanges();
    const navigate = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const spy = jest.spyOn(fixture.componentInstance.goPrevious, 'emit');
    fixture.componentInstance.transportPrevious();
    expect(navigate).toHaveBeenCalledWith('/chapter/1/step/1');
    expect(spy).not.toHaveBeenCalled();
  });

  it('navigates to nextStepUrl at the last checkpoint even while animation plays', () => {
    fixture.componentRef.setInput('activeCheckpointIndex', 2);
    fixture.componentRef.setInput('canGoNext', true);
    fixture.componentRef.setInput('advanceDisabled', false);
    fixture.detectChanges();
    const navigate = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const spy = jest.spyOn(fixture.componentInstance.goNext, 'emit');
    fixture.componentInstance.transportNext();
    expect(navigate).toHaveBeenCalledWith('/chapter/1/step/3');
    expect(spy).not.toHaveBeenCalled();
  });

  it('blocks boundary forward navigation when advanceDisabled at the last checkpoint', () => {
    fixture.componentRef.setInput('activeCheckpointIndex', 2);
    fixture.componentRef.setInput('canGoNext', false);
    fixture.componentRef.setInput('advanceDisabled', true);
    fixture.detectChanges();
    const navigate = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.componentInstance.transportNext();
    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.componentInstance['transportCanGoNext']()).toBe(false);
  });

  it('shows boundary hints at the first and last checkpoints regardless of runner state', () => {
    fixture.componentRef.setInput('activeCheckpointIndex', 0);
    fixture.componentRef.setInput('canGoPrevious', true);
    fixture.componentRef.setInput('canGoNext', true);
    fixture.detectChanges();
    expect(fixture.componentInstance['previousHint']()).toBe('step 1');
    expect(fixture.componentInstance['nextHint']()).toBe('');

    fixture.componentRef.setInput('activeCheckpointIndex', 2);
    fixture.detectChanges();
    expect(fixture.componentInstance['previousHint']()).toBe('');
    expect(fixture.componentInstance['nextHint']()).toBe('step 3');
  });

  it('shows cross-chapter hints at step boundaries', () => {
    fixture.componentRef.setInput('chapter', 2);
    fixture.componentRef.setInput('step', 1);
    fixture.componentRef.setInput('prevStepUrl', '/chapter/1/step/4');
    fixture.componentRef.setInput('activeCheckpointIndex', 0);
    fixture.componentRef.setInput('nextChapter', true);
    fixture.componentRef.setInput('canGoPrevious', true);
    fixture.componentRef.setInput('canGoNext', true);
    fixture.detectChanges();
    expect(fixture.componentInstance['previousHint']()).toBe('previous chapter');

    fixture.componentRef.setInput('activeCheckpointIndex', 2);
    fixture.detectChanges();
    expect(fixture.componentInstance['nextHint']()).toBe('next chapter');
  });
});
