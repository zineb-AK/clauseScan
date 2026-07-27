## Context

Le `ContractController` gère déjà l'import de contrats (PDF et texte). Les routes sont protégées par Sanctum, et une `ContractPolicy` existe déjà avec les méthodes `view`, `create`, et `delete`. Le modèle `Contract` et sa migration sont en place.

## Goals / Non-Goals

**Goals:**
- Permettre à un utilisateur de lister ses contrats (paginiés, triés par date de création descendante)
- Permettre à un utilisateur de supprimer un contrat dont il est propriétaire
- Supprimer le fichier PDF associé lors de la suppression d'un contrat importé via PDF

**Non-Goals:**
- Aucun changement de schéma de base de données
- Aucune modification du comportement d'import existant
- Pas de soft delete (suppression physique)

## Decisions

- **Pagination** : Par défaut 15 résultats par page, paramètre `per_page` optionnel via la query string. Format standard Laravel paginator.
- **Tri** : `created_at DESC` par défaut — les contrats les plus récents en premier.
- **Suppression du fichier** : Nettoyage du fichier PDF dans `Storage` avant suppression du modèle (dans le controller, pas dans un événement — simple et explicite).
- **Policy existante** : La méthode `delete` de `ContractPolicy` est déjà implémentée et sera utilisée via `$this->authorize('delete', $contract)`.
- **Resource** : Réutilisation de `ContractResource` existante — les champs actuels suffisent pour la liste.
- **404 vs 403** : Si le contrat n'existe pas → 404. Si le contrat appartient à un autre utilisateur → 403 (géré par la Policy).

## Risques / Trade-offs

- **Suppression définitive** : Pas de soft delete — une fois supprimé, le contrat et son fichier sont irrécupérables. Acceptable pour ce périmètre.
- **Fichier orphelin** : Si la suppression du fichier échoue, le contrat est tout de même supprimé de la base. Acceptable — les fichiers orphelins sont rares et sans impact sécurité.
