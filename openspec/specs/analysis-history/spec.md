## Purpose

Consultation de l'historique des analyses de l'utilisateur connecté (US13). Endpoint paginé listant les analyses avec tri chronologique décroissant et réponse allégée.

## Requirements

### Requirement: User can view paginated analysis history

The system SHALL expose a `GET /api/analyses` endpoint, protected by `auth:sanctum`. The response SHALL return a paginated list of analyses belonging exclusively to the authenticated user, sorted by `created_at` descending, using a lightweight `AnalysisResource` containing `id`, `contract_title`, `status`, and `created_at`.

#### Scenario: Authenticated user retrieves their analysis list
- **GIVEN** an authenticated user who owns multiple contracts with analyses
- **WHEN** sending a `GET` request to `/api/analyses`
- **THEN** the response status is `200`
- **AND** the response body contains a paginated list with `data` array, `meta` (current_page, last_page, per_page, total)
- **AND** each item in `data` includes `id`, `contract_title`, `status`, `created_at`
- **AND** results are sorted by `created_at` descending

#### Scenario: Unauthenticated user cannot view analysis list
- **GIVEN** no authenticated user
- **WHEN** sending a `GET` request to `/api/analyses`
- **THEN** the response status is `401`

#### Scenario: Authenticated user with no analyses gets empty list
- **GIVEN** an authenticated user who has no contracts or analyses
- **WHEN** sending a `GET` request to `/api/analyses`
- **THEN** the response status is `200`
- **AND** the `data` array is empty

#### Scenario: User only sees their own analyses (not others')
- **GIVEN** an authenticated user and another user who owns analyses
- **WHEN** sending a `GET` request to `/api/analyses`
- **THEN** the response only includes analyses belonging to the authenticated user
- **AND** the response does NOT include analyses belonging to other users

#### Scenario: Pagination respects per_page parameter
- **GIVEN** an authenticated user with more than 15 analyses
- **WHEN** sending a `GET` request to `/api/analyses?per_page=5`
- **THEN** the response status is `200`
- **AND** the response contains at most 5 items in `data`
- **AND** `meta.per_page` equals `5`
