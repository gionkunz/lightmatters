## ADDED Requirements

### Requirement: Wavefront variant supports milestone radius animation

`LmSpacetimeDiagram` with `variant: 'wavefront'` SHALL accept a `wavefrontRadius` input (timeline-targetable as `wavefront.radius`) representing the current expansion radius of a **single** pulse ring from B's emission event. Reception markers and intersection geometry SHALL update from the radius value so the diagram can hold a stable frame when the timeline pauses between animate segments.

#### Scenario: Radius input drives ring size

- **WHEN** `wavefrontRadius` is set to a value between 0 and the radius at observer A
- **THEN** the rendered pulse ring radius matches the input
- **AND** no C reception marker is shown

#### Scenario: Ring holds position during narrative pause

- **WHEN** `wavefrontRadius` is held constant at the A-reception milestone across frames
- **THEN** the ring and A reception marker remain visible unchanged
- **AND** the diagram does not emit additional pulses

#### Scenario: Milestone radii align with observer worldlines

- **WHEN** `wavefrontRadius` equals the physics-derived radius at observer A
- **THEN** the ring tangent intersects A's worldline at the reception event
- **WHEN** `wavefrontRadius` equals the physics-derived radius at observer C
- **THEN** the ring tangent intersects C's worldline at the reception event
