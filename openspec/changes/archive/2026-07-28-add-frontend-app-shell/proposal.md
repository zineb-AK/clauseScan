## Why

Le frontend React de ClauseScan n'existe pas encore — seule une page Blade Laravel par défaut est servie. Aucune feature frontend (authentification, contrats, analyses) ne peut être développée sans une coquille applicative de base : routing, layout, composants UI réutilisables, et client API configuré. Ce change pose les fondations transverses nécessaires à toutes les US frontend.

## What Changes

- Scaffolding d'une SPA React avec Vite dans `resources/js/`
- Structure de dossiers : `src/pages`, `src/components`, `src/lib`, `src/features`
- React Router (v7) avec routes publiques (login, register), routes protégées (layout authentifié), page 404, page d'erreur générique (403/500)
- Layout principal avec navigation (Contrats, Historique, déconnexion) et sidebar/footer
- Design system minimal : palette de couleurs + typographie (Tailwind v4 tokens), composants de base (Button, Input, Card, Badge de statut/risque)
- Instance Axios (`src/lib/api.ts`) avec `baseURL` via `VITE_API_URL`, intercepteur Bearer token, et gestion globale 401/422/403
- Provider TanStack Query (`QueryClientProvider`) dans l'arbre React
- Auth context React (`src/features/auth/AuthContext.tsx`) avec stockage du token en mémoire + localStorage
- Composant `<RequireAuth>` pour les routes protégées
- Point d'entrée Blade unique (`resources/views/app.blade.php`) qui monte l'app React
- Mise à jour de `vite.config.js` pour React et du `package.json` avec les dépendances nécessaires

## Capabilities

### New Capabilities
- `app-shell`: Coquille applicative React — routing, layout, design system, client API, auth context, et pages génériques (404, erreur).

### Modified Capabilities

<!-- Aucune spec existante modifiée — il s'agit d'un pré-requis transverse. -->

## Impact

- **Dépendances npm ajoutées** : react, react-dom, react-router, @tanstack/react-query, axios, @vitejs/plugin-react
- **Fichiers modifiés** : `vite.config.js`, `package.json`, `resources/js/app.js` (devient point d'entrée React)
- **Nouveau fichier** : `resources/views/app.blade.php` (SPA mount point)
- **Nouveaux dossiers** : `resources/js/src/`
- **Architecture** : le frontend devient une SPA React. Le Blade `welcome` reste inchangé. Aucun changement backend, base de données, ou authentification API.
