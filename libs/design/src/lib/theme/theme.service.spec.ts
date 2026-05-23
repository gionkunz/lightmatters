import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('defaults to light theme', () => {
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles between light and dark', () => {
    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    service.toggle();
    expect(service.theme()).toBe('light');
  });

  it('persists theme preference in localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('lm-theme')).toBe('dark');

    localStorage.setItem('lm-theme', 'dark');
    const reloaded = TestBed.inject(ThemeService);
    expect(reloaded.theme()).toBe('dark');
  });
});
