<?php

namespace Database\Factories;

use App\Models\Analysis;
use App\Models\Clause;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClauseFactory extends Factory
{
    protected $model = Clause::class;

    public function definition(): array
    {
        return [
            'analysis_id' => Analysis::factory(),
            'type' => fake()->word(),
            'content' => fake()->sentence(),
            'risk_level' => 'low',
            'explanation' => fake()->sentence(),
        ];
    }

    public function lowRisk(): static
    {
        return $this->state(fn (array $attrs) => [
            'risk_level' => 'low',
            'explanation' => fake()->sentence(),
        ]);
    }

    public function mediumRisk(): static
    {
        return $this->state(fn (array $attrs) => [
            'risk_level' => 'medium',
            'explanation' => fake()->sentence(),
        ]);
    }

    public function highRisk(): static
    {
        return $this->state(fn (array $attrs) => [
            'risk_level' => 'high',
            'explanation' => fake()->sentence(),
        ]);
    }
}
