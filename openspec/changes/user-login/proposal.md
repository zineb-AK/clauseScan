## Why

ClauseScan nécessite un système d'authentification complet. Après l'inscription (US1), la connexion (US2) est la seconde pierre de l'épic authentification, permettant aux utilisateurs de s'authentifier et d'obtenir un token Sanctum pour accéder aux endpoints protégés.

## What Changes

- Ajout de l'endpoint `POST /api/login` pour la connexion utilisateur
- Validation des champs : email et password requis
- Vérification des identifiants (email + mot de passe hashé)
- Retour du token Sanctum en 200 si valide
- Retour d'une erreur 401 avec message générique si identifiants incorrects
- Retour d'une erreur 422 si champs manquants

## Capabilities

### New Capabilities

- `user-auth-login`: Connexion utilisateur avec vérification des identifiants et émission de token Sanctum

### Modified Capabilities

- Aucune modification de capacités existantes

## Impact

- **Endpoints**: Ajout `POST /api/login` (route publique, pas de middleware auth)
- **Modèles**: Utilisation du modèle `User` existant (pas de modification)
- **Base de données**: Aucun changement de schéma
- **Dépendances**: Aucune nouvelle dépendance (Sanctum déjà installé)
- **Isolation des données**: Non applicable (endpoint public)
- **Traitement asynchrone**: Non nécessaire (opération synchrone)
