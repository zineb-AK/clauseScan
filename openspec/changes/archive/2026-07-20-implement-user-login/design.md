## Context

ClauseScan utilise déjà Laravel Sanctum pour l'authentification (Bearer token). Le `register` est implémenté. Le login doit suivre la même architecture : `LoginRequest` (Form Request), méthode dans `AuthController`, retour d'un token via `UserResource`.

## Goals / Non-Goals

**Goals:**
- Ajouter `POST /api/login` avec validation via Form Request
- Authentifier l'utilisateur par email + mot de passe
- Retourner un token Sanctum en 200
- Retourner 401 avec message générique si identifiants incorrects
- Retourner 422 si champs manquants

**Non-Goals:**
- Déconnexion (US3) — traité dans un change séparé
- Modification du modèle User ou de la BDD
- Rate limiting — pourrait être ajouté plus tard

## Decisions

1. **Validation via `LoginRequest`** : Cohérence avec `RegisterRequest`. Form Request dédié avec règles `required|email` pour email, `required|string` pour password.
2. **Vérification manuelle via `Hash::check()`** : On cherche l'utilisateur par email, puis on vérifie le mot de passe avec `Hash::check()`. Alternative avec `Auth::attempt()` rejetée car Sanctum ne gère pas les sessions — `Auth::attempt()` est conçu pour les sessions, pas pour les API tokens.
3. **Message d'erreur 401 générique** : `'Identifiants invalides.'` dans les deux cas (email inexistant ou mot de passe incorrect) — pas de fuite d'information.
4. **Token via `createToken('auth_token')`** : Même approche que le register, le client reçoit un `plainTextToken`.
5. **Réponse 200 avec `UserResource` + token** : Structure identique au register (sans les champs créés, juste le code HTTP diffère : 200 vs 201).

## Risks / Trade-offs

- [Recherche email] → Pas de timing attack mitigée au niveau applicatif. Acceptable à ce stade.
- [Message générique] → L'utilisateur ne sait pas si l'email existe. C'est le comportement souhaité (sécurité).
- [Rate limiting] → Pas implémenté. Un utilisateur pourrait bruteforcer. À prioriser si déploiement public.
