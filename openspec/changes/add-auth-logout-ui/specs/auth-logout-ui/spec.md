## ADDED Requirements

### Requirement: Logout button in navigation header

The application SHALL display a "Déconnexion" button in the navigation header of all protected pages.

#### Scenario: Logout button visible when authenticated
- **WHEN** a user is authenticated and views any protected page
- **THEN** the header displays a "Déconnexion" button

#### Scenario: Logout button hidden when not authenticated
- **WHEN** a user is not authenticated and views a public page (e.g., /login)
- **THEN** the header does not display the "Déconnexion" button

### Requirement: Logout via API call

Clicking "Déconnexion" SHALL send a POST request to /api/logout with the current Bearer token and revoke the token on success.

#### Scenario: Successful logout
- **WHEN** the user clicks "Déconnexion"
- **THEN** a POST request is sent to /api/logout
- **AND** the token is revoked server-side
- **AND** the token is removed from localStorage
- **AND** the auth context user/token state is cleared
- **AND** the user is redirected to /login

#### Scenario: Logout API fails (network error)
- **WHEN** the user clicks "Déconnexion" and the API call fails
- **THEN** the token is still removed from localStorage
- **AND** the auth context state is still cleared
- **AND** the user is redirected to /login
- **AND** no error is shown to the user

### Requirement: Automatic logout on 401 interception

When any API call returns a 401 Unauthorized response, the system SHALL automatically clear local auth state and redirect to /login.

#### Scenario: 401 on any protected endpoint
- **WHEN** the application receives a 401 response from any API call
- **THEN** the auth token is removed from localStorage
- **AND** the auth context state is cleared
- **AND** the user is redirected to /login
