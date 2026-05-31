## ADDED Requirements

### Requirement: Feedback API is a file-based Pages Function

The deployment SHALL expose `POST /api/feedback` via Cloudflare Pages Functions file-based routing. The handler SHALL live at `functions/api/feedback.ts` relative to the Pages project root (repo root for this monorepo — **not** inside the static build output directory). Pages CI SHALL auto-discover the `/functions` directory on Git deploy; no manual route table or Advanced-mode `_worker.js` is required.

#### Scenario: File path maps to API route

- **WHEN** the repository contains `functions/api/feedback.ts` at the Pages project root
- **THEN** Cloudflare routes `POST /api/feedback` to that file's `onRequestPost` handler after Git deploy

#### Scenario: Functions directory is outside static build output

- **WHEN** the Angular build completes to `dist/apps/lightmatters/browser`
- **THEN** the `functions/` directory remains at the repo root and is not copied into the static output directory

### Requirement: Feedback API accepts POST submissions

The handler SHALL accept JSON bodies, validate required fields, persist a row to D1, and respond with JSON. Methods other than POST SHALL receive HTTP 405.

#### Scenario: Valid submission persisted

- **WHEN** a client sends `POST /api/feedback` with `Content-Type: application/json` and a body containing a non-empty `message` (1–2000 characters)
- **THEN** the handler inserts a row into D1
- **AND** responds with HTTP 201 and `{ "ok": true, "id": "<uuid>" }`

#### Scenario: Invalid method rejected

- **WHEN** a client sends `GET /api/feedback`
- **THEN** the handler responds with HTTP 405

#### Scenario: Missing message rejected

- **WHEN** a client sends a body without a `message` or with a whitespace-only `message`
- **THEN** the handler responds with HTTP 400 and `{ "ok": false, "error": "message required" }`
- **AND** no row is inserted

### Requirement: Feedback rows are stored in D1 with structured fields

The D1 database SHALL contain a `feedback` table with columns: `id` (TEXT PK), `created_at` (TEXT ISO UTC, server-set), `message` (TEXT NOT NULL), `name` (TEXT nullable), `category` (TEXT NOT NULL, default `general`), `route` (TEXT NOT NULL), `chapter` (INTEGER nullable), `step` (INTEGER nullable), `checkpoint_index` (INTEGER nullable), `event_index` (INTEGER nullable), `elapsed_ms` (INTEGER nullable), `theme` (TEXT nullable), and `user_agent` (TEXT nullable). Indexes SHALL exist on `created_at` and `(chapter, step)`.

#### Scenario: Server sets timestamp

- **WHEN** a valid submission is received
- **THEN** `created_at` is set by the server to the current UTC ISO timestamp
- **AND** is not taken from the client payload

#### Scenario: Optional fields stored as null

- **WHEN** a submission omits chapter, step, or playback fields
- **THEN** those columns are stored as NULL

### Requirement: Input validation and sanitization

The handler SHALL trim string fields, enforce maximum lengths (`message` ≤ 2000, `name` ≤ 100, `route` ≤ 500, `category` one of `general|narrative|content|experience`), reject unknown categories with 400, and store plain text only (no HTML rendering on write).

#### Scenario: Name length enforced

- **WHEN** a client sends a `name` longer than 100 characters
- **THEN** the handler responds with HTTP 400
- **AND** no row is inserted

#### Scenario: Unknown category rejected

- **WHEN** a client sends `category: "spam"`
- **THEN** the handler responds with HTTP 400

### Requirement: D1 binding configured for Pages

The Cloudflare Pages project SHALL bind a D1 database (conventionally `FEEDBACK_DB`) to the feedback function environment via **Settings → Functions → Bindings** in the dashboard and/or a repo-root `wrangler.jsonc` `d1_databases` entry. If the binding is missing at runtime, the handler SHALL respond with HTTP 503 and a generic error JSON body.

#### Scenario: Missing D1 binding fails gracefully

- **WHEN** the function executes without a D1 binding
- **THEN** the handler responds with HTTP 503
- **AND** does not throw an unhandled exception to the client

#### Scenario: Functions deploy via Git integration

- **WHEN** a commit containing `functions/` is pushed to a connected branch
- **THEN** Cloudflare Pages Git deploy discovers and bundles the Functions alongside the static build output
- **AND** Direct Upload without Git does not need to be supported for Functions

### Requirement: Feedback API schema is version-controlled

The repository SHALL include a SQL migration file for the `feedback` table and instructions to apply it via `wrangler d1 execute`. Engineers SHALL be able to recreate the database schema from repository files alone.

#### Scenario: Schema file exists in repo

- **WHEN** an engineer clones the repository
- **THEN** they can locate the feedback table DDL and apply it to a D1 instance using documented wrangler commands

### Requirement: Feedback API is same-origin

The feedback endpoint SHALL be served from the same origin as the static app (`https://lightmatters.app` in production) so browser clients can call it without CORS preflight configuration.

#### Scenario: Production same-origin POST

- **WHEN** the app at `https://lightmatters.app` submits feedback
- **THEN** the request targets `https://lightmatters.app/api/feedback`
- **AND** succeeds without cross-origin CORS headers
