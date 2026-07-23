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
- `clauses` (array of objects with `type`, `contenu`, `risk_level` [low|medium|high], and `explanation`)

#### Scenario: Successful extraction with risk detection
- **GIVEN** an `Analysis` record with status `pending` linked to a contract that has non-empty `raw_text`
- **WHEN** `AnalyzeContractJob::handle()` is executed
- **THEN** the analysis status is set to `processing` at the start
- **AND** the job sends a POST request to OpenRouter with a JSON Schema requiring `risk_level` (enum: low|medium|high) and `explanation` on each clause
- **AND** the job receives a valid JSON response where each clause has `risk_level` set to one of `low`, `medium`, or `high` and a non-empty `explanation`
- **AND** the job stores the response in `Analysis.result_json` via the `AnalysisResultCast`
- **AND** the analysis status is set to `done`
- **AND** each `ClauseItem` object in the result has typed properties `risk_level` and `explanation`

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

#### Scenario: Multiple risk levels are detected
- **GIVEN** a contract containing both standard clauses and potentially abusive clauses
- **WHEN** `AnalyzeContractJob::handle()` is executed
- **THEN** clauses that are standard (e.g., "durée déterminée") receive `risk_level: "low"`
- **AND** clauses that are unusual but not necessarily dangerous receive `risk_level: "medium"`
- **AND** clauses that are abusive, illegal, or heavily unbalanced receive `risk_level: "high"`
- **AND** each clause includes a simple-language explanation of why it has that risk level

#### Scenario: Job handles AI response missing risk_level on a clause
- **GIVEN** an `Analysis` record with status `pending`
- **WHEN** `AnalyzeContractJob::handle()` is executed and the OpenRouter API returns a valid response where one or more clauses are missing `risk_level` or `explanation`
- **THEN** the analysis status is set to `failed`
- **AND** no `result_json` is stored

#### Scenario: Analysis result can be read via API Resource
- **GIVEN** an `Analysis` record with status `done` and a `result_json` populated via `AnalysisResultCast`
- **WHEN** accessing the analysis through `AnalysisResource`
- **THEN** the response includes `results` with clauses each containing `type`, `contenu`, `risk_level`, and `explanation`
