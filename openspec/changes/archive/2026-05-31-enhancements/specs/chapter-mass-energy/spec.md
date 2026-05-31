## MODIFIED Requirements

### Requirement: See-saw moment-balance derivation

Step 5 SHALL complete the derivation using a see-saw (moment-balance) visual: the heavy box close to the pivot (small arm \(\Delta x\)) balances the light photon far out (long arm \(L\)). It SHALL define a moment as mass × distance (units kg·m, not energy), set the two moments equal (\(M\,\Delta x = m\,L\)), substitute \(\Delta x = EL/(Mc^2)\) (from \(v = E/(Mc)\) and crossing time \(t = L/c\)), and cancel to \(m = E/c^2\), explaining that the two factors of \(c\) (push and crossing time) are why it is \(c\) squared. The algebraic cancellation SHALL be presented through the `animated-derivation` primitive — the \(M\) and \(L\) factors visibly cancel (strike and fade) as the expression resolves to \(m = E/c^2\) — and the step SHALL offer a skip-to-result affordance so a reader who does not want the algebra still reaches \(m = E/c^2\). An interactive control SHALL let the reader vary \(E\) and observe both moments grow together while the beam stays level.

#### Scenario: Moments balance for every energy

- **WHEN** Step 5's see-saw visual runs and the reader varies \(E\)
- **THEN** the box moment \(M\,\Delta x\) and light moment \(m\,L\) grow together and remain equal
- **AND** narration cancels the balance to \(m = E/c^2\), attributing the squared \(c\) to the push (\(E/c\)) and the crossing time (\(L/c\))

#### Scenario: Cancellation is animated

- **WHEN** the derivation reaches the step where \(M\) and \(L\) cancel
- **THEN** the \(M\) and \(L\) tokens visibly cancel (strike and fade) via the `animated-derivation` primitive
- **AND** the expression resolves on screen to \(m = E/c^2\)

#### Scenario: Reader can skip to the result

- **WHEN** the reader chooses to skip the algebra
- **THEN** the derivation jumps to its final frame showing \(m = E/c^2\) (equivalently \(E = mc^2\))
- **AND** forward progress is not gated on watching the intermediate cancellation
