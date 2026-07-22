<?php

namespace App\Providers;

use App\Models\Analysis;
use App\Models\Contract;
use App\Policies\AnalysisPolicy;
use App\Policies\ContractPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Analysis::class => AnalysisPolicy::class,
        Contract::class => ContractPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
