# Tasks — add-contract-import-ui

Changement frontend uniquement (React). **Aucune tâche backend** : aucun endpoint ajouté/modifié (pas de mise à jour Scribe requise), aucune migration, aucun Job. La consommation existante de `POST /api/contracts` est déjà couverte par les tests Pest de l'API (`ImportPdfTest`, `ImportTextTest`).

## 1. Fondations frontend

- [x] 1.1 Créer le composant `RequireAuth` (`resources/js/src/components/RequireAuth.jsx`) : lit `user` depuis `AuthContext`, rend les enfants si connecté, sinon `<Navigate to="/login" replace />`
- [x] 1.2 Créer le dossier `resources/js/src/features/contracts/` avec un fichier `index.js` d'exports
- [x] 1.3 Ajouter le lien « Nouveau contrat » (`/contracts/new`) sur la page placeholder `/contracts` (App.jsx) menant à la page d'import

## 2. Validation client (Zod)

- [x] 2.1 Créer `features/contracts/importSchema.js` : schéma Zod miroir de `StoreContractRequest` — `contract` requis en mode PDF (type `application/pdf`, ≤ 10 240 000 octets), `content` requis en mode texte (non vide après trim, ≤ 100 000 caractères), exclusivité `contract` XOR `content` via `superRefine`, messages en français alignés sur `StoreContractRequest::messages()`
- [x] 2.2 Créer `features/contracts/importSchema.test.js` (Vitest) : cas valides (PDF ok, texte ok) et invalides (non-PDF, PDF > 10 Mo, contenu vide, contenu > 100 000 caractères, aucun champ, les deux champs) — tests du schéma pur, sans appel réseau

## 3. Composant d'upload réutilisable

- [x] 3.1 Créer `components/FileDropzone.jsx` : zone cliquable + drag & drop (avec `preventDefault` sur `dragover`/`drop`), validation immédiate type/taille, affichage du nom du fichier sélectionné et erreur éventuelle
- [x] 3.2 Intégrer une barre de progression (props `progress` / `uploading`) affichant le pourcentage pendant l'envoi du PDF

## 4. Page d'import `/contracts/new`

- [x] 4.1 Créer `pages/ContractNewPage.jsx` : en-tête + onglets PDF / Texte (bascule qui vide l'autre mode), rendu conditionnel du dropzone ou du textarea (avec compteur « X / 100 000 caractères »)
- [x] 4.2 Créer le hook `features/contracts/useImportContract.js` : `api.post('/contracts', formData, { onUploadProgress })` via le client Axios existant (intercepteur Bearer + 401), états `isSubmitting`, `progress`, `apiError`, répartition des erreurs 422 (`errors.contract`/`errors.content` via `setError`, sinon `message` global en bandeau)
- [x] 4.3 Câbler le formulaire avec `react-hook-form` + `zodResolver(importSchema)` : bouton submit désactivé pendant l'envoi, redirection `navigate('/contracts/' + id, { state: { contract } })` sur 201
- [x] 4.4 Enregistrer la route dans `App.jsx` : `/contracts/new` et `/contracts/:id` enveloppées dans `<RequireAuth>`

## 5. Fiche du contrat créé

- [x] 5.1 Créer `pages/ContractDetailPage.jsx` : affiche `title`, `source_type`, `status`, `created_at` depuis `location.state.contract` (données de la réponse 201, `ContractResource`)
- [x] 5.2 Gérer l'absence de `location.state` (refresh direct) : état « contrat introuvable » + lien retour `/contracts`

## 6. Tests frontend (Vitest)

- [x] 6.1 Créer `pages/ContractNewPage.test.jsx` (RTL) avec `vi.mock` du client API : rendu des deux onglets, erreur 422 affichée sous le champ, message global « PDF scanné » en bandeau, redirection après succès
- [x] 6.2 Vérifier que la suite complète passe : `npm test` (suite Vitest existante + nouveaux tests)

## 7. Vérification manuelle du flux

- [ ] 7.1 Vérifier manuellement avec `composer run dev` : navigation `/contracts` → « Nouveau contrat » → import PDF (fichier valide, fichier non-PDF, fichier > 10 Mo, PDF scanné) et import texte (valide, vide, trop long)
- [ ] 7.2 Vérifier la redirection vers la fiche du contrat créé + état « introuvable » sur refresh direct
- [ ] 7.3 Vérifier la protection : accès à `/contracts/new` sans session → redirection `/login`

## 8. Finalisation

- [x] 8.1 Exécuter `vendor/bin/pint --dirty --format agent` (aucun fichier PHP attendu modifié, vérification de sécurité)
- [ ] 8.2 Commit atomique du changement complet (une tâche = un commit si séparation souhaitée)
