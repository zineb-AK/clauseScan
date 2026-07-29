## Why

US3 (Déconnexion) est décrite dans les specs mais le bouton de déconnexion dans la navigation n'est pas encore implémenté côté frontend. L'utilisateur doit pouvoir cliquer sur "Déconnexion" pour révoquer son token Sanctum, être redirigé vers `/login`, et voir ses données locales nettoyées. La gestion globale des 401 interceptés doit aussi déclencher la même déconnexion propre.

## What Changes

- Ajout du bouton "Déconnexion" dans la barre de navigation du layout protégé (`AppLayout`)
- Implémentation de `AuthContext.logout()` : appel POST /api/logout → purge du token localStorage + reset du contexte React → redirection `/login`
- Intercepteur 401 dans l'instance Axios (`api.ts`) : purge automatique + redirection vers `/login`
- Aucun changement backend nécessaire — le endpoint POST /api/logout et la révocation du token Sanctum existent déjà

## Capabilities

### New Capabilities
- `auth-logout-ui`: Interface de déconnexion : bouton dans la navigation, logique de déconnexion (appel API + purge locale + redirection), et interception 401 globale

### Modified Capabilities
- `app-shell`: Le layout principal reçoit le bouton de déconnexion et l'instance Axios intègre l'intercepteur 401
- `auth-screens`: Le contexte d'authentification expose la méthode `logout()`

## Impact

- **Frontend** : `src/components/layout/AppLayout.tsx` — ajout du bouton Déconnexion ; `src/features/auth/AuthContext.tsx` — implémentation de `logout()` ; `src/lib/api.ts` — intercepteur 401
- **Backend** : aucun changement (endpoint existant)
- **Base de données** : aucune migration
