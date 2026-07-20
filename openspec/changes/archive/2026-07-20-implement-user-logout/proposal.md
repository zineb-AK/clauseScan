## Why

US3 (Déconnexion) permet aux utilisateurs connectés de révoquer leur token Sanctum courant pour sécuriser leur session. Sans cette fonctionnalité, un token ne peut pas être invalidé, ce qui pose un risque de sécurité si le token est compromis ou si l'utilisateur souhaite se déconnecter.

## What Changes

- Ajout de l'endpoint `POST /api/logout`, protégé par `auth:sanctum`
- Révoque le token Sanctum courant de l'utilisateur connecté
- Retourne 204 en cas de succès
- Retourne 401 si non authentifié
- Aucun changement de schéma BDD ni de modèle

## Capabilities

### New Capabilities
- `user-auth-logout`: Révocation du token Sanctum courant pour déconnecter l'utilisateur

### Modified Capabilities

- *(none)*

## Impact

- **Controller** : `AuthController@logout` (nouvelle méthode)
- **Route** : `POST /api/logout`, protégée par middleware `auth:sanctum`
- **Epic 1 (auth)** — User Story US3 couverte
- **Tests** : nouveau fichier de test pour le logout
- **Aucun changement** : modèle User, base de données, dépendances
