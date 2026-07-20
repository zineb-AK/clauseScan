## Context

ClauseScan est une API REST Laravel qui analyse des contrats via l'IA. Le système d'authentification est nécessaire pour protéger les endpoints et isoler les données par utilisateur. La connexion (US2) est le second endpoint de l'épic authentification, permettant aux utilisateurs de s'authentifier.

État actuel :
- Modèle `User` existant avec cast `password` (bcrypt automatique)
- Migration `users` existante
- Sanctum installé avec le trait `HasApiTokens` sur le modèle User
- Controller `AuthController` existant avec la méthode `register()`
- Form Request `RegisterRequest` existante pour l'inscription

## Goals / Non-Goals

**Goals:**
- Créer un endpoint `POST /api/login` fonctionnel et sécurisé
- Valider les entrées via un Form Request dédié
- Vérifier les identifiants et retourner un token Sanctum
- Retourner un message générique en cas d'échec (pas de fuite d'information)
- Suivre les conventions du projet

**Non-Goals:**
- Déconnexion (US3) - fera l'objet d'un changement séparé
- Réinitialisation de mot de passe - hors périmètre initial
- Authentification sociale (Google, GitHub) - hors périmètre
- Double authentification (2FA) - hors périmètre

## Decisions

### 1. Utiliser un Form Request pour la validation

**Décision**: Créer `LoginRequest` pour valider les entrées.

**Pourquoi**: Suit les conventions du projet. Permet de réutiliser la validation et de garder le controller fin.

**Alternative considérée**: Validation inline dans le controller → Rejeté car contraire aux conventions.

### 2. Message générique en cas d'échec

**Décision**: Retourner "These credentials do not match our records." que l'email ou le mot de passe soit incorrect.

**Pourquoi**: Sécurité - empêche l'énumération d'utilisateurs. Un attaquant ne peut pas déterminer si un email existe dans le système.

**Alternative considérée**: Messages spécifiques ("Email not found", "Wrong password") → Rejeté car expose l'existence d'utilisateurs.

### 3. Utiliser Auth::attempt() de Laravel

**Décision**: Utiliser `Auth::attempt($credentials)` pour vérifier les identifiants.

**Pourquoi**: Méthode native de Laravel qui gère automatiquement le hachage et la vérification. Plus sécurisé que de comparer manuellement les mots de passe.

**Alternative considérée**: Vérification manuelle avec Hash::check() → Rejeté car Auth::attempt() est plus complet et gère la session.

### 4. Retourner le token dans la réponse

**Décision**: Inclure le token dans la réponse JSON.

**Pourquoi**: Le frontend a besoin du token immédiatement après la connexion pour authentifier les requêtes suivantes.

**Alternative considérée**: Envoyer le token uniquement dans un header → Rejeté car moins pratique pour le frontend.

## Risks / Trade-offs

- **[Risk]** Brute force sur l'endpoint login → **Mitigation**: Rate limiting à implémenter (hors périmètre de ce change)
- **[Risk]** Token exposé dans la réponse → **Mitigation**: Token utilisé uniquement côté client, jamais logué côté serveur

## Files

- `app/Http/Controllers/AuthController.php` - Ajout de la méthode `login()`
- `app/Http/Requests/LoginRequest.php` - Form Request pour la validation
- `routes/api.php` - Ajout de la route `POST /api/login`
