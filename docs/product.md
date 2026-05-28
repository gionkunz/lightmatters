# Light Matters — Product

**Domain:** lightmatters.app
**Tagline (working):** An interactive journey into light, matter, spacetime, and relativity.

## Vision

Light Matters is an interactive web experience that builds **intuition** for special and general relativity. It is not a textbook, not a video course, and not a documentation site. It is closer to a guided game: a narrated journey where each step reveals a concept through a small, interactive experiment.

Most people first encounter relativity as equations or analogies that never quite click. Light Matters borrows the pedagogical approach of Lewis Carroll Epstein's *Relativity Visualized* — folded paper, cones, vectors on spacetime diagrams — and turns those static drawings into interactive, animated, dial-able experiences in the browser. The aim is that by the end of a chapter, the learner can *see* why gravity curves a light beam, why the center of the Earth is weightless, or why every observer measures the same speed of light — without needing the math first.

## Audience

- Curious adults who have tried to learn relativity and bounced off the equations.
- Students who want geometric intuition to complement a physics course.
- Physics enthusiasts who already love this material and want a beautiful interactive companion to Epstein's book.

The product assumes curiosity, not prior physics knowledge. Math is optional and always layered on top of a visual that already makes sense.

## Experience principles

1. **Intuition before formalism.** Every concept is introduced through a geometric picture you can manipulate. Equations, if shown at all, come after the picture clicks.
2. **A journey, not a reference.** The user is guided step-by-step by a narrator. They can skip ahead, but the default flow is linear and paced.
3. **Show, then let them play.** Most steps open with an animation that demonstrates the idea, then hand control to the user (sliders, draggable vectors, etc.) to explore the parameter space.
4. **Minimalist, paper-like aesthetic.** Black on white (or white on black). Line-based rendering even for 3D — bodies are drawn as wireframes/silhouettes, not shaded solids. A serif typeface gives the experience the feel of a learning paper or a quiet notebook.
5. **One screen, one idea.** Steps are small. A step has a single visual focus and a single insight.
6. **Narrated reveal.** Text appears progressively, like a chat conversation, so the reader's eye moves with the explanation rather than skimming ahead. The reader can press a key to reveal everything immediately and continue at their own pace.
7. **Optional commitment questions.** Prediction prompts and similar beats invite a choice but never gate navigation — playback transport, checkpoint seek, and step boundaries stay available; an unanswered question is simply ignored.

## Aesthetic direction

The visual design is mocked up in `visual-design-prototype/` and is the source of truth. The shorthand:

- **Two skins, one product.** A warm-paper **light** mode (`#f6f5f1` paper, near-black ink) and a deep-night **dark** mode (`#0a0c11` paper, ivory ink). The user can toggle freely; both are first-class.
- **Two-color grammar.** Beyond ink-on-paper, exactly two accents — a red family and a blue family. They are **semantic**: body A vs. body B, vector A vs. vector B. Never decorative.
- **Type.** **EB Garamond** for everything readable. **IBM Plex Mono** for small uppercase labels — axis ticks, chapter/step marks, control names.
- **2D visuals.** Clean line work, thin strokes, plenty of negative space. Diagrams feel hand-drawn rather than engineered.
- **3D visuals.** Wireframe / line-art rendering. No physically-based shading. The cone, the bent grid, the gravity well — all drawn in lines so they feel continuous with the 2D sketches.
- **Interactive elements glow.** Only things you can press or drag emit a soft accent halo. Diagrams stay quiet linework. The interface teaches you what's grabbable without arrows or labels.
- **Motion.** Smooth and unhurried. Animations are paced for comprehension, not spectacle.
- **Wordmark.** "Light Matters" in EB Garamond with a colored period as a signal mark. Tagline: *"the geometry of relativity, by hand."*

## Narrative structure

The product is organized as a sequence of **chapters**, each containing several **steps**. A step is the atomic unit — one visual, one beat of narration, one interaction.

The chapter list below is the **working journey skeleton**. It is intended as a starting point; the engine is designed so chapters and steps can be reordered, added, or rewritten without touching the core.

**Structure:** Chapters 1–5 build **flat spacetime** (special relativity intuition). Chapters 6–8 turn to **curved spacetime** (general relativity). Finish the speed-budget arc in Chapter 2 before opening Chapter 3.

### Chapter 1 — Position, time, spacetime

Establish the vocabulary before introducing relativity at all.

- What is position? A point on an axis.
- What is time? Another axis.
- The spacetime diagram: space on one axis, time on the other. Things trace lines through it.
- Introduce the spacetime diagram as the core reusable visual that will appear throughout the entire product.

### Chapter 2 — The speed budget

The single most powerful idea in the journey: you are always moving through spacetime at the speed of light. You only choose how to allocate it between space and time.

- A normalized velocity vector on the spacetime diagram.
- Pure time motion (at rest spatially) → moving through time at full c.
- Pure space motion → light, moving through space at full c, frozen in time.
- Anywhere in between: time dilation falls out of the geometry.
- Two-vector comparison: catch-up problems become straightforward graphical exercises.
- The realization that we — at everyday speeds — are essentially moving through time at the speed of light.

**Bridge to Chapter 3.** The final step of Chapter 2 is a short handoff: two stationary observers, B sends one flash toward A along a light ray, both clocks agree. One forward-looking question — what changes with motion, or with many flashes? — then continue to Chapter 3, which introduces wavefronts, moving observers, and relativity of simultaneity.

### Chapter 3 — Light and information

We **change cameras**. The Epstein spacetime diagram is set aside; both axes here are **space**, viewed from above. Light expands as visible circles in space. Time is the animation, not a dimension on the page. The diagram returns intact in Chapter 6.

- **Step 1 — Light through space.** Camera-switch beat. One source $S$, one observer $A$. The wavefront expands at $c$ in every direction and reaches $A$.
- **Step 2 — Two listeners.** Stationary $A$ and $B$, equidistant from $S$. The pulse arrives at both at the same instant — symmetry on display.
- **Step 3 — One of them moves.** Same scene, but $B$ is moving toward $S$ at $0.4\,c$. $B$ hears the flash before $A$. Motion changed when the news arrived, not how fast it travelled.
- **Step 4 — Two flashes, one witness.** Two equidistant sources flash simultaneously. A stationary witness in the middle sees both arrive together; a witness drifting rightward sees the right flash first. Relativity of simultaneity, made visible.
- **Step 5 — Outro.** Tie back to Chapter 2's clocks; flag what is coming next: source motion and the constancy of $c$ (Chapter 4), Doppler and aberration (Chapter 5).

Aberration ("rain on the windshield") and Doppler shift live in Chapter 5, not here. Chapter 3 is the conceptual unlock; later chapters reuse the same spatial primitive to add colour, rhythm, and source-motion.

### Chapter 4 — The ether was wrong

A short detour with high payoff: dismantle the medium intuition, then show what light actually does.

- **Step 1 — The ether.** Sound needs air; people assumed light needed an invisible "luminiferous ether." Narration-led; the old picture stated plainly.
- **Step 2 — Ether wind and Michelson–Morley.** Animated ether vector field: at rest (dots), moving (headwind arrows), circular motion, ether-dragged light prediction, then Earth's orbital null result (expected fringe shift vs nothing observed). No apparatus schematic.
- **Step 3 — Light at rest.** Back on `lm-light-scene`: stationary source, one pulse expanding at $c$ — baseline before the pivot.
- **Step 4 — Moving source.** Source moving at $0.4\,c$ when it flashes; pulse circle anchored at the **birth point**, still expanding at $c$. Light does not inherit source velocity. FactLines track source position vs fixed emission origin.
- **Step 5 — Outro.** Self-propagating EM wave; $c$ invariant for everyone; bridge to Chapter 5 Doppler.

The Michelson–Morley apparatus is a step-local schematic, not a reusable primitive. Moving-source pulse origin is implemented in `lm-light-scene` (`source.velocity` + emission-position rendering).

### Chapter 5 — Doppler and seeing motion

Combine the constancy of $c$ with source motion on `lm-light-scene` — pulse trains, observed tick rhythm, redshift and blueshift.

- **Step 1 — Each pulse is a tick.** Stationary source S and observer A; periodic pulses; count arrivals as clock ticks.
- **Step 2 — Receding — redshift.** S moves away at $0.5\,c$; wavefronts space out; mean tick interval at A grows.
- **Step 3 — Approaching — blueshift.** S moves toward A at $0.5\,c$; wavefronts compress; mean tick interval shrinks.
- **Step 4 — Extreme recession.** S at $0.9\,c$ receding; ticks arrive nearly frozen; "since last tick" stretches dramatically.
- **Step 5 — Outro.** Tie rhythm to Doppler, time dilation, and what you *see*; bridge to Chapter 6 (gravity as geometry).

Physics helpers: `buildPeriodicEmissions`, `pulseArrivalSceneTimes`, `meanPulseInterval` in `@lm/physics`.

---

*Chapters 6–8 leave flat spacetime and introduce curved geometry.*

### Chapter 6 — Rolling the diagram: gravity as geometry

The cone visualization from Epstein, brought to life. Returns to the Epstein spacetime diagram and introduces WebGL (`lm-curved-surface`).

- **Step 1 — A point in time.** Unrolled cylinder with **Space** / **time** axes; a body at rest moves along a line offset from the time axis, then the sheet **rolls into a tube** and the dot completes another lap around the rim.
- **Step 2 — Bend into a cone.** Morph cylinder → cone; wide end = strong gravity, point = weak gravity.
- **Step 3 — Gravity as geometry.** A straight geodesic on the cone curves spatially when unrolled.
- **Step 4 — Newton's apple.** Tiny house on the rim; gravity is the geometry, not the apple. Bridge to Chapter 7.

Physics helpers: `cylinderSurfacePoint`, `coneSurfacePoint`, `morphSurfacePoint`, `worldlineTrailSamples` in `@lm/physics`.

### Chapter 7 — Why the center of the Earth is weightless

A continuation of the cone idea, answering a question the founder asked himself as a child — opened with the tunnel-through-Earth thought experiment.

- **Step 1 — The puzzle.** Tunnel jump hook; Epstein's **bulge** (not a dipping well); cone recap.
- **Step 2 — Build the bulge.** Piecewise: narrow outer cylinder → **expanding** cone → wide center cylinder (Earth sphere, weightless) → **contracting** cone → narrow outer cylinder.
- **Step 3 — Fall on folded paper.** A particle falls through the piecewise bulge, then the paper unrolls flat — the curving worldline straightens into a literal straight line. Gravity is the shape of the paper.
- **Step 4 — Smooth the shape.** Morph the four creases into one continuous bulge; the smooth shape can't lay perfectly flat, but the straight-line truth from Step 3 still holds.
- **Step 5 — Fall through Earth.** Pay off the tunnel: particle spirals in, passes the weightless center, climbs the far side (trail) — the same straight-line worldline you saw on the unrolled paper.
- **Step 6 — Escape velocity.** Interactive energy dial: bound vs escape trajectories; bridge to Chapter 8.

Physics helpers: `wellRadiusAt`, `wellSurfacePoint`, `wellTrajectoryPoint`, `wellTrajectorySamples`, `isEscapeTrajectory` in `@lm/physics`.

### Chapter 8 — Light bending around mass

General relativity applied to light — the deep-well regime where deflection is visible.

- **Step 1 — The deep well.** Bridge from Chapter 7: Earth's shallow well barely bends light; introduce the extreme regime and a massive star at the well center.
- **Step 2 — One ray.** Animate a single light geodesic skimming past the mass with visible deflection.
- **Step 3 — Widen the beam.** Inner and outer edges both bend; the whole band curves together.
- **Step 4 — The path puzzle.** Compare spatial path lengths: outer longer than inner; pose the synchronization question without resolving it.
- **Step 5 — Time runs slower inside.** Gravitational time-dilation readout on inner vs outer edge; connect to Chapter 2 speed-budget vocabulary.
- **Step 6 — Synchronized arrival.** Both edges reach the detector together; dilation compensates for the shorter inner path.
- **Step 7 — Straight lines, curved canvas.** Payoff: light follows straight geodesics on curved spacetime, not a force; interactive skim-distance control; outro toward future chapters.

Physics helpers: `lightGeodesicPoint`, `lightGeodesicSamples`, `lightGeodesicArcLength`, `gravitationalTimeDilationFactor`, `DEEP_WELL_PARAMS` in `@lm/physics`.

### Beyond — open

The structure is intentionally extensible. Candidate future chapters: black holes and event horizons, cosmological expansion, the twin paradox as a worldline puzzle, gravitational waves, frame dragging. The framework is designed so that adding a new chapter is a content task, not an engineering task.

## Recurring visual primitives

A small set of reusable building blocks appears across many chapters. These are the "vocabulary" of the engine:

- **The spacetime diagram.** Always available. The most important component in the product.
- **The velocity vector** on the spacetime diagram, normalized to c.
- **The expanding light circle / wavefront.**
- **The cone / curved-paper transformation** — a parametric surface that smoothly morphs from cylinder to cone to gravity well.
- **The wireframe massive body** (Earth, star, black hole) — a sphere drawn in lines.
- **The traced worldline** — a point that moves through a diagram and leaves a fading trail.
- **The narrator text** — typewritten reveal, skippable.

Designing these primitives carefully is more important than rushing to build chapter content. Once they exist, building new steps is a matter of composing them on a timeline.

## Interaction model

A step generally follows one of three patterns:

1. **Animated reveal.** The narrator speaks; the diagram animates to show the concept. The user advances when ready.
2. **Guided exploration.** An opening animation establishes the setup, then hands off to the user. Sliders, draggable elements, or buttons let them perturb the system and see the response.
3. **Hybrid.** An animation runs, pauses at a moment of insight, waits for the user to interact, then continues — possibly branching based on what the user did.

All three patterns are expressed through the same underlying mechanism: a timeline of declarative animation/interaction events. See `architecture.md`.

## Naming, branding

- Product name: **Light Matters** (working title, possibly final).
- Domain: **lightmatters.app**.
- The double meaning is intentional: "light matters" as physics (light and matter), and "light matters" as importance.
- Visual identity follows the aesthetic principles above: monochrome, line-based, serif, quiet.

## What this product is *not*

- Not a textbook. It does not aim for completeness or rigor. It aims for *clicks of intuition*.
- Not a video. Everything is interactive and re-playable at the learner's pace.
- Not a game with scores or progression mechanics. The journey itself is the reward.
- Not a mobile-first product (initially). The interaction model assumes a real screen and a pointer. Mobile may follow once the desktop experience is solid.

## First milestone

A vertically-sliced first release:

- The engine: chapter/step framework, narration system, animation timeline, the reusable spacetime diagram primitive, a working WebGL canvas with line-based rendering.
- Chapter 1 (Position, time, spacetime) fully built as a proof that the engine can deliver the intended feel.
- Two or three steps of Chapter 2 (Speed budget) to validate that the speed-budget vector and time-dilation visualizations work end-to-end.

Everything after that is content built on top of a stable engine.
