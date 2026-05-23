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

The chapter list below is the **initial draft** discussed in the founder's interview. It is intended as a starting skeleton; the engine is designed so chapters and steps can be reordered, added, or rewritten without touching the core.

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

### Chapter 3 — Rolling the diagram: gravity as geometry

The cone visualization from Epstein, brought to life.

- Roll the spacetime diagram into a **cylinder** — you are moving in circles through time with negligible spatial displacement.
- Bend the cylinder into a **cone** — the wide end represents strong gravity, the point weak gravity.
- A straight worldline drawn on the cone curves spatially in the unrolled view: **this is gravity**. Not a force, just geodesics on warped spacetime.
- Newton's apple: place a tiny house on the rim of the cone, draw an apple's worldline. Place the same house further around the cone — the apple falls the same way. Gravity is the geometry, not the apple.

### Chapter 4 — Why the center of the Earth is weightless

A continuation of the cone idea, answering a question the founder asked himself as a child.

- Compose the full gravity well as a sequence: cylinder (space) → cone narrowing toward the surface → small cylinder (Earth's center, no gravity) → cone widening → cylinder (space again).
- Smooth that piecewise shape into a single bezier-curved gravity well.
- Animate a particle dropped into the well: it spirals in, passes through the weightless center, climbs the far side, and either falls back or escapes depending on its energy.
- Interactive: let the user dial initial energy and watch the trajectory change. The notion of escape velocity becomes a visual threshold, not a formula.

### Chapter 5 — Light and information

Set the stage for special relativity by visualizing how information travels.

- Two points on the spacetime diagram emitting pulses of light (expanding circles).
- Stationary observers see synchronized arrival.
- One observer accelerates — the rings hit at irregular intervals. Relativity of simultaneity, made visible.
- Aberration: an accelerating observer sees light from a distant star tilt forward, like rain on a windshield. Animate the starfield shifting as acceleration ramps up.

### Chapter 6 — The ether was wrong

A small detour with high payoff: kill the intuition that light needs a medium.

- Introduce the historical idea of the ether.
- Michelson–Morley as a thought experiment, visualized.
- Pivot: a stationary source emits expanding circles at c. A moving source emits expanding circles at c — *from the spacetime point where the photon was emitted*, regardless of source velocity. Light does not inherit the source's motion.
- Light propagates as a self-sustaining electromagnetic wave. No medium needed.
- This closes the loop: the speed of light is the same for every observer because that is simply how light is born into spacetime.

### Chapter 7 — Doppler and seeing motion

Combine the constancy of c with source motion.

- A pulsing emitter on the spacetime diagram. Each wavefront is a "frame" — every time it reaches an observer, the observer sees one tick of the emitter's clock.
- Source moves away → wavefronts space out → observer sees the clock run slow → redshift.
- Source moves toward → wavefronts compress → observer sees the clock run fast → blueshift.
- Push the source to 99.999% c receding: the observer sees the clock frozen on a single final wavefront.
- This is Doppler shift, time dilation, and the visual experience of relativistic motion, all from the same diagram.

### Chapter 8 — Light bending around mass

General relativity applied to light.

- A wide beam of light passes near a massive body. The whole beam bends.
- Geometry says the outer edge of the beam travels a longer spatial path than the inner edge.
- Both edges arrive synchronized. Why? The inner edge, deeper in the gravity well, experiences more time dilation — it has more *subjective* time to cover its shorter path.
- The bending of light is not a force. It is straight-line travel through curved spacetime, and the geometry forces synchronization.

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
