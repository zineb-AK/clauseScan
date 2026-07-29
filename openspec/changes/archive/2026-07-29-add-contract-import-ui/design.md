## Context

L'API backend expose `POST /api/contracts` qui accepte soit un fichier PDF (champ `contract`) soit du texte brut (champ `content`). Le `ContractResource` retourne `{ id, title, source_type, status, created_at }`. Les erreurs 422 remontent via `errors.{field}`. Le frontend React n'a actuellement aucune interface d'import — la page `/contracts` est un placeholder.

## Goals / Non-Goals

**Goals:**
- Page `/contracts/new` avec deux modes d'import (PDF et texte) accessibles par onglets
- Validation Zod côté client en miroir des règles backend (taille, type, champs mutuellement exclusifs)
- Drag & drop pour le mode PDF avec feedback visuel (zone surlignée, progression)
- Compteur de caractères pour le mode texte (max 100000)
- Affichage des erreurs 422 API (PDF scanné, validation serveur)
- Redirection vers `/contracts/{id}` après création réussie
- Lien "Nouveau contrat" sur la page `/contracts`

**Non-Goals:**
- Modification du backend ou de l'API
- Téléchargement progressif (le fetch est atomique — un seul POST multipart)
- Support de l'annulation d'upload (hors scope MVP)

## Decisions

1. **TanStack Query `useMutation` pour l'appel API** plutôt que `fetch` manuel. Conforme à l'architecture existante, permet de gérer les états `isPending`/`isError`/`isSuccess` nativement et d'invalider le cache de la liste des contrats après création.

2. **React Hook Form + Zod pour la validation client** — déjà utilisé sur Login/Register. Le schéma Zod reflète les contraintes de `StoreContractRequest` : `contract` ou `content` (pas les deux, pas zéro), `contract` max 10MB et type PDF, `content` max 100000 caractères.

3. **Onglets (tabs) pour basculer entre mode PDF et texte** au lieu de deux pages séparées. UX plus fluide, les deux modes partagent le même layout et la même mutation API. Implémentation simple avec un `useState<'pdf' | 'text'>`.

4. **Input file caché + zone de drop cliquable** — pattern standard drag & drop. La zone de drop change de style au `dragOver`/`dragLeave`. Un input `<input type="file" hidden>` est déclenché au clic sur la zone.

5. **Affichage des erreurs API** : le catch de la mutation distingue 422 (errors champ par champ via `setError`) des autres erreurs (message global). Les erreurs 422 serveur côté `contract` (ex: PDF scanné) s'affichent dans la zone de drop.

6. **Pas de `react-dropzone`** — le drag & drop natif suffit (peu de code, pas de dépendance supplémentaire). L'input file standard avec `accept=".pdf"` gère le filtrage côté OS.

## Risks / Trade-offs

- **PDF scanné** : le backend retourne 422 avec un message explicite. Le frontend affiche cette erreur dans la zone de drop — l'utilisateur doit fournir un PDF avec texte sélectionnable.
- **Upload sans barre de progression réelle** : le POST multipart est atomique. On peut afficher un spinner/loading, mais pas un pourcentage. Le `useMutation` donne `isPending` pour le feedback.
- **Pas de support mobile avancé** : le drag & drop fonctionne sur desktop. Sur mobile, le clic sur la zone ouvre le sélecteur de fichiers natif — c'est suffisant.
