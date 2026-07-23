# AI Main Clauses

## Purpose

Allow the system to automatically extract the main clauses from a contract using AI (OpenRouter) and store the structured result. This is the core analysis pipeline: receive the full contract text, send it to an LLM with a JSON schema constraint, validate the response, and persist the typed result via a dedicated Eloquent Cast.

## Requirements

### Requirement: Job extracts main clauses from contract text

The system SHALL, when `AnalyzeContractJob` is processed, send the full contract text (`Contract.raw_text`) to OpenRouter and store the structured result in `Analysis.result_json`.

The AI response SHALL be constrained by a `response_format` JSON Schema guaranteeing these fields:
- `duree` (string): duration of the contract
- `preavis` (string): notice period
- `penalites` (string): penalties / late fees
- `conditions_resiliation` (string): termination conditions
- `clauses` (array of objects with `type` and `contenu`)

#### Scenario: Successful extraction of main clauses
- **GIVEN** an `Analysis` record with status `pending` linked to a contract that has non-empty `raw_text`
- **WHEN** `AnalyzeContractJob::handle()` is executed
- **THEN** the analysis status is set to `processing` at the start
- **AND** the job sends a POST request to OpenRouter's `/chat/completions` endpoint with the contract's `raw_text` as the user message and a `response_format` JSON Schema constraining the output
- **AND** the job receives a valid JSON response matching the schema
- **AND** the job stores the response in `Analysis.result_json` via the `AnalysisResultCast`
- **AND** the analysis status is set to `done`
- **AND** `Analysis.result_json` is an instance of `AnalysisResult` with typed properties `duree`, `preavis`, `penalites`, `conditions_resiliation`, and an array of `ClauseItem` objects

#### Scenario: Job handles OpenRouter API error
- **GIVEN** an `Analysis` record with status `pending`
- **WHEN** `AnalyzeContractJob::handle()` is executed and the OpenRouter API returns an HTTP error (timeout, 4xx, 5xx)
- **THEN** the analysis status is set to `failed`
- **AND** no `result_json` is stored

#### Scenario: Job handles malformed AI response (invalid JSON)
- **GIVEN** an `Analysis` record with status `pending`
- **WHEN** `AnalyzeContractJob::handle()` is executed and the OpenRouter API returns a response that is not valid JSON
- **THEN** the analysis status is set to `failed`
- **AND** no `result_json` is stored

#### Scenario: Job handles AI response missing required fields
- **GIVEN** an `Analysis` record with status `pending`
- **WHEN** `AnalyzeContractJob::handle()` is executed and the OpenRouter API returns valid JSON that does not contain all required fields (`duree`, `preavis`, `penalites`, `conditions_resiliation`, `clauses`)
- **THEN** the analysis status is set to `failed`
- **AND** no `result_json` is stored

#### Scenario: Job handles AI response with empty clauses array
- **GIVEN** an `Analysis` record with status `pending`
- **WHEN** `AnalyzeContractJob::handle()` is executed and the OpenRouter API returns a valid response with top-level fields filled but an empty `clauses` array
- **THEN** the analysis status is SET to `done`
- **AND** the `result_json` contains an empty `clauses` array (the contract may genuinely have no extractable clauses — this is a valid edge case)

#### Scenario: Analysis result can be read via API Resource
- **GIVEN** an `Analysis` record with status `done` and a `result_json` populated via `AnalysisResultCast`
- **WHEN** accessing the analysis through `AnalysisResource`
- **THEN** the response includes the typed fields: `duree`, `preavis`, `penalites`, `conditions_resiliation`, `clauses` (each with `type` and `contenu`)
