## ADDED Requirements

### Requirement: Pulse-train Doppler uses relativistic emission intervals

The `@lm/physics` pulse-train helpers used by Chapter 5 SHALL model the source's emission cadence as a **proper-time** interval in the source's own frame, mapped into the scene (observer) frame with the time-dilation factor γ. As a result, the mean observed arrival interval at a stationary observer SHALL reflect the **relativistic** longitudinal Doppler factor √((1+β)/(1−β)) for recession (and its reciprocal for approach), not the bare classical light-travel-time factor (1±β). A helper SHALL exist (e.g. an extension of, or relativistic-aware variant alongside, `buildPeriodicEmissions`) that places emissions at γ-dilated scene-frame times for a source moving at a given β.

#### Scenario: Receding source mean interval matches relativistic Doppler

- **WHEN** a source recedes from a stationary observer at speed β along the line of sight, emitting at a fixed proper interval T₀
- **AND** the relativistic-aware pulse-train helper computes arrival times at the observer
- **THEN** the mean observed arrival interval approaches T₀·√((1+β)/(1−β)) within numerical tolerance
- **AND** this is strictly larger than the classical value T₀·(1+β)

#### Scenario: Approaching source mean interval matches relativistic Doppler

- **WHEN** a source approaches a stationary observer at speed β along the line of sight, emitting at a fixed proper interval T₀
- **THEN** the mean observed arrival interval approaches T₀·√((1−β)/(1+β)) within numerical tolerance

#### Scenario: Time-dilation contribution is present

- **WHEN** the relativistic emission intervals are compared to equal coordinate-time intervals at the same β
- **THEN** the relativistic arrival spacing differs from the classical-only spacing by the γ factor
- **AND** Chapter 5 narration's claim that the observed rhythm change includes the Chapter 2 time-dilation effect is supported by the model
