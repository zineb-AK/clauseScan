## Why

US5 (Envoyer un contrat sous forme de texte) permet aux utilisateurs de coller directement le contenu textuel d'un contrat pour lancer l'analyse, sans avoir à fournir un fichier PDF. Cette alternative à US4 couvre le cas où l'utilisateur dispose du texte brut (copié depuis un email, un document, etc.).

## What Changes

- Modification de l'endpoint `POST /api/contracts` pour accepter un champ optionnel `content` (texte brut) en plus du champ `contract` (fichier PDF)
- Validation : `content` doit être une chaîne non vide, taille maximale configurable (ex. 100 000 caractères)
- Si `content` est fourni → source_type = "text", pas de stockage fichier, pas d'extraction Spatie
- Si `contract` est fourni → comportement existant (source_type = "pdf")
- Erreur 422 si les deux champs sont absents ou si `content` est vide/dépasse la limite
- Réutilisation du modèle `Contract`, de `ContractResource`, et de `ContractPolicy` existants

## Capabilities

### New Capabilities
- `contract-import-text`: Import d'un contrat par collage de texte brut, validation de contenu, stockage en base avec source_type "text"

### Modified Capabilities
- *(none)*

## Impact

- **Modification** : `StoreContractRequest` — ajout validation du champ `content` (required_without:contract, string, min:1, max:100000)
- **Modification** : `ContractController@store` — logique conditionnelle selon que `content` ou `contract` est présent, titre dérivé du contenu si pas de fichier
- **Modification** : `Contract` migration — `file_path` déjà nullable, pas de changement nécessaire
- **Tests** : Nouveaux cas pour import texte réussi, contenu vide, contenu trop long, absence des deux champs
- **Epic 2 (contracts)** — User Story US5 couverte
