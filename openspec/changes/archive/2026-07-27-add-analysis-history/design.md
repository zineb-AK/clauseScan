## Context

Besoin d'un endpoint listant l'historique des analyses pour l'utilisateur connecté (US13). Actuellement, seul l'endpoint `GET /api/analyses/{analysis}` existe pour le détail. Aucune vue liste paginée n'est exposée.

## Goals / Non-Goals

**Goals:**
- Endpoint `GET /api/analyses` paginé, protégé par `auth:sanctum`
- Filtrage automatique par `user_id` via la relation `Contract → Analysis`
- Réponse allégée : `id`, `contract_title`, `status`, `created_at`
- Tri par `created_at` descendant

**Non-Goals:**
- Filtres avancés (par statut, date, texte) — hors périmètre US13
- Export PDF du rapport (US14 — traité séparément)
- Aucune IA sollicitée — simple requête lecture

## Decisions

- **Controller** : Ajout d'une méthode `index()` dans `AnalysisController` existant (créé pour US12). Approche cohérente avec le pattern existant.
- **Policy** : Aucune Policy dédiée nécessaire pour la liste — le scoping par `user_id` se fait directement via la relation Eloquent (`$user->analyses()` via le `Contract` ou requête scope). Une Policy ne gère pas la liste, seulement les actions individuelles.
- **Resource** : Création d'un `AnalysisResource` allégé. Si le resource existe déjà pour le show (US12, champs complets), on conserve les deux resources séparées : `AnalysisResource` (léger) pour la liste et `AnalysisDetailResource` pour le show, ou on utilise le même en conditionnel.
- **Pagination** : Pagination Laravel par défaut (15 items/page). Paramètre `per_page` optionnel (max 100).
- **Requête** : `auth()->user()->analyses()` via une relation hasManyThrough sur le modèle `User`, ou requête directe sur `Analysis` avec `whereHas('contract', fn($q) => $q->where('user_id', auth()->id()))`. La relation hasManyThrough est préférable pour la propreté du code.

## Risks / Trade-offs

- Aucun risque majeur identifié — il s'agit d'une opération de lecture simple, synchrone, sans dépendance externe.
