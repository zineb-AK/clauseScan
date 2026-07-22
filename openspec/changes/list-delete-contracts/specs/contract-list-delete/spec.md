## ADDED Requirements

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
