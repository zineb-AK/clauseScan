## ADDED Requirements

### Requirement: User can view analysis results via dedicated endpoint

The system SHALL expose a `GET /api/analyses/{analysis}` endpoint, protected by `auth:sanctum` and `AnalysisPolicy::view()`. The response SHALL use `AnalysisResource` with conditional content based on analysis status.

#### Scenario: Authenticated user views completed analysis results
- **GIVEN** an authenticated user who owns a contract with a completed analysis (`status: done`)
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}`
- **THEN** the response status is `200`
- **AND** the response includes `id`, `status`, `results` (with `duree`, `preavis`, `penalites`, `conditions_resiliation`, `clauses[]`), and `clauses` (with `id`, `type`, `content`, `risk_level`, `explanation`)

#### Scenario: Authenticated user views pending analysis
- **GIVEN** an authenticated user who owns an analysis with `status: pending`
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}`
- **THEN** the response status is `200`
- **AND** the response includes only `id` and `status`
- **AND** the response does NOT include `results` or `clauses`

#### Scenario: Authenticated user views processing analysis
- **GIVEN** an authenticated user who owns an analysis with `status: processing`
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}`
- **THEN** the response status is `200`
- **AND** the response includes only `id` and `status`
- **AND** the response does NOT include `results` or `clauses`

#### Scenario: Unauthenticated user cannot view analysis
- **GIVEN** no authenticated user
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}`
- **THEN** the response status is `401`

#### Scenario: User cannot view another user's analysis
- **GIVEN** an authenticated user who does NOT own the analysis
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}`
- **THEN** the response status is `403`

#### Scenario: User views non-existent analysis
- **GIVEN** an authenticated user
- **WHEN** sending a `GET` request to `/api/analyses/99999`
- **THEN** the response status is `404`
