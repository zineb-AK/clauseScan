## ADDED Requirements

### Requirement: User can navigate to the contract import page

The system SHALL provide a page at `/contracts/new` accessible from a "Nouveau contrat" link on the contracts list page (`/contracts`). The page SHALL be protected by authentication.

#### Scenario: Authenticated user sees the import page
- **WHEN** an authenticated user navigates to `/contracts/new`
- **THEN** the system SHALL display the contract import page with two tabs: "Fichier PDF" and "Texte"
- **AND** the "Fichier PDF" tab SHALL be selected by default

#### Scenario: Unauthenticated user is redirected
- **WHEN** an unauthenticated user navigates to `/contracts/new`
- **THEN** the system SHALL redirect to `/login`

#### Scenario: Contracts list page links to import
- **WHEN** the contracts list page (`/contracts`) is displayed
- **THEN** the system SHALL show a "Nouveau contrat" button or link pointing to `/contracts/new`

### Requirement: User can import a contract as PDF file

The system SHALL allow users to upload a PDF file via drag-and-drop zone or file picker. The form SHALL validate the file client-side before submitting.

#### Scenario: Successful PDF import via file picker
- **WHEN** the user clicks the drop zone, selects a valid PDF file (≤ 10 MB), and clicks "Importer"
- **THEN** the system SHALL submit a POST request to `/api/contracts` with the file as multipart/form-data field `contract`
- **AND** upon receiving a 201 response, the system SHALL redirect to `/contracts/{id}` where `id` is the created contract's ID

#### Scenario: Successful PDF import via drag-and-drop
- **WHEN** the user drags a valid PDF file (≤ 10 MB) onto the drop zone and releases it
- **THEN** the system SHALL display the file name as selected
- **AND** when the user clicks "Importer", the system SHALL submit and redirect as in the file picker scenario

#### Scenario: Drop zone visual feedback
- **WHEN** the user drags a file over the drop zone
- **THEN** the system SHALL visually highlight the drop zone (border color change, background tint)
- **AND** when the file is dragged away, the system SHALL revert the visual state

#### Scenario: Client-side file type validation
- **WHEN** the user selects or drops a non-PDF file
- **THEN** the system SHALL display an inline error: "Le contrat doit être au format PDF"
- **AND** the submit button SHALL remain disabled

#### Scenario: Client-side file size validation
- **WHEN** the user selects or drops a file larger than 10 MB
- **THEN** the system SHALL display an inline error: "Le contrat ne doit pas dépasser 10 Mo"
- **AND** the submit button SHALL remain disabled

#### Scenario: Server returns 422 for scanned PDF
- **WHEN** the user submits a valid PDF file that contains no extractable text (scanned document)
- **THEN** the system SHALL display the server error message near the drop zone: "Le PDF semble être scanné (aucun texte exploitable). Veuillez fournir un PDF contenant du texte sélectionnable."

#### Scenario: Server returns 422 for other validation errors
- **WHEN** the API returns a 422 with field-level errors
- **THEN** the system SHALL display each error message next to the corresponding form field

#### Scenario: Loading state during upload
- **WHEN** the form is submitting
- **THEN** the submit button SHALL show a loading spinner and SHALL be disabled
- **AND** the file input and textarea SHALL be disabled to prevent double submission

### Requirement: User can import a contract as raw text

The system SHALL allow users to paste or type contract text into a textarea. The form SHALL validate content client-side before submitting.

#### Scenario: Successful text import
- **WHEN** the user switches to the "Texte" tab, enters non-empty text (≤ 100 000 characters), and clicks "Importer"
- **THEN** the system SHALL submit a POST request to `/api/contracts` with `content` in the JSON body
- **AND** upon receiving a 201 response, the system SHALL redirect to `/contracts/{id}`

#### Scenario: Character count display
- **WHEN** the user types or pastes text into the textarea
- **THEN** the system SHALL display a live character count below the textarea (e.g., "1 234 / 100 000")
- **AND** the counter SHALL turn red when approaching or exceeding the limit

#### Scenario: Client-side empty content validation
- **WHEN** the textarea is empty or contains only whitespace and the user clicks "Importer"
- **THEN** the system SHALL display: "Le contenu ne doit pas être vide"
- **AND** the form SHALL NOT be submitted

#### Scenario: Client-side content length validation
- **WHEN** the text content exceeds 100 000 characters
- **THEN** the system SHALL display: "Le contenu ne doit pas dépasser 100 000 caractères"
- **AND** the submit button SHALL remain disabled

#### Scenario: Server returns 422 for text validation
- **WHEN** the API returns a 422 error for the `content` field
- **THEN** the system SHALL display the server error message below the textarea

### Requirement: Tab switching resets form state

The system SHALL reset form state when switching between PDF and text tabs to avoid stale data or validation errors from the other mode.

#### Scenario: Switching from PDF to text clears file selection
- **WHEN** the user has selected a PDF file, then clicks the "Texte" tab
- **THEN** the file selection SHALL be cleared
- **AND** any file-related validation errors SHALL be cleared

#### Scenario: Switching from text to PDF clears textarea
- **WHEN** the user has entered text, then clicks the "Fichier PDF" tab
- **THEN** the textarea content SHALL be cleared
- **AND** any text-related validation errors SHALL be cleared
