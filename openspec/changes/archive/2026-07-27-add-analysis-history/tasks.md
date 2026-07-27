## 1. Contrôleur et route

- [x] 1.1 Ajouter la méthode `index()` à `AnalysisController` — requête paginée scoped à l'utilisateur connecté via `hasManyThrough` ou `whereHas`
- [x] 1.2 Ajouter la route `GET /api/analyses` dans le groupe `auth:sanctum` de `routes/api.php`
- [x] 1.3 Créer `AnalysisResource` allégé avec champs : `id`, `contract_title`, `status`, `created_at`

## 2. Tests

- [x] 2.1 Créer `AnalysisHistoryTest` avec Pest : test de consultation réussie — utilisateur authentifié obtient la liste paginée
- [x] 2.2 Ajouter test : consultation sans authentification → 401
- [x] 2.3 Ajouter test : consultation par un utilisateur sans analyses → liste vide
- [x] 2.4 Ajouter test : les analyses d'un autre utilisateur ne sont pas incluses
- [x] 2.5 Ajouter test : paramètre `per_page` fonctionne correctement

## 3. Nettoyage

- [x] 3.1 Exécuter `vendor/bin/pint --dirty --format agent`
- [x] 3.2 Exécuter `php artisan test --compact` et vérifier que tout passe
