<?php

namespace App\ValueObjects;

class ClauseItem
{
    public function __construct(
        public readonly string $type,
        public readonly string $contenu,
        public readonly ?string $risk_level = null,
        public readonly ?string $explanation = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            type: $data['type'],
            contenu: $data['contenu'],
            risk_level: $data['risk_level'] ?? null,
            explanation: $data['explanation'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'type' => $this->type,
            'contenu' => $this->contenu,
            'risk_level' => $this->risk_level,
            'explanation' => $this->explanation,
        ], fn ($value) => $value !== null);
    }
}
