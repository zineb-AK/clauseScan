## 1. Contrôleur et routes

- [x] 1.1 Créer `AnalysisController` avec la méthode `show()` — chargement conditionnel des `clauses` si `status === 'done'`
- [x] 1.2 Ajouter la route `GET /api/analyses/{analysis}` dans le groupe `auth:sanctum` de `routes/api.php`
- [x] 1.3 Vérifier que `AnalysisPolicy` est bien enregistrée (auto-découverte Laravel ou `AuthServiceProvider`)

## 2. Tests

- [x] 2.1 Créer `AnalysisShowTest` : test de consultation réussie (analyse `done` avec clauses persistées)
- [x] 2.2 Ajouter test : consultation d'une analyse `pending` → seulement `id` et `status`
- [x] 2.3 Ajouter test : consultation d'une analyse `processing` → seulement `id` et `status`
- [x] 2.4 Ajouter test : consultation par un autre utilisateur → 403
- [x] 2.5 Ajouter test : consultation d'une analyse inexistante → 404
- [x] 2.6 Ajouter test : consultation sans authentification → 401

## 3. Nettoyage

- [x] 3.1 Exécuter `vendor/bin/pint --dirty --format agent`
- [x] 3.2 Exécuter `php artisan test --compact` et vérifier que tout passe
