## Context

Le backend expose déjà `POST /api/logout` (protégé par `auth:sanctum`) qui révoque le token Sanctum courant et retourne 204. Côté frontend, l'infrastructure Axios (`src/lib/api.ts`) et le contexte d'authentification (`src/features/auth/AuthContext.tsx`) sont en place mais la méthode `logout()` et l'intercepteur 401 doivent être implémentés.

Aucun changement backend, base de données, ou IA n'est nécessaire — cette feature est 100% frontend.

## Goals / Non-Goals

**Goals:**
- Implémenter la méthode `logout()` dans AuthContext : appel POST /api/logout → purge locale → redirection
- Ajouter le bouton "Déconnexion" dans AppLayout
- Ajouter l'intercepteur 401 dans l'instance Axios pour une déconnexion automatique
- Gérer les cas d'erreur (échec réseau) en nettoyant quand même l'état local

**Non-Goals:**
- Aucun changement backend (endpoint existant)
- Aucune migration base de données
- Aucune nouvelle dépendance
- Aucun changement au design system ou aux autres composants UI

## Decisions

| Décision | Choix | Alternative | Raison |
|---|---|---|---|
| Méthode de déconnexion | `logout()` dans AuthContext | Hook ou fonction séparée | Cohérence avec `login()` existant, encapsulation complète de l'état auth |
| Comportement en cas d'échec API | Nettoyage local + redirection quand même | Afficher une erreur | Le token local n'est plus fiable ; la priorité est de sortir l'utilisateur de l'état authentifié |
| Intercepteur 401 | Via `api.ts` (response interceptor) | Vérification manuelle après chaque appel | Applicable globalement, pas de duplication |
| Notification AuthContext de la 401 | Callback `onUnauthorized` enregistré à mount | Import direct de auth context | Évite la dépendance circulaire (api.ts ne doit pas importer AuthContext) |

## Risks / Trade-offs

- **Échec réseau sur logout** → Mitigé : le nettoyage local se fait quoi qu'il arrive ; l'utilisateur est déconnecté côté client même si la révocation serveur n'a pas eu lieu
- **Race condition 401** : un intercepteur 401 peut être appelé alors qu'un logout volontaire est déjà en cours → Mitigé : vérifier si le token existe encore avant de déclencher la redirection ; si déjà null, ne pas rediriger à nouveau
- **Aucun** risque lié à la sécurité ou aux données
