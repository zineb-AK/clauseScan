<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_successfully(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJson(fn (AssertableJson $json) => $json
                ->has('data.id')
                ->has('data.name')
                ->has('data.email')
                ->has('token')
                ->where('data.name', 'John Doe')
                ->where('data.email', 'john@example.com')
            );

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'name' => 'John Doe',
        ]);
    }

    public function test_password_is_hashed(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->postJson('/api/register', $payload);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    public function test_registration_fails_with_missing_name(): void
    {
        $payload = [
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_registration_fails_with_missing_email(): void
    {
        $payload = [
            'name' => 'John Doe',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_registration_fails_with_missing_password(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_registration_fails_with_invalid_email(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'not-an-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_registration_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'john@example.com']);

        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_registration_fails_with_short_password(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_registration_fails_with_password_confirmation_mismatch(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }
}
