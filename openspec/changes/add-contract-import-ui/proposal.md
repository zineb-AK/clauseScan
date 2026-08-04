## Why

La gestion des contrats existe côté API (import PDF, import texte, liste, suppression) mais aucune interface React ne permet encore d'importer un contrat. L'utilisateur authentifié est bloqué sur une page placeholder `/contracts`. Cette change couvre l'Épic 2 — US4 (importer un contrat PDF) et US5 (envoyer un contrat sous forme de texte) côté frontend.

## What Changes

- Nouvelle page React `/contracts/new` (import de contrat) accessible uniquement aux utilisateurs authentifiés.
- Deux modes de saisie au choix (onglets) :
  - **PDF** : zone drag & drop + input file, uniquement `.pdf`, taille max 10 Mo, feedback de progression pendant l'envoi.
  - **Texte** : textarea avec compteur de caractères (max 100 000), contenu non vide requis.
- Validation côté client (Zod) miroir du backend (`StoreContractRequest`) : fichier requis/PDF/≤ 10 Mo, contenu requis/≤ 100 000 caractères, champs mutuellement exclusifs.
- Affichage des erreurs serveur 422 sous le formulaire (ex. « PDF scanné sans texte exploitable »).
- Redirection vers la fiche du contrat créé après succès (données issues de la réponse 201 — aucun nouvel endpoint requis).
- Lien d'entrée depuis la page `/contracts`.

**Brique concernée :** extraction PDF (Spatie pdf-to-text, déjà en place côté API) et import texte brut. Pas d'analyse IA (context stuffing) ni d'agent conversationnel (RAG) dans ce périmètre.

**Traitement asynchrone :** aucun. L'import est synchrone (201) ; le lancement d'analyse asynchrone (US8) reste hors périmètre de cette change.

## Capabilities

### New Capabilities
- `contract-import-ui`: Interface React d'import d'un contrat en deux modes (PDF via drag & drop / texte brut), avec validation client, gestion des erreurs 422 et redirection vers la fiche du contrat créé.

### Modified Capabilities
<!-- Aucun changement de comportement au niveau spec de l'API : `contract-import` (backend) ne change pas. -->

## Impact

- **Code** : uniquement le frontend React — `resources/js/src/pages/ContractNewPage.jsx`, `resources/js/src/features/contracts/` (schéma Zod, hook d'import), ajout de la route dans `App.jsx`, composant d'upload réutilisable dans `resources/js/src/components/`. Lien « Nouveau contrat » sur la page `/contracts`.
- **API** : aucun endpoint ajouté ni modifié — consommation de `POST /api/contracts` existant (champs `contract` / `content`).
- **Authentification / isolation** : page protégée par `auth:sanctum` via le middleware côté frontend (requête sans token → 401 → redirection `/login`) ; l'isolation des données reste garantie côté API par `ContractPolicy::create`.
- **Base de données** : aucune migration.
- **Dépendances** : aucune nouvelle dépendance (Zod et Axios déjà présents).
