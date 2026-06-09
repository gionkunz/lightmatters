# Critiques & Responses

Working log of substantive critiques received on Light Matters (e.g. from the
Physics subreddit), our analysis of whether each is valid, and the response we
intend to give. Each entry has three parts:

- **The comment**: quoted verbatim.
- **Analysis**: is it valid, partially valid, or a misreading? What's the
  physics, grounded in what the app actually does?
- **Response**: the public reply we plan to post.

## Guiding principle (the goal everything is measured against)

The audience is people who start with **no intuition at all** for light, space,
and time. The job is to help them build that intuition from zero. For that
audience the project deliberately **trades precision for simplicity wherever the
simpler picture is still true**. The hard rule: simplify, never lie. We choose
the gentler correct picture over the complete one, but we do not say things that
are wrong.

This is the lens for judging every critique below. "You left out a subtlety" is
usually fine and intended; "you said something false" is a real bug we fix. The
Epstein speed-budget diagram in critique #1 is the canonical example: a simpler,
single-frame, fully correct on-ramp, not the whole Minkowski story.

## Diagram convention (locked): Epstein space-proper-time only

Design intent (locked): the app uses **Epstein space-proper-time diagrams only**.
We do **not** use Minkowski (space vs coordinate-time) spacetime diagrams
anywhere. The reason is pedagogical: introducing a second diagram type, and
switching between proper-time and coordinate-time conventions mid-journey,
confuses the beginner audience. Light propagation is shown on plain
**space-space** (top-down 2D canvas) views of expanding light circles, never by
placing light on a spacetime diagram.

Consequences, treated as hard rules. A diagram is in error if it has any of:

- a vertical **coordinate-time** axis (the vertical axis must always be **proper
  time**);
- **45° null light lines / light cones** (on an Epstein diagram light lies along
  the horizontal space axis, at proper time zero);
- a single-point **reunion of two moving observers** (on an Epstein diagram their
  reunion is two points).

If a diagram shows these features it is a remnant/error to rework, regardless of
whether it currently "works."

### Known violations to rework (audit)

- **Twin paradox (Ch 8 repo / Ch 9 live), all steps, `variant="twin"`:** a full
  Minkowski diagram (coordinate-time axis, 45° null light pulses, single-point
  reunion). Its Doppler pulse-counting mechanic depends on 45° light, which has
  no place on an Epstein diagram, so this is a **redesign, not a relabel**.
  Candidate approach: split into (a) an Epstein space-proper-time diagram for the
  aging / proper-time comparison and (b) a space-space (2D canvas) view for the
  light-pulse exchange, consistent with how light propagation is handled
  elsewhere.
- **`chapter-08-twin-paradox/.../step-04-doppler-count.ts` narration:** explicitly
  teaches the Minkowski convention switch ("here we plot coordinate time and
  space together, so light runs at 45°"). Remove / rework alongside the diagram.
- **Chapter 1 Step 4 "Moving in spacetime" (confirmed, flagged publicly):** uses
  `variant="single"` *without* `budgetArc`, so it is a coordinate-time diagram,
  and `showLightCone` defaults to `true`, drawing a **45° diagonal light line**.
  Meanwhile its narration is pure Epstein speed-budget copy ("everything moves at
  c, watch the vector tilt"). Epstein narration on a Minkowski diagram: fix to the
  Epstein space-proper-time picture (proper-time axis, light horizontal, no cone),
  consistent with the Ch 2 budget diagram.
- **Systemic root cause:** `showLightCone` defaults to `true` on
  `lm-spacetime-diagram`, so *every* non-budget `single` / `full` diagram draws a
  45° cone. Reconsider this default (or set it off) under the Epstein-only
  convention; it is the mechanism behind the 45° remnants.
- **Audit candidates (verify):** the rest of Chapter 1 (`full` / `single` steps,
  coordinate-time lineage); Ch 2 bridge `variant="wavefront"`; landing-page
  placeholder with "45° light lines."

---

## 1. "Speed budget uses a Euclidean metric instead of Minkowski"

### The comment

> The way you present the "speed budget" is just completely wrong. It seems
> you're using the usual euclidean metric instead of the minkowski metric. All
> vectors of magnitude c don't lie on a circle of radius c, they lie on a
> hyperbola.

### Analysis

**Status: partially valid. The headline conclusion ("completely wrong") is
incorrect, but there is a legitimate kernel about axis labeling.**

Everything turns on *what the vertical axis represents*.

What the app actually plots (`speedBudgetComponents` in
`libs/physics/src/lib/speed-budget.ts`):

- vertical component = `properTimeFraction(v)` = √(1 − v²/c²), i.e. **proper
  time τ** (the moving object's own clock), in units of c·time;
- horizontal component = `v · LIGHT_YEAR`, the distance travelled in the chosen
  frame's coordinate time.

So this is **not** a standard Minkowski spacetime diagram with *coordinate* time
on the vertical axis. It is the **Epstein proper-time construction** ("space vs.
proper time"). The diagram primitive itself documents this: the
`lm-spacetime-diagram` component comments that for light "the photon spends its
full c on space, proper time τ stays at 0."

With proper time on the vertical axis, the locus is genuinely a **circle**:

  (c·τ)² + x² = (c·t)²

which is nothing more than the invariant interval rearranged:

  c²·t² − x² = c²·τ²

So the Euclidean rotation is **exact**, not an approximation and not a metric
error. The equal-split point sits at v = sin(45°) = √2/2 ≈ 0.707
(`EQUAL_SPLIT_V_OVER_C = Math.SQRT1_2`), exactly as the geometry demands.

**Where the critic's hyperbola comes from.** They are picturing the
**four-velocity**, whose components (γc, γv) satisfy

  (γc)² − (γv)² = c²

and therefore lie on a hyperbola, with **Minkowski** norm c. That is a
different (and equally valid) decomposition. The speed budget instead uses the
components (c·dτ/dt, dx/dt) = (c/γ, v), whose **Euclidean** magnitude is exactly
c:

  (c/γ)² + v² = c²(1 − v²/c²) + v² = c²

Both statements ("everything moves through spacetime at c") are true; they are
just two different projections. The critic conflated the four-velocity (hyperbola,
Minkowski norm) with the Epstein proper-time vector (circle, Euclidean norm).

**The fair kernel.** This construction is only unambiguous if the vertical axis
is clearly the *traveller's proper time*, not coordinate time. The diagram's
vertical glyph is currently just `t`, and the narration says "time passed", so a
reader who assumes coordinate time will (correctly!) object that a circle is
wrong for a Minkowski diagram. So the legitimate takeaway is a **labeling fix**:
mark the vertical axis as proper time τ and state the construction explicitly.

**Caveats worth owning publicly.** Epstein diagrams are a single-frame
representation: they don't render relativity of simultaneity cleanly and don't
compose velocities by simple addition. They are a pedagogical on-ramp, not a
replacement for the full Minkowski picture, and the app is explicit that this
is an intuition-building first chapter.

### Response (draft, for review)

> It depends on what the axes are. This isn't a Minkowski diagram with
> coordinate time vertical. The vertical axis is the object's **proper time** τ,
> the horizontal is distance in the chosen frame. Then
>
>   (cτ)² + x² = (ct)²
>
> which is just the invariant interval c²t² − x² = c²τ² rearranged, so the locus
> genuinely is a circle and the rotation is exact. It's the Epstein construction.
>
> The hyperbola you mean is the **four-velocity** (γc, γv): (γc)² − (γv)² = c²,
> Minkowski norm c. The budget instead uses (c/γ, v), whose Euclidean magnitude
> is exactly c: (c/γ)² + v² = c². Both say "everything moves through spacetime at
> c", just different projections.
>
> Fair point on labeling, though: it only reads right if the vertical axis is
> clearly proper time, so I'll make that explicit. The whole aim here is to give
> someone with zero intuition a correct first picture, and Epstein's is exactly
> that: simpler than full Minkowski, but not wrong.

### Potential improvements (tracked, not yet done)

- **Label the vertical axis as proper time τ** on the speed-budget diagram
  (`lm-spacetime-diagram`, `budgetArc` variant) instead of the current `t`
  glyph, and add a small "Epstein diagram" note. This removes the only genuine
  ambiguity the critique exposed. Deferred; revisit after working through the
  other critiques.

### Follow-up: "Chapter 1 Step 4 shows a usual Minkowski diagram"

> I see... It's a strange way to visualize it but it does make sense. On the
> other hand, your chapter 1 step 4 shows a usual minkowski diagram, with light
> being on the diagonal instead of a horizontal line. I'm not sure if that's
> intentional.

**Status: correct, confirmed remnant.** The reader accepted the Epstein
explanation and then caught a real inconsistency. Ch 1 Step 4 uses
`variant="single"` without `budgetArc`, so it renders on coordinate-time axes,
and `showLightCone` defaults to `true`, drawing a 45° diagonal light line, while
the narration is pure Epstein speed-budget copy. This is a leftover from before
the Epstein-only convention was locked. Fix tracked under "Known violations to
rework" at the top of the doc; the right framing publicly is "not intentional,
will fix," not a defence.

#### Response (draft, for review)

> Good eye, and no, that one is not intentional. You have caught a genuine
> inconsistency. Chapter 1 Step 4 still uses an older coordinate-time (Minkowski)
> diagram with light on the 45° diagonal, left over from before I committed to
> doing the whole app in the Epstein space-proper-time picture. So that step
> contradicts the convention I explain later, which is exactly the kind of thing
> that makes it confusing.
>
> The intended convention is Epstein throughout: the vertical axis is proper
> time, and light lies flat along the space axis (proper time zero), with no 45°
> lines and no light cones. I would rather give people one consistent mental
> model the whole way through than quietly switch diagram types on them. I am
> going to fix Step 4, and hunt down any other 45° remnants and loose "spacetime
> diagram" wording, so it all matches. Thanks for flagging it.

---

## 2. "It's AI-generated, therefore low-effort" (provenance attack)

### The comments

> Lol what effort? Typing a prompt into chatgpt? Lmao
>
> Putting it into a website to check if it is AI written says it is confident it
> is written by AI.
>
> I might be on your side if it wasn't exceedingly obvious.

(A defender in the same thread, `PrettyPicturesNotTxt`: "they're trying to
accuse OP ... without providing any evidence why they think so ... defend
yourself!")

### Analysis

**Status: not a physics critique. It is an ad hominem about provenance plus a
dismissal of effort. No content claim to rebut.**

- The only "evidence" is an AI-detector website, and it is debunked *inside the
  same thread* by `Flob368`: detectors are trained on human text and are
  unreliable, to the point where real humans get flagged. The critics undercut
  each other, so there is no need to argue the detector point.
- The accusation bundles two separate claims: (a) "AI was used" and (b)
  "therefore it has no value / no effort." Claim (a) is true and unremarkable;
  claim (b) is the only one that matters and is the one to dismantle, by
  pointing at substance.
- The winning move is to refuse the provenance frame and pivot to physics. The
  metric exchange (critique #1) is the proof of substance: specific, technical,
  correct engagement. "Name the step that is wrong" is unanswerable for anyone
  who has not read the work.
- Tone discipline: own the tooling plainly, do not argue with the detector, do
  not match the snark, do not call critics names in public (it confirms the
  "thin-skinned" prior and spawns a second pile-on). Brevity reads as
  confidence.

**Author's position (own it):** 20+ years building software; AI tooling let this
be built in roughly a fifth of the time with the architecture, code style, UX,
and physics foundation exactly as the author would have built by hand. Rejecting
the tool is the same mistake as every craft that fought its transformative tool
and lost the argument in hindsight:

- programmers: "real code is assembly," compilers were "cheating"; later the same
  about high-level languages, GC, IDEs, autocomplete, Stack Overflow;
- accountants: ledgers and adding machines vs spreadsheets (VisiCalc/Excel);
- chess grandmasters: refused engines, until every serious player trained on one;
- photographers: "not real art" (painters vs photography; then film vs digital;
  Kodak invented the sensor and refused to commit, which is the actual cautionary
  tale);
- architects/draftsmen vs CAD; translators vs CAT/MT; mathematicians vs
  calculators/Mathematica; musicians vs synths and drum machines; pilots and
  navigators vs GPS/autopilot.

The tool changes; the judgment about what to build and whether it is correct does
not.

### Response (draft, for review)

> Yes, of course I used AI to build this. I have written software for 20 years,
> and these tools let me build it in roughly a fifth of the time, with the
> architecture, code style, UX, and physics exactly the way I would have done by
> hand. I made every decision; the model just typed faster than I can. Why
> wouldn't I?
>
> Every craft has had this argument. Programmers who insisted real code was
> assembly, not those cheating compilers. Accountants who trusted ledgers over
> spreadsheets. Photographers who weren't real artists. Grandmasters who wouldn't
> touch a chess engine, right up until every serious player trained with one. The
> tool changes; the judgment about what to build and whether it is correct does
> not.
>
> So let's have the actual conversation: is the physics right? A couple of people
> raised the Euclidean vs Minkowski point on the speed budget, and that was a
> genuinely good exchange. If something else is wrong, name the step and I will
> fix it or defend it. "An AI touched it" is not a critique of the content.
>
> And to be clear about what this is for: it's built for people who start with no
> intuition at all for light, space, and time. For that audience I will happily
> trade precision for simplicity wherever the simpler picture is still true. The
> one rule I hold is that simpler must never mean wrong. If you catch me being
> actually incorrect, that's a bug and I want to know. Leaving out a subtlety on
> purpose is the whole point.

---

## 3. Epstein vs Minkowski terminology, and the four-velocity normalization

### The comment

> In my opinion, "Minkowski" should be named since you mention Epstein.
> Note that Epstein's diagrams (space-vs-properTime diagrams) are not spacetime
> diagrams. Light-cones (first defined by Minkowski) don't appear on Epstein
> diagrams (the speed budget diagram in Ch 2). Epstein only mentions light-cones
> and Minkowski spacetime diagrams in his brief appendix. Your Twin Paradox
> diagram in Ch 9 is a Minkowski spacetime diagram. (In Epstein's diagram, the
> reunion-event appears as different points.)
>
> "Light traveling at c" refers to a speed in space. Note that "observers
> traveling at c in spacetime" is really a statement of a convenient
> "normalization" of a 4-velocity [of a timelike particle], which does not apply
> to light. In my opinion, this normalization described as a "speed through
> spacetime" is memorable and provocative, but it's not as profound as it is
> often presented.
>
> In Epstein's budget diagram in Ch 2, the circular-arc reflects the
> normalization, but not the limiting signal speed, which is along its horizontal
> axis (where light is drawn, which is why Epstein can't draw light cones on his
> diagrams).
>
> Other than these comments about LC Epstein, from a skim, the rest of the
> presentation seems okay.

### Analysis

**Status: valid and welcome. This is the level of critique the project wants.
Every technical claim is correct. None of it violates the "don't be incorrect"
rule; it is precision and naming. Adopt essentially all of it.**

Point by point, grounded in the code:

1. **Name Minkowski since we name Epstein.** This point dissolves under the
   locked Epstein-only convention (see top of doc): we are removing the Minkowski
   diagram rather than naming it. The critic's premise was that we *use* a
   Minkowski diagram (the twin paradox) without naming it; our resolution is to
   not use one at all.
2. **Epstein diagrams are not (Minkowski) spacetime diagrams.** They plot space
   vs *proper* time, not space vs *coordinate* time. This is a judgment call, not
   a clear-cut error.

   *Naming history.* In *Relativity Visualized*, Epstein introduces these through
   what he explicitly calls a **"myth"**: everything in the universe always moves
   at c, partitioned between motion through space and motion through proper time.
   He calls the diagrams **"myth diagrams"** (sometimes "space-time myth
   diagrams"), i.e. a graphical picture of that myth rather than a literal
   Minkowski diagram. The wider literature calls them **"Epstein diagrams"**
   (especially the German didactics tradition, *Epstein-Diagramme*, where they
   are popular for teaching SR because relativity of simultaneity, time dilation,
   and length contraction read off geometrically with simple rotations instead of
   Minkowski's hyperbolic geometry). The technical name is the **space-proper-time
   (SPT) diagram**. So calling ours a "spacetime diagram" loosely is defensible.

   The reason to change it anyway is specific to *this* project: we use **both**
   diagram types, and the distinction is pedagogically load-bearing. On an SPT
   diagram the reunion of the twins shows up as **two points**; on the Minkowski
   diagram (our twin paradox) it is **one point**. If both carry the same name,
   we lose the vocabulary to mark that difference later. The Ch 2 budget diagram
   kicker currently reads `spacetime · normalized to c`
   (`chapter-02-speed-budget/.../step-02.component.ts`).

   *Resolution (author's preference): avoid both proper nouns in the app.*
   "Epstein diagram" explains nothing to a beginner; "spacetime diagram"
   conflates with the Minkowski one. Instead, **describe the axes**: a label like
   "proper-time & space axes" (kicker) or, in body copy, "a diagram with
   proper-time and space axes." Reserve the names "Epstein" / "myth diagram" /
   "Minkowski" for expert-facing contexts like this reply, not the in-app label.
   ("normalized to c" already gestures at the four-velocity normalization the
   critic raises, so we are partway there.)
3. **Light cones don't appear on Epstein diagrams; light is along the horizontal
   axis.** Correct. We don't draw cones on the budget diagram, so no error, just
   confirms why.
4. **The twin-paradox diagram is a genuine Minkowski spacetime diagram.**
   Confirmed, and under the locked Epstein-only convention this is now classed as
   an **error to rework**, not something to "name as Minkowski." Evidence:
   `step-01-two-worldlines.ts` says "time running up, space across" with a
   single-point reunion; `twinPx(x, t)` plots coordinate time on the vertical
   axis; the `variant="twin"` diagram draws 45° null light pulses; and
   `step-04-doppler-count.ts` explicitly narrates the convention switch. See
   "Known violations to rework" at the top of the doc for the redesign plan.
5. **"Everything moves through spacetime at c" is a normalization of a timelike
   four-velocity and does not apply to light.** Correct and the deepest point.
   Light has no proper time and a null tangent (Minkowski norm 0), so it has no
   four-velocity normalized to c. Our copy applies the slogan to light ("that's
   how light moves through spacetime, at c"). At the Epstein-limit level (proper
   time -> 0, all budget on space) that picture is internally fine, but the
   slogan is routinely sold as more profound than it is. Per the guiding
   principle this is a borderline "omitted subtlety," not a false statement, but
   the honest move is to acknowledge it.
6. **Two roles of c on the budget diagram.** Elegant: the arc radius encodes the
   normalization (|4-velocity| = c); the limiting signal speed appears separately
   as the horizontal axis where light sits. Worth folding into the chapter.

Numbering note: the critic's "Ch 9" (twin paradox) and "Ch 2" (budget) match the
**live site** numbering, not the repo folder numbering. No confusion, no action.

**Design rationale on light cones (on record).** Drawing light cones would
require Minkowski (space vs coordinate-time) diagrams, which the locked
Epstein-only convention (top of doc) rules out. Light propagation is instead
shown on a plain space-space (top-down 2D canvas) view of expanding light
circles, never on a spacetime diagram. The convention is locked; whether it is
the optimal pedagogical trade is still genuinely open, which is why the reply
invites the critic's view.

### Response (draft, for review)

> This is the good stuff, thank you.
>
> Agreed that an Epstein diagram is not a Minkowski spacetime diagram, and that
> light cones live only on the latter, with light sitting on the horizontal axis
> of the Epstein plot. I'd been leaning on "spacetime" loosely (Epstein himself
> frames them as "myth diagrams," and the wider literature, especially the German
> Epstein-Diagramme tradition, just calls them Epstein diagrams), but you're
> right that the label shouldn't blur the two. I'll relabel the Chapter 2 budget
> diagram by its axes, a diagram with proper-time and space axes, rather than name
> it after a person, which would explain nothing to a beginner.
>
> You've also put your finger on something I want to fix: the twin-paradox plot is
> currently the one place I switch to the coordinate-time (Minkowski) convention,
> 45° light lines and all. My intent for this app is to stay in the
> space-proper-time picture throughout and to show light propagation on a separate
> space-space view, so that readers never have to relearn what the axes mean. So
> I'm treating that chapter as inconsistent with the rest and reworking it rather
> than blessing the second convention. Still working out the cleanest way to do
> the pulse-counting without 45° lines.
>
> On "everything moves through spacetime at c": fully agree it's the
> normalization of a timelike four-velocity and does not apply to light, which
> has no proper time and a null tangent. I use the line as an on-ramp because
> it's memorable, but you're right that it gets sold as more profound than it is.
> The arc encodes that normalization; the limiting signal speed shows up
> separately, as the horizontal axis where light sits, which is exactly why cones
> can't be drawn there. That distinction is worth making explicit and I'll add
> it.
>
> I went back and forth on this, since coordinate-time diagrams would let me draw
> light cones directly, and I am genuinely not certain that dropping them in
> favour of a separate space-space view is the best trade for a beginner audience.
> If you have a view on it, I would like to hear it. Appreciate the careful read.

### Potential improvements (tracked, not yet done)

- **Relabel the Ch 2 budget diagram** kicker from `spacetime · normalized to c`
  to a descriptive, proper-noun-free label that names the axes (e.g.
  "proper-time & space axes"), avoiding both "spacetime diagram" (conflates with
  Minkowski) and "Epstein diagram" (opaque to beginners). Pairs with the τ-axis
  labeling fix already tracked under critique #1.
- **Rework the twin-paradox chapter off the Minkowski convention** (see "Known
  violations to rework" at the top of the doc). This supersedes the critic's
  "name it Minkowski" suggestion: under the locked Epstein-only convention we
  remove the Minkowski diagram instead of naming it.
- **Add a clarifying beat in Ch 2** distinguishing the two roles of c: the arc
  radius = four-velocity normalization; the horizontal axis = limiting signal
  speed (where light sits), which is why light cones don't live on an Epstein
  diagram.
- **Soften the "light moves through spacetime at c" framing** so it reads as the
  Epstein limiting case (proper time zero, all budget on space) rather than
  implying light has a four-velocity normalized to c. Keep the memorable slogan,
  add the honest caveat.

---

# Concluded fixes (decided, to implement)

> **Implementation status (done):** Fixes 1, 2, 3, 5 and the cross-cutting audit
> are implemented. Fix 4 (twin paradox) is implemented as an Epstein
> space-proper-time diagram across all five steps (A climbs straight, B's bent
> path banks less proper time and ends lower on the axis, with an "age gap"
> marker; the reunion shows as two distinct points). Axis labels everywhere now
> read **"Proper time"** and **"Space"** (per a later decision, instead of the
> τ / t / x glyphs). **One deviation from the plan below:** the Fix 4(b)
> space-space (light-scene) pulse-exchange animation for the doppler step was
> *not* built — `light-scene` actors are constant-velocity and B's turnaround
> needs a path-aware extension. Step 4 instead reuses the Epstein twin diagram
> with the doppler reasoning carried in narration + the proper-time/flash-count
> readout, which removes the 45° Minkowski convention (the actual goal). The
> dedicated space-space animation remains a recommended follow-up.

The decided, actionable outcome of the critiques above. Each item is something we
have committed to; the per-critique "Potential improvements" notes are the
reasoning, this is the work list. Suggested order: consistency + labeling first
(cheap, high-confusion-reduction), then the full Chapter 1 conversion, then the
twin-paradox redesign (largest). Item **G** (two-roles-of-c beat) is explicitly
**out of scope** for now (kept optional/advanced; would add subtlety that cuts
against the beginner-first goal).

## Fix 1 — Terminology & axis labeling on the budget diagram (small)

- Relabel the Ch 2 budget kicker `spacetime · normalized to c` to a descriptive,
  proper-noun-free label naming the axes, e.g. **"proper-time & space axes"**.
  Avoid both "spacetime diagram" (conflates with Minkowski) and "Epstein diagram"
  (opaque to beginners).
  - `chapter-02-speed-budget/src/lib/steps/step-02.component.ts` (and any sibling
    budget steps using the same kicker).
- Label the budget diagram's **vertical axis as proper time τ** (currently the
  glyph is just `t`), with a one-line gloss that proper time is "the time on your
  own clock."
  - `libs/primitives/spacetime-diagram/src/lib/lm-spacetime-diagram.component.ts`.

## Fix 2 — Remove light cones / 45° light everywhere (systemic)

Decision: **no light cones or 45° light lines anywhere** in the app. The
limiting speed is shown as the horizontal (space) axis on the Epstein diagram and
via space-space light circles, never as a 45° line.

- Flip the systemic root cause: `showLightCone` defaults to `true` on
  `lm-spacetime-diagram`, so every non-budget `single` / `full` diagram draws a
  45° cone. Default it **off** and remove remaining cone/45°-null rendering paths
  that are no longer used.
  - `libs/primitives/spacetime-diagram/src/lib/lm-spacetime-diagram.component.ts`
    (`showLightCone`, `lightConeEndX`, twin null-ray rendering).

## Fix 3 — Convert all of Chapter 1 to the Epstein space-proper-time convention

Decision: **all of Chapter 1** uses the Epstein picture (vertical = proper time,
light flat on the space axis, no cone), consistent with Ch 2. This includes the
confirmed Step 4 contradiction (Epstein speed-budget narration currently sitting
on a coordinate-time diagram with a 45° light line).

- `libs/features/chapter-01-position-time/src/lib/steps/*` (Steps 1–4; audit each
  step's `variant` and ensure proper-time axis + horizontal light, no 45°).
- Verify nothing in Ch 1 relies on the coordinate-time/light-cone rendering being
  removed in Fix 2.

## Fix 4 — Redesign the twin-paradox chapter off Minkowski (large)

Decision: **full redesign now.** The chapter is currently a Minkowski diagram
(coordinate-time axis, 45° null pulses, single-point reunion) and its Doppler
pulse-counting depends on 45° light, which cannot exist on an Epstein diagram.

- Split the visualization into:
  - (a) an **Epstein space-proper-time diagram** for the aging / proper-time
    comparison between the twins; and
  - (b) a **space-space (top-down 2D canvas) view** for the light-pulse exchange,
    consistent with how light propagation is shown elsewhere.
- Remove the convention-switch narration in
  `chapter-08-twin-paradox/src/lib/steps/step-04-doppler-count.ts`
  ("here we plot coordinate time and space together, so light runs at 45°").
- Touches all `variant="twin"` usages across
  `libs/features/chapter-08-twin-paradox/src/lib/steps/*` and the `twin*`
  rendering in `lm-spacetime-diagram.component.ts`.
- Note: this is the item most likely to draw expert pushback (the twin paradox is
  the textbook case for Minkowski); the public replies stay on the consistency
  argument and do not relitigate it.

## Fix 5 — Light / four-velocity wording (small, content) — item H

Lightly reword the "everything moves through spacetime at c" copy so that **light
reads as the edge case** of the budget (all space, zero proper time), not as a
massive object with a four-velocity normalized to c. Keep the memorable slogan;
do **not** add a four-velocity lecture.

- `chapter-02-speed-budget/src/lib/steps/step-01-always-at-c.ts` ("That's how
  light moves through spacetime…") and
  `step-03-bridge-to-light.ts` ("everyone moves through spacetime at c …
  Horizontal means light").

## Explicitly out of scope (for now)

- **G — two-roles-of-c beat.** The distinction (arc radius = normalization vs
  horizontal axis = limiting signal speed) is correct and useful, but too subtle
  for the beginner-first goal. Keep as an optional/advanced aside, not a
  concluded fix.

## Cross-cutting audit (do alongside Fixes 2–4)

- Ch 2 bridge `variant="wavefront"` — verify it carries no 45° light remnant.
- Landing-page placeholder with "45° light lines"
  (`libs/features/landing/.../diagram-placeholder.component.ts`).
- Global sweep for loose "spacetime diagram" wording in narration that should
  read as the proper-time / Epstein picture.
