## Context

Light Matters renders narrated, timeline-driven steps with no audio. The timeline engine (`libs/engine`) has three implemented event types — `narrate`, `animate`, `wait` — executed by a plain (non-`@Injectable`) `TimelineRunner` that each step component constructs with `new TimelineRunner(events, registry)`. Angular app services use `providedIn: 'root'` (`ThemeService`, `MathJaxService`); `libs/engine` already depends on `libs/design` (the narrator injects `MathJaxService`). The step-frame nav (`libs/engine/.../lm-step-frame.component.ts`) puts `<lm-theme-toggle />` alone in its top-right grid column. There is an unused asset at `apps/lightmatters/public/bg-music.mp3`. The app builds with SSG (build-time prerender), so any browser-only API must be guarded.

Constraints carried from `docs/architecture.md`: no third-party tween/audio wrappers (hand-rolled, like the easings), Web Audio is acceptable as a browser standard, two first-class themes, interactive elements glow via `lmInteractive`.

## Goals / Non-Goals

**Goals:**
- A single root `AudioService` owning one Web Audio graph: lazy `AudioContext`, looped low-volume background music, a synth effect-sound player, and a shared master chain (compressor + spatial low-wetness reverb).
- Predefined effect sound types synthesized from `OscillatorNode`s, each playable with per-call `volume` and stereo `pan`.
- A declarative timeline sound capability so steps emit cues with per-event `volume`/`pan`, consistent with skip/seek/checkpoint behavior.
- A mute/unmute icon button in the step-frame nav, persisted like the theme; full SSR/SSG and autoplay-policy safety.

**Non-Goals:**
- No music sequencing, BPM sync, or beat-matching to the timeline.
- No third-party audio library (Howler, Tone.js) — synths are hand-rolled OSCs.
- No per-step custom music tracks; one ambient bed for the whole app.
- No `prefers-reduced-motion`-style "reduced audio" mode beyond the global mute.
- Not retrofitting `bind`/`trigger` timeline events (still deferred).

## Decisions

### 1. `AudioService` lives in `libs/design`, root-provided
Mirrors `ThemeService`/`MathJaxService`. `libs/engine` already depends on `libs/design`, so engine code and UI can both reach it without a new dependency edge. Alternative (a dedicated `libs/audio`) was rejected as premature; can be extracted later if it grows.

### 2. Web Audio graph topology
One graph, built lazily on first resume:

```
bgSource (HTMLAudioElement → MediaElementSource) → bgGain (very low) ─┐
effect voices (Oscillator → ampEnv → StereoPanner) ──────────────────┤
                                                                      ▼
                                                                  busGain
                                                                      │
                                                              DynamicsCompressor
                                                                      │
                                            ┌─────────────────────────┴───────────┐
                                            ▼ (dry)                                ▼
                                          dryGain                              Convolver (IR)
                                            │                                      │
                                            │                                   wetGain (low, audible)
                                            └──────────────┬───────────────────────┘
                                                           ▼
                                                      masterGain (mute)
                                                           ▼
                                                     destination
```

- **Compressor before the dry/wet split** so background and effects are glued together as one program, matching the request that the shared master nodes carry the compressor and reverb.
- **Parallel dry/wet reverb** (not in-line) so wetness is a clean mix control; `wetGain` low (~0.15) but audible, `dryGain` ~1.0.
- **`masterGain` is the mute control** (ramp to 0 / restore), kept after the reverb so mute also silences reverb tails.

### 3. Background music via `HTMLAudioElement` + `MediaElementAudioSourceNode`
`<audio loop>` streams `bg-music.mp3` and loops natively with minimal memory, then routes into the graph through `bgGain` at a very low fixed level. Alternative (`decodeAudioData` into an `AudioBufferSourceNode`) was rejected: more memory and manual loop handling for no benefit here.

### 4. Reverb impulse response is generated procedurally
At graph build, synthesize a stereo impulse response into an `AudioBuffer` (exponentially decaying, slightly decorrelated L/R noise, ~2–3 s decay) and assign it to the `ConvolverNode`. This gives a "spatial" reverb with no licensed `.wav` asset to source/ship, and the decay/length are tunable constants. Trade-off: synthetic IRs are less characterful than recorded spaces; acceptable for an ambient wash, and the node can later accept a real IR file without API change.

### 5. Effect sounds: a small `SoundType` preset table of OSC recipes
A typed enum/union of predefined cues (e.g. `tick`, `tilt`, `expand`, `snap`, `arrive`, `soft`) maps to recipes describing oscillator type, start/end frequency (with a short glide), and an amplitude envelope (attack/decay) — all short, fire-and-forget. `play(type, { volume = 1, pan = 0 })` builds an `Oscillator → GainNode(env) → StereoPanner` voice, schedules it, and lets it free-run to completion (auto-disconnect on `ended`). Per-call `volume` scales the env peak; `pan` sets `StereoPannerNode.pan` in [-1, 1].

### 6. Timeline integration: a standalone fire-and-forget `sound` event
Add `SoundEvent = { type: 'sound'; sound: SoundType; volume?: number; pan?: number }` to `TimelineEvent`. Rationale over overloading `animate`: a standalone event gives clean "per play event" volume/pan and free placement (before/after any beat), and keeps `animate` focused on tweening.

Scheduling rules (the consistency contract):
- **Zero duration, non-seekable.** `sound` events are excluded from checkpoint/`buildTimelineSchedule` beats, add 0 to total duration, and never trigger a checkpoint hold — they fire and immediately advance.
- **Plays only on genuine forward playback.** `skip()`, `goToCheckpoint()`, seek, and instant/complete paths do **not** fire sound events. Scrubbing the timeline must not spray cues.
- Implemented in `executeEvent` (play + resolve immediately) while the instant paths (`executeEventInstantly`, `completeCurrentEvent`) treat `sound` as a no-op.

### 7. Wiring the runner to audio without per-step churn or a DI cycle
`TimelineRunner` is a plain class created inside ~dozens of step components, and `libs/design` must not import `libs/engine` (would invert the existing dependency and create a cycle). Therefore:
- `libs/engine` defines a `TimelineSoundSink` interface (`play(sound, opts)`) plus a module-scoped registrar `setTimelineSoundSink(sink)` / internal getter. `TimelineRunner` reads the registered sink (browser-only) when it hits a `sound` event.
- `AudioService` (in `design`) structurally implements `TimelineSoundSink` but does not import engine.
- The app wires them once: `app.config.ts`'s `APP_INITIALIZER` (which already injects `ThemeService`) also injects `AudioService` and calls `setTimelineSoundSink(audioService)`.

This keeps zero changes to individual step components, no dependency cycle, and a single wiring point. Trade-off: a module-scoped singleton in engine; acceptable because it is browser-only and set exactly once at bootstrap (no SSR state leakage since the sink is only consulted client-side).

### 8. Autoplay policy and lifecycle
The `AudioContext` is created suspended. `AudioService` registers a one-time `pointerdown`/`keydown` listener (browser only) that resumes the context and starts the background music (unless muted). All graph creation is lazy and guarded by `isPlatformBrowser`, so SSG/prerender never touches Web Audio.

### 9. Mute UI mirrors the theme toggle
New `LmAudioToggleComponent` in `libs/design` mirrors `LmThemeToggleComponent`: a bordered `lmInteractive` button using inline SVG (`stroke="currentColor"`) showing a speaker / speaker-off glyph from `audio.muted()`. Mute state is a `signal<boolean>` persisted to `localStorage` key `lm-audio-muted` (default unmuted). It is placed in the step-frame nav's right column, grouped with `<lm-theme-toggle />` via a flex container.

## Risks / Trade-offs

- **Autoplay blocked by the browser** → context starts suspended and resumes on the first user gesture; nothing depends on audio being audible before interaction.
- **Sound spam while scrubbing/skipping** → `sound` events fire only on real forward playback; all instant/seek paths skip them.
- **DI cycle / per-step edit explosion** → interface + module-scoped registrar in engine, implemented by `AudioService` in design, wired once in `app.config.ts`.
- **Procedural IR sounds generic** → tunable decay/length constants; node accepts a real IR later without API change.
- **Overlapping voices / loudness spikes** → master `DynamicsCompressorNode` glues the mix; effect voices auto-disconnect on `ended`; consider a small concurrent-voice cap.
- **SSR/SSG crash on missing Web Audio** → every entry point guarded by `isPlatformBrowser`; service methods no-op on the server.
- **iOS/Safari `MediaElementSource` quirks** → keep the `<audio>` element in the DOM and only connect after resume; verify on Safari during implementation.

## Migration Plan

Additive only — no existing behavior changes if no `sound` events are authored and the user leaves audio unmuted-but-untriggered. Roll out in order: (1) `AudioService` + graph + presets, (2) `sound` event + runner integration + registrar, (3) `app.config.ts` wiring + nav toggle, (4) audit and annotate selected step timelines. Rollback is removing the toggle and any authored `sound` events; the graph is dormant until a gesture.

## Open Questions

- Final effect-sound palette (names + exact OSC recipes) — to be tuned by ear during implementation; the spec fixes the *contract* (named presets, per-call volume/pan), not the timbres.
- Exact background-music level and reverb wetness constants — set by ear, within "very low" / "low but audible".
- Whether the landing page (`LandingNavComponent`) should also start the ambient bed and show the toggle, or keep audio scoped to chapter steps (default: wire the toggle in step chrome first; landing optional follow-up).
