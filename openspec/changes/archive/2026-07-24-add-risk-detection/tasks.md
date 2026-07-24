## 1. Migration et modèle Clause

- [x] 1.1 Créer la migration `create_clauses_table` avec `id`, `analysis_id` (FK → analyses.id CASCADE), `type`, `content`, `risk_level`, `explanation`, `timestamps`
- [x] 1.2 Créer le modèle `Clause` avec `$fillable`, `$casts` (risk_level en string), relation `belongsTo` vers `Analysis`
- [x] 1.3 Créer la `ClauseFactory` avec les états `lowRisk`, `mediumRisk`, `highRisk`
- [x] 1.4 Ajouter la relation `hasMany` `clauses()` sur le modèle `Analysis`

## 2. Job d'analyse

- [x] 2.1 Modifier `AnalyzeContractJob::handle()` : après validation de la réponse IA et avant mise à jour du status, persister chaque clause dans la table `clauses` via `DB::transaction()` avec un bulk insert
- [x] 2.2 Si la persistance échoue, catcher l'exception et marquer l'analyse en `failed` (rollback implicite de la transaction)

## 3. API Resource

- [x] 3.1 Modifier `AnalysisResource` pour exposer les clauses depuis la relation Eloquent `$this->clauses` en plus du champ `results` existant

## 4. Tests

- [x] 4.1 Adapter `AnalyzeContractJobTest::test_successful_extraction_with_risk_levels` : vérifier que les `Clause` records sont créés en base avec `assertDatabaseHas` ou `assertCount` sur `$analysis->clauses`
- [x] 4.2 Ajouter un test de persistance : réponse IA valide → N clauses créées avec les bonnes valeurs
- [x] 4.3 Ajouter un test de rollback : simuler un échec DB → analyse en `failed`, aucune clause persistée
- [x] 4.4 Ajouter un test de clause vide : réponse IA avec `clauses: []` → aucune clause en base
- [x] 4.5 Exécuter les tests existants pour vérifier la non-régression

## 5. Nettoyage

- [x] 5.1 Exécuter `vendor/bin/pint --dirty --format agent`
- [x] 5.2 Exécuter `php artisan test --compact` et vérifier que tout passe
