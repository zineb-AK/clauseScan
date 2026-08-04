## ADDED Requirements

### Requirement: User can access the contract import page

The system SHALL provide a page at `/contracts/new` allowing an authenticated user to import a contract either by uploading a PDF file or by pasting raw text. The page SHALL be accessible only to authenticated users.

#### Scenario: Access while authenticated
- **WHEN** an authenticated user navigates to `/contracts/new`
- **THEN** the system renders the import page showing two input modes (PDF and text)

#### Scenario: Access while unauthenticated
- **WHEN** an unauthenticated user navigates to `/contracts/new`
- **THEN** the system redirects the user to `/login`

### Requirement: User can switch between PDF and text input modes

The system SHALL present two mutually exclusive input modes: a PDF upload mode and a raw text mode. Switching modes SHALL clear the other mode's input.

#### Scenario: Switch from PDF to text
- **WHEN** the user selects the "text" mode while a file is selected in PDF mode
- **THEN** the PDF file selection is cleared
- **AND** the system displays the textarea for raw text input

#### Scenario: Switch from text to PDF
- **WHEN** the user selects the "PDF" mode while text has been typed
- **THEN** the textarea content is cleared
- **AND** the system displays the file drop zone

### Requirement: User can import a contract as a PDF file

The system SHALL allow the user to select a PDF file either by clicking the drop zone or by dragging and dropping a file onto it. The system SHALL accept only PDF files of 10 MB or less, SHALL display a progress indicator during upload, and SHALL submit the file to `POST /api/contracts` under the `contract` field.

#### Scenario: Successful PDF import
- **WHEN** the user selects or drops a valid PDF file ≤ 10 MB
- **AND** the user submits the form
- **THEN** the system sends a `multipart/form-data` POST request to `/api/contracts` containing the `contract` field
- **AND** the system displays a progress indicator during the upload
- **AND** on a 201 response with `{ "data": { "id", "title", "source_type": "pdf", "status", "created_at" } }` the system redirects to the created contract's detail page

#### Scenario: Import fails when unauthenticated
- **WHEN** an unauthenticated user submits a PDF
- **THEN** the API returns 401
- **AND** the system clears the session and redirects to `/login`

#### Scenario: Import fails with a non-PDF file
- **WHEN** the user selects a file that is not a PDF (e.g., .docx, .png)
- **THEN** the system shows a client-side error message and does not send the request

#### Scenario: Import fails with an oversized file
- **WHEN** the user selects a PDF file larger than 10 MB
- **THEN** the system shows a client-side error message ("Le contrat ne doit pas dépasser 10 Mo") and does not send the request

#### Scenario: Import succeeds but PDF contains no extractable text
- **WHEN** the user submits a valid PDF of 10 MB or less
- **AND** the server cannot extract any text (scanned document)
- **THEN** the system shows the server message ("Le PDF semble être scanné...") in an error banner
- **AND** the contract is not created and the user remains on the import page

### Requirement: User can import a contract as raw text

The system SHALL allow the user to paste the contract's raw text in a textarea, SHALL display a character counter, and SHALL reject empty or excessively long content.

#### Scenario: Successful text import
- **WHEN** the user enters non-empty text of ≤ 100 000 characters and submits
- **THEN** the system sends the text to `POST /api/contracts` under the `content` field
- **AND** on a 201 response the system redirects to the contract detail page

#### Scenario: Import fails with empty content
- **WHEN** the user submits with no text or whitespace-only content
- **THEN** the system shows the client-side error "Le contenu ne doit pas être vide"
- **AND** does not send the request

#### Scenario: Import fails with excessively long content
- **WHEN** the user submits content exceeding 100 000 characters
- **THEN** the system blocks submission and shows an error indicating the 100 000 character limit
- **AND** the character counter is displayed (max 100 000)

#### Scenario: Import fails when unauthenticated
- **WHEN** an unauthenticated user submits raw text
- **THEN** the API returns 401
- **AND** the system clears the session and redirects to `/login`

### Requirement: User sees server-side validation errors

The system SHALL display server-side validation errors from a 422 response under the relevant field (`errors.contract` / `errors.content`) and any global `message` (e.g., scanned PDF) as a banner above the form.

#### Scenario: Field error under the contract field
- **WHEN** the server returns `{ "errors": { "contract": ["Le contrat doit être au format PDF."] } }`
- **THEN** the error is displayed under the file input

#### Scenario: Global server error message
- **WHEN** the server returns a `message` without `errors` (e.g., scanned PDF)
- **THEN** the message is displayed in an error banner above the form

### Requirement: User sees upload progress

The system SHALL show a percentage progress indicator during the PDF upload and disable the submit button while a request is in flight.

#### Scenario: Progress indicator shown during upload
- **WHEN** a PDF upload is in progress
- **THEN** the form displays a progress bar reflecting the uploaded percentage

#### Scenario: Submit button disabled during submission
- **WHEN** the form is being submitted
- **THEN** the submit button is disabled and subsequent clicks are ignored

### Requirement: User is redirected to the created contract detail page

The system SHALL redirect to `/contracts/:id` after a successful import and SHALL display the contract data from the 201 response via `ContractResource` (`id`, `title`, `source_type`, `status`, `created_at`).

#### Scenario: Successful import navigates to detail
- **WHEN** the API returns a 201 response with contract data
- **THEN** the system navigates to `/contracts/{id}` with the contract data passed in navigation state
- **AND** the detail page shows the title, source type, status and creation date

#### Scenario: Detail page with no navigation state
- **WHEN** the user opens `/contracts/{id}` directly (page refresh, no navigation state)
- **THEN** the system displays a "contract not found" state with a link back to the contracts list