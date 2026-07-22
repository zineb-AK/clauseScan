<?php

use App\Jobs\AnalyzeContractJob;
use App\Models\Analysis;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class AnalyzeContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_analyze_their_contract(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->postJson("/api/contracts/{$contract->id}/analyze");

        $response->assertStatus(202);
        $response->assertJsonStructure([
            'data' => ['id', 'status'],
        ]);
        $response->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('analyses', [
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        Queue::assertPushed(AnalyzeContractJob::class);
    }

    public function test_analyze_fails_when_unauthenticated(): void
    {
        $contract = Contract::factory()->create();

        $response = $this->postJson("/api/contracts/{$contract->id}/analyze");

        $response->assertStatus(401);
    }

    public function test_analyze_fails_for_other_users_contract(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->postJson("/api/contracts/{$contract->id}/analyze");

        $response->assertStatus(403);
    }

    public function test_analyze_fails_for_non_existent_contract(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/contracts/99999/analyze');

        $response->assertStatus(404);
    }

    public function test_analyze_fails_when_analysis_already_in_progress(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);

        Analysis::create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)
            ->postJson("/api/contracts/{$contract->id}/analyze");

        $response->assertStatus(409);
        $response->assertJson([
            'message' => 'Une analyse est déjà en cours pour ce contrat.',
        ]);
    }

    public function test_analyze_allows_new_analysis_when_previous_completed(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);

        Analysis::create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($user)
            ->postJson("/api/contracts/{$contract->id}/analyze");

        $response->assertStatus(202);

        $this->assertDatabaseCount('analyses', 2);
    }
}
