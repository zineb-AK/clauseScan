## ADDED Requirements

### Requirement: Register page

Le système SHALL afficher un formulaire d'inscription sur `/register` avec les champs name, email, password, password_confirmation, validés côté client via Zod avant soumission.

#### Scenario: Affichage du formulaire d'inscription

- **WHEN** un utilisateur accède à `/register`
- **THEN** le formulaire affiche les champs name, email, password, password_confirmation et un bouton "Créer un compte"

#### Scenario: Validation Zod — email invalide

- **WHEN** l'utilisateur saisit un email invalide et soumet le formulaire
- **THEN** un message d'erreur "Email invalide" s'affiche sous le champ email sans appel API

#### Scenario: Validation Zod — mot de passe trop court

- **WHEN** l'utilisateur saisit un mot de passe de moins de 8 caractères
- **THEN** un message d'erreur s'affiche sous le champ password sans appel API

#### Scenario: Validation Zod — confirmation mismatch

- **WHEN** l'utilisateur saisit deux mots de passe différents
- **THEN** un message d'erreur s'affiche sous le champ password_confirmation sans appel API

#### Scenario: Erreur 422 — email déjà pris

- **WHEN** l'utilisateur soumet avec un email existant
- **THEN** le champ email affiche l'erreur API "Cet email est déjà utilisé"

#### Scenario: Inscription réussie

- **WHEN** l'utilisateur soumet des données valides et uniques
- **THEN** le compte est créé, l'utilisateur est connecté automatiquement, et redirigé vers `/contracts`

### Requirement: Login page

Le système SHALL afficher un formulaire de connexion sur `/login` avec les champs email et password, validés côté client avant soumission.

#### Scenario: Affichage du formulaire de connexion

- **WHEN** un utilisateur accède à `/login`
- **THEN** le formulaire affiche les champs email, password et un bouton "Se connecter"

#### Scenario: Validation Zod — email vide

- **WHEN** l'utilisateur soumet sans email
- **THEN** un message d'erreur "L'email est requis" s'affiche sous le champ email sans appel API

#### Scenario: Validation Zod — password vide

- **WHEN** l'utilisateur soumet sans password
- **THEN** un message d'erreur "Le mot de passe est requis" s'affiche sous le champ password sans appel API

#### Scenario: Erreur 401 — identifiants incorrects

- **WHEN** l'utilisateur soumet un email ou mot de passe incorrect
- **THEN** un message d'erreur générique "Email ou mot de passe incorrect" s'affiche au-dessus du formulaire

#### Scenario: Connexion réussie

- **WHEN** l'utilisateur soumet email et password valides
- **THEN** le token Sanctum est stocké dans localStorage, le contexte Auth est mis à jour, et l'utilisateur est redirigé vers `/contracts`

### Requirement: Navigation entre les pages d'auth

Les pages `/login` et `/register` SHALL être publiques (accessibles sans authentification). Un lien SHALL permettre de basculer entre les deux.

#### Scenario: Lien vers l'inscription depuis la connexion

- **WHEN** un utilisateur est sur `/login`
- **THEN** un lien "Pas encore de compte ? Créer un compte" pointe vers `/register`

#### Scenario: Lien vers la connexion depuis l'inscription

- **WHEN** un utilisateur est sur `/register`
- **THEN** un lien "Déjà un compte ? Se connecter" pointe vers `/login`

#### Scenario: Redirection vers login si non authentifié

- **WHEN** un utilisateur non authentifié accède à une route protégée
- **THEN** il est redirigé vers `/login`
