## Context

L'analyse asynchrone (US8-US10) est implémentée : `POST /api/contracts/{contract}/analyze` crée une analyse (`status: pending`), dispatch `AnalyzeContractJob` et retourne 202. Une fois le job terminé (`status: done`), les résultats sont stockés dans `Analysis.results` (via `AnalysisResultCast`) et chaque clause est persistée dans la table `clauses`.

Ce qui manque : un endpoint pour consulter ces résultats. `AnalysisResource` existe déjà avec `id`, `status`, `results`, `clauses`, mais il n'est utilisé que dans la réponse 202 de création (pas de chargement des relations à ce stade).

État actuel :
- `AnalysisPolicy` existe avec méthode `view()` (vérifie `user_id`)
- `AnalysisResource` expose `id`, `status`, `results`, `clauses` (avec `whenLoaded`)
- `ClauseResource` existe
- Aucun endpoint `GET` pour les analyses

## Goals / Non-Goals

**Goals:**
- Créer `AnalysisController` avec méthode `show()`
- Ajouter la route `GET /api/analyses/{analysis}` dans le groupe `auth:sanctum`
- Comportement conditionnel : pending/processing → seulement `id` et `status` ; done → résultats complets + clauses
- Protection via `AnalysisPolicy::view()` (autorisation implicite via `authorizeResource` ou `$this->authorize()`)
- Tests Pest couvrant succès, pending, 403, 404, 401

**Non-Goals:**
- Liste des analyses (historique) — c'est US13
- Modification ou suppression d'analyse
- Changement de modèle ou de schéma BDD
- Modification de l'existant `AnalyzeContractJob`

## Decisions

### D1 : Contrôleur dédié avec `show()` explicite

Un `AnalysisController` avec une méthode `show()` unique. L'autorisation se fait via `$this->authorize('view', $analysis)` qui utilise `AnalysisPolicy::view()` existante.

### D2 : Load conditionnel des clauses

Dans `show()` :
- Si `status` est `done` → `$analysis->load('clauses')` avant de passer au Resource
- Si `status` est `pending` ou `processing` → pas de load, le Resource n'exposera que `id` et `status` (grâce à `whenLoaded('clauses')`)
- Si `status` est `failed` → on charge quand même les clauses (il pourrait y en avoir) mais le Resource ne retournera ni `results` (null via le Cast) ni clauses (aucune persistée)

### D3 : Route RESTful

```php
Route::get('analyses/{analysis}', [AnalysisController::class, 'show'])
    ->middleware('auth:sanctum');
```

Pas de route resource complète — seul `show` est nécessaire pour US12.

### D4 : `AnalysisResource` inchangé

Le Resource existant avec `whenLoaded('clauses')` gère déjà le comportement conditionnel. Aucune modification nécessaire.

## Risks / Trade-offs

- **[Risque] Analyse récente sans clauses persistées** : Si le job US10 n'a pas encore tourné sur une analyse `done` d'avant la migration des clauses. → **Mitigation** : La relation `clauses()` retourne une Collection vide si aucun enregistrement. Le `whenLoaded` ne s'applique pas (relation non chargée). Acceptable en l'état.
