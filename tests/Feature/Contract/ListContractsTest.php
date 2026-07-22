<?php

use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListContractsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_their_contracts(): void
    {
        $user = User::factory()->create();
        Contract::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/contracts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'source_type', 'status', 'created_at'],
                ],
                'meta' => ['total', 'current_page', 'per_page'],
            ])
            ->assertJsonPath('meta.total', 3);
    }

    public function test_contracts_are_ordered_by_creation_date_descending(): void
    {
        $user = User::factory()->create();
        $old = Contract::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDays(2)]);
        $new = Contract::factory()->create(['user_id' => $user->id, 'created_at' => now()]);

        $response = $this->actingAs($user)->getJson('/api/contracts');

        $response->assertStatus(200);
        $this->assertEquals($new->id, $response->json('data.0.id'));
        $this->assertEquals($old->id, $response->json('data.1.id'));
    }

    public function test_list_fails_when_unauthenticated(): void
    {
        $response = $this->getJson('/api/contracts');

        $response->assertStatus(401);
    }

    public function test_empty_list_returns_empty_data(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/contracts');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('data', []);
    }

    public function test_only_own_contracts_are_returned(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Contract::factory()->count(2)->create(['user_id' => $otherUser->id]);
        Contract::factory()->count(1)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/contracts');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1);
    }
}
