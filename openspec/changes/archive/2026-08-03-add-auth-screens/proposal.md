## Why

Le backend Laravel expose déjà les endpoints Sanctum `/api/register`, `/api/login` et `/api/logout` (Epic 1 — US1, US2, US3), mais la SPA React ne propose encore qu'une landing page statique. Sans écrans d'inscription et de connexion, un utilisateur ne peut ni créer de compte ni récupérer son token Sanctum pour accéder aux fonctionnalités protégées (import de contrat, analyse IA). Il faut donc construire les écrans `/login` et `/register` et la gestion du token côté client.

## What Changes

- Création des pages React `LoginPage` (`/login`) et `RegisterPage` (`/register`) branchées sur les routes API existantes `POST /api/login` et `POST /api/register`.
- Ajout des dépendances frontend : `axios`, `react-hook-form`, `zod`, `@hookform/resolvers`.
- Création de l'instance Axios `src/lib/api.js` (baseURL via `VITE_API_URL`, intercepteur Bearer token, gestion globale 401/422).
- Ajout du service `src/lib/auth.js` (ou contexte) pour stocker le token Sanctum dans `localStorage` et exposer l'utilisateur courant.
- Formulaires avec React Hook Form + Zod : messages d'erreur sous chaque champ, y compris les erreurs de validation 422 renvoyées par l'API.
- Redirection vers `/contracts` après connexion ou inscription réussie (la page `/contracts` reste à créer dans un change ultérieur — le routage y pointera dès maintenant).
- Liens croisés entre les deux écrans : « Déjà un compte ? » et « Pas encore de compte ? ».

## Capabilities

### New Capabilities

- `auth-screens`: écrans d'inscription et de connexion React, gestion du token Sanctum côté client (axios, localStorage, AuthContext).

### Modified Capabilities

<!-- Aucun changement de comportement backend : les endpoints, validations et formats de réponse existants (user-auth-login, user-auth-registration) ne sont pas modifiés. -->

## Impact

- **Frontend** : `resources/js/` — nouvelles pages, librairie API, service auth, routage React Router (routes `/login`, `/register`), dépendances `package.json`.
- **Aucun impact backend** : pas de nouvelle route, pas de migration, pas de modification des policies existantes (`User` n'a pas de policy dédiée).
- **Aucun traitement asynchrone** : inscription et connexion sont des appels synchrones.
- **Brique concernée** : authentification Sanctum côté client uniquement (ni extraction PDF, ni analyse IA, ni RAG).
- **Variables d'environnement** : `VITE_API_URL` ajoutée au frontend (fichier `.env` local).
- **Documentation** : mise à jour README (section frontend) si nécessaire.
