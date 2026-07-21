## Context

Sanctum gère les tokens d'API. Le register et le login créent des tokens avec `createToken()`. La déconnexion consiste à révoquer le token courant via `$request->user()->currentAccessToken()->delete()`. L'endpoint doit être protégé par `auth:sanctum`.

## Goals / Non-Goals

**Goals:**
- Ajouter `POST /api/logout`, protégé par `auth:sanctum`
- Révoquer le token Sanctum courant
- Retourner 204 avec corps vide
- Retourner 401 si non authentifié

**Non-Goals:**
- Révoquer tous les tokens de l'utilisateur (seulement le token courant)
- Gérer la déconnexion depuis plusieurs appareils simultanément
- Modification du modèle User ou de la BDD

## Decisions

1. **`currentAccessToken()->delete()`** : Méthode native Sanctum pour révoquer le token de la requête courante. Alternative (supprimer tous les tokens) rejetée car trop large.
2. **Aucun Form Request** : L'endpoint ne prend pas de paramètres, la seule validation est l'authentification via le middleware `auth:sanctum`.
3. **Réponse 204** : Code standard pour une suppression réussie (le token est supprimé). Corps vide, pas de message.
4. **Route protégée** : Utilisation du middleware `auth:sanctum` — si non authentifié, Sanctum retourne 401 automatiquement.

## Risks / Trade-offs

- [Token révoqué mais côté client conservé] → Le client doit oublier le token après le 204. C'est la responsabilité du frontend.
- [Aucune confirmation] → 204 sans corps. Si un message de confirmation est nécessaire plus tard, passer à 200.
