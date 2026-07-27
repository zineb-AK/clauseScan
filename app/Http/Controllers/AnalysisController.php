<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnalysisResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
