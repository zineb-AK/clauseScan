## Why

Les utilisateurs peuvent importer des contrats via l'API (`POST /api/contracts`), mais il n'existe aucune interface utilisateur pour le faire. Actuellement, la page `/contracts` n'affiche qu'un placeholder `<div>Contracts</div>`. Il faut créer la page de création de contrat pour permettre l'upload PDF (US4) et le collage de texte (US5).

## What Changes

- Création de la page `/contracts/new` avec deux modes d'import mutuellement exclusifs :
  - **Mode PDF** : zone de drag & drop + input file, validation côté client (taille max 10 Mo, type PDF), feedback visuel de progression
  - **Mode texte** : textarea avec compteur de caractères (max 100 000)
- Validation Zod côté client miroir des règles backend (StoreContractRequest)
- Affichage des erreurs 422 retournées par l'API (PDF scanné illisible, validation échouée)
- Redirection vers la fiche du contrat créé après succès (`/contracts/{id}`)
- Bascule entre les deux modes via des onglets/tabs
- Le backend existe déjà — modification frontend uniquement

## Capabilities

### New Capabilities
- `contract-import-ui`: Page d'import de contrat avec deux modes (PDF upload et texte), validation client, feedback d'erreur 422, et redirection post-création. Interface consommateur de l'API existante.

### Modified Capabilities

*Aucune modification du backend ou du contrat API.*

## Impact

- **Frontend uniquement** : nouvelle page `src/pages/NewContractPage.tsx`, nouveau layout/tabs
- Aucun changement backend, API, base de données, ou dépendances
- Le composant `RequireAuth` protège déjà la route (authentification requise)
- La page `/contracts` existante devra lier vers `/contracts/new`
