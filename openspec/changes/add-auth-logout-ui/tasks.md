## 1. Frontend — AuthContext logout

- [x] 1.1 Implement `logout()` method in `AuthContext.tsx`: POST /api/logout with current token, then clear token + user from state and localStorage, navigate to /login
- [x] 1.2 Handle API failure gracefully in `logout()`: catch errors, still clear local state and redirect

## 2. Frontend — Axios 401 interceptor

- [x] 2.1 Add response interceptor in `src/lib/api.ts` that catches 401 responses, clears localStorage, and calls an `onUnauthorized` callback
- [x] 2.2 Register `setOnUnauthorized` in `AuthContext` on mount to redirect to /login when 401 is intercepted

## 3. Frontend — Layout logout button

- [x] 3.1 Add "Déconnexion" button in `AppLayout.tsx` header, wired to `useAuth().logout()`
- [x] 3.2 Ensure the button is only visible when user is authenticated (protected routes only)

## 4. Tests

- [x] 4.1 Write Vitest + React Testing Library tests for AuthContext.logout() (successful call, API failure, state cleanup)
- [x] 4.2 Write Vitest test for Axios 401 interceptor (token cleared, redirect triggered)
- [x] 4.3 Write Vitest test for AppLayout logout button (renders when authenticated, calls logout on click)

## 5. Quality

- [x] 5.1 Run `vendor/bin/pint --dirty --format agent`
- [x] 5.2 Run full test suite (`php artisan test --compact` + frontend tests) to verify nothing is broken
