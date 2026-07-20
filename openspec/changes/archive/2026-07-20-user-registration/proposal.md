## Why

ClauseScan nécessite un système d'authentification pour permettre aux utilisateurs de gérer leurs contrats et analyses. L'inscription (US1) est la première pierre de l'épic authentification, permettant la création de compte avec retour d'un token Sanctum pour accéder aux endpoints protégés.

## What Changes

- Ajout de l'endpoint `POST /api/register` pour la création de compte utilisateur
- Validation des champs : name, email (unique), password (confirmé, min 8 caractères)
- Retour de l'utilisateur créé + token Sanctum en 201
- Hachage automatique du mot de passe via le cast bcrypt du modèle User

## Capabilities

### New Capabilities

- `user-auth-registration`: Inscription utilisateur avec validation, création de compte et émission de token Sanctum

### Modified Capabilities

- Aucune modification de capacités existantes

## Impact

- **Endpoints**: Ajout `POST /api/register` (route publique, pas de middleware auth)
- **Modèles**: Utilisation du modèle `User` existant (ajout du trait `HasApiTokens` pour Sanctum)
- **Base de données**: Aucun changement de schéma (table `users` déjà existante)
- **Dépendances**: Aucune nouvelle dépendance (Sanctum déjà installé)
- **Isolation des données**: Non applicable (endpoint public)
- **Traitement asynchrone**: Non nécessaire (opération synchrone)
