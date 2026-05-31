# feedback-ui Specification

## Purpose

Global feedback FAB, dialog, client context capture, and submission UX in `@lm/design`.

## Requirements

### Requirement: Global feedback FAB is always available

The system SHALL render a fixed-position feedback button (FAB) on every route, including the landing page and all chapter step routes. The FAB SHALL remain visible above page content without obscuring primary navigation or playback transport controls. The FAB SHALL use the standard interactive glow affordance (`lmInteractive`).

#### Scenario: FAB visible on landing page

- **WHEN** a user opens `/`
- **THEN** the feedback FAB is visible in the bottom-right region of the viewport

#### Scenario: FAB visible on step routes

- **WHEN** a user opens any step route (e.g. `/chapter/1/step/1`)
- **THEN** the feedback FAB remains visible and does not overlap the centered playback transport controls

#### Scenario: FAB is keyboard reachable

- **WHEN** the user tabs through the page
- **THEN** the feedback FAB receives focus with a visible focus ring consistent with other interactive elements

### Requirement: Feedback dialog collects message and optional name

Activating the feedback FAB SHALL open a dialog with a required message field and an optional name field. Submission SHALL be anonymous when the name field is empty. The dialog SHALL include a submit control and a dismiss control; dismissing SHALL not clear a pending submission error state until the user closes or retries.

#### Scenario: Dialog opens from FAB

- **WHEN** the user activates the feedback FAB
- **THEN** a dialog opens with a message textarea and an optional name input
- **AND** focus moves into the dialog

#### Scenario: Anonymous submission

- **WHEN** the user submits feedback with a message and an empty name field
- **THEN** the submission is accepted without requiring a name

#### Scenario: Empty message rejected client-side

- **WHEN** the user attempts to submit with an empty or whitespace-only message
- **THEN** the client prevents submission and indicates the message is required

### Requirement: Feedback dialog offers optional category

The feedback dialog SHALL provide an optional category selector with at least: general, narrative confusion, content error, and experience/bug. When omitted by the user, the category SHALL default to `general`.

#### Scenario: Category defaults to general

- **WHEN** the user submits without changing the category
- **THEN** the submission is stored with category `general`

#### Scenario: User selects a category

- **WHEN** the user selects "narrative confusion" and submits
- **THEN** the submission includes category `narrative`

### Requirement: Step playback context is captured automatically

When feedback is submitted from a step route with registered playback context, the client SHALL include chapter number, step number, checkpoint index, timeline event index, elapsed milliseconds, current route path, active theme, and client timestamp (ISO 8601) in the API payload without requiring the user to enter them.

#### Scenario: Step context attached on chapter step

- **WHEN** a user submits feedback while on `/chapter/3/step/2` and the step has registered playback context
- **THEN** the payload includes `chapter: 3`, `step: 2`, checkpoint index, event index, elapsed ms, route, theme, and timestamp

#### Scenario: Non-step routes omit playback fields

- **WHEN** a user submits feedback from `/` with no step context registered
- **THEN** the payload includes route, theme, and timestamp
- **AND** chapter, step, checkpoint index, event index, and elapsed ms are null or omitted

### Requirement: FeedbackContextService holds optional step context

The system SHALL provide a root `FeedbackContextService` with methods to set and clear step playback context. Step components SHALL register context while mounted and clear it on destroy. Context updates SHALL reflect checkpoint seeks and timeline progression.

#### Scenario: Context set on step mount

- **WHEN** a step component initializes and registers runner state
- **THEN** `FeedbackContextService` exposes the current chapter, step, checkpoint index, event index, and elapsed ms

#### Scenario: Context cleared on step destroy

- **WHEN** the user navigates away from a step
- **THEN** playback context is cleared so a subsequent landing-page submission does not inherit stale step data

### Requirement: Submission UX handles loading and outcomes

The feedback dialog SHALL show a loading state while submitting, a success confirmation on HTTP 2xx, and a recoverable error message on failure. A failed submission SHALL retain the user's typed message and optional name.

#### Scenario: Successful submission

- **WHEN** the API returns success
- **THEN** the dialog shows a brief thank-you confirmation
- **AND** the dialog closes automatically or via an explicit dismiss after confirmation

#### Scenario: Failed submission retains input

- **WHEN** the API returns an error or the network fails
- **THEN** the dialog shows an error message
- **AND** the message and name fields retain their values for retry

### Requirement: Feedback UI matches design system

Feedback chrome SHALL use EB Garamond for dialog copy, IBM Plex Mono for kicker labels, theme tokens (`paper`, `ink`, `accent1`), and no sans-serif fonts. The FAB and dialog SHALL respect the active light/dark theme.

#### Scenario: Dialog respects dark theme

- **WHEN** the user has dark theme active and opens the feedback dialog
- **THEN** dialog background and text use dark-theme tokens
