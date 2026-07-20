## Context

L'import de contrat PDF nécessite : (1) une dépendance externe `spatie/pdf-to-text` pour l'extraction, (2) un nouveau modèle `Contract` avec sa migration, (3) un controller avec validation du fichier, (4) un stockage du fichier PDF sur disque.

## Goals / Non-Goals

**Goals:**
- Installer `spatie/pdf-to-text` (nécessite `pdftotext` via poppler-utils)
- Créer le modèle `Contract` et sa migration
- Endpoint `POST /api/contracts` avec upload de fichier PDF
- Validation : fichier requis, type PDF, max 10 Mo
- Extraction du texte avec Spatie, stockage dans `raw_text`
- Détection des PDF scannés (texte vide → 422)
- Association à l'utilisateur connecté via `ContractPolicy`
- Stockage du fichier dans `storage/app/contracts/`

**Non-Goals:**
- Analyse IA du contrat (US8 - change séparé)
- Import par texte brut (US5 - change séparé)
- Liste des contrats (US6 - change séparé)
- Suppression de contrat (US7 - change séparé)

## Decisions

1. **`spatie/pdf-to-text`** : Bibliothèque Laravel standard pour extraction PDF. Alternative (`smalot/pdfparser`) rejetée car moins fiable sur les PDF complexes.
2. **Upload via `$request->file('contract')`** : Utilisation native de Laravel. Form Request dédié pour la validation.
3. **Stockage fichier PDF** : `$request->file('contract')->store('contracts')` dans le disque `local`. Le chemin relatif est stocké dans `file_path`.
4. **Extraction synchrone** : L'extraction est rapide (quelques secondes max). Pas besoin de Job pour ça. L'analyse IA sera asynchrone (Job).
5. **`ContractPolicy`** : Pour l'isolation utilisateur. Méthode `view`, `delete` à implémenter même si seul `create` est utilisé ici (cohérence future).
6. **Détection PDF scanné** : Si `$text` après `trim()` est vide → 422 avec message explicite.

## Risks / Trade-offs

- [PDF scannés] → Impossible d'extraire le texte. Renvoyer 422 explicitement plutôt que créer un contrat vide. Limitation connue et assumée.
- [Dépendance système] → `pdftotext` (poppler-utils) doit être installé dans l'image Docker. À documenter dans le Dockerfile.
- [Taille fichier] → Limite à 10 Mo côté PHP (upload_max_filesize) + validation Laravel. Vérifier la config PHP.
