<?php

use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DeleteContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_delete_their_contract(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/contracts/{$contract->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('contracts', ['id' => $contract->id]);
    }

    public function test_delete_also_removes_pdf_file(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('contract.pdf', 1024);
        $path = $file->store('contracts');

        $contract = Contract::factory()->create([
            'user_id' => $user->id,
            'source_type' => 'pdf',
            'file_path' => $path,
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/contracts/{$contract->id}");

        $response->assertStatus(204);
        Storage::assertMissing($path);
    }

    public function test_delete_fails_when_unauthenticated(): void
    {
        $contract = Contract::factory()->create();

        $response = $this->deleteJson("/api/contracts/{$contract->id}");

        $response->assertStatus(401);
    }

    public function test_delete_fails_for_other_users_contract(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/contracts/{$contract->id}");

        $response->assertStatus(403);
    }

    public function test_delete_fails_for_non_existent_contract(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->deleteJson('/api/contracts/99999');

        $response->assertStatus(404);
    }
}
