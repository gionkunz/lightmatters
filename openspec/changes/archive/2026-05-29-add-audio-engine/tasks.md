## 1. AudioService and Web Audio graph (libs/design)

- [x] 1.1 Create `AudioService` (`@Injectable({ providedIn: 'root' })`) in `libs/design`, guarding all Web Audio access behind `isPlatformBrowser`
- [x] 1.2 Lazily create the `AudioContext` and build the shared graph once: `busGain → DynamicsCompressorNode → (dryGain + ConvolverNode→wetGain) → masterGain → destination`
- [x] 1.3 Generate a procedural stereo impulse response (decaying decorrelated noise, ~2–3 s) into an `AudioBuffer` and assign it to the `ConvolverNode`; set `wetGain` low but audible (~0.15) and `dryGain` ~1.0
- [x] 1.4 Wire background music: an `<audio loop>` element for `bg-music.mp3` → `MediaElementAudioSourceNode` → `bgGain` (very low) → `busGain`
- [x] 1.5 Register a one-time `pointerdown`/`keydown` listener that resumes the context and starts background music (unless muted) on first gesture
- [x] 1.6 Add a `muted` signal + `toggle()`/`setMuted()` that ramps `masterGain` to 0 / restores, persisted to `localStorage` key `lm-audio-muted` (default unmuted)
- [x] 1.7 Export `AudioService` from `libs/design/src/index.ts`

## 2. Synthesized effect sounds

- [x] 2.1 Define a `SoundType` union/enum and a preset recipe table (oscillator type, start/end frequency glide, amp envelope) for an initial palette (e.g. `tick`, `tilt`, `expand`, `snap`, `arrive`, `soft`)
- [x] 2.2 Implement `play(type, { volume = 1, pan = 0 })` building an `Oscillator → GainNode(env) → StereoPannerNode → busGain` voice, scaling env peak by `volume` and setting pan in [-1, 1]
- [x] 2.3 Auto-disconnect each voice on `ended`; optionally cap concurrent voices
- [x] 2.4 Export `SoundType` (and any sound options type) from `libs/design/src/index.ts`

## 3. Timeline engine sound integration (libs/engine)

- [x] 3.1 Add `SoundEvent` (`{ type: 'sound'; sound: SoundType; volume?; pan? }`) to `TimelineEvent` in `libs/engine/.../timeline/types.ts` (define a local `SoundType`/`TimelineSoundSink` to avoid an engine→design import cycle)
- [x] 3.2 Add a `TimelineSoundSink` interface + module-scoped `setTimelineSoundSink(sink)` registrar and internal getter in `libs/engine`
- [x] 3.3 Handle `sound` in `TimelineRunner.executeEvent`: play via the registered sink (browser-only), then resolve immediately and advance
- [x] 3.4 Exclude `sound` events from `buildTimelineSchedule` checkpoints, timeline total duration, and checkpoint holds
- [x] 3.5 Make `executeEventInstantly`/`completeCurrentEvent`/`skip`/seek paths treat `sound` as a silent no-op (never replay while scrubbing/skipping)
- [x] 3.6 Export `SoundEvent`, `TimelineSoundSink`, and `setTimelineSoundSink` from `libs/engine/src/index.ts`

## 4. App wiring and mute toggle UI

- [x] 4.1 In `app.config.ts` `APP_INITIALIZER`, inject `AudioService` and call `setTimelineSoundSink(audioService)` (single wiring point, no per-step changes)
- [x] 4.2 Create `LmAudioToggleComponent` in `libs/design` mirroring `LmThemeToggleComponent`: bordered `lmInteractive` button with inline speaker / speaker-off SVG driven by `audio.muted()`, calling `toggle()`
- [x] 4.3 Export `LmAudioToggleComponent` from `libs/design/src/index.ts`
- [x] 4.4 Place `<lm-audio-toggle />` in the step-frame nav right column (`lm-step-frame.component.ts`), grouping it with `<lm-theme-toggle />` in a flex container

## 5. Audit steps and author sounds

- [x] 5.1 Audit all chapter step timelines for beats where sound reinforces the visual (vector tilts, light-circle expansions, value snaps, arrivals/boundaries)
- [x] 5.2 Add `sound` events (with tuned `volume`/`pan`) to the identified beats; tune background level and reverb wetness by ear

## 6. Tests and verification

- [x] 6.1 Extend `timeline-runner.spec.ts`: `sound` event plays via a fake sink on playback, forwards volume/pan, adds no checkpoint/duration, and is silent on skip/seek
- [x] 6.2 Add `AudioService` unit tests with a mocked/guarded Web Audio context (graph built once, mute toggles master, SSR no-op)
- [x] 6.3 Run `nx lint`, `nx test`, and `nx build` for `lightmatters` and affected libs (`--tui=false`); verify SSG build is unaffected and the nav toggle mutes/unmutes
