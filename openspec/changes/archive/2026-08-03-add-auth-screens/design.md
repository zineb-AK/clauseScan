## Context

Le backend expose déjà les endpoints Sanctum (sans modification nécessaire) :

- `POST /api/register` → 201 `{data: {id, name, email, created_at}, token}`
- `POST /api/login` → 200 `{data: {...}, token}`
- `POST /api/logout` → 204 (protégé par `auth:sanctum`)
- `GET /api/user` → 200 `{data: {...}}` (protégé)

Les erreurs 422 suivent le format Laravel standard : `{message, errors: {field: [messages]}}`. Les 401 retournent `{message: "Identifiants invalides."}`.

La SPA React (Vite, `resources/js/`) n'a aujourd'hui qu'une landing page (`/`). Les dépendances présentes : `react`, `react-dom`, `react-router-dom` (v7), Tailwind 4. Manquent : `axios`, `react-hook-form`, `zod`, `@hookform/resolvers`.

## Goals / Non-Goals

**Goals:**

- Pages `/login` et `/register` fonctionnelles, branchées sur les endpoints existants.
- Gestion du token Sanctum côté client : Axios unique avec intercepteur Bearer, persistance `localStorage`, état d'auth partagé via un AuthContext.
- Validation client (React Hook Form + Zod) reflétant les règles backend, et affichage des erreurs 422 sous chaque champ.
- Redirection vers `/contracts` après connexion/inscription (page elle-même hors périmètre, routage créé).

**Non-Goals:**

- Ne modifie AUCUN code backend (routes, controllers, requests, resources, tests Pest).
- Pas de page `/contracts` (change séparé), pas de route protégée `<RequireAuth>` complète, pas de TanStack Query (sera ajouté avec les écrans data — les mutations d'auth utilisent Axios directement).
- Pas d'i18n (react-i18next) — textes en français codés en dur.

## Decisions

### D1. Instance Axios unique `src/lib/api.js`
`baseURL` = `import.meta.env.VITE_API_URL ?? '/api'`. Intercepteur de requête : injecte `Authorization: Bearer <token>` lu dans `localStorage` (pas de closure qui fige le token — lecture à chaque requête). Intercepteur de réponse :
- 401 → purge du storage + `window.location.href = '/login'` (via une fonction `handleUnauthorized` importée depuis `auth.js` pour éviter les cycles d'import).
- 422 → rejette l'erreur telle quelle pour que le formulaire affiche `error.response.data.errors`.

*Alternative écartée* : une instance par module — moins maintenable, intercepteurs dupliqués. Axios plutôt que `fetch` : conformité à l'architecture définie dans la charte frontend (intercepteurs, erreurs structurées `error.response`).

### D2. Service `src/lib/auth.js` + `AuthContext` (`src/features/auth/`)
Le service `auth.js` porte la logique pure (lecture/écriture `localStorage` sous clés `clausescan_token` / `clausescan_user`, `login()`, `register()`, `logout()`, `getStoredUser()`). Le `AuthProvider` (contexte React) initialise son état depuis `getStoredUser()` (survit au refresh) et expose `{user, login, register, logout}`. Les pages utilisent `useAuth()`.

*Alternative écartée* : uniquement un service sans contexte — les composants devraient re-synchroniser manuellement après login. Contexte nécessaire car l'état d'auth est consommé à plusieurs endroits (pages, futurs composants).

### D3. React Hook Form + Zod avec mapping des erreurs serveur
Schémas dans `src/features/auth/` :
- `registerSchema` : `name` (min 2), `email` (format email), `password` (min 8), `password_confirmation` (`.refine` égalité).
- `loginSchema` : `email` (format email), `password` (non vide).

Les messages Zod reflètent les règles des `RegisterRequest`/`LoginRequest` backend. Utilisation de `@hookform/resolvers/zod` et de `resolver` avec `errors` en mode `all`. En cas de 422, `setError` depuis `error.response.data.errors` (un message par champ). Le champ `password` backend renvoie l'erreur de confirmation sur `password` : le mapping client la place sur le champ correspondant du backend (`password`), mais Zod affiche déjà la non-correspondance sur `password_confirmation` côté client.

### D4. Routage React Router v7
Ajout dans `App.jsx` (ou `main.jsx`) des routes :
- `/` → LandingPage (inchangée)
- `/login` → `LoginPage`
- `/register` → `RegisterPage`
- `/contracts` → composant placeholder minimal « page à venir » (la vraie page arrive dans un autre change), pour que la redirection post-auth ait une cible.

`LoginPage` : si déjà authentifié (token présent), `Navigate` vers `/contracts` pour éviter de re-afficher le formulaire.

### D5. Dépendances
`npm install axios react-hook-form zod @hookform/resolvers`.

### D6. UI
Reprise du style Tailwind existant de la landing (fond sombre, accents indigo/violet). Composants de formulaire locaux aux pages (pas de bibliothèque UI). Boutons désactivés + état « Connexion…/Inscription… » pendant la requête. Lien « Pas encore de compte ? » (login → register) et « Déjà un compte ? » (register → login) via `Link` de react-router-dom.

## Risks / Trade-offs

- **[401 global sur les pages publiques]** L'intercepteur redirige vers `/login` sur tout 401 ; un 401 sur `/api/register` (email existant renverra 422, pas 401 — ok) est donc sans conséquence ; mais un futur endpoint public qui renverrait 401 ferait une boucle. → Mitigation : la redirection 401 est ignorée si l'URL courante est déjà `/login` ; cette logique restera volontairement simple (pas d'erreur sur un login déjà 401 géré par les formulaires).
- **[localStorage exposé au XSS]** Le token vit dans `localStorage`. → Accepté pour ce projet (chartre frontend), toutes les entrées sont échappées par React, aucune HTML injection.
- **[Cycle d'import api.js ↔ auth.js]** L'intercepteur 401 doit purger le storage ; `auth.js` utilise `api.js`, `api.js` importerait `auth.js`. → Mitigation : `api.js` expose `setUnauthorizedHandler(fn)` que `AuthProvider` enregistre, ou `auth.js` ne dépend pas de `api.js` (logout fait son appel Axios dans le contexte via l'instance). Décision retenue : `auth.js` ne fait pas d'appel réseau (logique pure + storage) ; les appels `POST /api/login|register|logout` se font dans le contexte (qui importe `api.js` et `auth.js`) — pas de cycle.
- **[Token mort / expiré]** Un token révoqué côté serveur → 401 → purge + redirection, comportement cohérent.
- **[API non démarrée]** Axios échoue en `ERR_NETWORK` sans réponse → message générique affiché dans le formulaire (« Service indisponible, réessayez. »), pas de crash.

## Migration Plan

1. `npm install axios react-hook-form zod @hookform/resolvers`.
2. Créer `src/lib/api.js`, `src/lib/auth.js`, `src/features/auth/AuthContext.jsx`.
3. Créer `src/pages/LoginPage.jsx`, `src/pages/RegisterPage.jsx`.
4. Router : routes `/login`, `/register`, `/contracts` (placeholder) + `AuthProvider` au-dessus de `App`.
5. Vérifier `VITE_API_URL` dans `.env` local (ex. `http://localhost:8000/api`).
6. Test manuel : inscription → redirection, connexion → redirection, 422 affichés, token dans `localStorage`.

Rollback : simple retrait des fichiers et des routes ; aucun changement backend ni base de données.

## Open Questions

- Aucune bloquante. La clé `localStorage` (`clausescan_token`) et l'URL de redirection (`/contracts`) sont des choix par défaut, ajustables pendant l'implémentation.
