## ADDED Requirements

### Requirement: User can log out

The system SHALL allow authenticated users to revoke their current Sanctum token, effectively logging them out of the current session.

#### Scenario: Successful logout
- **WHEN** an authenticated POST request is made to `/api/logout` with a valid Bearer token
- **THEN** the current token is revoked (deleted from the database)
- **AND** the response status is 204
- **AND** the response body is empty

#### Scenario: Logout fails when unauthenticated
- **WHEN** a POST request is made to `/api/logout` without a valid Bearer token
- **THEN** the response status is 401
- **AND** the response body contains an authentication error
