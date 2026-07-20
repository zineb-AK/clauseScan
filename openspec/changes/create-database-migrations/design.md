## Context

L'application nécessite 3 nouvelles tables pour les fonctionnalités métier : contracts (import des contrats), analyses (résultats d'analyse IA), clauses (détail des clauses extraites). Les migrations existantes couvrent users, cache, jobs et tokens Sanctum.

## Goals / Non-Goals

**Goals:**
- Créer la table `contracts` avec clé étrangère vers `users`
- Créer la table `analyses` avec clé étrangère vers `contracts` et colonne `result_json` (JSON)
- Créer la table `clauses` avec clé étrangère vers `analyses` et colonne `risk_level` (enum)
- Indexer les clés étrangères pour les performances
- Ajouter `cascadeOnDelete` sur les relations

**Non-Goals:**
- Créer les modèles Eloquent (fait dans un change séparé)
- Créer les factories/seeders
- Modifier les migrations existantes

## Decisions

1. **Trois migrations séparées** : Une par table (contracts, analyses, clauses). Plus lisible et maintenable.
2. **`enum` via `string` avec `check` constraint** : MySQL gère bien les colonnes string avec validation. Alternative (`tinyInteger` avec mapping) rejetée pour la clarté en base.
3. **`json` pour `result_json`** : MySQL 8+ supporte nativement le type JSON. Le Cast Eloquent fera la conversion en PHP.
4. **`cascadeOnDelete`** : Supprimer un contrat supprime ses analyses et clauses. Une analyse supprime ses clauses. Un utilisateur supprime ses contrats.
5. **`foreignId()->constrained()`** : Utilisation de la syntaxe moderne Laravel pour les clés étrangères.

## Risks / Trade-offs

- [Données existantes] → Aucun risque, les tables n'existent pas encore.
- [Changement de structure] → Utiliser `down()` pour rollback. Migration classique, sans risque.
- [Type JSON en MySQL] → Ne fonctionne pas sur SQLite (tests). Utiliser `$table->json()` qui se résout en TEXT sur SQLite automatiquement.
