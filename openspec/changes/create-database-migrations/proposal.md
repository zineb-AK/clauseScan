## Why

Les entités métier (Contract, Analysis, Clause) n'ont pas encore de tables en base de données. Les migrations sont nécessaires pour que les fonctionnalités d'import de contrat, d'analyse IA et de consultation des résultats puissent fonctionner.

## What Changes

- Création de la migration `create_contracts_table` avec les colonnes : id, user_id (FK), title, source_type (enum: pdf|text), file_path (nullable), raw_text (longText), status, timestamps
- Création de la migration `create_analyses_table` avec les colonnes : id, contract_id (FK), status (enum: pending|processing|done|failed), language, result_json (json), timestamps
- Création de la migration `create_clauses_table` avec les colonnes : id, analysis_id (FK), type, content, risk_level (enum: low|medium|high), explanation, timestamps
- Aucune modification des migrations existantes

## Capabilities

### New Capabilities
- *(aucune — changement d'infrastructure, pas de nouvelle capacité fonctionnelle)*

### Modified Capabilities

- *(aucune)*

## Impact

- **3 nouvelles migrations** : contracts, analyses, clauses
- **Base de données** : nouvelles tables avec clés étrangères et contraintes d'intégrité
- **Modèles** : les modèles Contract, Analysis, Clause pourront être créés ensuite
- **Factory/Seeder** : les factories pourront utiliser ces tables via les modèles
