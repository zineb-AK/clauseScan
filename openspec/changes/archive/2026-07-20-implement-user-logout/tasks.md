## 1. Controller & Route

- [x] 1.1 Add `logout()` method to `AuthController` — revoke current token via `$request->user()->currentAccessToken()->delete()`, return 204
- [x] 1.2 Register route `POST /api/logout` in `routes/api.php` with middleware `auth:sanctum`

## 2. Tests

- [x] 2.1 Create `tests/Feature/Auth/LogoutTest.php` with Pest tests covering: successful logout (204), unauthenticated (401)

## 3. Finalize

- [x] 3.1 Run `vendor/bin/pint --dirty --format agent`
- [x] 3.2 Run `php artisan test --compact --filter=LogoutTest` to verify all tests pass
