## 1. Setup

- [x] 1.1 Ajouter le trait `HasApiTokens` au modèle `User` (`app/Models/User.php`)
- [x] 1.2 Créer le répertoire `app/Http/Requests/`

## 2. Backend Implementation

- [x] 2.1 Créer `app/Http/Requests/RegisterRequest.php` avec les règles de validation (name required, email required|unique, password required|confirmed|min:8)
- [x] 2.2 Créer `app/Http/Resources/UserResource.php` pour formater la réponse JSON (id, name, email, created_at)
- [x] 2.3 Créer `app/Http/Controllers/AuthController.php` avec la méthode `register()` qui crée l'utilisateur, génère le token Sanctum et retourne la réponse 201
- [x] 2.4 Ajouter la route `POST /api/register` dans `routes/api.php`

## 3. Tests

- [x] 3.1 Créer `tests/Feature/Auth/RegistrationTest.php` avec les tests Pest : succès 201, hachage mot de passe, erreurs 422 (champs manquants, email dupliqué, mot de passe court, confirmation mismatch)

## 4. Quality

- [x] 4.1 Exécuter `vendor/bin/pint --dirty --format agent` pour le formatage du code
- [x] 4.2 Vérifier que tous les tests passent (`php artisan test --compact`)
