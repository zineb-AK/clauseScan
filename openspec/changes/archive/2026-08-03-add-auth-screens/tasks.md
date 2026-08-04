## 1. Setup frontend

- [x] 1.1 Install dependencies : `npm install axios react-hook-form zod @hookform/resolvers`
- [x] 1.2 Ajouter `VITE_API_URL` au fichier `.env` local du frontend (ex. `http://localhost:8000/api`) et documenter dans le README (section frontend)
- [x] 1.3 Ajouter la config Vitest + React Testing Library (deps dev `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) et le script `test` dans `package.json`

## 2. Client API et service d'auth

- [x] 2.1 Créer `resources/js/src/lib/api.js` : instance Axios avec `baseURL` depuis `VITE_API_URL`, intercepteur de requête injectant `Authorization: Bearer <token>` (lecture de `localStorage` à chaque requête), intercepteur de réponse 401 (purge + redirection `/login`, ignorée si déjà sur `/login`) et 422 (laisse remonter `error.response.data.errors`)
- [x] 2.2 Créer `resources/js/src/lib/auth.js` : logique pure de lecture/écriture du storage (clés `clausescan_token`, `clausescan_user`), `getStoredUser()`, `setSession()`, `clearSession()` — aucun appel réseau
- [x] 2.3 Créer `resources/js/src/features/auth/AuthContext.jsx` : `AuthProvider` (état `user` initialisé via `getStoredUser()`), expose `useAuth()` avec `{user, login, register, logout}` ; `login`/`register` appellent `POST /api/login` / `POST /api/register` via `api.js`, stockent la session et mettent à jour l'état ; `logout` appelle `POST /api/logout`, purge le storage et redirige vers `/login`

## 3. Écrans de connexion et d'inscription

- [x] 3.1 Créer `resources/js/src/features/auth/schemas.js` : `loginSchema` (email format, password non vide) et `registerSchema` (name min 2, email format, password min 8, password_confirmation égale au password) avec messages reflétant les règles backend
- [x] 3.2 Créer `resources/js/src/pages/LoginPage.jsx` : formulaire React Hook Form + Zod (email, password), affichage des erreurs 422 sous chaque champ (`setError` depuis `error.response.data.errors`), message générique « Identifiants invalides. » sur 401, état de chargement, lien « Pas encore de compte ? » → `/register`, redirection vers `/contracts` si déjà authentifié
- [x] 3.3 Créer `resources/js/src/pages/RegisterPage.jsx` : formulaire React Hook Form + Zod (name, email, password, password_confirmation), affichage des erreurs 422 sous chaque champ, état de chargement, lien « Déjà un compte ? » → `/login`, redirection vers `/contracts` si déjà authentifié
- [x] 3.4 Brancher le routage : `AuthProvider` au-dessus du routeur, routes `/login`, `/register`, `/contracts` (placeholder « page à venir ») dans `App.jsx`, landing `/` inchangée
- [ ] 3.5 Vérifier visuellement : `npm run dev`, test manuel inscription → redirection `/contracts`, connexion → redirection, 422 affichés sous les champs, token présent dans `localStorage`

## 4. Tests frontend (Vitest + React Testing Library)

- [x] 4.1 Tests unitaires de `src/lib/auth.js` : `setSession`/`clearSession`/`getStoredUser` (persistance et restauration, y compris après refresh simulé)
- [x] 4.2 Tests unitaires des schémas Zod : validation client du register (password court, confirmation différente, email invalide) et du login (champs manquants)
- [x] 4.3 Tests `LoginPage` : rendu du formulaire, erreurs client affichées sous les champs, 422 API affichés sous les champs (mock Axios via `vi.mock`), 401 → message générique, succès → token stocké + redirection vers `/contracts`
- [x] 4.4 Tests `RegisterPage` : rendu du formulaire, erreurs client affichées, 422 API affichés (mock Axios), succès → token stocké + redirection vers `/contracts`
- [x] 4.5 Test de l'intercepteur API : une requête part avec le header `Authorization: Bearer <token>` quand un token est en storage, et une réponse 401 purge le storage (mock Axios)

## 5. Qualité et finition

- [x] 5.1 Mettre à jour le README : section frontend (écrans `/login` et `/register`, variable `VITE_API_URL`, clés `localStorage`)
- [x] 5.2 Vérifier le passage des tests frontend : `npm run test -- --run`
- [x] 5.3 Vérifier le build frontend : `npm run build`
