## Purpose

Gestion de l'authentification utilisateur : inscription, connexion, déconnexion via Laravel Sanctum.

## Requirements

### Requirement: User can register an account

The system SHALL allow unauthenticated users to create a new account by providing a name, email, and password. The system SHALL create the user, hash the password, and return the created user with a Sanctum token.

#### Scenario: Successful registration

- **WHEN** a POST request is made to `/api/register` with valid `name`, `email`, `password`, and `password_confirmation`
- **THEN** the system creates a new user in the database
- **AND** the password is stored hashed (bcrypt)
- **AND** a Sanctum token is created for the user
- **AND** the response status is 201
- **AND** the response body contains the user data (via `UserResource`: `id`, `name`, `email`, `created_at`) and the `token` field

#### Scenario: Registration fails with missing name

- **WHEN** a POST request is made to `/api/register` without the `name` field
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `name` field

#### Scenario: Registration fails with missing email

- **WHEN** a POST request is made to `/api/register` without the `email` field
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `email` field

#### Scenario: Registration fails with invalid email format

- **WHEN** a POST request is made to `/api/register` with an invalid email format
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `email` field

#### Scenario: Registration fails with duplicate email

- **WHEN** a POST request is made to `/api/register` with an email that already exists in the database
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `email` field

#### Scenario: Registration fails with missing password

- **WHEN** a POST request is made to `/api/register` without the `password` field
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `password` field

#### Scenario: Registration fails with short password

- **WHEN** a POST request is made to `/api/register` with a password shorter than 8 characters
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `password` field

#### Scenario: Registration fails with password confirmation mismatch

- **WHEN** a POST request is made to `/api/register` with `password` and `password_confirmation` that do not match
- **THEN** the response status is 422
- **AND** the response body contains validation errors for the `password` field
