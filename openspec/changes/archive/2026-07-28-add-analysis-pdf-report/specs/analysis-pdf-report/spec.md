## ADDED Requirements

### Requirement: User can download analysis report as PDF

The system SHALL expose a `GET /api/analyses/{analysis}/report` endpoint, protected by `auth:sanctum` and `AnalysisPolicy::view()`. When the analysis status is `done`, the system SHALL return a PDF file with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename="analyse-{analysis->id}.pdf"`. The PDF SHALL contain the contract title, extracted clauses (duration, notice period, penalties, termination conditions), and risk clauses with their level and explanation.

#### Scenario: Authenticated user downloads report for completed analysis
- **GIVEN** an authenticated user who owns a contract with a completed analysis (`status: done`)
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}/report`
- **THEN** the response status is `200`
- **AND** the response header `Content-Type` equals `application/pdf`
- **AND** the response header `Content-Disposition` contains `attachment; filename="analyse-{id}.pdf"`
- **AND** the response body is a valid PDF containing the contract title and analysis results

#### Scenario: Unauthenticated user cannot download report
- **GIVEN** no authenticated user
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}/report`
- **THEN** the response status is `401`

#### Scenario: User cannot download another user's analysis report
- **GIVEN** an authenticated user who does NOT own the analysis
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}/report`
- **THEN** the response status is `403`

#### Scenario: User downloads report for non-existent analysis
- **GIVEN** an authenticated user
- **WHEN** sending a `GET` request to `/api/analyses/99999/report`
- **THEN** the response status is `404`

#### Scenario: User cannot download report for pending analysis
- **GIVEN** an authenticated user who owns an analysis with `status: pending`
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}/report`
- **THEN** the response status is `409`

#### Scenario: User cannot download report for processing analysis
- **GIVEN** an authenticated user who owns an analysis with `status: processing`
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}/report`
- **THEN** the response status is `409`

#### Scenario: User cannot download report for failed analysis
- **GIVEN** an authenticated user who owns an analysis with `status: failed`
- **WHEN** sending a `GET` request to `/api/analyses/{analysis}/report`
- **THEN** the response status is `409`
