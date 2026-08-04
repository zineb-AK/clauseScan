## ADDED Requirements

### Requirement: SPA mount point

L'application React SHALL être montée via une page Blade unique qui sert de point d'entrée pour la SPA.

#### Scenario: Chargement initial de la SPA

- **WHEN** un utilisateur accède à la racine du site
- **THEN** le serveur retourne une page HTML avec un élément `<div id="app">` et le bundle React est chargé

### Requirement: Routing

Le système SHALL utiliser React Router avec les routes suivantes :
- `/login` — page de connexion (publique)
- `/register` — page d'inscription (publique)
- `/` — page d'accueil / tableau de bord (protégée)
- `/contracts` — liste des contrats (protégée)
- `/history` — historique des analyses (protégée)
- `/404` — page non trouvée
- `/error` — page d'erreur générique (403/500)

Toute route inconnue SHALL rediriger vers `/404`.

#### Scenario: Navigation vers une route protégée sans authentification

- **WHEN** un utilisateur non authentifié tente d'accéder à `/contracts`
- **THEN** il est redirigé vers `/login`

#### Scenario: Navigation vers une route inconnue

- **WHEN** un utilisateur navigue vers une route qui n'existe pas
- **THEN** la page 404 s'affiche

#### Scenario: Affichage de la page d'erreur générique

- **WHEN** l'application reçoit une erreur 403 ou 500
- **THEN** la page d'erreur générique s'affiche avec un titre, un message explicatif et un bouton de retour

### Requirement: Layout principal

Les routes protégées SHALL utiliser un layout commun avec :
- Une barre de navigation (header) contenant :
  - Le logo / nom de l'application
  - Un lien "Contrats" pointant vers `/contracts`
  - Un lien "Historique" pointant vers `/history`
  - Un bouton de déconnexion
- Un contenu principal (`<main>`) qui s'adapte au viewport

#### Scenario: Affichage de la navigation sur une page protégée

- **WHEN** un utilisateur authentifié consulte une page protégée
- **THEN** le header affiche les liens Contrats, Historique, et le bouton de déconnexion

#### Scenario: Déconnexion depuis le header

- **WHEN** l'utilisateur clique sur "Déconnexion"
- **THEN** le token est supprimé du localStorage et du contexte, et l'utilisateur est redirigé vers `/login`

### Requirement: Design system

Le design system SHALL fournir les tokens et composants suivants :
- **Palette de couleurs** définie via Tailwind v4 `@theme` : primary (bleu), secondary (gris), danger (rouge), warning (ambre), success (vert)
- **Typographie** : système de polices via Tailwind (font-sans, font-mono)
- **Button** : variants `primary`, `secondary`, `danger`, `ghost`, tailles `sm`, `md`, `lg`, état `loading` avec spinner
- **Input** : avec label, message d'erreur, état `disabled`, état d'erreur visuel
- **Card** : conteneur avec padding, ombre, optionnel header/footer
- **Badge** : variants `low`, `medium`, `high` pour le niveau de risque ; variant `info`, `success`, `warning`, `error` pour les statuts

#### Scenario: Bouton avec état loading

- **WHEN** un Button reçoit la prop `loading={true}`
- **THEN** il affiche un spinner et devient désactivé

#### Scenario: Badge de risque

- **WHEN** un Badge reçoit `variant="high"`
- **THEN** il est affiché avec la couleur rouge (danger)

#### Scenario: Input avec erreur de validation

- **WHEN** un Input reçoit une prop `error` avec un message
- **THEN** le message d'erreur s'affiche sous le champ et le bordure du champ passe en rouge

### Requirement: Axios instance

Le système SHALL fournir une instance Axios unique avec :
- `baseURL` définie via la variable d'environnement `VITE_API_URL`
- Un intercepteur de requête qui injecte le token Bearer depuis le localStorage
- Un intercepteur de réponse qui gère :
  - 401 → déconnexion + redirection vers `/login`
  - 422 → les erreurs de validation sont propagées pour traitement par le formulaire appelant
  - 403/404 → redirection vers la page d'erreur

#### Scenario: Requête avec token valide

- **WHEN** une requête est envoyée vers un endpoint protégé
- **THEN** l'en-tête `Authorization: Bearer <token>` est ajouté automatiquement

#### Scenario: Réception d'une 401

- **WHEN** l'API retourne une réponse 401
- **THEN** le token est supprimé du localStorage et l'utilisateur est redirigé vers `/login`

#### Scenario: Réception d'une 422

- **WHEN** l'API retourne une réponse 422
- **THEN** l'erreur est propagée pour que le formulaire appelant puisse l'afficher

### Requirement: TanStack Query provider

L'application SHALL être enveloppée dans un `QueryClientProvider` TanStack Query avec une configuration par défaut (staleTime, retry, refetchOnWindowFocus).

#### Scenario: QueryClientProvider rendu

- **WHEN** l'application React se monte
- **THEN** le QueryClientProvider est présent dans l'arbre des composants

### Requirement: Auth context

Le système SHALL fournir un contexte React (`AuthContext`) qui expose :
- `user` — l'utilisateur courant (ou null)
- `token` — le token courant (ou null)
- `login(email, password)` — appelle POST /api/login, stocke le token et l'utilisateur
- `logout()` — appelle POST /api/logout, supprime le token et l'utilisateur
- `isAuthenticated` — booléen

Le token SHALL être persisté dans `localStorage` sous la clé `auth_token`.

#### Scenario: Connexion réussie

- **WHEN** l'utilisateur se connecte avec des identifiants valides
- **THEN** le token est stocké dans localStorage et le contexte est mis à jour avec l'utilisateur

#### Scenario: Déconnexion

- **WHEN** l'utilisateur se déconnecte
- **THEN** le token est supprimé du localStorage et le contexte est réinitialisé
