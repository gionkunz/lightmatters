## ADDED Requirements

### Requirement: Wavefront radius milestones for timeline authoring

The physics library SHALL export `wavefrontRadiusAtObserver(layout, observer)` returning the diagram-space ring radius when an omnidirectional pulse from B first reaches the given observer ('a' or 'c'), using the same layout constants as Step 3.

#### Scenario: Milestone radius at A is less than at C for default layout

- **WHEN** `wavefrontRadiusAtObserver` is called for the Step 3 default layout with A left of B and C right of B at $v/c = 0.5$
- **THEN** the radius at A is positive and less than the radius at C

#### Scenario: Timeline animate targets use milestone radii

- **WHEN** a step timeline animates `wavefront.radius` from 0 to `wavefrontRadiusAtObserver(layout, 'a')`
- **THEN** the animation ends with the ring visually arriving at A's worldline

#### Scenario: Reception time helpers remain available

- **WHEN** `receptionTimeStationary`, `receptionTimeMoving`, and `properTimeAtReception` are called for the Step 3 layout
- **THEN** returned values are consistent with the milestone radii (same underlying geometry)
