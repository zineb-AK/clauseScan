<?php

use App\Models\Analysis;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalysisHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_their_analyses(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id, 'title' => 'Bail de location']);
        Analysis::factory()->count(3)->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/analyses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'contract_title', 'status', 'created_at'],
                ],
                'meta' => ['total', 'current_page', 'per_page'],
            ])
            ->assertJsonPath('meta.total', 3);
    }

    public function test_list_fails_when_unauthenticated(): void
    {
        $response = $this->getJson('/api/analyses');

        $response->assertStatus(401);
    }

    public function test_empty_list_returns_empty_data(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/analyses');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('data', []);
    }

    public function test_only_own_analyses_are_returned(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $otherContract = Contract::factory()->create(['user_id' => $otherUser->id]);
        Analysis::factory()->count(2)->create([
            'contract_id' => $otherContract->id,
            'user_id' => $otherUser->id,
        ]);
        Analysis::factory()->count(1)->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->getJson('/api/analyses');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1);
    }

    public function test_pagination_respects_per_page_parameter(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        Analysis::factory()->count(15)->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/analyses?per_page=5');

        $response->assertStatus(200)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonCount(5, 'data');
    }

    public function test_analyses_are_ordered_by_created_at_descending(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $old = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'created_at' => now()->subDays(2),
        ]);
        $new = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'created_at' => now(),
        ]);

        $response = $this->actingAs($user)->getJson('/api/analyses');

        $response->assertStatus(200);
        $this->assertEquals($new->id, $response->json('data.0.id'));
        $this->assertEquals($old->id, $response->json('data.1.id'));
    }
}
