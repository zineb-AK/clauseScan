## MODIFIED Requirements

### Requirement: Job extracts main clauses from contract text

The system SHALL, when `AnalyzeContractJob` is processed, send the full contract text (`Contract.raw_text`) to OpenRouter and store the structured result in `Analysis.results`. The job SHALL also persist each clause as a `Clause` record in the database.

The AI response SHALL be constrained by a `response_format` JSON Schema guaranteeing these fields:
- `duree` (string): duration of the contract
- `preavis` (string): notice period
- `penalites` (string): penalties / late fees
- `conditions_resiliation` (string): termination conditions
- `clauses` (array of objects with `type`, `contenu`, `risk_level` [low|medium|high], and `explanation`)

#### Scenario: Successful extraction with risk detection and persistence
- **GIVEN** an `Analysis` record with status `pending` linked to a contract that has non-empty `raw_text`
- **WHEN** `AnalyzeContractJob::handle()` is executed
- **THEN** the analysis status is set to `processing` at the start
- **AND** the job sends a POST request to OpenRouter with a JSON Schema requiring `risk_level` (enum: low|medium|high) and `explanation` on each clause
- **AND** the job receives a valid JSON response where each clause has `risk_level` set to one of `low`, `medium`, or `high` and a non-empty `explanation`
- **AND** the job stores the response in `Analysis.results` via the `AnalysisResultCast`
- **AND** the job creates a `Clause` record for each clause in the response, linked to the analysis
- **AND** the analysis status is set to `done`
- **AND** each `ClauseItem` object in the result has typed properties `risk_level` and `explanation`

#### Scenario: Job handles database error during clause persistence
- **GIVEN** an `Analysis` record with status `pending`
- **WHEN** `AnalyzeContractJob::handle()` processes a valid AI response but database persistence of clauses fails
- **THEN** the analysis status is set to `failed`
- **AND** no `Clause` records are persisted (transaction is rolled back)

## ADDED Requirements

### Requirement: Analysis model has hasMany relationship to Clause

The `Analysis` model SHALL define a `hasMany` relationship to the `Clause` model named `clauses`. Deleting an `Analysis` SHALL cascade-delete all associated `Clause` records.

#### Scenario: Analysis clauses relationship returns persisted clauses
- **GIVEN** an `Analysis` record with 3 associated `Clause` records
- **WHEN** accessing `$analysis->clauses`
- **THEN** it returns a Collection of 3 `Clause` models
- **AND** each `Clause` has the correct `type`, `content`, `risk_level`, and `explanation`

#### Scenario: Deleting analysis cascades to clauses
- **GIVEN** an `Analysis` record with associated `Clause` records
- **WHEN** the `Analysis` is deleted
- **THEN** all associated `Clause` records are also deleted
