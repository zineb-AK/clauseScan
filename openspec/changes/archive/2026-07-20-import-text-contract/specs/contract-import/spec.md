## ADDED Requirements

### Requirement: User can import a contract as raw text

The system SHALL allow authenticated users to submit raw text content representing a contract. The text SHALL be stored as a contract record with status "pending" and source_type "text".

#### Scenario: Successful text import
- **WHEN** an authenticated user sends a POST request to `/api/contracts` with a `content` field containing non-empty text (no `contract` file field)
- **THEN** the system creates a contract record associated to the authenticated user with `source_type` = "text", `status` = "pending", the submitted text in `raw_text`, and a title derived from the first line of the content
- **AND** the response status is 201
- **AND** the response body contains the contract data (via `ContractResource`: `id`, `title`, `source_type`, `status`, `created_at`)

#### Scenario: Import fails when unauthenticated
- **WHEN** an unauthenticated POST request is made to `/api/contracts` with a `content` field
- **THEN** the response status is 401

#### Scenario: Import fails with empty content
- **WHEN** a POST request is made to `/api/contracts` with an empty or whitespace-only `content` field
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `content` field

#### Scenario: Import fails with excessively long content
- **WHEN** a POST request is made to `/api/contracts` with a `content` field exceeding 100 000 characters
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `content` field

#### Scenario: Import fails when both fields are missing
- **WHEN** a POST request is made to `/api/contracts` with neither `content` nor `contract` fields
- **THEN** the response status is 422
- **AND** the response body contains validation errors

#### Scenario: Import fails when both fields are provided
- **WHEN** a POST request is made to `/api/contracts` with both `content` and `contract` fields
- **THEN** the response status is 422
- **AND** the response body contains validation errors
