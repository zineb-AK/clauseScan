## Why

US4 (Importer un contrat) permet aux utilisateurs d'envoyer un contrat au format PDF pour que le système en extraie le texte et le stocke en vue d'une analyse ultérieure. Sans cette fonctionnalité, l'application ne peut pas recevoir de documents à analyser.

## What Changes

- Ajout de la dépendance `spatie/pdf-to-text` (extraction texte des PDF)
- Création du modèle `Contract` avec les attributs : user_id, title, source_type, file_path, raw_text, status
- Création de la migration `contracts` (si pas déjà faite)
- Ajout de l'endpoint `POST /api/contracts` protégé par `auth:sanctum`
- Validation : fichier PDF valide, max 10 Mo
- Extraction du texte via Spatie pdf-to-text côté serveur
- Vérification que le texte extrait n'est pas vide (PDF scanné → erreur 422)
- Stockage du fichier PDF sur le disque (storage/app/contracts/)
- Création du contrat en base avec statut "pending" et source_type "pdf"

## Capabilities

### New Capabilities
- `contract-import-pdf`: Import d'un contrat au format PDF, extraction du texte, stockage en base

### Modified Capabilities

- *(none)*

## Impact

- **Nouvelle dépendance** : `spatie/pdf-to-text` (composer)
- **Nouveau modèle** : `Contract`
- **Nouveau Controller** : `ContractController@store`
- **Nouveau Form Request** : `StoreContractRequest` (validation fichier + taille)
- **Nouvelle API Resource** : `ContractResource`
- **Nouvelle route** : `POST /api/contracts`, protégée par `auth:sanctum`
- **Nouveau Policy** : `ContractPolicy` (isolation utilisateur)
- **Stockage** : dossier `storage/app/contracts/` pour les fichiers PDF
- **Epic 2 (contracts)** — User Story US4 couverte
