<?php

use App\Models\Analysis;
use App\Models\Clause;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalysisShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_completed_analysis(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'done',
        ]);

        Clause::factory()->count(2)->create([
            'analysis_id' => $analysis->id,
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/analyses/{$analysis->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'status',
                'results',
                'clauses' => [
                    '*' => ['id', 'type', 'content', 'risk_level', 'explanation'],
                ],
            ],
        ]);
        $response->assertJsonPath('data.status', 'done');
    }

    public function test_pending_analysis_returns_status_only(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/analyses/{$analysis->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('data.status', 'pending');
        $response->assertJsonPath('data.results', null);
        $response->assertJsonMissingPath('data.clauses');
    }

    public function test_processing_analysis_returns_status_only(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'processing',
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/analyses/{$analysis->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('data.status', 'processing');
        $response->assertJsonPath('data.results', null);
        $response->assertJsonMissingPath('data.clauses');
    }

    public function test_user_cannot_view_another_users_analysis(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $otherUser->id]);
        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $otherUser->id,
            'status' => 'done',
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/analyses/{$analysis->id}");

        $response->assertStatus(403);
    }

    public function test_viewing_non_existent_analysis_returns_404(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/analyses/99999');

        $response->assertStatus(404);
    }

    public function test_unauthenticated_user_cannot_view_analysis(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'done',
        ]);

        $response = $this->getJson("/api/analyses/{$analysis->id}");

        $response->assertStatus(401);
    }
}
