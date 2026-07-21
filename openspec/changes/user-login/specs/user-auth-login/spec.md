## ADDED Requirements

### Requirement: User can log in with email and password

The system SHALL allow users to authenticate by providing an email and password. The system SHALL verify the credentials against the database and return a Sanctum token if valid.

#### Scenario: Successful login

- **WHEN** a POST request is made to `/api/login` with valid `email` and `password`
- **THEN** the system verifies the credentials against the database
- **AND** a Sanctum token is created for the user
- **AND** the response status is 200
- **AND** the response body contains the `token` field

#### Scenario: Login fails with incorrect credentials

- **WHEN** a POST request is made to `/api/login` with an incorrect email or password
- **THEN** the response status is 401
- **AND** the response body contains the message "These credentials do not match our records."
- **AND** the system does not specify whether the email or password was incorrect

#### Scenario: Login fails with missing email

- **WHEN** a POST request is made to `/api/login` without the `email` field
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `email` field

#### Scenario: Login fails with missing password

- **WHEN** a POST request is made to `/api/login` without the `password` field
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `password` field

#### Scenario: Login fails with invalid email format

- **WHEN** a POST request is made to `/api/login` with an invalid email format
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `email` field
