<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            margin: 0;
            padding: 20px;
        }
        .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 20px;
            color: #1e3a5f;
            margin: 0 0 4px 0;
        }
        .header .meta {
            font-size: 11px;
            color: #6b7280;
        }
        .section {
            margin-bottom: 18px;
        }
        .section h2 {
            font-size: 14px;
            color: #1e3a5f;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 4px;
            margin-bottom: 10px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .summary-table td {
            padding: 6px 8px;
            border: 1px solid #d1d5db;
            vertical-align: top;
        }
        .summary-table td:first-child {
            font-weight: bold;
            width: 35%;
            background-color: #f3f4f6;
        }
        .clauses-table {
            width: 100%;
            border-collapse: collapse;
        }
        .clauses-table th {
            background-color: #1e3a5f;
            color: #ffffff;
            padding: 6px 8px;
            text-align: left;
            border: 1px solid #1e3a5f;
        }
        .clauses-table td {
            padding: 6px 8px;
            border: 1px solid #d1d5db;
            vertical-align: top;
        }
        .clauses-table tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .risk-low { color: #16a34a; font-weight: bold; }
        .risk-medium { color: #d97706; font-weight: bold; }
        .risk-high { color: #dc2626; font-weight: bold; }
        .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #d1d5db;
            font-size: 10px;
            color: #9ca3af;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Rapport d'analyse — {{ $analysis->contract->title }}</h1>
        <div class="meta">
            Généré le {{ $analysis->created_at->format('d/m/Y à H:i') }}
            · Statut : {{ $analysis->status }}
        </div>
    </div>

    <div class="section">
        <h2>Résumé des clauses extraites</h2>
        <table class="summary-table">
            <tr>
                <td>Durée du contrat</td>
                <td>{{ $analysis->results->duree }}</td>
            </tr>
            <tr>
                <td>Préavis</td>
                <td>{{ $analysis->results->preavis }}</td>
            </tr>
            <tr>
                <td>Pénalités</td>
                <td>{{ $analysis->results->penalites }}</td>
            </tr>
            <tr>
                <td>Conditions de résiliation</td>
                <td>{{ $analysis->results->conditions_resiliation }}</td>
            </tr>
        </table>
    </div>

    @if($analysis->clauses->count() > 0)
    <div class="section">
        <h2>Clauses à risque</h2>
        <table class="clauses-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Contenu</th>
                    <th>Niveau</th>
                    <th>Explication</th>
                </tr>
            </thead>
            <tbody>
                @foreach($analysis->clauses as $clause)
                <tr>
                    <td>{{ $clause->type }}</td>
                    <td>{{ $clause->content }}</td>
                    <td>
                        @if($clause->risk_level === 'high')
                            <span class="risk-high">Élevé</span>
                        @elseif($clause->risk_level === 'medium')
                            <span class="risk-medium">Moyen</span>
                        @else
                            <span class="risk-low">Faible</span>
                        @endif
                    </td>
                    <td>{{ $clause->explanation }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        ClauseScan — Rapport généré automatiquement
    </div>

</body>
</html>
