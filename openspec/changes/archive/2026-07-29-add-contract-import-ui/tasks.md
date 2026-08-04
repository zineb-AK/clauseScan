## 1. Route et structure de la page

- [x] 1.1 Ajouter la route `/contracts/new` dans `App.tsx` pointant vers `NewContractPage`, sous le layout protégé `AppLayout`
- [x] 1.2 Créer le fichier `NewContractPage.tsx` avec squelette (deux tabs, layout de base)

## 2. Composant PDF Upload (drag & drop)

- [x] 2.1 Créer un sous-composant `PdfUploadZone` : input file caché + zone cliquable, gestion des événements `dragOver`/`dragLeave`/`drop`, feedback visuel Tailwind (bordure, fond)
- [x] 2.2 Gérer la sélection de fichier : validation côté client type PDF + taille ≤ 10 Mo, affichage du nom du fichier sélectionné, message d'erreur inline si validation échoue

## 3. Composant Texte (textarea)

- [x] 3.1 Créer un sous-composant `TextInput` : textarea avec compteur de caractères en direct (ex: "1 234 / 100 000"), changement de couleur au seuil critique

## 4. Schéma Zod et mutation API

- [x] 4.1 Définir le schéma Zod `contractSchema` avec validation conditionnelle : `contract` OU `content` (pas les deux, pas zéro), contraintes miroir du backend (type, taille, longueur)
- [x] 4.2 Implémenter `useMutation` TanStack Query pour `POST /api/contracts` avec gestion multipart (PDF) et JSON (texte)
- [x] 4.3 Gérer les erreurs 422 : extraction des `errors.{field}` du serveur, affichage via `setError` de React Hook Form au champ correspondant
- [x] 4.4 Gérer les erreurs globales (hors 422) : message d'erreur générique en haut du formulaire
- [x] 4.5 Rediriger vers `/contracts/{id}` après succès (201)

## 5. Intégration page et reset des tabs

- [x] 5.1 Assembler `NewContractPage` : tabs "Fichier PDF" / "Texte" avec `useState<'pdf' | 'text'>`, reset du formulaire au changement de tab
- [x] 5.2 Ajouter un bouton "Nouveau contrat" sur la page `/contracts` (placeholder actuel) pointant vers `/contracts/new`

## 6. Tests frontend

- [x] 6.1 Écrire le test Vitest pour `PdfUploadZone` : rendu, drag-over visuel, validation fichier invalide, sélection fichier valide
- [x] 6.2 Écrire le test Vitest pour `TextInput` : rendu, compteur de caractères, validation vide, validation dépassement limite
- [x] 6.3 Écrire le test Vitest pour `NewContractPage` : rendu des deux tabs, soumission réussie (mock API → redirection), erreur 422 (affichage champ par champ)
