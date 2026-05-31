## ADDED Requirements

### Requirement: Reader can toggle frames to feel relativity of simultaneity

In addition to the scripted moving-witness segment, Step 4 SHALL provide a learner-controlled frame toggle (a glowing control bound through the `TargetRegistry`, unlocked at the exploration wait) that lets the reader switch between the outside ("ground") view and the witness's own rest-frame view of the same two flashes. In the witness's frame the witness SHALL appear at rest and equidistant from both sources, and the flashes SHALL be shown as genuinely non-simultaneous — so the reader discovers the relativity of simultaneity by flipping the view themselves rather than only watching it asserted.

#### Scenario: Toggling to the witness frame re-centers the witness

- **WHEN** the reader toggles into the witness's rest frame
- **THEN** the witness is shown at rest and equidistant from both sources
- **AND** the two flashes are depicted as occurring at different times in that frame

#### Scenario: Toggling back to the ground frame restores arrival-order view

- **WHEN** the reader toggles back to the outside view
- **THEN** the scene shows the moving witness and the asymmetric arrival order

#### Scenario: Toggle unlocks at the exploration wait and does not gate navigation

- **WHEN** the pre-exploration beat begins
- **THEN** the frame toggle becomes interactive
- **AND** forward navigation does not depend on the reader using the toggle
