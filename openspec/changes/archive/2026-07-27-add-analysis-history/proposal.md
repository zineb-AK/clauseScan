## Why

Les utilisateurs ont besoin de consulter l'historique de leurs analyses pour suivre les contrats déjà traités. Actuellement, aucune vue liste n'expose les analyses — seul le détail d'une analyse est accessible (US12). Cette vue liste est nécessaire pour permettre la navigation dans l'historique (US13) avant d'accéder au détail d'une analyse.

## What Changes

- Ajout d'un endpoint `GET /api/analyses` paginé, listant les analyses de l'utilisateur connecté
- Réponse allégée via `AnalysisResource` : `id`, `contract_title`, `status`, `created_at`
- Tri par date de création décroissante
- Cloisonnement des données : seules les analyses dont le contrat appartient à l'utilisateur connecté sont renvoyées (via `AnalysisPolicy`)

## Capabilities

### New Capabilities
- `analysis-history`: Listing paginé de l'historique des analyses pour l'utilisateur connecté

### Modified Capabilities
- *None — new capability only*

## Impact

- **Nouveau contrôleur** : `AnalysisController` si inexistant, ou ajout de la méthode `index()`
- **Nouvelle route** : `GET /api/analyses` dans le groupe `auth:sanctum`
- **AnalysePolicy** : vérification existante via `view()` — la méthode `index()` filtera naturellement par `user_id` sans nécessiter de policy supplémentaire
- **Épic** : 4 — Historique (US13)
- **Brique** : Consultation API, aucune IA concernée
- **Traitement** : Synchrone (lecture simple en base)
