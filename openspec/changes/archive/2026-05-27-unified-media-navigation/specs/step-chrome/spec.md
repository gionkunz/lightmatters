## MODIFIED Requirements

### Requirement: Step frame provides chapter navigation chrome

The engine SHALL provide an `LmStepFrame` component that renders the step shell: chapter number and title, progress dots, step counter, and playback transport. The step frame SHALL NOT render a footer navigation row.

#### Scenario: Step frame shows chapter metadata

- **WHEN** Step 1 of Chapter 1 renders inside the step frame
- **THEN** the nav displays chapter 1 title "Position, time, spacetime"
- **AND** the step counter shows "01 / 06"

#### Scenario: Progress dots reflect current step

- **WHEN** Step 1 is active in a chapter with 6 steps
- **THEN** the first progress dot is highlighted as the current step
- **AND** remaining dots are unfilled

#### Scenario: No footer navigation row

- **WHEN** any step renders inside the step frame
- **THEN** no footer with back or continue buttons is visible
- **AND** the main content area extends to the bottom of the viewport

### Requirement: Step frame provides playback transport

The step frame SHALL render an `LmPlaybackBar` below the nav with a progress track on the first row and rewind / play / pause / fast-forward transport controls centered on a second row below the track, wired to the timeline runner. Transport controls SHALL be visually prominent (large hit targets, readable icons, clear active/disabled states). The playback bar SHALL be the sole navigation control for checkpoint, step, and chapter boundaries.

#### Scenario: Playback bar shows progress during narration

- **WHEN** Step 1's timeline is playing through narrate events
- **THEN** the playback bar progress indicator advances
- **AND** checkpoint markers are visible on the progress track

#### Scenario: Transport controls on second row

- **WHEN** a step with a timeline is active
- **THEN** the progress track and elapsed/total times appear on the top row of the playback bar
- **AND** rewind, play/pause, and forward controls appear centered on a separate row below the track

#### Scenario: Prominent transport controls

- **WHEN** the playback bar is visible
- **THEN** each transport control has a hit target of at least 48×48 CSS pixels
- **AND** the play control is visually emphasized relative to rewind and forward

#### Scenario: Play visible at checkpoint hold

- **WHEN** the timeline is paused at a checkpoint hold
- **THEN** the Play control is shown
- **AND** the Pause control is hidden

#### Scenario: Pause visible during active playback

- **WHEN** the timeline is actively playing (typing, tweening)
- **THEN** the Pause control is shown
- **AND** the Play control is hidden

#### Scenario: Rewind at first checkpoint navigates to previous step

- **WHEN** the user is at the first checkpoint of Step 2
- **AND** presses the rewind (⏮) transport control
- **THEN** the router navigates to the previous step URL provided by the step frame
- **AND** the timeline runner does not seek within the current step

#### Scenario: Forward at last checkpoint navigates to next step

- **WHEN** the timeline is at the last checkpoint or complete on Step 1
- **AND** the user presses the forward (⏭) transport control
- **THEN** the router navigates to the next step URL provided by the step frame

#### Scenario: Rewind from Step 1 navigates home

- **WHEN** the user is at the first checkpoint of Chapter 1 Step 1
- **AND** presses the rewind transport control
- **THEN** the router navigates to `/`

#### Scenario: Forward at chapter boundary navigates to next chapter

- **WHEN** the timeline is at the last checkpoint or complete on the final step of a chapter
- **AND** a next chapter step URL is provided
- **AND** the user presses the forward transport control
- **THEN** the router navigates to the first step of the next chapter

## REMOVED Requirements

### Requirement: Step footer provides back navigation

**Reason**: Back navigation is handled by the playback bar rewind control at step boundaries.
**Migration**: Use ⏮ at the first checkpoint (or ArrowLeft) instead of the footer back button.

### Requirement: Advance control hidden when no next step exists

**Reason**: Forward transport disabled state replaces footer continue visibility rules.
**Migration**: When no next step exists, ⏭ is disabled at the last checkpoint.

### Requirement: Step 2 shows advance when Step 3 exists

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏭ at Step 2's last checkpoint to reach Step 3.

### Requirement: Step 3 back navigates to Step 2

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏮ at Step 3's first checkpoint to return to Step 2.

### Requirement: Step 3 shows advance when Step 4 exists

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏭ at Step 3's last checkpoint to reach Step 4.

### Requirement: Step 4 back navigates to Step 3

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏮ at Step 4's first checkpoint to return to Step 3.

### Requirement: Chapter 1 Step 4 advances to Chapter 2 Step 1

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏭ at Chapter 1 Step 4's last checkpoint with "next chapter" hint.

### Requirement: Chapter 2 Step 1 back navigates to Chapter 1 Step 4

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏮ at Chapter 2 Step 1's first checkpoint.

### Requirement: Chapter 2 Step 1 advances to Chapter 2 Step 2

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏭ at Chapter 2 Step 1's last checkpoint.

### Requirement: Chapter 2 Step 2 back navigates to Chapter 2 Step 1

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏮ at Chapter 2 Step 2's first checkpoint.

### Requirement: Chapter 2 Step 2 advances to Chapter 2 Step 3

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏭ at Chapter 2 Step 2's last checkpoint.

### Requirement: Chapter 2 Step 3 back navigates to Chapter 2 Step 2

**Reason**: Consolidated into unified playback transport boundary navigation.
**Migration**: Use ⏮ at Chapter 2 Step 3's first checkpoint.

### Requirement: Step frame supports disabled continue control

**Reason**: Replaced by `advanceDisabled` on forward transport at step boundaries.
**Migration**: Pass `advanceDisabled` to step frame instead of `continueDisabled`.

### Requirement: Chapter 2 Step 3 advances to Chapter 3 Step 1

**Reason**: Consolidated into unified playback transport boundary navigation with prediction gating on forward transport.
**Migration**: Use ⏭ at Chapter 2 Step 3's last checkpoint with `advanceDisabled` until predictions are selected.

## ADDED Requirements

### Requirement: Transport shows boundary hints

When a transport action would cross a step or chapter boundary rather than seek to an intra-step checkpoint, the playback bar SHALL display a short kicker label beside the corresponding transport button.

#### Scenario: Forward hint before next step

- **WHEN** the user is at the last checkpoint of Step 1
- **AND** Step 2 exists in the chapter
- **THEN** a kicker label beside the forward button indicates the upcoming step (e.g. "step 2")

#### Scenario: Forward hint before next chapter

- **WHEN** the user is at the last checkpoint of the final step in a chapter
- **AND** the next chapter is authored
- **THEN** a kicker label beside the forward button indicates "next chapter"

#### Scenario: Rewind hint before previous step

- **WHEN** the user is at the first checkpoint of Step 3
- **THEN** a kicker label beside the rewind button indicates the previous step (e.g. "step 2")

#### Scenario: Rewind hint before previous chapter

- **WHEN** the user is at the first checkpoint of Chapter 2 Step 1
- **THEN** a kicker label beside the rewind button indicates the prior chapter step (e.g. "ch 1 · step 4")

#### Scenario: No hint during checkpoint navigation

- **WHEN** the user is between the first and last checkpoint within a step
- **THEN** no boundary hint labels are shown beside the transport buttons

### Requirement: Step frame supports disabled advance at boundary

`LmStepFrame` SHALL accept an optional `advanceDisabled` input. When `advanceDisabled` is true and the user is at the last checkpoint or step completion, the forward transport control SHALL be disabled and SHALL NOT navigate to the next step or chapter.

#### Scenario: Disabled forward ignores clicks at boundary

- **WHEN** `advanceDisabled` is true
- **AND** the timeline is at the last checkpoint
- **AND** the user presses the forward transport control
- **THEN** no navigation occurs

#### Scenario: Enabled forward navigates at boundary

- **WHEN** `advanceDisabled` is false or unset
- **AND** the timeline is at the last checkpoint
- **AND** the user presses the forward transport control
- **THEN** the step frame navigates to the next step or chapter URL

### Requirement: Keyboard arrows mirror transport controls

The step host SHALL listen for ArrowLeft and ArrowRight key presses to trigger the same dispatch as rewind and forward transport controls, respectively, when focus is not in an input, textarea, or button.

#### Scenario: ArrowRight advances at boundary

- **WHEN** the timeline is at the last checkpoint of Step 1
- **AND** the user presses ArrowRight
- **THEN** the router navigates to Step 2

#### Scenario: ArrowLeft returns to previous step

- **WHEN** the user is at the first checkpoint of Step 2
- **AND** the user presses ArrowLeft
- **THEN** the router navigates to Step 1

#### Scenario: Arrow keys ignored in form controls

- **WHEN** focus is in a slider input
- **AND** the user presses ArrowLeft or ArrowRight
- **THEN** the transport dispatch does not run
