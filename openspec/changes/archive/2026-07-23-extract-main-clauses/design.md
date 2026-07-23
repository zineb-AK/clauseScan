## Context

Le projet ClauseScan doit analyser des contrats via IA. `AnalyzeContractJob` est actuellement un stub vide : il est bien dispatché depuis `ContractController::analyze()` avec un status `pending`, mais `handle()` ne fait rien. Le statut `processing` n'est jamais écrit en base. La colonne `results` (type `json`) existe mais n'est jamais remplie.

Le pipeline à implémenter :
1. Le controller crée une `Analysis` (status `pending`) et dispatch le Job.
2. Le Job passe le statut à `processing`, appelle OpenRouter avec `raw_text`, reçoit un JSON structuré.
3. Le Job valide et stocke le résultat, passe le statut à `done` (ou `failed` en cas d'erreur).

## Goals / Non-Goals

**Goals:**
- Implémenter `AnalyzeContractJob::handle()` avec le pipeline complet (statuts, appel IA, stockage).
- Créer un Cast Eloquent dédié (`AnalysisResultCast`) pour typer la colonne `results` en `AnalysisResult`.
- Créer les DTO `AnalysisResult` et `ClauseItem` pour garantir la structure en PHP.
- Configurer le client HTTP OpenRouter (endpoint, model, timeout) dans `config/ai.php`.
- Couvrir le comportement avec des tests Pest (succès, erreur IA, hors schéma).

**Non-Goals:**
- Implémenter la détection de clauses à risque (US10) ou l'explication (US11) — ce sera dans des changes ultérieurs. US9 fournit la structure de base (type, contenu) sans `risk_level` ni `explanation` dans l'appel IA.
- Créer la table `clauses` (entité dédiée) — le stockage se fait dans `results` JSON via le Cast.
- Sortir le `raw_text` du contrat du Job — le texte est chargé depuis la relation `Contract` directement dans le Job (context stuffing).
- Changer le contrat vis-à-vis du frontend ou de l'API — le flux existant est conservé.

## Decisions

### D1 : Appel OpenRouter via `Http::withToken()` (pas de SDK dédié)

- **Choix** : Utiliser le facade `Http` de Laravel (`Http::withToken(config('ai.api_key'))->post(...)`) dans le Job directement, pas de service séparé ni de client SDK.
- **Raison** : Pas de dépendance externe supplémentaire. Le Job est le seul appelant à ce stade. Si plusieurs appels IA apparaissent (US17), on extraira un service.
- **Alternative rejetée** : `laravel/ai` SDK — nécessite une installation Composer supplémentaire, apporte une abstraction qui n'est pas encore justifiée pour un seul point d'appel.

### D2 : Structured output via JSON Schema dans le `system_prompt` et `response_format`

- **Choix** : Utiliser le paramètre `response_format` de l'API OpenAI/OpenRouter avec `type: json_schema` et un JSON Schema strict qui définit les champs `duree`, `preavis`, `penalites`, `conditions_resiliation` (strings) et `clauses` (tableau d'objets avec `type`, `contenu`).
- **Raison** : OpenRouter supporte le paramètre `response_format` pour les modèles compatibles (Claude, GPT-4o, Gemini). Cela garantit que la réponse est toujours un JSON valide conforme au schéma.
- **Alternative rejetée** : Validation côté PHP uniquement après un appel libre — le modèle peut retourner du JSON invalide ou hors schéma. Avec `response_format`, le modèle est contraint nativement.

### D3 : Cast Eloquent `AnalysisResultCast` au lieu de `array`

- **Choix** : Remplacer le cast `'results' => 'array'` par `'results' => AnalysisResultCast::class` qui hydrate un DTO `AnalysisResult`.
- **Raison** : Garantit que le code PHP manipule toujours un objet typé (avec getters documentés) plutôt qu'un tableau associatif fragile. Facilite la sérialisation/désérialisation.
- **Alternative rejetée** : Garder `array` et valider à la main à chaque lecture — risque d'incohérence et de duplication de validation.

### D4 : Gestion d'erreur — try/catch + statut `failed`

- **Choix** : Tout le `handle()` est entouré d'un `try/catch`. Toute exception (timeout HTTP, réponse invalide, JSON mal formé, champ manquant) → `$analysis->update(['status' => 'failed'])` et log de l'erreur.
- **Raison** : Les appels LLM sont imprévisibles (timeout, hallucinations, format inattendu). Le Job ne doit pas échouer silencieusement ou rester bloqué en `processing`.
- **Alternative rejetée** : Propager l'exception et laisser le worker retry — un retry ne changera pas le fait que la réponse IA était invalide. Mieux vaut passer en `failed` et laisser l'utilisateur relancer.

### D5 : Modèle OpenRouter configurable via `.env`

- **Choix** : `config/ai.php` expose :
  ```php
  'api_key' => env('OPENROUTER_API_KEY'),
  'model' => env('OPENROUTER_MODEL', 'openai/gpt-4o-mini'),
  'endpoint' => env('OPENROUTER_ENDPOINT', 'https://openrouter.ai/api/v1/chat/completions'),
  'timeout' => env('OPENROUTER_TIMEOUT', 120),
  ```
- **Raison** : Permet de changer de modèle sans déployer (utile en dev avec des modèles moins chers). Le timeout long (120s) est nécessaire car les extractions de longs contrats peuvent prendre du temps.

### D6 : Statut `done` (pas `completed`)

- **Choix** : Utiliser la valeur `done` plutôt que `completed` pour le statut final de succès. La valeur `completed` était utilisée de manière incohérente dans les tests avant ce change.
- **Raison** : Correspond à la convention `pending|processing|done|failed` définie dans le modèle de données openspec. Une migration met à jour les éventuels enregistrements `completed` existants.

### D7 : JSON Schema strict pour `response_format`

- **Choix** : Le schéma côté API OpenRouter est :
  ```json
  {
    "type": "object",
    "properties": {
      "duree": { "type": "string" },
      "preavis": { "type": "string" },
      "penalites": { "type": "string" },
      "conditions_resiliation": { "type": "string" },
      "clauses": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "type": { "type": "string" },
            "contenu": { "type": "string" }
          },
          "required": ["type", "contenu"],
          "additionalProperties": false
        }
      }
    },
    "required": ["duree", "preavis", "penalites", "conditions_resiliation", "clauses"],
    "additionalProperties": false
  }
  ```
- **Raison** : La contrainte `additionalProperties: false` au niveau racine et dans les items garantit que l'IA n'ajoute pas de champ surprise. Les champs principaux sont des strings (pas de nested object complexe) pour maximiser la compatibilité entre modèles.
- **Note** : Les champs `risk_level` et `explanation` ne sont pas demandés ici — ils seront ajoutés dans US10/US11.

## Risks / Trade-offs

- **[Risque] Timeout OpenRouter** : Un contrat très long (>50k tokens) peut dépasser le timeout de 120s. → **Mitigation** : Le timeout est configurable via `.env`. Si le problème persiste, on pourra tronquer le texte ou passer à un modèle avec une fenêtre de contexte plus grande.
- **[Risque] Réponse IA hors schéma malgré `response_format`** : Certains modèles ou versions d'API peuvent ne pas respecter strictement le JSON Schema. → **Mitigation** : La validation PHP avec `@throws InvalidAiResponseException` est conservée en second rideau après l'API.
- **[Risque] Coût API** : Chaque analyse envoie le texte complet du contrat. Pour de très longs contrats, le coût token peut être élevé. → **Mitigation** : Le modèle par défaut (`gpt-4o-mini`) est économique. Le modèle est configurable.
- **[Risque] Blocage en `processing`** : Si le Job est killé (worker crash, déploiement) avant de passer en `done`/`failed`, l'analyse reste bloquée. → **Mitigation** : Le contrôleur utilise déjà `whereIn('status', ['pending', 'processing'])` pour détecter les conflits, donc un retry manuel est possible. Une future US pourrait ajouter un cleanup des `processing` orphelins.

## Open Questions

- Faut-il envoyer un titre de contrat ou metadata supplémentaire dans le prompt système en plus de `raw_text` ? → Non, pour US9 on envoie seulement `raw_text`. Les métadonnées pourront être ajoutées au prompt dans US11 si nécessaire.
- Quel niveau de détail pour la description des champs dans le JSON Schema ? → Les descriptions dans `"description"` du schéma sont suffisantes, pas besoin de `system_prompt` complexe pour US9.
