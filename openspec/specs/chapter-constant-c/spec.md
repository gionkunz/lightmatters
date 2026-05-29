# chapter-constant-c Specification

## Purpose

Chapter 5 "The same speed of light" — a *demonstrated* (not merely asserted) constancy of `c`, via Einstein's light-sphere / frame-switch argument. It resolves the relativity-of-simultaneity puzzle planted in "Light and information" (Chapter 3) and *forces* the time dilation and length contraction that the light clock (Chapter 6) then makes concrete. Numbering and routes (`/chapter/:chapter/step/:step`) are owned by `reorder-chapters-and-route-scheme`; scenarios reference steps by ordinal within this chapter.

## Requirements

### Requirement: The Same Speed of Light chapter exists as a feature lib

The workspace SHALL provide a feature library for "The same speed of light" chapter, tagged `scope:feature`, exporting lazy-loaded routes, registered in the chapter registry and prerender/sitemap step list. Steps: (1) recall and pose the question, (2) the flash in the ground frame, (3) switch to the moving observer's frame, (4) outro.

#### Scenario: Chapter route redirects to first step

- **WHEN** a user navigates to the chapter root route
- **THEN** the router redirects to the chapter's step 1

### Requirement: Constancy of c is demonstrated, not merely asserted

The chapter SHALL demonstrate that the same light flash expands at `c` for two observers in relative motion, by showing the wavefront centered on each observer in that observer's own frame. Narration SHALL explain the reconciliation as the *necessary consequence* that space and time re-slice — moving clocks run slow, moving rulers contract, and simultaneity is relative — rather than a bare assertion, noting that the light clock (next chapter) makes the dilation concrete.

#### Scenario: Ground-frame wavefront centered on the emission point

- **WHEN** Step 2 runs in the ground frame
- **THEN** the wavefront expands as a circle centered on the emission point at speed `c`
- **AND** the stationary observer A sits at its center while the moving observer B drifts off-center
- **AND** narration poses the puzzle that B appears off-center

#### Scenario: Frame switch re-centers the wavefront on the moving observer

- **WHEN** Step 3 switches into the moving observer B's frame
- **THEN** the wavefront is shown centered on B, still expanding at `c`
- **AND** narration explains that space and time re-slice (dilation/contraction/simultaneity) so both centerings are simultaneously true

#### Scenario: Reconciliation names the forced consequences

- **WHEN** the chapter's narration runs
- **THEN** it explicitly ties the same-`c` result to the dilation, contraction, and relativity of simultaneity it *forces* (resolving the Chapter 3 simultaneity puzzle and motivating the light clock that follows)
- **AND** does not resolve the puzzle by asserting "c is just constant" without the geometric reason

### Requirement: Outro frames c-invariance as the foundation

The outro SHALL state that the constancy of `c` is the foundation from which dilation, contraction, and simultaneity all follow, and bridge to the next chapter. It SHALL NOT introduce gravity or E=mc².

#### Scenario: Outro positions c-invariance as the rock

- **WHEN** the final step's narrate beats run
- **THEN** narration states that the other SR effects spring from `c`-invariance
- **AND** no beat introduces curved spacetime or mass–energy

### Requirement: Chapter navigation

The chapter SHALL support forward/back transport between consecutive steps and link to the adjacent chapters per the final journey map.

#### Scenario: Forward and back move between steps

- **WHEN** the user advances at a step's last checkpoint
- **THEN** the router navigates to the next step (or next chapter from the final step)
- **AND** rewinding at the first checkpoint navigates to the previous step (or previous chapter from step 1)
