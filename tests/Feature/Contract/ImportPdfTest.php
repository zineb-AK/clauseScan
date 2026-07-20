<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ImportPdfTest extends TestCase
{
    use RefreshDatabase;

    private function createTestPdf(): UploadedFile
    {
        $content = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length 44>>stream\nBT /F1 12 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n0000000355 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n415\n%%EOF";

        $tempDir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR);
        $path = $tempDir.DIRECTORY_SEPARATOR.'test-contract-'.uniqid().'.pdf';
        file_put_contents($path, $content);

        return new UploadedFile($path, 'contract.pdf', 'application/pdf', null, true);
    }

    public function test_user_can_import_pdf_contract(): void
    {
        $user = User::factory()->create();
        $pdf = $this->createTestPdf();

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', ['contract' => $pdf]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'source_type', 'status', 'created_at'],
            ])
            ->assertJsonPath('data.source_type', 'pdf')
            ->assertJsonPath('data.status', 'pending');
    }

    public function test_import_fails_when_unauthenticated(): void
    {
        $pdf = UploadedFile::fake()->create('contract.pdf', 1024);

        $response = $this->postJson('/api/contracts', ['contract' => $pdf]);

        $response->assertStatus(401);
    }

    public function test_import_fails_with_missing_file(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('contract');
    }

    public function test_import_fails_with_non_pdf_file(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('contract.docx', 1024);

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', ['contract' => $file]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('contract');
    }

    public function test_import_fails_with_oversized_file(): void
    {
        $user = User::factory()->create();
        $pdf = UploadedFile::fake()->create('contract.pdf', 11264);

        $response = $this->actingAs($user)
            ->postJson('/api/contracts', ['contract' => $pdf]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('contract');
    }
}
