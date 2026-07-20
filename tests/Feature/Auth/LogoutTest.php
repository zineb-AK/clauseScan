<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/logout');

        $response->assertStatus(204);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_logout_fails_when_unauthenticated(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }
}
