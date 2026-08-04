## ADDED Requirements

### Requirement: User can register an account from the React SPA

The system SHALL provide a `/register` page in the React SPA with a registration form (name, email, password, password_confirmation) that submits to `POST /api/register` and, on success, stores the returned Sanctum token and the user data, then redirects to `/contracts`.

#### Scenario: Successful registration
- **WHEN** the user submits the registration form with a valid name, a valid email, a password of at least 8 characters and the matching password_confirmation
- **THEN** a POST request is sent to `/api/register` with fields `name`, `email`, `password`, `password_confirmation`
- **AND** the response status is 201
- **AND** the returned `token` is stored in `localStorage` under the key `clausescan_token`
- **AND** the returned user data is stored in `localStorage` under the key `clausescan_user`
- **AND** the user is redirected to `/contracts`

#### Scenario: Registration fails with client-side validation errors
- **WHEN** the user submits the registration form with an invalid email, a password shorter than 8 characters, or a password_confirmation that does not match the password
- **THEN** the form is not submitted to the API
- **AND** an inline error message is displayed under the corresponding field (name, email, password or password_confirmation)

#### Scenario: Registration fails with API validation errors (422)
- **WHEN** the API responds with status 422 (e.g. duplicate email, missing field, invalid format)
- **THEN** the errors from the `errors` object of the response are displayed inline under the corresponding fields
- **AND** the user stays on the `/register` page

#### Scenario: User navigates to login from the registration page
- **WHEN** the user clicks the link "Déjà un compte ?"
- **THEN** the SPA navigates to `/login`

### Requirement: User can log in from the React SPA

The system SHALL provide a `/login` page in the React SPA with a login form (email, password) that submits to `POST /api/login` and, on success, stores the returned Sanctum token and the user data, then redirects to `/contracts`.

#### Scenario: Successful login
- **WHEN** the user submits the login form with a valid email and password
- **THEN** a POST request is sent to `/api/login` with fields `email` and `password`
- **AND** the response status is 200
- **AND** the returned `token` is stored in `localStorage` under the key `clausescan_token`
- **AND** the returned user data is stored in `localStorage` under the key `clausescan_user`
- **AND** the user is redirected to `/contracts`

#### Scenario: Login fails with client-side validation errors
- **WHEN** the user submits the login form with an invalid email format or a missing field
- **THEN** the form is not submitted to the API
- **AND** an inline error message is displayed under the corresponding field (email or password)

#### Scenario: Login fails with invalid credentials (401)
- **WHEN** the API responds with status 401 (email not found or wrong password)
- **THEN** a generic error message "Identifiants invalides." is displayed (without specifying whether the email or the password was incorrect)
- **AND** the user stays on the `/login` page

#### Scenario: Login fails with API validation errors (422)
- **WHEN** the API responds with status 422 (e.g. missing or malformed field)
- **THEN** the errors from the `errors` object of the response are displayed inline under the corresponding fields
- **AND** the user stays on the `/login` page

#### Scenario: User navigates to registration from the login page
- **WHEN** the user clicks the link "Pas encore de compte ?"
- **THEN** the SPA navigates to `/register`

### Requirement: SPA sends the Sanctum token on every API request

The system SHALL configure a single Axios instance that automatically attaches the stored Sanctum token as `Authorization: Bearer <token>` on every request, and that redirects to `/login` when an authenticated request returns 401.

#### Scenario: Authenticated requests carry the Bearer token
- **WHEN** the SPA makes any request through the shared Axios instance while a token exists in `localStorage`
- **THEN** the request includes the header `Authorization: Bearer <token>`

#### Scenario: 401 response clears the session and redirects to login
- **WHEN** the API responds with status 401 to an authenticated request
- **THEN** the token and user data are removed from `localStorage`
- **AND** the user is redirected to `/login`

### Requirement: SPA exposes the current authentication state to components

The system SHALL expose the current user and login/logout operations through an auth context so that any component can read the authentication state and trigger login or logout.

#### Scenario: Auth state is available to all components
- **WHEN** any component consumes the auth context
- **THEN** it can read the current user (restored from `localStorage` after a page refresh)
- **AND** it can call the login and register operations, which update the stored token and user data

#### Scenario: Logout clears the session
- **WHEN** the user triggers logout
- **THEN** a POST request is sent to `/api/logout`
- **AND** the token and user data are removed from `localStorage`
- **AND** the user is redirected to `/login`
