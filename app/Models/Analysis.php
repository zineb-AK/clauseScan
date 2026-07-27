<?php

namespace App\Models;

use App\Casts\AnalysisResultCast;
use Database\Factories\AnalysisFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Analysis extends Model
{
    /** @use HasFactory<AnalysisFactory> */
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'user_id',
        'status',
        'results',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function clauses(): HasMany
    {
        return $this->hasMany(Clause::class);
    }

    protected function casts(): array
    {
        return [
            'results' => AnalysisResultCast::class,
        ];
    }
}
