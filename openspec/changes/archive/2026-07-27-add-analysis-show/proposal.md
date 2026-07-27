## Why

US12 permet à l'utilisateur de consulter les résultats d'une analyse. Actuellement, l'analyse est créée (202 Accepted) mais il n'existe aucun endpoint pour récupérer le résultat structuré une fois le Job terminé. L'utilisateur ne peut pas visualiser la durée, le préavis, les pénalités, les clauses et leurs niveaux de risque.

## What Changes

- **Nouvel endpoint** `GET /api/analyses/{analysis}` protégé par `auth:sanctum` + `AnalysisPolicy::view()`
- **Nouveau contrôleur** `AnalysisController` avec méthode `show()`
- **Nouvelle route** dans le groupe `auth:sanctum` de `routes/api.php`
- **Comportement conditionnel** : si le statut est `pending` ou `processing`, retourner uniquement `id` et `status` sans `results` ni `clauses`
- **Enregistrement de la Policy** : `AnalysisPolicy` existe déjà mais doit être enregistrée dans `AuthServiceProvider`

## Capabilities

### New Capabilities
- `analysis-show`: Endpoint de consultation des résultats d'analyse avec comportement conditionnel selon le statut (pending/processing → statut seul, done → résultats complets)

### Modified Capabilities
- *(aucune — la spec `ai-main-clauses` décrit déjà le format de réponse via `AnalysisResource`, l'endpoint est un ajout séparé)*

## Impact

- **Nouveaux fichiers** : `app/Http/Controllers/AnalysisController.php`
- **Code modifié** : `routes/api.php` (nouvelle route), `app/Providers/AuthServiceProvider.php` (enregistrement Policy si absent)
- **API** : nouvel endpoint `GET /api/analyses/{analysis}` — 200 avec résultats complets, 200 avec statut seul (pending/processing), 403 (autre utilisateur), 404 (inexistant)
- **Tests** : nouveau test `AnalysisShowTest` couvrant succès, pending, 403, 404
