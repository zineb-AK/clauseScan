# Contract Management

## Purpose

Allow authenticated users to import, list, and delete their contracts. Import supports two modes: PDF file upload (text extracted server-side) or raw text paste. Both modes create a contract record with status "pending" for further analysis.

## Requirements

### Requirement: User can import a contract as PDF

The system SHALL allow authenticated users to upload a PDF file representing a contract. The system SHALL extract the text content from the PDF and create a contract record with status "pending".

#### Scenario: Successful PDF import
- **WHEN** an authenticated user sends a POST request to `/api/contracts` with a valid PDF file (field name: `contract`) that is 10 MB or less
- **THEN** the system extracts the text content from the PDF using Spatie pdf-to-text
- **AND** the system creates a contract record associated to the authenticated user with `source_type` = "pdf", `status` = "pending", and the extracted text in `raw_text`
- **AND** the PDF file is stored on the server
- **AND** the response status is 201
- **AND** the response body contains the contract data (via `ContractResource`: `id`, `title`, `source_type`, `status`, `created_at`)

#### Scenario: Import fails when unauthenticated
- **WHEN** an unauthenticated POST request is made to `/api/contracts` with a PDF file
- **THEN** the response status is 401

#### Scenario: Import fails with missing file
- **WHEN** a POST request is made to `/api/contracts` without a file
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `contract` field

#### Scenario: Import fails with non-PDF file
- **WHEN** a POST request is made to `/api/contracts` with a file that is not a PDF (e.g., .docx, .png)
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `contract` field

#### Scenario: Import fails with oversized file
- **WHEN** a POST request is made to `/api/contracts` with a PDF file larger than 10 MB
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `contract` field

#### Scenario: Import fails with scanned PDF (no extractable text)
- **WHEN** a POST request is made to `/api/contracts` with a PDF that contains no extractable text (scanned document)
- **THEN** the system does NOT create a contract record
- **AND** the response status is 422
- **AND** the response body contains an explicit error message indicating the PDF appears to be scanned

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

### Requirement: User can list their contracts
The system SHALL return a paginated list of contracts belonging to the authenticated user, ordered by creation date descending.

#### Scenario: Successful listing
- **WHEN** a GET request is made to `/api/contracts` with a valid Sanctum token
- **THEN** the response SHALL have status 200 and return a paginated JSON collection with contracts data, each contract containing `id`, `title`, `source_type`, `status`, and `created_at` fields

#### Scenario: Unauthenticated request
- **WHEN** a GET request is made to `/api/contracts` without a valid Sanctum token
- **THEN** the response SHALL have status 401

#### Scenario: Empty list
- **WHEN** a GET request is made to `/api/contracts` by a user with no contracts
- **THEN** the response SHALL have status 200 with an empty data array and pagination metadata showing total = 0

#### Scenario: Only own contracts are returned
- **WHEN** a GET request is made to `/api/contracts` and other users have contracts in the database
- **THEN** the response SHALL contain only the authenticated user's contracts

### Requirement: User can delete their own contract
The system SHALL permanently delete a contract and its associated file (if PDF) when the authenticated user owns it.

#### Scenario: Successful deletion
- **WHEN** a DELETE request is made to `/api/contracts/{contract}` by the contract owner
- **THEN** the response SHALL have status 204 and the contract SHALL be removed from the database

#### Scenario: Delete PDF contract also removes file
- **WHEN** a DELETE request is made to `/api/contracts/{contract}` by the owner of a PDF-sourced contract
- **THEN** the response SHALL have status 204 and the stored PDF file SHALL also be deleted from storage

#### Scenario: Unauthenticated request
- **WHEN** a DELETE request is made to `/api/contracts/{contract}` without a valid Sanctum token
- **THEN** the response SHALL have status 401

#### Scenario: Delete another user's contract
- **WHEN** a DELETE request is made to `/api/contracts/{contract}` by a user who is not the owner
- **THEN** the response SHALL have status 403

#### Scenario: Delete non-existent contract
- **WHEN** a DELETE request is made to `/api/contracts/{contract}` with a non-existent contract ID
- **THEN** the response SHALL have status 404
