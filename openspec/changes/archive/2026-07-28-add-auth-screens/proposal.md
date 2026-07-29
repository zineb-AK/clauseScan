## Why

Les pages d'inscription et de connexion sont les premières pages interactives de la SPA ClauseScan. Sans elles, un utilisateur ne peut ni créer de compte ni s'authentifier pour accéder aux fonctionnalités protégées (contrats, analyses). L'API backend existe déjà (`POST /api/register`, `POST /api/login`, `POST /api/logout`) — il reste à brancher les écrans React.

## What Changes

- Création de `resources/js/src/pages/LoginPage.tsx` : formulaire email/password, validation Zod, affichage des erreurs 422 champ par champ, appel à `AuthContext.login()` à la soumission, redirection vers `/contracts` après connexion réussie
- Création de `resources/js/src/pages/RegisterPage.tsx` : formulaire name/email/password/password_confirmation, validation Zod, appel à `POST /api/register`, puis connexion automatique et redirection vers `/contracts`
- Mise à jour de `App.tsx` pour rendre les pages réelles (plus les placeholder `<div>`)
- Ajout d'un lien "Déjà un compte ? / Pas de compte ?" entre les deux pages
- Installation de `react-hook-form` et `@hookform/resolvers` (Zod resolver)

## Capabilities

### New Capabilities
- `auth-screens`: Pages React d'inscription et de connexion avec formulaires React Hook Form + Zod, validation frontend, affichage des erreurs API, et redirection post-auth.

### Modified Capabilities

<!-- Aucune spec backend modifiée — le comportement API reste inchangé. -->

## Impact

- **Dépendances npm ajoutées** : `react-hook-form`, `@hookform/resolvers`
- **Fichiers créés** : `resources/js/src/pages/LoginPage.tsx`, `resources/js/src/pages/RegisterPage.tsx`
- **Fichiers modifiés** : `resources/js/src/App.tsx` (branchement des vraies pages)
- **Aucun changement backend** : les endpoints API existent déjà
