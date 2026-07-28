## 1. Installation

- [x] 1.1 Install `barryvdh/laravel-dompdf` via Composer: `composer require barryvdh/laravel-dompdf`

## 2. Template Blade

- [x] 2.1 Create `resources/views/reports/analysis.blade.php` with PDF layout (entête : titre contrat + date + statut, clauses extraites en tableau, clauses à risque avec niveau et explication, CSS inline compatible Dompdf)

## 3. Controller & Route

- [x] 3.1 Add `report(Analysis $analysis)` method to `AnalysisController` : authorize via `$this->authorize('view', $analysis)`, return 409 si status !== 'done', charger `contract` + `clauses`, générer PDF via Dompdf avec vue Blade, retourner en téléchargement avec `Content-Disposition: attachment; filename="analyse-{id}.pdf"`
- [x] 3.2 Add route `GET /api/analyses/{analysis}/report` dans le groupe `auth:sanctum` de `routes/api.php`

## 4. Tests Pest

- [x] 4.1 Créer `tests/Feature/AnalysisReportTest.php` couvrant : succès 200 (PDF valide + headers Content-Type + Content-Disposition), 401, 403, 404, 409 pour chaque statut non `done` (pending, processing, failed)

## 5. Finition

- [x] 5.1 Exécuter `vendor/bin/pint --dirty --format agent`
- [x] 5.2 Générer / mettre à jour la documentation Scribe : `php artisan scribe:generate` (ou commande équivalente) — Scribe non installé, à faire quand le package sera ajouté au projet
