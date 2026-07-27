## 1. Configuration & DTOs

- [x] 1.1 Créer `config/ai.php` avec les paramètres OpenRouter (api_key, model, endpoint, timeout)
- [x] 1.2 Créer `app/ValueObjects/AnalysisResult.php` — DTO typé avec `duree`, `preavis`, `penalites`, `conditions_resiliation`, `clauses` (array de ClauseItem)
- [x] 1.3 Créer `app/ValueObjects/ClauseItem.php` — DTO avec `type`, `contenu` + `fromArray()` / `toArray()`
- [x] 1.4 Créer `app/Casts/AnalysisResultCast.php` — Cast Eloquent qui hydrata `AnalysisResult` depuis/get en `array` vers la base

## 2. Pipeline d'analyse (AnalyzeContractJob)

- [x] 2.1 Modifier `AnalyzeContractJob::handle()` : set status à `processing`, charger `$this->analysis->contract->raw_text`, construire le prompt système avec le JSON Schema
- [x] 2.2 Appeler OpenRouter via `Http::withToken()` : POST vers `/v1/chat/completions` avec `response_format: { type: 'json_schema', json_schema: { ... } }`
- [x] 2.3 Valider la réponse IA : décoder JSON, vérifier la présence des champs requis (`duree`, `preavis`, `penalites`, `conditions_resiliation`, `clauses`), et la structure de chaque clause
- [x] 2.4 Stocker le résultat validé dans `$analysis->result_json` (via le Cast) et passer le statut à `done`
- [x] 2.5 Gérer les erreurs : catch exceptions HTTP, JSON invalide, champs manquants → statut `failed` + log

## 3. Mise à jour du modèle Analysis

- [x] 3.1 Mettre à jour le cast `results` dans `Analysis` : passer de `'array'` à `AnalysisResultCast::class`
- [x] 3.2 Renommer le statut `completed` en `done` si utilisé — créer une migration pour mettre à jour les enregistrements existants

## 4. Tests

- [x] 4.1 Créer `tests/Feature/AnalyzeContractJobTest.php` avec test de succès : `Http::fake()` retourne un JSON valide → vérifier statut `done` et `result_json` hydraté avec les bons types
- [x] 4.2 Test d'échec HTTP : `Http::fake()` retourne 500 → vérifier statut `failed`
- [x] 4.3 Test de réponse JSON invalide : `Http::fake()` retourne du texte non-JSON → vérifier statut `failed`
- [x] 4.4 Test de réponse JSON valide mais champs manquants → vérifier statut `failed`
- [x] 4.5 Test de clauses vides (tableau `clauses` vide) → vérifier statut `done` avec `clauses` = [] dans le résultat
- [x] 4.6 Exécuter tous les tests existants pour vérifier la non-régression
- [x] 5.1 Exécuter `vendor/bin/pint --dirty --format agent` pour la conformité du style
- [x] 5.2 Vérifier que `php artisan test --compact` passe intégralement
