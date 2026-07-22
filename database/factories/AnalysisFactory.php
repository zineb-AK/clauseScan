<?php

namespace Database\Factories;

use App\Models\Analysis;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnalysisFactory extends Factory
{
    protected $model = Analysis::class;

    public function definition(): array
    {
        return [
            'contract_id' => Contract::factory(),
            'user_id' => User::factory(),
            'status' => 'pending',
            'results' => null,
        ];
    }
}
