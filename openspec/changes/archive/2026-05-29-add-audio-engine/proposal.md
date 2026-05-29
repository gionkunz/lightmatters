## Why

Light Matters is a guided, narrated journey, but it is silent. Sound is a powerful, low-cost channel for atmosphere and feedback: a quiet ambient bed makes the experience feel alive, and small synthesized cues reinforce the moments where vectors tilt, light circles expand, or a value snaps into place. We have a background track sitting unused at `apps/lightmatters/public/bg-music.mp3` and an animation framework that is the natural place to author per-beat sound. Adding audio now — before the new SR chapters land — means every future step inherits sound for free.

## What Changes

- Introduce an `AudioService` (root-provided) that owns a single Web Audio API graph: a lazily-created `AudioContext`, a background-music source node (the looped `bg-music.mp3` at a very low volume), and a shared master chain where background and effect sounds converge.
- The master chain SHALL route through a `DynamicsCompressorNode` and then a spatial convolution reverb (`ConvolverNode`) mixed at low wetness but clearly audible, before reaching the destination.
- Provide methods to play short synthesized effect sounds built from `OscillatorNode`s (a small set of predefined sound types), each accepting per-play `volume` and stereo `pan` controls.
- Extend the animation framework (timeline engine) with a new declarative way to emit sounds during a step: events/fields that name a predefined sound type and carry optional `volume` and `pan`, kept consistent with skip / seek / checkpoint behavior so audio never desyncs from the playhead.
- Audit existing chapter steps and identify/annotate the beats where sound meaningfully reinforces the visual (tilts, expansions, snaps, arrivals) and wire those sounds in.
- Add an audio mute/unmute icon button in the top-right of the step-frame nav (grouped with the existing theme toggle), backed by the `AudioService` mute state and persisted like the theme.
- Respect browser autoplay policy: the audio graph resumes on first user gesture; nothing throws on SSG/SSR where Web Audio is unavailable.

## Capabilities

### New Capabilities
- `audio-engine`: The Web Audio API service — `AudioContext` lifecycle, looped low-volume background music, a synth-based effect-sound player (OSC presets) with per-play volume/pan, the shared master chain (compressor + spatial low-wetness reverb), mute state with persistence, and autoplay/SSR safety.

### Modified Capabilities
- `timeline-engine`: Add a declarative sound capability to the timeline so steps can play predefined sound types with per-play volume and pan, integrated with skip, seek, and checkpoint navigation.
- `step-chrome`: Add an audio mute/unmute icon button to the step-frame nav top-right.

## Impact

- New code: `AudioService` and effect-sound presets (in `libs/design` alongside `ThemeService`, or a small dedicated audio module), plus an `LmAudioToggle` component mirroring `LmThemeToggle`.
- Modified code: `libs/engine` timeline types + `TimelineRunner` (new sound event/field and its skip/seek/instant paths); `lm-step-frame.component.ts` nav; selected chapter step timeline data files for sound annotations.
- Dependencies: none new — Web Audio API is a browser standard. No GSAP/Howler; synths are hand-rolled OSCs, consistent with the hand-rolled-tweening decision.
- Assets: `apps/lightmatters/public/bg-music.mp3` becomes wired; a short impulse-response (or procedurally generated impulse) is needed for the convolution reverb.
- Build/SSR: graph creation is guarded behind `isPlatformBrowser` and a user gesture so prerender/SSG is unaffected.
