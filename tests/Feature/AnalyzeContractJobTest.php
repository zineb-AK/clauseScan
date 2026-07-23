<?php

use App\Jobs\AnalyzeContractJob;
use App\Models\Analysis;
use App\Models\Contract;
use App\Models\User;
use App\ValueObjects\AnalysisResult;
use App\ValueObjects\ClauseItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AnalyzeContractJobTest extends TestCase
{
    use RefreshDatabase;

    private function fakeAnalysis(): Analysis
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create([
            'user_id' => $user->id,
            'raw_text' => "Bail de location\n\nArticle 1 : Durée : 12 mois\nArticle 2 : Préavis : 3 mois\nArticle 3 : Pénalités : 10%",
        ]);

        return Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
    }

    public function test_successful_extraction_with_risk_levels(): void
    {
        Http::fake([
            config('ai.endpoint') => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'duree' => '12 mois',
                                'preavis' => '3 mois',
                                'penalites' => '10% du montant total',
                                'conditions_resiliation' => 'Résiliation possible après 6 mois avec un préavis de 2 mois',
                                'clauses' => [
                                    [
                                        'type' => 'durée',
                                        'contenu' => 'Le contrat est conclu pour une durée de 12 mois.',
                                        'risk_level' => 'low',
                                        'explanation' => 'La durée est standard pour ce type de contrat.',
                                    ],
                                    [
                                        'type' => 'préavis',
                                        'contenu' => 'Le préavis de résiliation est de 3 mois.',
                                        'risk_level' => 'medium',
                                        'explanation' => 'Un préavis de 3 mois est relativement long, vérifiez si c\'est adapté à votre situation.',
                                    ],
                                ],
                            ]),
                        ],
                    ],
                ],
            ]),
        ]);

        $analysis = $this->fakeAnalysis();
        $job = new AnalyzeContractJob($analysis);
        $job->handle();

        $analysis->refresh();

        $this->assertEquals('done', $analysis->status);
        $this->assertNotNull($analysis->results);
        $this->assertInstanceOf(AnalysisResult::class, $analysis->results);
        $this->assertEquals('12 mois', $analysis->results->duree);
        $this->assertCount(2, $analysis->results->clauses);

        $this->assertInstanceOf(ClauseItem::class, $analysis->results->clauses[0]);
        $this->assertEquals('durée', $analysis->results->clauses[0]->type);
        $this->assertEquals('low', $analysis->results->clauses[0]->risk_level);
        $this->assertNotNull($analysis->results->clauses[0]->explanation);

        $this->assertEquals('préavis', $analysis->results->clauses[1]->type);
        $this->assertEquals('medium', $analysis->results->clauses[1]->risk_level);
        $this->assertNotNull($analysis->results->clauses[1]->explanation);
    }

    public function test_multiple_risk_levels_are_parsed(): void
    {
        Http::fake([
            config('ai.endpoint') => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'duree' => '12 mois',
                                'preavis' => '1 mois',
                                'penalites' => 'Aucune',
                                'conditions_resiliation' => 'Préavis de 1 mois',
                                'clauses' => [
                                    [
                                        'type' => 'durée',
                                        'contenu' => 'Durée déterminée de 12 mois.',
                                        'risk_level' => 'low',
                                        'explanation' => 'Clause standard.',
                                    ],
                                    [
                                        'type' => 'indexation',
                                        'contenu' => 'Indexation sur l\'indice INSEE.',
                                        'risk_level' => 'medium',
                                        'explanation' => 'Vérifiez le plafonnement.',
                                    ],
                                    [
                                        'type' => 'résiliation abusive',
                                        'contenu' => 'Le bailleur peut résilier sans motif.',
                                        'risk_level' => 'high',
                                        'explanation' => 'Cette clause est abusive car elle ne respecte pas l\'équilibre contractuel.',
                                    ],
                                ],
                            ]),
                        ],
                    ],
                ],
            ]),
        ]);

        $analysis = $this->fakeAnalysis();
        $job = new AnalyzeContractJob($analysis);
        $job->handle();

        $analysis->refresh();

        $this->assertEquals('done', $analysis->status);
        $this->assertCount(3, $analysis->results->clauses);
        $this->assertEquals('low', $analysis->results->clauses[0]->risk_level);
        $this->assertEquals('medium', $analysis->results->clauses[1]->risk_level);
        $this->assertEquals('high', $analysis->results->clauses[2]->risk_level);
    }

    public function test_job_fails_when_risk_level_missing_on_clause(): void
    {
        Http::fake([
            config('ai.endpoint') => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'duree' => '12 mois',
                                'preavis' => '3 mois',
                                'penalites' => '10%',
                                'conditions_resiliation' => 'Préavis de 3 mois',
                                'clauses' => [
                                    [
                                        'type' => 'durée',
                                        'contenu' => 'Durée de 12 mois.',
                                        // risk_level manquant
                                        'explanation' => 'Clause standard.',
                                    ],
                                ],
                            ]),
                        ],
                    ],
                ],
            ]),
        ]);

        $analysis = $this->fakeAnalysis();
        $job = new AnalyzeContractJob($analysis);
        $job->handle();

        $analysis->refresh();

        $this->assertEquals('failed', $analysis->status);
        $this->assertNull($analysis->results);
    }

    public function test_job_sets_processing_at_start(): void
    {
        Http::fake([
            config('ai.endpoint') => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'duree' => '12 mois',
                                'preavis' => '3 mois',
                                'penalites' => 'Aucune',
                                'conditions_resiliation' => 'Préavis de 3 mois',
                                'clauses' => [],
                            ]),
                        ],
                    ],
                ],
            ]),
        ]);

        $analysis = $this->fakeAnalysis();
        $job = new AnalyzeContractJob($analysis);

        $this->assertEquals('pending', $analysis->status);

        $job->handle();

        $this->assertDatabaseHas('analyses', [
            'id' => $analysis->id,
            'status' => 'done',
        ]);
    }

    public function test_job_sets_status_failed_on_http_error(): void
    {
        Http::fake([
            config('ai.endpoint') => Http::response(null, 500),
        ]);

        $analysis = $this->fakeAnalysis();
        $job = new AnalyzeContractJob($analysis);
        $job->handle();

        $analysis->refresh();

        $this->assertEquals('failed', $analysis->status);
        $this->assertNull($analysis->results);
    }

    public function test_job_sets_status_failed_on_invalid_json_response(): void
    {
        Http::fake([
            config('ai.endpoint') => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => 'Ceci n\'est pas du JSON valide',
                        ],
                    ],
                ],
            ]),
        ]);

        $analysis = $this->fakeAnalysis();
        $job = new AnalyzeContractJob($analysis);
        $job->handle();

        $analysis->refresh();

        $this->assertEquals('failed', $analysis->status);
        $this->assertNull($analysis->results);
    }

    public function test_job_sets_status_failed_on_missing_required_fields(): void
    {
        Http::fake([
            config('ai.endpoint') => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'duree' => '12 mois',
                                'preavis' => '3 mois',
                                'penalites' => 'Aucune',
                                'conditions_resiliation' => 'Préavis de 3 mois',
                            ]),
                        ],
                    ],
                ],
            ]),
        ]);

        $analysis = $this->fakeAnalysis();
        $job = new AnalyzeContractJob($analysis);
        $job->handle();

        $analysis->refresh();

        $this->assertEquals('failed', $analysis->status);
        $this->assertNull($analysis->results);
    }

    public function test_job_sets_status_done_with_empty_clauses_array(): void
    {
        Http::fake([
            config('ai.endpoint') => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'duree' => '12 mois',
                                'preavis' => '3 mois',
                                'penalites' => 'Aucune',
                                'conditions_resiliation' => 'Préavis de 3 mois',
                                'clauses' => [],
                            ]),
                        ],
                    ],
                ],
            ]),
        ]);

        $analysis = $this->fakeAnalysis();
        $job = new AnalyzeContractJob($analysis);
        $job->handle();

        $analysis->refresh();

        $this->assertEquals('done', $analysis->status);
        $this->assertNotNull($analysis->results);
        $this->assertCount(0, $analysis->results->clauses);
    }

    public function test_job_sets_failed_on_empty_raw_text(): void
    {
        $user = User::factory()->create();
        $contract = Contract::factory()->create([
            'user_id' => $user->id,
            'raw_text' => '',
        ]);

        $analysis = Analysis::factory()->create([
            'contract_id' => $contract->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $job = new AnalyzeContractJob($analysis);
        $job->handle();

        $analysis->refresh();

        $this->assertEquals('failed', $analysis->status);
        $this->assertNull($analysis->results);
    }
}
