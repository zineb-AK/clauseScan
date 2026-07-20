<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_successfully(): void
    {
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('password123'),
        ]);

        $payload = [
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(200)
            ->assertJson(fn (AssertableJson $json) => $json
                ->has('data.id')
                ->has('data.name')
                ->has('data.email')
                ->has('token')
                ->where('data.email', 'john@example.com')
            );
    }

    public function test_login_fails_with_missing_email(): void
    {
        $payload = ['password' => 'password123'];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_login_fails_with_missing_password(): void
    {
        $payload = ['email' => 'john@example.com'];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_login_fails_with_both_fields_missing(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_login_fails_with_invalid_email_format(): void
    {
        $payload = [
            'email' => 'not-an-email',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_login_fails_with_non_existent_email(): void
    {
        $payload = [
            'email' => 'unknown@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(401)
            ->assertJson(fn (AssertableJson $json) => $json
                ->where('message', 'Identifiants invalides.')
                ->missing('token')
            );
    }

    public function test_login_fails_with_incorrect_password(): void
    {
        User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('correct-password'),
        ]);

        $payload = [
            'email' => 'john@example.com',
            'password' => 'wrong-password',
        ];

        $response = $this->postJson('/api/login', $payload);

        $response->assertStatus(401)
            ->assertJson(fn (AssertableJson $json) => $json
                ->where('message', 'Identifiants invalides.')
                ->missing('token')
            );
    }

    public function test_login_generic_message_does_not_reveal_which_field_is_wrong(): void
    {
        $payloadNonExistentEmail = [
            'email' => 'nonexistent@example.com',
            'password' => 'anypassword',
        ];

        User::factory()->create([
            'email' => 'existing@example.com',
            'password' => bcrypt('realpassword'),
        ]);

        $payloadWrongPassword = [
            'email' => 'existing@example.com',
            'password' => 'wrongpassword',
        ];

        $responseNonExistent = $this->postJson('/api/login', $payloadNonExistentEmail);
        $responseWrongPwd = $this->postJson('/api/login', $payloadWrongPassword);

        $responseNonExistent->assertStatus(401)
            ->assertJson(fn (AssertableJson $json) => $json
                ->where('message', 'Identifiants invalides.')
            );

        $responseWrongPwd->assertStatus(401)
            ->assertJson(fn (AssertableJson $json) => $json
                ->where('message', 'Identifiants invalides.')
            );
    }
}
