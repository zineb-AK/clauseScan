## Context

L'API `POST /api/contracts` (Épic 2 — US4/US5) est opérationnelle : import PDF (champ `contract`, ≤ 10 Mo, extraction Spatie pdf-to-text) ou texte brut (champ `content`, ≤ 100 000 caractères), champs mutuellement exclusifs, réponse 201 avec `ContractResource` (`id`, `title`, `source_type`, `status`, `created_at`) et erreurs 422 structurées (`errors`).

Côté frontend, seule la page `/contracts` existe (placeholder). Aucune route React protégée par `RequireAuth` n'est encore en place : `AuthContext` (user + token persistés en localStorage) et le client Axios (injection `Authorization: Bearer`, gestion 401 → `/login`) sont prêts et utilisés par les pages Login/Register.

Cette change implémente l'interface d'import (US4/US5) : nouvelle page `/contracts/new` + fiche du contrat créé. Aucune modification backend.

## Goals / Non-Goals

**Goals:**
- Page `/contracts/new` avec deux modes de saisie : PDF (drag & drop + input file) et texte (textarea + compteur).
- Validation client Zod miroir du backend (PDF requis/format/taille, contenu requis/longueur, exclusivité des champs).
- Feedback de progression pendant l'envoi du PDF et gestion des erreurs 422 sous les champs.
- Redirection vers la fiche du contrat créé après succès (201).
- Page protégée : utilisateur non connecté redirigé vers `/login`.

**Non-Goals:**
- Lancement d'analyse IA (US8) et affichage des résultats (US9-US12) — change ultérieure.
- Liste des contrats enrichie (US6) et suppression (US7) depuis l'UI — change ultérieure.
- Endpoint API `GET /api/contracts/{id}` (fiche serveur) — non requis : la fiche est alimentée par la réponse 201.
- Toute modification backend (routes, migrations, policies, jobs).

## Decisions

### D1 — Route et protection `RequireAuth`
Nouvelle route React `/contracts/new` (et `/contracts/:id` pour la fiche), enveloppées dans un composant `<RequireAuth>` (convention du projet) qui vérifie `user` dans `AuthContext` et redirige vers `/login` sinon. Le backend reste la source de vérité (sanctum + `ContractPolicy`), `RequireAuth` n'est qu'une protection d'UX.
*Alternative :* garder les routes publiques et laisser l'intercepteur 401 gérer — rejeté car l'utilisateur verrait le formulaire avant la redirection.

### D2 — Structure des fichiers
```
resources/js/src/
├── components/FileDropzone.jsx        # zone drag & drop + input file réutilisable
├── features/contracts/
│   ├── importSchema.js                # schéma Zod miroir de StoreContractRequest
│   └── useImportContract.js           # hook : appel POST /api/contracts, états
└── pages/
    ├── ContractNewPage.jsx            # page /contrats/nouveau
    └── ContractDetailPage.jsx         # fiche du contrat créé (lecture de location.state)
```
Routage ajouté dans `App.jsx`.

### D3 — Validation client (Zod + React Hook Form)
Réutilisation du pattern Login/Register (`react-hook-form` + `zodResolver` + `useForm`). Nouveau schéma `importSchema` dans `features/contracts/importSchema.js` :
- mode PDF : fichier requis, `type === 'application/pdf'`, taille ≤ 10 Mo (10 240 000 octets).
- mode texte : `content` requis (non vide après trim), ≤ 100 000 caractères.
- exclusivité : un seul champ à la fois (l'onglet actif détermine le champ soumis ; le schéma impose `contract` XOR `content` via `superRefine`).
Les messages client sont en français, alignés sur `StoreContractRequest::messages()`.

### D4 — Envoi PDF multipart avec progression
Envoi via `api.post('/contracts', formData, { onUploadProgress })` (instance Axios existante de `lib/api.js`). Le fichier sélectionné est mis dans un `FormData` sous le nom `contract` ; le texte sous la clé `content`. Progression affichée en % (barre) pendant l'envoi, bouton submit désactivé (`isSubmitting`).

### D5 — Gestion des erreurs 422
Les erreurs 422 du backend sont réparties : `errors.contract` / `errors.content` → affichées sous les champs via `setError(field, ...)` ; erreur globale (ex. « Le PDF semble être scanné » — renvoyée par le controller avec un `message`, sans clé `errors`) → bandeau d'erreur au-dessus du formulaire. Les 401 restent gérés par l'intercepteur Axios.

### D6 — Fiche du contrat créé (sans endpoint show)
Après succès : `navigate('/contracts/' + data.id, { state: { contract: data } })`. `ContractDetailPage` affiche les infos de la réponse 201 (titre, source, statut, date) puis propose un retour vers `/contracts`. Sans `location.state` (refresh direct), la page affiche un état « contrat introuvable » avec lien vers `/contracts`.
*Alternative :* ajouter `GET /api/contracts/{id}` — rejeté (hors périmètre backend, la réponse 201 suffit pour cette change).

### D7 — Tests frontend
Le repo possède déjà Vitest + Testing Library (29 tests sur Login/Register). Suivre la convention existante :
- `importSchema.test.js` : cas valides/invalides des deux modes (taille, format, longueur, exclusivité).
- `ContractNewPage.test.jsx` : rendu des deux onglets, erreur 422 affichée, redirection après succès (mock du client API via `vi.mock`).
Aucun appel réseau réel.

### D8 — Contrat d'API consommé
- **Requête** : `POST /api/contracts`, multipart/form-data, soit `contract` (File) soit `content` (string). En-tête `Authorization: Bearer` injecté par l'intercepteur.
- **Succès (201)** : `{ "data": { "id": 1, "title": "...", "source_type": "pdf|text", "status": "pending", "created_at": "..." } }`
- **Erreur validation (422)** : `{ "message": "...", "errors": { "contract": ["..."], "content": ["..."] } }`
- **Erreur PDF illisible (422)** : `{ "message": "Le PDF semble être scanné ..." }` (pas de clé `errors`).

## Risks / Trade-offs

- [Fichier > 10 Mo passé en doublon côté client] → Validation Zod avant envoi + message français immédiat ; la règle backend reste l'autorité (422).
- [PDF scanné : succès d'upload mais 422 serveur] → Bandeau d'erreur global affichant le `message` backend, l'utilisateur peut réessayer ou basculer sur le mode texte.
- [Double clic submit → double import] → Bouton désactivé pendant `isSubmitting` ; le backend ne bloque pas les doublons (accepté pour cette change).
- [Drag & drop par défaut du navigateur (ouvre le fichier)] → `preventDefault()` sur `dragover`/`drop` de la zone.
- [Fiche contrat illisible après refresh direct] → État « contrat introuvable » + retour à la liste (documenté D6).
- [Pas de fiche serveur (aucun show)] → Limitation connue, levée si la change « liste des contrats » ajoute un endpoint show.

## Migration Plan

Aucune migration backend, aucune étape de déploiement particulière : simple ajout de pages React (build Vite). Rollback = retrait des routes/pages.

## Open Questions

Aucune.
