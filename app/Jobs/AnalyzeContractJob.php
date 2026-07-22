<?php

namespace App\Jobs;

use App\Models\Analysis;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;

class AnalyzeContractJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(
        public Analysis $analysis,
    ) {}

    public function handle(): void
    {
        // L'analyse IA sera implémentée dans US9-US11
    }
}
