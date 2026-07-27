## Context

US9 a posé les bases du pipeline d'analyse : envoi du contrat à OpenRouter, extraction des champs `duree`, `preavis`, `penalites`, `conditions_resiliation` et `clauses[]` (avec `type` et `contenu`). US10 enrichit chaque clause avec un niveau de risque (`risk_level`) et une explication.

État actuel :
- `ClauseItem` a 2 propriétés : `type`, `contenu`
- Le JSON Schema ne contraint que `type` et `contenu` dans les items de `clauses[]`
- Le prompt système demande d'extraire les clauses sans mention de risque ni d'explication
- `AnalysisResource` expose `id` et `status` uniquement

## Goals / Non-Goals

**Goals:**
- Ajouter `risk_level` (enum: low|medium|high) et `explanation` (string) à `ClauseItem`
- Mettre à jour le JSON Schema dans `AnalyzeContractJob` pour contraindre ces nouveaux champs
- Renforcer le prompt système pour que le modèle évalue le risque et explique en langage simple
- Mettre à jour `AnalysisResource` pour exposer `results` avec tous les champs
- Adapter les tests existants et ajouter un scénario multi-risque

**Non-Goals:**
- Créer une table `clauses` dédiée — le stockage reste dans `Analysis.results` via le Cast
- Modifier le flux d'analyse ou les endpoints — seul le contenu du JSON Schema et du DTO change
- Ajouter de la logique côté PHP pour calculer le risque — c'est l'IA qui détermine le niveau
- Modifier `AnalysisResult` ou son Cast — ils sont génériques et passent les données telles quelles

## Decisions

### D1 : Ajout des champs dans le JSON Schema avec énumération

Le champ `risk_level` est contraint via `enum: ["low", "medium", "high"]` dans le JSON Schema, pas seulement un `type: "string"`. Cela force le modèle à choisir parmi les 3 valeurs autorisées.

```json
{
  "type": "object",
  "properties": {
    "type": { "type": "string" },
    "contenu": { "type": "string" },
    "risk_level": {
      "type": "string",
      "enum": ["low", "medium", "high"]
    },
    "explanation": { "type": "string" }
  },
  "required": ["type", "contenu", "risk_level", "explanation"],
  "additionalProperties": false
}
```

### D2 : Prompt système renforcé

Le prompt système est complété avec : *"Pour chaque clause que tu extrais, évalue son niveau de risque (low, medium, high) et fournis une explication en langage simple compréhensible par un non-juriste."*

### D3 : Aucune validation PHP supplémentaire sur les valeurs de `risk_level`

Le JSON Schema avec `enum` garantit que l'IA ne peut pas répondre autre chose que `low`, `medium` ou `high`. Le Cast et le DTO n'ont pas besoin de validation redondante. La validation PHP existante (présence des champs requis) est suffisante.

### D4 : `AnalysisResource` expose désormais `results` en plus de `id` et `status`

Le resource est mis à jour pour inclure `results` dans la réponse, ce qui permet au frontend de consommer directement les données structurées de l'analyse.

## Risks / Trade-offs

- **[Risque] Modèles gratuits (gemma-3-12b-it:free) moins fiables sur l'évaluation du risque** : Les petits modèles peuvent attribuer des niveaux de risque incohérents. → **Mitigation** : Le prompt est explicite sur les critères. L'utilisateur final verra l'explication et pourra juger par lui-même.
- **[Risque] Champs `risk_level` et `explanation` absents dans les anciennes analyses** : Les analyses US9 stockées sans ces champs retourneraient null. → **Mitigation** : `ClauseItem` rend `risk_level` et `explanation` nullable via `?string`, et le Cast existe déjà pour gérer les données partielles.
