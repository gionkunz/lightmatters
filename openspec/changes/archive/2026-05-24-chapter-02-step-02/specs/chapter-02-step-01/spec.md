## ADDED Requirements

### Requirement: Step 1 fifty-fifty demo uses equal-split velocity on arc

Chapter 2 Step 1 SHALL animate the velocity vector to $v/c = \sin(45°) \approx 0.707$ (45° on the budget arc, equal time and space components) for its fifty-fifty split beat — not $v/c = 0.5$.

#### Scenario: Fifty-fifty animation targets equal split on arc

- **WHEN** Step 1's timeline runs the animate event before the fifty-fifty narrate beat
- **THEN** the animate target ends at $v/c \approx 0.707$
- **AND** the velocity vector tip lies at 45° on the budget arc

#### Scenario: Fifty-fifty readouts match Lorentz at equal split

- **WHEN** Step 1's velocity is $v/c \approx 0.707$ after the fifty-fifty animation
- **THEN** the tip readout shows approximately 0.71 years time elapsed for one coordinate year
- **AND** the spatial speed readout shows approximately 212,000 km/s

### Requirement: Step 1 narration distinguishes equal split from half light speed

Step 1 narration for the fifty-fifty beat SHALL describe equal time and space components at 45° on the arc (~71% of $c$ through space) and SHALL NOT describe $v/c = 0.5$ as a fifty-fifty split.

#### Scenario: Narration describes forty-five degree equal split

- **WHEN** Step 1's timeline runs the fifty-fifty narrate beat
- **THEN** the narration refers to the vector bisecting the angle on the arc (45°) with equal time and space shares
- **AND** the narration does not equate half light speed ($v/c = 0.5$) with the fifty-fifty split
