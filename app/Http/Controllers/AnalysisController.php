<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnalysisResource;
use App\Models\Analysis;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AnalysisController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $analyses = $request->user()
            ->analyses()
            ->orderBy('created_at', 'desc')
            ->paginate(min($request->integer('per_page', 15), 100));

        return AnalysisResource::collection($analyses)->response();
    }

    public function show(Analysis $analysis): JsonResponse
    {
        $this->authorize('view', $analysis);

        if ($analysis->status === 'done') {
            $analysis->load('clauses');
        }

        return (new AnalysisResource($analysis))->response();
    }

    public function report(Analysis $analysis): Response
    {
        $this->authorize('view', $analysis);

        if ($analysis->status !== 'done') {
            abort(409, 'L\'analyse n\'est pas encore terminée.');
        }

        $analysis->load('contract', 'clauses');

        $pdf = Pdf::loadView('reports.analysis', ['analysis' => $analysis]);

        return $pdf->download('analyse-'.$analysis->id.'.pdf');
    }
}
