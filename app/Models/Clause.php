<?php

namespace App\Models;

use Database\Factories\ClauseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Clause extends Model
{
    /** @use HasFactory<ClauseFactory> */
    use HasFactory;

    protected $fillable = [
        'analysis_id',
        'type',
        'content',
        'risk_level',
        'explanation',
    ];

    public function analysis(): BelongsTo
    {
        return $this->belongsTo(Analysis::class);
    }
}
