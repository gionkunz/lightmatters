## MODIFIED Requirements

### Requirement: Locked v1.0 chapter numbering

The application SHALL number chapters per the updated journey map (13 chapters): (1) Position,
time, spacetime; (2) The speed of light; (3) The speed budget; (4) Light and information; (5)
The ether was wrong; (6) The same speed of light; (7) Clocks & rulers; (8) Doppler and seeing
motion; (9) The twin paradox; (10) Mass is energy (E=mc²); (11) Rolling the diagram; (12) The
center of the Earth; (13) Light bending around mass. Chapters 1–10 are the flat-spacetime
(special relativity) block; chapters 11–13 are the curved-spacetime (general relativity) block.
Inserting "The speed of light" at position 2 SHALL shift every previously later chapter up by
one (speed budget 2→3, light & information 3→4, the ether 4→5, the same speed of light 5→6,
clocks & rulers 6→7, Doppler 7→8, twin paradox 8→9, mass is energy 9→10, rolling 10→11, center
11→12, light bending 12→13); feature-lib folder names are historical and SHALL NOT be required
to match the new numbers, since route mounts in `app.routes.ts` and `site-routes.ts` map
numbers to libs.

#### Scenario: Speed-of-light chapter sits at position 2

- **WHEN** a reader navigates to `/chapter/2`
- **THEN** the router resolves the "The speed of light" chapter and redirects to `/chapter/2/step/1`

#### Scenario: Shifted chapters reachable at their new numbers

- **WHEN** a reader navigates to the shifted chapters
- **THEN** the speed budget resolves at `/chapter/3`, light & information at `/chapter/4`, the
  same speed of light at `/chapter/6`, Doppler at `/chapter/8`, rolling at `/chapter/11`, the
  center of the Earth at `/chapter/12`, and light bending at `/chapter/13`
- **AND** "Position, time, spacetime" remains at `/chapter/1`

#### Scenario: Registry, prerender, and SEO reflect the new numbering

- **WHEN** the build enumerates routes for prerender and sitemap generation
- **THEN** every chapter step path uses the 13-chapter numbering and the `/chapter/...` scheme
- **AND** the chapter registry, `site-routes.ts`, and SEO output all agree on the numbering
