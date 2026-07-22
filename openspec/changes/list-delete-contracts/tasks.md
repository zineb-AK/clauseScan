## 1. Controller — Index

- [x] 1.1 Add `index()` method to `ContractController` that returns paginated contracts of authenticated user, ordered by `created_at DESC`
- [x] 1.2 Write Pest test for listing contracts: success (200), unauthenticated (401), empty list, only own contracts returned

## 2. Controller — Destroy

- [x] 2.1 Add `destroy()` method to `ContractController` that authorizes via `ContractPolicy::delete`, deletes the PDF file if source_type is `pdf`, then deletes the contract model and returns 204
- [x] 2.2 Write Pest test for deleting contracts: success (204), unauthenticated (401), other user's contract (403), non-existent contract (404), PDF file cleanup

## 3. Routes

- [x] 3.1 Update `routes/api.php` to add `index` and `destroy` to the `apiResource` contracts route group

## 4. Finalize

- [x] 4.1 Run `vendor/bin/pint --format agent` for code style
- [x] 4.2 Run full test suite and confirm all tests pass
