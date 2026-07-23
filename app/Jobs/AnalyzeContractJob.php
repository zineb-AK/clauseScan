<?php

namespace App\Jobs;

use App\Models\Analysis;
use App\ValueObjects\AnalysisResult;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnalyzeContractJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(
        public Analysis $analysis,
    ) {}

    public function handle(): void
    {
        $this->analysis->update(['status' => 'processing']);

        try {
            $contract = $this->analysis->contract;

            if (blank($contract->raw_text)) {
                throw new \RuntimeException('Le contrat ne contient pas de texte à analyser.');
            }

            $jsonSchema = [
                'type' => 'object',
                'properties' => [
                    'duree' => ['type' => 'string'],
                    'preavis' => ['type' => 'string'],
                    'penalites' => ['type' => 'string'],
                    'conditions_resiliation' => ['type' => 'string'],
                    'clauses' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'object',
                            'properties' => [
                                'type' => ['type' => 'string'],
                                'contenu' => ['type' => 'string'],
                                'risk_level' => [
                                    'type' => 'string',
                                    'enum' => ['low', 'medium', 'high'],
                                ],
                                'explanation' => ['type' => 'string'],
                            ],
                            'required' => ['type', 'contenu', 'risk_level', 'explanation'],
                            'additionalProperties' => false,
                        ],
                    ],
                ],
                'required' => ['duree', 'preavis', 'penalites', 'conditions_resiliation', 'clauses'],
                'additionalProperties' => false,
            ];

            $response = Http::withToken(config('ai.api_key'))
                ->timeout(config('ai.timeout'))
                ->post(config('ai.endpoint'), [
                    'model' => config('ai.model'),
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Tu es un assistant juridique spécialisé dans l\'analyse de contrats. '
                                .'Extrais les informations demandées du contrat fourni. '
                                .'Pour chaque clause que tu extrais, évalue son niveau de risque (low = standard, medium = attention nécessaire, high = abusive ou dangereuse) '
                                .'et fournis une explication en langage simple compréhensible par un non-juriste. '
                                .'Réponds UNIQUEMENT avec le JSON structuré demandé, en français, sans commentaire supplémentaire.',
                        ],
                        [
                            'role' => 'user',
                            'content' => "Analyse le contrat suivant et extrais les clauses principales :\n\n{$contract->raw_text}",
                        ],
                    ],
                    'response_format' => [
                        'type' => 'json_schema',
                        'json_schema' => [
                            'name' => 'contract_analysis',
                            'strict' => true,
                            'schema' => $jsonSchema,
                        ],
                    ],
                ]);

            if ($response->failed()) {
                throw new \RuntimeException(
                    "OpenRouter a retourné un statut {$response->status()}: {$response->body()}"
                );
            }

            $body = $response->json();

            if ($body === null || ! isset($body['choices'][0]['message']['content'])) {
                throw new \RuntimeException('Réponse IA invalide : structure inattendue.');
            }

            $content = $body['choices'][0]['message']['content'];
            $decoded = json_decode($content, true);

            if (! is_array($decoded)) {
                throw new \RuntimeException('Réponse IA invalide : le JSON renvoyé est mal formé.');
            }

            $this->validateResponse($decoded);

            $result = AnalysisResult::fromArray($decoded);

            $this->analysis->update([
                'status' => 'done',
                'results' => $result,
            ]);
        } catch (\Throwable $e) {
            Log::error('Analyse IA échouée', [
                'analysis_id' => $this->analysis->id,
                'error' => $e->getMessage(),
            ]);

            $this->analysis->update(['status' => 'failed']);
        }
    }

    private function validateResponse(array $data): void
    {
        $required = ['duree', 'preavis', 'penalites', 'conditions_resiliation', 'clauses'];

        foreach ($required as $field) {
            if (! array_key_exists($field, $data)) {
                throw new \RuntimeException("Champ requis manquant dans la réponse IA : {$field}.");
            }
        }

        if (! is_array($data['clauses'])) {
            throw new \RuntimeException('Le champ "clauses" doit être un tableau.');
        }

        foreach ($data['clauses'] as $index => $clause) {
            if (! isset($clause['type'], $clause['contenu'], $clause['risk_level'], $clause['explanation'])) {
                throw new \RuntimeException(
                    "Clause #{$index} invalide : les champs 'type', 'contenu', 'risk_level' et 'explanation' sont requis."
                );
            }
        }
    }
}
