## ADDED Requirements

### Requirement: User can log in with email and password

The system SHALL allow registered users to authenticate by providing their email and password. Upon successful authentication, the system SHALL return a Sanctum token.

#### Scenario: Successful login with valid credentials
- **WHEN** a POST request is made to `/api/login` with valid `email` and `password`
- **THEN** the response status is 200
- **AND** the response body contains the user data (via `UserResource`: `id`, `name`, `email`, `created_at`) and the `token` field

#### Scenario: Login fails with missing email
- **WHEN** a POST request is made to `/api/login` without the `email` field
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `email` field

#### Scenario: Login fails with missing password
- **WHEN** a POST request is made to `/api/login` without the `password` field
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `password` field

#### Scenario: Login fails with both fields missing
- **WHEN** a POST request is made to `/api/login` without both `email` and `password` fields
- **THEN** the response status is 422
- **AND** the response body contains validation errors for both `email` and `password` fields

#### Scenario: Login fails with invalid email format
- **WHEN** a POST request is made to `/api/login` with an invalid email format
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `email` field

#### Scenario: Login fails with non-existent email
- **WHEN** a POST request is made to `/api/login` with an email that does not exist in the database
- **THEN** the response status is 401
- **AND** the response body contains a generic error message that does not specify whether the email or password was incorrect

#### Scenario: Login fails with incorrect password
- **WHEN** a POST request is made to `/api/login` with an existing email but wrong password
- **THEN** the response status is 401
- **AND** the response body contains a generic error message that does not specify whether the email or password was incorrect
