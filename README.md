# Immersive Mystery Reading

> Status: `maintenance`  
> Purpose: preserve three related immersive mystery-reading experiments in one repository  
> Entrypoints: `apps/newcomer-reader`, `apps/suspect-x-reader`, `apps/suspect-x-explorer`  
> Validation: `pnpm run verify`  
> GitHub: `https://github.com/BallCard/immersive-mystery-reading`  
> Next: extract shared reading, clue, progress, and save-state primitives only when a real reuse need appears

## Experiences

| App | Source work | Interaction model |
| --- | --- | --- |
| `newcomer-reader` | *Newcomer* | chapter-based immersive reading with clue collection |
| `suspect-x-reader` | *The Devotion of Suspect X* | progressive reading, clue discovery, and chapter unlocking |
| `suspect-x-explorer` | *The Devotion of Suspect X* | branching detective experience with evidence, dossiers, timeline, and relationship tools |

The three apps intentionally remain separate. They share a theme and some interaction ideas, but they are not interchangeable versions of one product.

## Run and verify

Each app keeps its original package configuration and can be run independently:

```powershell
pnpm --dir apps/newcomer-reader install
pnpm --dir apps/newcomer-reader run dev
```

Run the complete verification set from the repository root:

```powershell
pnpm run verify
```

## Repository history

The original repositories were imported with `git subtree`, so their committed histories remain reachable from this repository. The consolidation repository is the canonical home after migration.

## Rights boundary

These are non-commercial interaction studies inspired by published fiction. The repository is not affiliated with or endorsed by the authors or publishers. Text and image assets must be reviewed independently before reuse, redistribution, or commercial deployment. The reusable value is the interaction and implementation pattern, not ownership of the underlying literary works.
