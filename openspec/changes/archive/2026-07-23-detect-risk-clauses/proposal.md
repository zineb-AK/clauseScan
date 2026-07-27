## Why

US9 a implémenté l'extraction brute des clauses (type, contenu). US10 ajoute la détection du niveau de risque (`risk_level`: low/medium/high) et une explication en langage simple pour chaque clause. C'est ce qui différencie ClauseScan d'une simple extraction de texte : l'utilisateur comprend instantanément quelles clauses sont dangereuses et pourquoi.

## What Changes

- **Modification du JSON Schema envoyé à OpenRouter** : chaque clause dans `clauses[]` gagne deux champs obligatoires : `risk_level` (low|medium|high) et `explanation`.
- **Modification du DTO `ClauseItem`** : ajout des propriétés `risk_level` et `explanation`, mise à jour de `fromArray()`/`toArray()`.
- **Modification du prompt système** : instruction explicite au modèle de noter le risque et d'expliquer simplement.
- **Mise à jour des tests** : validation des nouveaux champs dans le scénario de succès, y compris un test avec des clauses de différents niveaux de risque.
- **Mise à jour de `AnalysisResource`** : exposition des champs `risk_level` et `explanation` dans la réponse API.

## Capabilities

### New Capabilities
- *(aucune — US10 modifie la spec existante)*

### Modified Capabilities
- `ai-main-clauses`: Ajout de `risk_level` et `explanation` dans chaque clause. Le JSON Schema et le DTO sont enrichis, le prompt système est renforcé.

## Impact

- **Code modifié** : `app/ValueObjects/ClauseItem.php`, `app/Jobs/AnalyzeContractJob.php` (prompt + JSON Schema), `app/Http/Resources/AnalysisResource.php`
- **Schéma BDD** : aucun — le stockage est dans `Analysis.results` (JSON), le Cast s'adapte automatiquement aux nouveaux champs.
- **API** : aucun nouvel endpoint. La structure de la réponse change pour inclure `risk_level` et `explanation` dans chaque clause.
- **Tests** : modification de `tests/Feature/AnalyzeContractJobTest.php` (ajout d'assertions sur les nouveaux champs, nouveau test scénario).
