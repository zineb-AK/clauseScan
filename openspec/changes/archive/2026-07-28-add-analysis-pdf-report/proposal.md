## Why

Les utilisateurs ont besoin de pouvoir télécharger un rapport PDF reprenant les résultats d'analyse d'un contrat (clauses extraites, clauses à risque et leurs explications) pour conservation ou partage hors ligne. Actuellement, l'API retourne les résultats en JSON via la consultation individuelle, mais aucun export PDF structuré n'existe (US14).

## What Changes

- Ajout d'un endpoint `GET /api/analyses/{analysis}/report` protégé par `auth:sanctum` + `AnalysisPolicy`
- Installation du package `barryvdh/laravel-dompdf` pour la génération PDF côté serveur
- Création d'une vue Blade dédiée servant de template au rapport PDF
- Génération du PDF contenant : titre du contrat, statut, clauses extraites (durée, préavis, pénalités, résiliation), clauses à risque avec leur niveau et explication
- Réponse avec `Content-Disposition: attachment` pour forcer le téléchargement
- Codes : 200 (succès), 403 (non propriétaire), 404 (analyse inexistante), 409 (analyse pas encore `done`)

## Capabilities

### New Capabilities

- `analysis-pdf-report`: Endpoint de téléchargement PDF d'un rapport d'analyse structuré, avec template Blade dédié et contrôle d'accès via policy

### Modified Capabilities

*(Aucune spécification existante n'est modifiée — il s'agit d'une nouvelle capability)*

## Impact

- **Routes** : ajout d'une route `GET /api/analyses/{analysis}/report` dans le groupe `auth:sanctum`
- **Controllers** : ajout d'une méthode `report()` dans `AnalysisController`
- **Policy** : ajout d'une méthode `report()` ou réutilisation de `view()` dans `AnalysisPolicy` (vérification propriétaire + statut `done`)
- **Dépendance** : ajout de `barryvdh/laravel-dompdf` dans `composer.json`
- **Vues** : création d'une vue Blade `reports/analysis.blade.php` pour le template PDF
- **Tests** : nouveau fichier de test pour l'endpoint avec couverture : succès 200 (fichier PDF), 401, 403, 404, 409
