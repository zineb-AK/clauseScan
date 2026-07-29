## Context

Les endpoints d'authentification backend existent (`POST /api/register`, `POST /api/login`, `POST /api/logout`). Le AuthContext avec `login()` et `logout()` est déjà implémenté dans l'app shell. Il manque les pages React qui utilisent AuthContext et affichent les formulaires.

## Goals / Non-Goals

**Goals:**
- Page `/register` avec formulaire React Hook Form + Zod (name, email, password, password_confirmation)
- Page `/login` avec formulaire React Hook Form + Zod (email, password)
- Validation client avant soumission (Zod) reflétant les règles backend
- Affichage des erreurs 422 champ par champ retournées par l'API
- Redirection vers `/contracts` après auth réussie
- Lien de navigation entre les deux pages

**Non-Goals:**
- Déconnexion (déjà gérée par le AuthContext et le bouton dans AppLayout)
- Modification des endpoints backend
- Tests Pest ou Vitest (seront dans un change dédié)

## Decisions

1. **React Hook Form + `@hookform/resolvers/zod`** — standard du projet (cf. config.yaml). Les schémas Zod reflètent les règles backend : `name` requis (min 2), `email` valide, `password` min 8.

2. **Soumission via `AuthContext.login()`** — pas d'appel Axios direct. Le AuthContext encapsule `POST /api/login`, stocke le token et l'utilisateur. Pour l'inscription, on appelle `POST /api/register` directement via Axios puis on connecte via `AuthContext.login()`.

3. **Gestion des erreurs 422** — le formulaire React Hook Form capture `error.response.data.errors` et les associe aux champs via `setError()`. Le message générique d'erreur 401 est affiché via un `toast`/alerte en haut du formulaire.

4. **Redirection avec `useNavigate`** — après connexion ou inscription réussie, `navigate('/contracts')`. Le `RequireAuth` guard redirige déjà vers `/login` si non authentifié.

5. **Composant `AuthLayout`** — les deux pages partagent un layout simple centré (card avec logo/titre), sans le header AppLayout. Un composant `AuthLayout` encapsule la mise en page commune.

## Risks / Trade-offs

- [Risk] **Formulaire d'inscription : double appel API** (register puis login) → acceptable. On pourrait modifier le backend pour retourner un token directement à l'inscription, mais le endpoint `register` existant le fait déjà (201 + token).
- [Risk] **Erreurs 422 non uniformes** → le format Laravel est standardisé : `{ "message": "...", "errors": { "field": ["..."] } }`. Le parsing est prévisible.
