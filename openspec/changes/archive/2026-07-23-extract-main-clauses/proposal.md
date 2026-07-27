## Why

L'analyse IA est la valeur centrale de ClauseScan. Actuellement, le Job `AnalyzeContractJob` est vide (stub). US9 (extraction des clauses principales) est la première brique réelle du pipeline d'analyse : envoyer le texte brut du contrat à un LLM via OpenRouter, obtenir une réponse structurée (durée, préavis, pénalités, résiliation, clauses), et stocker le résultat. Sans cette implémentation, l'application ne produit aucune analyse.

## What Changes

- **AnalyzeContractJob** : remplace le `handle()` vide par le pipeline complet : statut → `processing`, appel OpenRouter avec contexte complet (raw_text), validation du structured output, stockage dans `Analysis.result_json`, statut → `done`/`failed`.
- **Nouveau Cast `AnalysisResultCast`** : Cast Eloquent dédié pour sérialiser/désérialiser le `result_json` de l'Analysis avec un typed PHP object (`AnalysisResult` DTO) garantissant la structure.
- **Nouveau DTO `AnalysisResult`** : Value Object PHP typé (duree, preavis, penalites, conditions_resiliation, clauses[]).
- **Nouveau DTO `ClauseItem`** : Value Object (type, contenu, risque, explication), graine de la future entité Clause.
- **Nouveau fichier `config/ai.php`** : configuration de l'API OpenRouter (endpoint, model, timeout).
- **Mise à jour des statuts** : `Analysis.status` utilise `pending` → `processing` → `done` (`completed` renommé en `done`) / `failed`.
- **Mise à jour de la migration** : modification null safe du statut par défaut et renommage `completed` → `done` si pertinent (via nouvelle migration).
- **Nouveau test** : couverture du Job (status flow, appel IA, structured output valide/invalide).

## Capabilities

### New Capabilities
- `ai-main-clauses`: Envoi du contrat complet à OpenRouter, extraction structurée des clauses principales (durée, préavis, pénalités, résiliation + liste de clauses), stockage via Cast dédié, cycle de vie du statut (processing → done/failed).

### Modified Capabilities
- *(Aucune spec existante modifiée)*

## Impact

- **Code modifié** : `app/Jobs/AnalyzeContractJob.php`, `app/Models/Analysis.php`
- **Nouveaux fichiers** : `app/ValueObjects/AnalysisResult.php`, `app/ValueObjects/ClauseItem.php`, `app/Casts/AnalysisResultCast.php`, `config/ai.php`
- **Schéma BDD** : la colonne `results` (JSON) reste inchangée, c'est le Cast qui change (`array` → `AnalysisResultCast`)
- **API** : aucun nouvel endpoint. Le flux existant (POST `/contracts/{contract}/analyze` → 202 → Job asynchrone) est conservé.
- **Dépendances** : aucune nouvelle dépendance Composer. Appels HTTP directs via `Http::withToken()` depuis le Job.
- **Données** : isolation via `AnalysisPolicy` existante (inchangée).
- **Tests** : nouveau fichier `tests/Feature/AnalyzeContractJobTest.php`.
