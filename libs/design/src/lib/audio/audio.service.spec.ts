import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to unmuted', () => {
    expect(service.muted()).toBe(false);
  });

  it('persists mute preference in localStorage', () => {
    service.setMuted(true);
    expect(localStorage.getItem('lm-audio-muted')).toBe('true');
    expect(service.muted()).toBe(true);

    service.setMuted(false);
    expect(localStorage.getItem('lm-audio-muted')).toBe('false');
  });

  it('toggle flips mute state', () => {
    service.toggle();
    expect(service.muted()).toBe(true);
    service.toggle();
    expect(service.muted()).toBe(false);
  });

  it('play is a no-op on the server platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const serverService = TestBed.inject(AudioService);
    expect(() => serverService.play('tick')).not.toThrow();
  });

  it('unlockFromUserGesture resolves false without Web Audio', async () => {
    const originalAudioContext = window.AudioContext;
    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: undefined,
    });

    await expect(service.unlockFromUserGesture()).resolves.toBe(false);

    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: originalAudioContext,
    });
  });
});
