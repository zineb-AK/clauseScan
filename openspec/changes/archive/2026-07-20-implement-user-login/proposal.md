## Why

US2 (Connexion) permet aux utilisateurs déjà inscrits de s'authentifier et d'obtenir un token Sanctum pour accéder aux endpoints protégés de l'API. Sans cette fonctionnalité, un utilisateur ne peut pas utiliser l'application après la création de son compte.

## What Changes

- Ajout de l'endpoint `POST /api/login` qui authentifie un utilisateur par email + mot de passe
- Retourne un token Sanctum (200) si les identifiants sont valides
- Retourne 401 avec un message générique si email ou mot de passe incorrect (sans préciser lequel)
- Retourne 422 si champs email ou password manquants
- Aucun changement de schéma BDD ni de modèle

## Capabilities

### New Capabilities
- `user-auth-login`: Authentification par email/mot de passe avec token Sanctum

### Modified Capabilities
- `user-auth-registration`: Aucun changement dans les requirements de registration. La spec existante mentionnait déjà la connexion dans son Purpose, mais les scenarios sont séparés.

## Impact

- **Controller** : `AuthController@login` (nouvelle méthode)
- **Form Request** : `LoginRequest` (validation)
- **API Resource** : `UserResource` (réutilisé, déjà existant)
- **Routes** : `POST /api/login`, publique (sans middleware)
- **Epic 1 (auth)** — User Story US2 couverte
- **Tests** : nouveau fichier de test pour le login
- **Authentification** : Laravel Sanctum, déjà en place via le register
