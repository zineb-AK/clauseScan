## 1. Dépendances

- [x] 1.1 Installer `react-hook-form` et `@hookform/resolvers`

## 2. Auth layout partagé

- [x] 2.1 Créer `resources/js/src/components/layout/AuthLayout.tsx` (layout centré avec logo/titre, sans le header AppLayout)
- [x] 3.1 Créer `resources/js/src/pages/LoginPage.tsx` (formulaire email/password, validation Zod, appel AuthContext.login(), gestion erreurs 401/422, redirection vers /contracts)
- [x] 4.1 Créer `resources/js/src/pages/RegisterPage.tsx` (formulaire name/email/password/password_confirmation, validation Zod, appel POST /api/register puis connexion automatique, gestion erreurs 422, redirection vers /contracts)
- [x] 5.1 Mettre à jour `App.tsx` pour utiliser les vraies pages LoginPage et RegisterPage (remplacer les `<div>` placeholders)

## 6. Vérification

- [x] 6.1 Lancer `npm run build` et corriger les éventuelles erreurs
