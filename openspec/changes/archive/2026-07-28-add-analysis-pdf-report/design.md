## Context

Le projet ClauseScan expose actuellement les résultats d'analyse via un endpoint JSON (`GET /api/analyses/{analysis}`). US14 nécessite un export PDF téléchargeable reprenant les mêmes données (clauses extraites, clauses à risque, explications) dans un format structuré et prêt à l'emploi.

Aucun package de génération PDF n'est installé actuellement. Le choix se porte sur `barryvdh/laravel-dompdf`, wrapper Laravel mature de Dompdf, qui permet d'utiliser des vues Blade comme templates et ne nécessite pas d'outil système externe (contrairement à wkhtmltopdf ou Snappy). Pas de modification de schéma BDD nécessaire : le PDF est généré à la volée à partir des données existantes.

## Goals / Non-Goals

**Goals:**
- Endpoint `GET /api/analyses/{analysis}/report` retournant un PDF téléchargeable
- Vérification : `auth:sanctum` + `AnalysisPolicy::view()` + statut `done` (sinon 409)
- Template Blade structuré reprenant : titre du contrat, statut, clauses extraites, clauses à risque avec leur niveau et explication
- Réponse avec header `Content-Disposition: attachment; filename="analyse-{id}.pdf"`

**Non-Goals:**
- Pas de modification du modèle de données (pas de migration)
- Pas d'envoi par email, pas de génération asynchrone (le PDF est léger, généré synchrone)
- Pas de personnalisation du template (choix de langue déjà géré par le champ `language` de l'analyse)
- Pas d'export CSV/Excel (hors périmètre US14)

## Decisions

### 1. Choix du package PDF : `barryvdh/laravel-dompdf`

Utilisation de Dompdf via son wrapper Laravel. Justification : pas de dépendance système (contrairement à wkhtmltopdf), vues Blade comme templates, large adoption, compatible Laravel 13.

Alternatives écartées :
- **Laravel Snappy (wkhtmltopdf)** : nécessite un binaire système, complexifie le Dockerfile
- **spatie/browsershot (Puppeteer)** : lourd, nécessite Node.js + Chrome en conteneur
- **TCPDF** : pas de wrapper Laravel maintenu, API moins idiomatique

### 2. Contrôle d'accès : réutilisation de `AnalysisPolicy::view()`

La policy `view()` vérifie déjà que `$user->id === $analysis->user_id`. Pas besoin d'une méthode dédiée pour le rapport — l'accès au rapport est le même que l'accès à la consultation JSON. On ajoute juste une vérification complémentaire sur le statut `done` dans le controller.

### 3. Génération synchrone

Le PDF est généré à la volée dans le controller. Justification : le contenu est déjà structuré en base, la génération Dompdf est rapide (< 1s pour ce volume de données). Un Job asynchrone ajouterait de la complexité sans bénéfice réel.

### 4. Template Blade

Une vue `resources/views/reports/analysis.blade.php` est créée. Dompdf supporte le CSS de base (inline, polices, couleurs, bordures). Le template utilise un style sobre, professionnel, compatible PDF. Les sections :
- En-tête : titre du contrat, date de génération, statut
- Résumé des clauses extraites (durée, préavis, pénalités, conditions de résiliation)
- Tableau des clauses à risque (type, contenu, niveau, explication)

### 5. Réponse HTTP

Utilisation de `response()->streamDownload()` ou directement `$dompdf->download()` fourni par le package, avec `Content-Type: application/pdf` et `Content-Disposition: attachment`.

## Risks / Trade-offs

- **[Risque] Styling PDF limité** : Dompdf ne supporte pas tout CSS moderne (Flexbox partiel, Grid non supporté). → Mitigation : template volontairement simple, tableaux pour la mise en page, CSS inline.
- **[Risque] Performance si analyse très longue** : une analyse avec des centaines de clauses pourrait ralentir la génération. → Mitigation : le nombre de clauses par analyse est limité par le schéma IA (typiquement < 30). Acceptable en synchrone.
- **[Risque] Encodage UTF-8 / caractères spéciaux** : Dompdf peut mal gérer certains caractères (accents, césures). → Mitigation : utiliser une police intégrée supportant l'Unicode (DejaVu via config Dompdf).
