## Context

Actuellement, ClauseScan ne sert qu'une page Blade Laravel (`welcome`). Le frontend React n'existe pas. Toutes les fonctionnalités frontend (auth, contrats, analyses) dépendent d'une coquille applicative de base : routing, layout, composants UI, et client API.

## Goals / Non-Goals

**Goals:**
- Structure Vite + React dans `resources/js/` avec TypeScript
- React Router pour la navigation avec routes publiques/protégées
- Layout principal avec navigation (Contrats, Historique, déconnexion)
- Pages génériques : 404, erreur (403/500)
- Design system minimal : couleurs, typographie, Button, Input, Card, Badge
- Instance Axios avec intercepteurs 401/422/403
- Provider TanStack Query configuré
- Auth context React avec token localStorage + RequireAuth

**Non-Goals:**
- Pages métier (login, register, contracts list, analysis, history) — traitées dans des changes dédiés
- Tests frontend (Vitest) — dépend d'une config qui sera dans un change dédié
- i18n (react-i18next) — sera ajouté dans un change ultérieur
- Déploiement ou configuration Docker frontend

## Decisions

1. **TypeScript plutôt que JavaScript** — meilleure DX, détection d'erreurs à la compilation, contrat clair avec l'API Laravel. Le projet utilise PHP typé côté backend ; le frontend suit la même rigueur.

2. **React Router v7** — dernière version stable, compatible avec les projets de type SPA. Pas de loaders/actions (mode framework) car on est en SPA pure.

3. **Composants avec `forwardRef`** — Input et Button utilisent `forwardRef` pour l'intégration React Hook Form dans les changes futurs.

4. **Tailwind v4 `@theme`** — les tokens de couleur sont déclarés dans `app.css` via `@theme {}` pour rester cohérents avec la config existante.

5. **AuthContext avec `createContext`** — pas de bibliothèque externe (Zustand, Jotai) pour l'instant. Le state auth est simple et bien géré par le Context API. On migrera si le besoin de state global plus complexe apparaît.

6. **Instance Axios unique importée partout** — pas de duplication de config. L'intercepteur 401 déclenche `logout()` via un callback injecté depuis AuthContext (pattern observer pour éviter la dépendance circulaire).

7. **`<RequireAuth>` composé** — vérifie `isAuthenticated`, redirige vers `/login` si faux, rend `<Outlet />` si vrai.

8. **Dossiers `src/pages/` vs `src/features/`** — `pages/` pour les composants de page (un par route), `features/` pour la logique métier groupée par domaine. Les composants UI partagés vont dans `components/`.

## Risks / Trade-offs

- [Risk] **Dépendance circulaire Axios/AuthContext** → l'intercepteur 401 utilise un callback (`onUnauthorized`) injecté au moment du mount de l'App, pas une import directe du contexte.
- [Risk] **localStorage pour le token** → pas idéal en sécurité (XSS). Accepté car Sanctum est en mode Bearer token (pas cookie), et le projet est un exercice pédagogique. Mitigation : le token expire côté backend.
- [Trade-off] **Pas de Vitest dans ce change** → les tests frontend viendront dans un change dédié (config Vitest + React Testing Library). Ce change pose uniquement la coquille.
