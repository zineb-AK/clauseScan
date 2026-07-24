## Context

L'analyse IA (US9/US10) est déjà fonctionnelle : `AnalyzeContractJob` envoie le contrat à OpenRouter, reçoit un JSON structuré avec `duree`, `preavis`, `penalites`, `conditions_resiliation` et `clauses[]` (incluant `risk_level` et `explanation`), et stocke le tout dans `Analysis.results` via `AnalysisResultCast`.

État actuel :
- `ClauseItem` (Value Object) a déjà `risk_level` et `explanation` en nullable
- Le JSON Schema contraint déjà `risk_level` via `enum: ["low", "medium", "high"]`
- Le prompt système demande déjà l'évaluation du risque
- `AnalysisResource` expose déjà `results` avec les clauses
- Les tests couvrent déjà les différents niveaux de risque

Ce qui manque : **la persistance individuelle des clauses en base relationnelle**. Aujourd'hui, les clauses sont noyées dans le JSON `Analysis.results`. On ne peut pas les interroger, les filtrer, ou les exporter individuellement sans parser le JSON.

## Goals / Non-Goals

**Goals:**
- Créer la migration et la table `clauses` (id, analysis_id FK, type, content, risk_level, explanation)
- Créer le modèle Eloquent `Clause` avec factory
- Ajouter la relation `hasMany` clauses sur `Analysis`
- Modifier `AnalyzeContractJob` pour persister chaque clause après validation de la réponse IA
- Mettre à jour `AnalysisResource` pour exposer les clauses depuis la relation Eloquent
- Adapter les tests existants et ajouter un test de persistance

**Non-Goals:**
- Modifier le DTO `ClauseItem` ou `AnalysisResult` — ils restent la source de vérité pour le Cast
- Modifier le JSON Schema ou le prompt — ils sont déjà corrects
- Ajouter un nouvel endpoint — les clauses sont exposées via l'`AnalysisResource` existante
- Créer une nouvelle Policy — les clauses héritent de la protection via la relation `Analysis` → `Contract` → `User`

## Decisions

### D1 : Table `clauses` avec FK cascade on delete

La table `clauses` est liée à `analyses` par `analysis_id` avec `cascadeOnDelete`. Quand une analyse est supprimée, toutes ses clauses sont supprimées automatiquement. Pas de soft delete sur les clauses — leur cycle de vie suit celui de l'analyse.

```sql
CREATE TABLE clauses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    analysis_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    risk_level VARCHAR(20) NOT NULL COMMENT 'low|medium|high',
    explanation TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
);
```

### D2 : `risk_level` stocké comme string avec validation au niveau applicatif

Pas de contrainte `ENUM` MySQL — le `risk_level` est stocké en `VARCHAR(20)` et validé par le modèle Eloquent via un Cast ou une validation dans le Job. Cela évite les migrations de schéma si on veut ajouter un niveau supplémentaire. L'IA ne peut de toute façon répondre que `low`, `medium` ou `high` via le JSON Schema `enum`.

### D3 : Persistance en transaction dans `AnalyzeContractJob`

La création des clauses se fait dans une transaction DB, après validation de la réponse IA et avant le store du `results`. Si la persistance échoue, le job marque l'analyse en `failed` — pas de données partielles.

```
try {
    DB::transaction(function () {
        // 1. Valider réponse IA
        // 2. Créer AnalysisResult
        // 3. Persister les Clause records
        // 4. Mettre à jour Analysis.status = done + results
    });
} catch (\Throwable $e) {
    // Analysis.status = failed
}
```

### D4 : `AnalysisResource` expose les clauses depuis la relation Eloquent

`AnalysisResource.toArray()` inclut `clauses` chargées via `$this->clauses`, chacune formatée avec `id`, `type`, `content`, `risk_level`, `explanation`. Le champ `results` (JSON) reste exposé pour la compatibilité descendante.

### D5 : Clause factory pour les tests

Une `ClauseFactory` est créée avec les états `lowRisk`, `mediumRisk`, `highRisk` pour simplifier les scénarios de test.

## Risks / Trade-offs

- **[Risque] Duplication des données** : Les clauses sont stockées à la fois dans `Analysis.results` (JSON) et dans la table `clauses`. → **Mitigation** : Accepté. Le JSON est la source de vérité pour le Cast et la rétrocompatibilité. La table `clauses` permet l'interrogation directe et l'export. La persistance se fait dans la même transaction — pas de divergence possible.
- **[Risque] Performance** : L'insertion de N clauses par analyse ajoute N+1 requêtes. → **Mitigation** : Utilisation de `insert()` (bulk insert) plutôt que `create()` pour chaque clause individuelle. Pour des contrats typiques (5-15 clauses), l'impact est négligeable.
