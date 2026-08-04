## 1. Dépendances et configuration Vite

- [x] 1.1 Installer les dépendances npm : react, react-dom, react-router, @tanstack/react-query, axios, @vitejs/plugin-react
- [x] 1.2 Mettre à jour `vite.config.js` pour utiliser le plugin React
- [x] 1.3 Mettre à jour `package.json` si nécessaire

## 2. Point d'entrée Blade SPA

- [x] 2.1 Créer `resources/views/app.blade.php` avec `<div id="app">` et les directives `@vite`
- [x] 2.2 Mettre à jour `routes/web.php` pour servir la SPA sur toutes les routes frontend

## 3. Structure de dossiers et app React

- [x] 3.1 Créer la structure `resources/js/src/{pages,components,lib,features}`
- [x] 3.2 Créer `resources/js/src/main.tsx` (point d'entrée React avec Provider TanStack Query)
- [x] 3.3 Créer `resources/js/src/App.tsx` (root component avec React Router)

## 4. Design system — tokens et composants de base

- [x] 4.1 Déclarer les tokens de couleur et typographie dans `resources/css/app.css` via `@theme`
- [x] 4.2 Créer `resources/js/src/components/ui/Button.tsx` (variants primary/secondary/danger/ghost, tailles sm/md/lg, état loading)
- [x] 4.3 Créer `resources/js/src/components/ui/Input.tsx` (label, message d'erreur, disabled, forwardRef)
- [x] 4.4 Créer `resources/js/src/components/ui/Card.tsx` (conteneur header/body/footer optionnel)
- [x] 4.5 Créer `resources/js/src/components/ui/Badge.tsx` (variants risque : low/medium/high ; statut : info/success/warning/error)

## 5. Client API et intercepteurs

- [x] 5.1 Créer `resources/js/src/lib/api.ts` (instance Axios avec baseURL, intercepteur Bearer token, gestion 401/422/403)
- [x] 5.2 Configurer le callback onUnauthorized pour l'intercepteur 401

## 6. Auth context et RequireAuth

- [x] 6.1 Créer `resources/js/src/features/auth/AuthContext.tsx` (contexte avec user, token, login, logout, isAuthenticated)
- [x] 6.2 Créer `resources/js/src/features/auth/RequireAuth.tsx` (composant de garde pour routes protégées)
- [x] 6.3 Implémenter la persistance du token dans localStorage

## 7. Layout principal et pages génériques

- [x] 7.1 Créer `resources/js/src/components/layout/AppLayout.tsx` (header avec navigation Contrats/Historique/déconnexion)
- [x] 7.2 Créer `resources/js/src/pages/NotFoundPage.tsx` (page 404)
- [x] 7.3 Créer `resources/js/src/pages/ErrorPage.tsx` (page d'erreur générique 403/500)

## 8. Vérification finale

- [x] 8.1 Lancer `npm run build` et corriger les éventuelles erreurs TypeScript
