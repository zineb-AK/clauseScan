## Why

US10 est partiellement implémentée : `risk_level` et `explanation` existent dans le DTO `ClauseItem` et le JSON Schema de l'IA, mais les clauses ne sont pas persistées en base de données relationnelle. Actuellement, elles sont noyées dans le JSON `Analysis.results`. Pour permettre l'interrogation, le filtrage et l'export individuel des clauses, chaque clause détectée doit être persistée dans une table dédiée `clauses`, liée à l'`Analysis`.

## What Changes

- **Nouvelle migration** : création de la table `clauses` avec `id`, `analysis_id` (FK), `type`, `content`, `risk_level` (enum: low|medium|high), `explanation`, `created_at`, `updated_at`.
- **Nouveau modèle** `Clause` : Eloquent Model, relation `belongsTo` vers `Analysis`.
- **Mise à jour du modèle `Analysis`** : ajout de la relation `hasMany` vers `Clause`.
- **Mise à jour de `AnalyzeContractJob`** : après validation de la réponse IA, persister chaque clause dans la table `clauses` en plus du stockage JSON existant.
- **Mise à jour de l'API Resource** : `AnalysisResource` expose les clauses via la relation Eloquent plutôt que depuis le JSON brut.
- **Tests** : adapter les tests existants pour vérifier la persistance en base, ajouter un test de rollback en cas d'échec.

## Capabilities

### New Capabilities
- `clause-persistence`: Persistance des clauses détectées par l'IA dans une table relationnelle dédiée, avec type, contenu, niveau de risque et explication.

### Modified Capabilities
- `ai-main-clauses`: Le job `AnalyzeContractJob` persiste désormais chaque clause individuellement dans la table `clauses` après la réponse IA, en plus du stockage JSON existant.

## Impact

- **Code modifié** : `app/Jobs/AnalyzeContractJob.php` (persistence des clauses), `app/Models/Analysis.php` (relation hasMany), `app/Http/Resources/AnalysisResource.php` (exposition via relation)
- **Nouveaux fichiers** : `app/Models/Clause.php`, `database/migrations/xxxx_xx_xx_create_clauses_table.php`
- **Schéma BDD** : nouvelle table `clauses` avec FK vers `analyses`
- **Tests** : adaptation de `AnalyzeContractJobTest.php` (vérification des enregistrements en base)
- **API** : structure de réponse enrichie (clauses exposées depuis la relation)
