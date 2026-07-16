<laravel-boost-guidelines>
=== foundation rules ===

# ClauseScan — Projet Fil Rouge

Application de fin de formation **Développeur Web et Web Mobile (DWWM/Backend)** — Backend augmenté par l'IA.

## 1. Présentation du projet

ClauseScan est une application basée sur une API REST développée avec Laravel. Elle utilise l'intelligence artificielle pour analyser automatiquement des contrats, comme les baux de location ou les contrats de prestation freelance.

L'application extrait les informations importantes du contrat, détecte les clauses pouvant présenter un risque et les explique dans un langage simple. Son objectif est d'aider les utilisateurs à mieux comprendre leurs contrats grâce à une analyse rapide et structurée.

## 2. Contexte

Aujourd'hui, de nombreuses personnes signent des contrats de location ou des contrats de prestation sans comprendre entièrement leur contenu. Ces documents contiennent souvent des termes juridiques complexes qui rendent leur lecture difficile pour les non-spécialistes.

Par ailleurs, les avancées de l'intelligence artificielle permettent désormais d'analyser automatiquement des textes, d'en extraire les informations importantes et de reformuler les passages difficiles dans un langage plus simple.

Dans ce contexte, le projet ClauseScan a pour objectif de développer une API basée sur Laravel et l'intelligence artificielle afin d'aider les utilisateurs à mieux comprendre les contrats qu'ils consultent ou signent.

## 3. Problématique

Comment utiliser l'intelligence artificielle pour aider un utilisateur à comprendre rapidement les informations importantes et les éventuels risques présents dans un contrat, sans avoir de connaissances juridiques ?

## 4. Objectifs

### 4.1 Objectifs fonctionnels

- Analyser automatiquement le contenu d'un contrat.
- Extraire les informations importantes telles que la durée, le préavis, les pénalités ou les conditions de résiliation.
- Détecter les clauses pouvant présenter un risque ou nécessiter une attention particulière.
- Fournir une explication simple et compréhensible des clauses identifiées.
- Générer un résultat structuré et facile à consulter.

### 4.2 Objectifs pédagogiques

Ce projet met en pratique les compétences acquises durant la formation Laravel AI Augmented Backend Developer :
- Concevoir et développer une API REST avec Laravel.
- Intégrer une intelligence artificielle externe via une API.
- Mettre en place une authentification sécurisée.
- Utiliser les Jobs et les files d'attente pour le traitement asynchrone.
- Tester et documenter l'API.
- Déployer l'application sur une machine virtuelle Azure.
- Utiliser GitHub Actions pour l'automatisation des tests et du déploiement.

## 5. Public cible

ClauseScan s'adresse principalement aux personnes qui souhaitent mieux comprendre le contenu d'un contrat avant de le signer ou pendant son exécution :
- **Locataires et futurs locataires** : vérifier les clauses d'un bail.
- **Freelances** : analyser un contrat de prestation.
- **Propriétaires ou clients** : s'assurer que leur contrat est clair et équilibré.

L'objectif est de fournir une analyse simple et rapide des principales clauses, signaler les risques et expliquer les informations importantes dans un langage facile à comprendre — sans remplacer les conseils d'un professionnel du droit.

## 6. User Stories

### Épic 1 : Authentification
- **US1** — Création d'un compte : créer un compte pour accéder à l'API et gérer ses analyses.
- **US2** — Connexion : se connecter avec email et mot de passe pour accéder à son espace personnel.
- **US3** — Déconnexion : se déconnecter pour sécuriser son compte.

### Épic 2 : Gestion des contrats
- **US4** — Importer un contrat : envoyer un contrat au format PDF pour analyse automatique.
- **US5** — Envoyer un contrat sous forme de texte : coller directement le contenu d'un contrat pour lancer l'analyse.
- **US6** — Consulter mes contrats : consulter la liste de tous les contrats déjà analysés.
- **US7** — Supprimer un contrat : supprimer un contrat de son historique.

### Épic 3 : Analyse par IA
- **US8** — Lancer une analyse : lancer automatiquement l'analyse d'un contrat.
- **US9** — Extraire les clauses importantes : identifier les clauses principales (durée, préavis, pénalités, résiliation).
- **US10** — Détecter les clauses à risque : détecter les clauses présentant un risque.
- **US11** — Comprendre les clauses : obtenir une explication simple des clauses importantes.
- **US12** — Consulter les résultats : visualiser les informations extraites et les risques détectés.

### Épic 4 : Historique
- **US13** — Consulter l'historique : accéder à l'historique des analyses.
- **US14** — Télécharger un rapport : télécharger un rapport d'analyse au format PDF.

### Épic 5 : Sécurité
- **US15** — Accès sécurisé : accès aux contrats et analyses réservé au compte utilisateur.

### Bonus
- **US16** — Choisir la langue : recevoir les résultats dans la langue de son choix.

## 7. Technologies et outils

| Technologie | Usage |
|---|---|
| **Laravel 13** | Backend et API REST |
| **MySQL** | Stockage des données |
| **Laravel Sanctum** | Authentification sécurisée (Bearer token) |
| **API Groq** | Analyse IA des contrats |
| **SDK laravel/ai** | Intégration de l'IA avec structured output |
| **Laravel Jobs & Queues** | Traitement asynchrone des analyses |
| **PHPUnit** / **Pest** | Tests automatisés |
| **Docker** | Conteneurisation |
| **GitHub Actions** | CI (tests automatiques à chaque push) |
| **Azure VM** | Hébergement et déploiement |
| **Nginx** | Serveur web |
| **Scribe** | Documentation d'API |
| **OpenSpec** | Spécifications fonctionnelles |
| **Jira** | Gestion de projet (board) |

## 8. Sécurité

- Authentification sécurisée avec Laravel Sanctum (Bearer tokens).
- Chiffrement des mots de passe (bcrypt).
- Accès limité : chaque utilisateur ne voit que ses propres données.
- Validation des fichiers importés (format PDF, taille limitée).
- Protection contre les injections SQL (Eloquent) et XSS.
- Stockage sécurisé des clés API (variables d'environnement).
- Respect des bonnes pratiques de protection des données.

## 9. Architecture

- **API REST** : routes, controllers, Form Requests (validation), API Resources, status codes.
- **Authentification** : Sanctum (Bearer token).
- **Traitements lents** : Jobs + Queues (réponse 202, worker).
- **IA** : SDK laravel/ai, structured output (schema garantissant la forme de la réponse), stockage via Casts.
- **Frontend** : Blade pour la démonstration.
- **Infrastructure** : Docker (app + DB) → GitHub → CI → Déploiement Azure.

## 10. Phases du projet

| Phase | Description |
|---|---|
| **Phase 1** — Cadrage et cahier des charges | Besoin, fonctionnalités, périmètre |
| **Phase 2** — Planification Jira | Découpage en tâches, board à jour |
| **Phase 3** — Conception | MCD, MLD, schéma d'architecture/pipeline |
| **Phase 4** — Développement Laravel | API, Sanctum, Jobs/Queues, Blade |
| **Phase 5** — Brique IA | SDK laravel/ai, structured output, Casts |
| **Phase 6** — Tests (Pest) | Endpoints, protection, validation, dispatch |
| **Phase 7** — Docker | Dockerfile, docker-compose |
| **Phase 8** — CI (GitHub Actions) | Tests automatiques à chaque push |
| **Phase 9** — Déploiement | Azure (ou Railway/Render/Fly.io) |
| **Phase 10** — Documentation | README, doc API (Scribe/Swagger) |

### Bonus
- CD (déploiement continu automatique)
- Image Docker buildée dans la CI
- Monitoring / observabilité
- Laravel Pint dans la CI

## 11. Livrables

1. **Repository GitHub** : README, diagrammes (MCD/MLD/architecture), Dockerfile, docker-compose, CI workflow, code source.
2. **Lien Jira** : board de gestion des tâches à jour.
3. **Documentation de l'API** : endpoints (Scribe ou Swagger).
4. **Support de soutenance** : PDF, PPT ou Canva.
5. **URL de l'application en ligne** (si déployée).

## 12. Critères d'évaluation

- Qualité du code : clair, organisé, bien nommé.
- Fonctionnel : l'application fait ce qui est annoncé.
- L'IA apporte une vraie valeur (pas un gadget).
- Tests : fonctionnalités principales couvertes, tests verts.
- Docker : l'application démarre proprement en conteneur.
- CI : check vert sur GitHub à chaque push.
- Déploiement : l'application répond en ligne (URL publique).
- Git : commits clairs et réguliers, historique cohérent.
- Documentation : README et doc d'API à jour.
- **Compréhension** (le plus important) : savoir expliquer son code, ses choix, et son usage de l'IA.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.
- Alternative platforms : Railway, Render, Fly.io, Azure VM.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.
- Use proper HTTP status codes : 200, 201, 202 (accepted for async jobs), 204, 401, 403, 404, 422.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Queue & Jobs

- Use Jobs and Queues for slow operations (IA analysis). Return 202 Accepted with a job/resource ID.
- Use `Queue::fake()` in tests to assert job dispatching.

## Testing

- This project uses **Pest** for testing (as specified by the training requirements). Use `php artisan make:test --pest {name}` to create tests.
- Test coverage : endpoints (200 + structure), protected routes (401), validation (422), job dispatch (Queue::fake).
- Faker la queue et l'IA dans les tests — on teste le code, pas le service externe.
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.

## IA Integration

- Use the `laravel/ai` SDK for AI functionality.
- Use **structured output** (a schema that guarantees the shape of the response).
- Store results properly using **Casts**.
- The AI must bring real value — if removing it leaves the app complete, it's a gadget.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.
- CI should also run Pint to verify code formatting.

=== phpunit/core rules ===

# PHPUnit / Pest

- This application uses **Pest** for testing. Use `php artisan make:test --pest {name}` to create a new test.
- Every time a test has been updated, run that singular test.
- When the tests relating to your feature are passing, ask the user if they would like to also run the entire test suite to make sure everything is still passing.
- Tests should cover all happy paths, failure paths, and edge cases.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files; these are core to the application.

## Running Tests

- Run the minimal number of tests, using an appropriate filter, before finalizing.
- To run all tests: `php artisan test --compact`.
- To run a specific test file: `php artisan test --compact tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --compact --filter=test_name` (recommended after making a change to a related file).

=== docker rules ===

# Docker

- **Dockerfile** : multi-stage build (composer install, npm build, production image).
- **docker-compose.yml** : services for app + database (MySQL).
- The application must start identically on any machine via Docker.
- In production : `APP_DEBUG=false`, `.env` never committed to GitHub.

=== github-actions rules ===

# GitHub Actions CI

- Workflow in `.github/workflows/` that runs tests automatically on every push.
- Visible green check on the repository.
- Bonus : CD (auto-deploy on green), Docker image build in CI, Pint check.

=== scribe rules ===

# API Documentation

- Use Scribe (or Swagger) to document the API.
- Document all endpoints : inputs, outputs, authentication requirements.
- Keep documentation up to date with code changes.

=== openspec rules ===

# OpenSpec

- Cadrer les fonctionnalités avec OpenSpec avant de coder.
- Utiliser les skills openspec-* pour la rédaction et la validation des spécifications.

=== git rules ===

# Git

- Commits clairs et réguliers, historique cohérent.
- Never force push to main/master.
- Never commit `.env` files or secrets.
- Follow conventional commit style observed in the repository.

</laravel-boost-guidelines>
