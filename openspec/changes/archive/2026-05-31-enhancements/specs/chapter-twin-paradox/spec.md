## ADDED Requirements

### Requirement: Turnaround speed is interactive with live proper-time readout

The chapter SHALL provide a guided-exploration control (a glowing slider bound through the `TargetRegistry`) that lets the reader vary the traveller's speed and watch the two twins' accumulated proper times — and the Doppler pulse counts — update live. The stay-at-home total, the traveller total, and the age difference SHALL reflect the chosen speed in real time, turning the stated "8 vs 10 years" into a discovered result.

#### Scenario: Dragging speed updates both proper-time totals

- **WHEN** the reader drags the traveller-speed slider
- **THEN** the traveller's accumulated proper time decreases relative to the stay-at-home's as speed increases
- **AND** the age-difference readout updates in real time without requiring playback

#### Scenario: Pulse counts track the proper-time totals

- **WHEN** the Doppler-counting view is active and the reader changes the speed
- **THEN** the received-pulse counts for each twin stay consistent with the displayed proper-time totals

### Requirement: The Minkowski diagram convention is distinguished from the speed-budget diagram

When the worldline (Minkowski) diagram is used — where light is a 45° line — the chapter SHALL include a brief beat acknowledging that this differs from the Epstein speed-budget diagram (where light lies flat along the space axis) taught earlier, so the reader is not silently confused by light appearing at a different angle.

#### Scenario: Convention shift is acknowledged

- **WHEN** the 45° light pulses first appear on the worldline diagram
- **THEN** a beat notes that this diagram plots coordinate time and space (light at 45°), distinct from the earlier speed-budget picture where light lay along the space axis
- **AND** the acknowledgment is brief and does not derive the difference formally
