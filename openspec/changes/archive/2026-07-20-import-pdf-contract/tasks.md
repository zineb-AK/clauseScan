## 1. Setup

- [x] 1.1 Install `spatie/pdf-to-text` via Composer
- [x] 1.2 Verify `pdftotext` is available (required by spatie/pdf-to-text)

## 2. Model & Migration

- [x] 2.1 Create `Contract` model with fillable fields, `ContractFactory`, and `contracts` migration (user_id FK, title, source_type, file_path nullable, raw_text, status with default "pending", timestamps)
- [x] 2.2 Run `php artisan migrate`

## 3. Policy

- [x] 3.1 Create `ContractPolicy` with `create` always true (any authenticated user can import), `view`/`delete` checking user_id ownership

## 4. API Endpoint

- [x] 4.1 Create `StoreContractRequest` with validation: `contract` required|file|mimes:pdf|max:10240
- [x] 4.2 Create `ContractResource` with fields: id, title, source_type, status, created_at
- [x] 4.3 Add `store()` method to `ContractController` — validate, store file, extract text via Spatie, check empty text, create Contract with user_id, return 201
- [x] 4.4 Register `POST /api/contracts` route with `auth:sanctum` middleware
- [x] 4.5 Register `ContractPolicy` in `AuthServiceProvider`

## 5. Tests

- [x] 5.1 Create `tests/Feature/Contract/ImportPdfTest.php` with Pest tests covering: successful import (201), unauthenticated (401), missing file (422), non-PDF file (422), oversized file (422)
- [x] 5.2 Use `Http::fake()` if needed, `Queue::fake()` if dispatching jobs

## 6. Finalize

- [x] 6.1 Run `vendor/bin/pint --dirty --format agent`
- [x] 6.2 Run `php artisan test --compact --filter=ImportPdfTest` to verify all tests pass
