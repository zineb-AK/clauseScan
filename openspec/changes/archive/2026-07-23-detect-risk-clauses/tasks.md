## 1. DTO ClauseItem

- [x] 1.1 Ajouter `risk_level` (?string) et `explanation` (?string) dans `ClauseItem` — propriétés readonly, constructeur, `fromArray()`, `toArray()`

## 2. Pipeline IA (AnalyzeContractJob)

- [x] 2.1 Mettre à jour le JSON Schema dans `AnalyzeContractJob` : ajouter `risk_level` (enum: low|medium|high) et `explanation` (string) dans les `properties` de chaque clause, les ajouter au `required`
- [x] 2.2 Renforcer le prompt système : instruction explicite pour évaluer le risque et fournir une explication en langage simple
- [x] 2.3 Mettre à jour `validateResponse()` pour vérifier `risk_level` et `explanation` sur chaque clause

## 3. API Resource

- [x] 3.1 Mettre à jour `AnalysisResource` : exposer `results` (incluant `duree`, `preavis`, `penalites`, `conditions_resiliation`, `clauses`) en plus de `id` et `status`

## 4. Tests

- [x] 4.1 Adapter le test de succès existant : ajouter `risk_level` et `explanation` dans la réponse mockée, vérifier leur présence dans les `ClauseItem`
- [x] 4.2 Ajouter un test multi-risque : plusieurs clauses avec low/medium/high, vérifier que chaque niveau est correctement parsé
- [x] 4.3 Ajouter un test d'échec : réponse IA avec `risk_level` manquant → statut `failed`
- [x] 4.4 Exécuter tous les tests existants pour vérifier la non-régression
- [x] 5.1 Exécuter `vendor/bin/pint --dirty --format agent` pour la conformité du style
- [x] 5.2 Vérifier que `php artisan test --compact` passe intégralement
