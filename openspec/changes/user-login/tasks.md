## 1. Backend Implementation

- [ ] 1.1 Créer `app/Http/Requests/LoginRequest.php` avec les règles de validation (email required|email, password required)
- [ ] 1.2 Ajouter la méthode `login()` dans `app/Http/Controllers/AuthController.php` qui vérifie les identifiants avec Auth::attempt() et retourne le token Sanctum en 200, ou un message générique en 401
- [ ] 1.3 Ajouter la route `POST /api/login` dans `routes/api.php`

## 2. Tests

- [ ] 2.1 Créer `tests/Feature/Auth/LoginTest.php` avec les tests Pest : succès 200 + token, échec 401 + message générique, erreurs 422 (champs manquants, email invalide)

## 3. Quality

- [ ] 3.1 Exécuter `vendor/bin/pint --dirty --format agent` pour le formatage du code
- [ ] 3.2 Vérifier que tous les tests passent (`php artisan test --compact`)
