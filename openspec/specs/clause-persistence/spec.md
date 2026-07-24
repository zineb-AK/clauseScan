# Clause Persistence

## Purpose

Persist each clause detected by the AI analysis as a separate database record in a dedicated `clauses` table, linked to the `Analysis` via foreign key. This enables direct querying, filtering, and individual export of clauses without parsing the JSON blob.

## Requirements

### Requirement: System persists each clause in the `clauses` table

After the AI response is validated, the system SHALL persist each detected clause as a separate record in the `clauses` table, linked to the `Analysis` via foreign key. The `Clause` model SHALL have fields: `type`, `content`, `risk_level` (enum: low|medium|high), and `explanation`.

#### Scenario: Clauses are persisted after successful AI analysis
- **GIVEN** an `Analysis` record with status `pending` linked to a contract with non-empty `raw_text`
- **WHEN** `AnalyzeContractJob::handle()` successfully processes the AI response
- **THEN** the analysis status is set to `done`
- **AND** for each clause in the AI response, a `Clause` record is created with the correct `analysis_id`, `type`, `content`, `risk_level`, and `explanation`
- **AND** the `Analysis` model's `clauses` relationship returns all persisted `Clause` records

#### Scenario: Clause persistence fails and analysis is marked as failed
- **GIVEN** an `Analysis` record with status `pending`
- **WHEN** `AnalyzeContractJob::handle()` processes the AI response but clause persistence fails (e.g., database error)
- **THEN** the analysis status is set to `failed`
- **AND** no partial `Clause` records remain (transaction rollback)

#### Scenario: No clauses in AI response results in no Clause records
- **GIVEN** an `Analysis` record with status `pending`
- **WHEN** `AnalyzeContractJob::handle()` successfully processes an AI response with an empty `clauses` array
- **THEN** the analysis status is set to `done`
- **AND** no `Clause` records are created for this analysis

#### Scenario: Clauses are accessible via API Resource with persisted data
- **GIVEN** an `Analysis` record with status `done` and associated `Clause` records
- **WHEN** accessing the analysis through `AnalysisResource`
- **THEN** the response includes `clauses` array with each clause containing `id`, `type`, `content`, `risk_level`, and `explanation` from the database

### Requirement: Clauses table has the correct schema

The `clauses` migration SHALL create a table with: `id` (auto-increment), `analysis_id` (foreign key to `analyses.id`), `type` (string), `content` (text), `risk_level` (string, enum constraint: low|medium|high), `explanation` (text), `created_at`, `updated_at`.

#### Scenario: Clauses table is created by migration
- **GIVEN** the application is freshly migrated
- **WHEN** inspecting the database schema
- **THEN** the `clauses` table exists
- **AND** it has a foreign key constraint on `analysis_id` referencing `analyses.id` with `cascade on delete`
- **AND** `risk_level` is constrained to `low`, `medium`, or `high`
