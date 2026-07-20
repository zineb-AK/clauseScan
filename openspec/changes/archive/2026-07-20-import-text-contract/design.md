## Context

L'import de contrat par texte brut s'appuie sur l'infrastructure existante mise en place pour US4 (modèle `Contract`, `ContractResource`, `ContractPolicy`). Le même endpoint `POST /api/contracts` doit gérer deux modes : upload PDF (existant) et contenu texte (nouveau). La logique de validation et de création diverge selon la source.

## Goals / Non-Goals

**Goals:**
- Ajouter le champ `content` (texte brut) à `POST /api/contracts`
- Validation : présent si `contract` absent, non vide, max 100 000 caractères
- Si `content` fourni → `source_type = "text"`, titre = première ligne du contenu, pas de fichier stocké
- Si `contract` fourni → comportement existant inchangé
- Erreur 422 si ni `content` ni `contract` fournis, ou si `content` vide/dépasse la limite
- Réutiliser `Contract` model, `ContractResource`, `ContractPolicy` sans modification

**Non-Goals:**
- Analyse IA du contrat (US8 - change séparé)
- Import PDF (US4 - déjà fait)
- Liste des contrats (US6 - change séparé)

## Decisions

1. **Champ `content` optionnel, conditionnel à l'absence de `contract`** : La validation utilise `required_without:contract` pour permettre un mode ou l'autre. Implique que les requêtes envoyant les deux champs soient rejetées.
2. **Titre dérivé du contenu** : Si `content` est fourni, le titre du contrat est la première ligne non vide (max 255 caractères). Pas de champ titre dédié dans la requête.
3. **Pas de service** : La logique reste dans le contrôleur — un `if/else` sur la source est suffisant. Un service serait prématuré tant qu'il n'y a que deux modes.
4. **Réutilisation de `StoreContractRequest`** : Un seul Form Request gère les deux modes, avec validation conditionnelle. Alternative (deux Form Requests séparés) rejetée car le endpoint est le même.
5. **Limite de 100 000 caractères** : Suffisant pour la plupart des contrats (un bail standard fait ~5 000-10 000 caractères). Ajustable via config si besoin futur.

## Risks / Trade-offs

- [Contenu malveillant] → Le texte brut est stocké tel quel. À l'avenir, un nettoyage/sanitization pourrait être nécessaire avant analyse IA. Pas bloquant pour cette US.
- [Limite arbitraire] → 100 000 caractères peut être trop court pour certains contrats très longs. Configurable via constantes ou config si besoin.
- [Rétrocompatibilité] → L'ajout d'un champ optionnel ne casse pas les clients existants. Les requêtes avec `contract` uniquement continuent de fonctionner.
