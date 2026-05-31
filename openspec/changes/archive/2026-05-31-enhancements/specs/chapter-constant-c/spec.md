## ADDED Requirements

### Requirement: c-invariance is explorable by dragging the moving observer's velocity

The chapter SHALL provide a guided-exploration interaction (a glowing slider bound through the `TargetRegistry`, unlocked at the exploration wait) that lets the reader vary observer B's velocity and adopt B as the at-rest frame, re-centering the same wavefront on whichever observer is treated as at rest. The interaction SHALL follow the established `v/c` slider pattern used elsewhere in the journey.

#### Scenario: Dragging B's velocity re-centers the wavefront

- **WHEN** the reader drags B's velocity slider while viewing the flash in B's frame
- **THEN** the wavefront remains a circle centered on B, expanding at `c`, for every value
- **AND** timeline playback is not required for the visual to respond

#### Scenario: Slider unlocks at the exploration wait

- **WHEN** the pre-exploration beat begins
- **THEN** the velocity slider becomes interactive (per `atExplorationWait`)

### Requirement: Chapter names the principle of relativity as the reason

The chapter SHALL explicitly name the **principle of relativity** — no experiment distinguishes one inertial frame as "truly at rest," so B's frame is as valid as A's — as the reason the wavefront is centered on every inertial observer. This SHALL be stated as the justification, not left as a bare "the experiment answers honestly."

#### Scenario: Principle of relativity is stated as the justification

- **WHEN** the chapter's narration explains why B also measures a centered sphere
- **THEN** a beat states that every inertial frame is physically equivalent (no preferred rest frame), and that this is why `c` is the same in B's frame

### Requirement: Frame of reference is defined before it is relied upon

The journey SHALL define "frame of reference" — a point of view that regards itself as at rest — in plain language at or before the chapter that first depends on switching frames, so the term is grounded rather than assumed.

#### Scenario: Frame of reference defined in plain language

- **WHEN** the reader first encounters frame-switching language
- **THEN** a beat has defined a frame of reference as a point of view that calls itself at rest
- **AND** the definition uses no prior physics vocabulary the journey has not introduced
