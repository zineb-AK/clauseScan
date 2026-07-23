<?php

namespace App\Casts;

use App\ValueObjects\AnalysisResult;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class AnalysisResultCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): ?AnalysisResult
    {
        if ($value === null || $value === 'null') {
            return null;
        }

        $decoded = json_decode(is_string($value) ? $value : $value, true);

        if (! is_array($decoded)) {
            return null;
        }

        return AnalysisResult::fromArray($decoded);
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): ?string
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof AnalysisResult) {
            return json_encode($value->toArray());
        }

        if (is_array($value)) {
            return json_encode($value);
        }

        return $value;
    }
}
