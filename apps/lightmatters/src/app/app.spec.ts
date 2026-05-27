import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('hosts the viewport resolution hint', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const hint = fixture.nativeElement.querySelector(
      'lm-viewport-resolution-hint',
    );
    expect(hint).not.toBeNull();
  });
});
