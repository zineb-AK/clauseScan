## 1. Validation & Form Request

- [x] 1.1 Update `StoreContractRequest` to add `content` validation: `string`, `min:1`, `max:100000`, `required_without:contract`, `prohibits:contract`
- [x] 1.2 Verify existing `contract` validation still works (file required_without:content, mimes:pdf, max:10240)

## 2. Controller Logic

- [x] 2.1 Update `ContractController@store` — branch on whether `content` or `contract` is present
- [x] 2.2 For `content` mode: derive title from first non-empty line (max 255 chars), set source_type="text", no file_path, raw_text from request
- [x] 2.3 For `contract` mode: keep existing behavior unchanged (PDF upload, Spatie extraction, file storage)

## 3. Tests

- [x] 3.1 Create test method for successful text import (201, source_type="text", title derived from content)
- [x] 3.2 Create test method for empty content (422, validation error on `content`)
- [x] 3.3 Create test method for content exceeding max length (422, validation error on `content`)
- [x] 3.4 Create test method for missing both fields (422, validation error)
- [x] 3.5 Create test method for both fields provided (422, validation error)

## 4. Finalize

- [x] 4.1 Run `vendor/bin/pint --format agent`
- [x] 4.2 Run all tests: `php artisan test --compact`
