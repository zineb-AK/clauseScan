<?php

use App\Models\Analysis;
use App\Models\Clause;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalysisReportTest extends TestCase
{
    use RefreshDatabase;

    private function createDoneAnalysis(User $user): Analysis
    {
        $contract = Contract::factory()->create(['user_id' => $user->id, 'title' => 'Bail de location']);

        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'done',
            'results' => [
                'duree' => '12 mois',
                'preavis' => '3 mois',
                'penalites' => 'Aucune',
                'conditions_resiliation' => 'Préavis écrit de 3 mois',
                'clauses' => [],
            ],
        ]);

        Clause::factory()->highRisk()->create([
            'analysis_id' => $analysis->id,
            'type' => 'Résiliation',
            'content' => 'Clause de résiliation anticipée sans motif',
        ]);

        return $analysis;
    }

    public function test_user_can_download_report_for_completed_analysis(): void
    {
        $user = User::factory()->create();
        $analysis = $this->createDoneAnalysis($user);

        $response = $this->actingAs($user)
            ->getJson("/api/analyses/{$analysis->id}/report");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
        $response->assertHeader('Content-Disposition', 'attachment; filename=analyse-'.$analysis->id.'.pdf');
    }

    public function test_unauthenticated_user_cannot_download_report(): void
    {
        $user = User::factory()->create();
        $analysis = $this->createDoneAnalysis($user);

        $response = $this->getJson("/api/analyses/{$analysis->id}/report");

        $response->assertStatus(401);
    }

    public function test_user_cannot_download_another_users_report(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $analysis = $this->createDoneAnalysis($owner);

        $response = $this->actingAs($other)
            ->getJson("/api/analyses/{$analysis->id}/report");

        $response->assertStatus(403);
    }

    public function test_downloading_report_for_non_existent_analysis_returns_404(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/analyses/99999/report');

        $response->assertStatus(404);
    }

    public function test_pending_analysis_returns_409(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/analyses/{$analysis->id}/report");

        $response->assertStatus(409);
    }

    public function test_processing_analysis_returns_409(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'processing',
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/analyses/{$analysis->id}/report");

        $response->assertStatus(409);
    }

    public function test_failed_analysis_returns_409(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create(['user_id' => $user->id]);
        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'failed',
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/analyses/{$analysis->id}/report");

        $response->assertStatus(409);
    }
}
