## 1. LoginRequest (Form Request)

- [x] 1.1 Create `app/Http/Requests/LoginRequest.php` with validation rules: `email` required|email, `password` required|string

## 2. Controller & Route

- [x] 2.1 Add `login()` method to `AuthController` — find user by email, verify with `Hash::check()`, create Sanctum token, return 200 with `UserResource` + token
- [x] 2.2 Return 401 with generic message `'Identifiants invalides.'` when credentials are wrong
- [x] 2.3 Register route `POST /api/login` in `routes/api.php`

## 3. Tests

- [x] 3.1 Create `tests/Feature/Auth/LoginTest.php` with Pest tests covering: successful login (200), missing email (422), missing password (422), both missing (422), invalid email format (422), non-existent email (401), wrong password (401)

## 4. Finalize

- [x] 4.1 Run `vendor/bin/pint --dirty --format agent`
- [x] 4.2 Run `php artisan test --compact --filter=LoginTest` to verify all tests pass
