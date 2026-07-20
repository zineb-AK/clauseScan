<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ImportTextTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_import_contract_as_text(): void
    {
        $user = User::factory()->create();
        $content = "Contrat de prestation\n\nEntre les soussignés...\nArticle 1: Objet\n...";

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', ['content' => $content]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'source_type', 'status', 'created_at'],
            ])
            ->assertJsonPath('data.source_type', 'text')
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.title', 'Contrat de prestation');
    }

    public function test_title_is_derived_from_first_line(): void
    {
        $user = User::factory()->create();
        $content = "  \n  \nBail de location\nArticle 1...";

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', ['content' => $content]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Bail de location');
    }

    public function test_import_fails_with_empty_content(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', ['content' => '']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('content');
    }

    public function test_import_fails_with_whitespace_only_content(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', ['content' => '   ']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('content');
    }

    public function test_import_fails_with_content_exceeding_max_length(): void
    {
        $user = User::factory()->create();
        $content = str_repeat('a', 100001);

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', ['content' => $content]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('content');
    }

    public function test_import_fails_when_both_fields_missing(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', []);

        $response->assertStatus(422);
    }

    public function test_import_fails_when_both_fields_provided(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', [
                'content' => 'Some text',
                'contract' => UploadedFile::fake()->create('contract.pdf', 1024),
            ]);

        $response->assertStatus(422);
    }

    public function test_import_fails_when_unauthenticated(): void
    {
        $response = $this->postJson('/api/contracts', ['content' => 'Some text']);

        $response->assertStatus(401);
    }
}
