## Why

Les utilisateurs peuvent importer des contrats mais pas encore les consulter ni les supprimer. Pour offrir une gestion complète des contrats, il faut pouvoir lister tous ses contrats et supprimer ceux devenus inutiles.

## What Changes

- Ajout de la méthode `index()` sur `ContractController` pour lister les contrats de l'utilisateur connecté (paginiés)
- Ajout de la méthode `destroy()` sur `ContractController` pour supprimer un contrat (avec vérification d'appartenance via `ContractPolicy::delete`)
- Ajout des routes `GET /api/contracts` et `DELETE /api/contracts/{contract}`
- Extension de `ContractResource` pour inclure plus de détails dans la liste si nécessaire
- Mise à jour du `ContractPolicy` (la méthode `delete` existe déjà)

## Capabilities

### New Capabilities
- `contract-list-delete`: Lister ses contrats (paginiés, triés par date de création descendante) et supprimer un contrat dont on est propriétaire

### Modified Capabilities
*Aucune spécification existante n'est modifiée — le comportement de l'import reste inchangé.*

## Impact

- **Code** : `ContractController` (ajout `index`, `destroy`), `routes/api.php` (nouvelles routes)
- **API** : Deux nouveaux endpoints authentifiés
- **Données** : Aucun changement de schéma (les colonnes existantes suffisent)
- **Tests** : Nouveaux tests pour les deux endpoints (succès, 401, 404, 403)
