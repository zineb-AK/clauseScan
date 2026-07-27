<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnalysisResource;
use App\Models\Analysis;
use Illuminate\Http\JsonResponse;

class AnalysisController extends Controller
{
    public function show(Analysis $analysis): JsonResponse
    {
        $this->authorize('view', $analysis);

        if ($analysis->status === 'done') {
            $analysis->load('clauses');
        }

        return (new AnalysisResource($analysis))->response();
    }
}
