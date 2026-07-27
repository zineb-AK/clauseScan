<?php

namespace App\ValueObjects;

class AnalysisResult
{
    /** @param ClauseItem[] $clauses */
    public function __construct(
        public readonly string $duree,
        public readonly string $preavis,
        public readonly string $penalites,
        public readonly string $conditions_resiliation,
        public readonly array $clauses,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            duree: $data['duree'],
            preavis: $data['preavis'],
            penalites: $data['penalites'],
            conditions_resiliation: $data['conditions_resiliation'],
            clauses: array_map(fn (array $clause) => ClauseItem::fromArray($clause), $data['clauses']),
        );
    }

    public function toArray(): array
    {
        return [
            'duree' => $this->duree,
            'preavis' => $this->preavis,
            'penalites' => $this->penalites,
            'conditions_resiliation' => $this->conditions_resiliation,
            'clauses' => array_map(fn (ClauseItem $clause) => $clause->toArray(), $this->clauses),
        ];
    }
}
