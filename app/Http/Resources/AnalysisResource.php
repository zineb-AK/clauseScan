<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use App\Http\Resources\ClauseResource;

class AnalysisResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'contract_title' => $this->contract?->title,
            'status' => $this->status,
            'results' => $this->results?->toArray(),
            'clauses' => ClauseResource::collection($this->whenLoaded('clauses')),
            'created_at' => $this->created_at,
        ];
    }
}
