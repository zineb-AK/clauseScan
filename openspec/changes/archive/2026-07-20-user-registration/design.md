## Context

ClauseScan est une API REST Laravel qui analyse des contrats via l'IA. Le système d'authentification est nécessaire pour protéger les endpoints et isoler les données par utilisateur. L'inscription (US1) est le premier endpoint de l'épic authentification.

État actuel :
- Modèle `User` existant avec cast `password` (bcrypt automatique)
- Migration `users` existante avec colonnes id, name, email, password, etc.
- Sanctum installé mais le modèle User n'a pas le trait `HasApiTokens`
- Aucun controller, Form Request ou API Resource pour l'authentification

## Goals / Non-Goals

**Goals:**
- Créer un endpoint `POST /api/register` fonctionnel et sécurisé
- Valider les entrées via un Form Request dédié
- Retourner une réponse JSON structurée avec l'utilisateur et le token
- Suivre les conventions du projet (Controllers fins, Form Requests, API Resources)

**Non-Goals:**
- Connexion (US2) - fera l'objet d'un changement séparé
- Déconnexion (US3) - fera l'objet d'un changement séparé
- Vérification d'email - hors périmètre initial
- Reset de mot de passe - hors périmètre initial

## Decisions

### 1. Utiliser un Form Request pour la validation

**Décision**: Créer `RegisterRequest` pour valider les entrées.

**Pourquoi**: Suit les conventions du projet (jamais de `$request->validate()` inline). Permet de réutiliser la validation et de garder le controller fin.

**Alternative considérée**: Validation inline dans le controller → Rejeté car contraire aux conventions.

### 2. Utiliser un API Resource pour la réponse

**Décision**: Créer `UserResource` pour formater la réponse JSON.

**Pourquoi**: Suit les conventions du projet (jamais de retour de modèle brut). Permet d'isoler la structure de réponse du modèle de données.

**Alternative considérée**: Retourner le modèle directement → Rejeté car contraire aux conventions.

### 3. Ajouter le trait HasApiTokens au modèle User

**Décision**: Modifier `app/Models/User.php` pour ajouter `use HasApiTokens`.

**Pourquoi**: Nécessaire pour que le modèle puisse créer des tokens Sanctum via `$user->createToken()`.

**Alternative considérée**: Utiliser un service dédié → Rejeté car trop complexe pour ce besoin simple.

### 4. Retourner le token dans la réponse

**Décision**: Inclure le token dans la réponse JSON via `additional(['token' => $token])`.

**Pourquoi**: Le frontend a besoin du token immédiatement après l'inscription pour authentifier les requêtes suivantes.

**Alternative considérée**: Envoyer le token uniquement dans un header → Rejeté car moins pratique pour le frontend.

## Risks / Trade-offs

- **[Risk]** Email déjà pris en cas de concurrence → **Mitigation**: Contrainte d'unicité en base + gestion de l'exception via la validation Laravel
- **[Risk]** Token exposé dans la réponse → **Mitigation**: Token utilisé uniquement côté client, jamais logué côté serveur

## Files

- `app/Http/Controllers/AuthController.php` - Controller avec méthode `register()`
- `app/Http/Requests/RegisterRequest.php` - Form Request pour la validation
- `app/Http/Resources/UserResource.php` - API Resource pour la réponse
- `app/Models/User.php` - Ajout du trait `HasApiTokens`
- `routes/api.php` - Ajout de la route `POST /api/register`
