## MODIFIED Requirements

### Requirement: Landing page is served at the root route

The application SHALL lazy-load a landing feature library at path `/` that renders the marketing landing page. Unknown paths that are not matched by a defined feature route SHALL redirect to `/`.

#### Scenario: Root URL renders landing page

- **WHEN** a user navigates to `/`
- **THEN** the landing page component renders without a full-page reload of the Angular app shell

#### Scenario: Unknown route redirects home

- **WHEN** a user navigates to a path that is not defined (e.g. `/unknown`)
- **THEN** the router redirects to `/`

## ADDED Requirements

### Requirement: Chapter 1 entry points link to Step 1

The landing page Hero primary CTA and Chapter 1 preview card SHALL link to `/ch/01/step/1`.

#### Scenario: Hero begin button navigates to Step 1

- **WHEN** a user clicks the Hero primary CTA ("begin chapter 1" or equivalent)
- **THEN** the router navigates to `/ch/01/step/1`

#### Scenario: Chapter 1 card navigates to Step 1

- **WHEN** a user clicks the Chapter 1 preview card
- **THEN** the router navigates to `/ch/01/step/1`
