# Immersive Mystery Reading

这是将东野圭吾先生《新参者》《嫌疑人X的献身》转化为电影式沉浸体验的交互叙事项目。读者通过场景画面、氛围声音、人物视角与互动推进进入故事，像看电影一样感受叙事节奏，并通过角色代入和分支选择体验故事线。

The project transforms Keigo Higashino's fiction into cinematic, role-immersive story experiences. Scene imagery, sound, character perspectives, and interactive pacing work together to let readers experience the story rather than only read a sequence of paragraphs.

> Status: `maintenance`  
> Purpose: turn Keigo Higashino's fiction into cinematic, role-immersive story experiences across three independent apps  
> Entrypoints: `apps/newcomer-reader`, `apps/suspect-x-reader`, `apps/suspect-x-explorer`  
> Validation: `pnpm run verify`  
> GitHub: `https://github.com/BallCard/immersive-mystery-reading`  
> Next: extract shared reading, clue, progress, and save-state primitives only when a real reuse need appears

## Live demos

- Newcomer Reader: <https://newcomer-reader.vercel.app/>
- Suspect X Reader: <https://suspect-x-reader.vercel.app/>
- Suspect X Explorer: <https://suspect-x-explorer.vercel.app/>

## Experience design

- **Cinematic immersion**: scene illustrations, transitions, ambient sound, and reveal pacing shape the mood and suspense.
- **Role perspective**: the readers present character-specific viewpoints; the explorer lets the participant act within a detective narrative.
- **Storyline experience**: paced chapters and scenes support story progression; branching choices belong to the explorer rather than every app.
- **Supporting tools**: clues, evidence, timelines, and relationship views help the participant understand the story and characters.

## Experiences

| App | Source work | Interaction model | Production |
| --- | --- | --- | --- |
| `newcomer-reader` | *Newcomer* | atmospheric scenes, neighborhood/Kaga perspectives, and chapter-by-chapter story immersion | [Open](https://newcomer-reader.vercel.app/) |
| `suspect-x-reader` | *The Devotion of Suspect X* | cinematic illustrations, sound cues, alternating Ishigami/police perspectives, and paced story reveal | [Open](https://suspect-x-reader.vercel.app/) |
| `suspect-x-explorer` | *The Devotion of Suspect X* | role-immersive detective storytelling with branching scenes, atmospheric effects, and investigation tools | [Open](https://suspect-x-explorer.vercel.app/) |

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

Each app is deployed as an independent Vercel project. Its Vite base path defaults to `/`; set `VITE_BASE_PATH` only when a subpath deployment is required.

## Repository history

The original repositories were imported with `git subtree`, so their committed histories remain reachable from this repository. The consolidation repository is the canonical home after migration.

## Rights boundary

These are non-commercial interaction studies inspired by published fiction. The repository is not affiliated with or endorsed by the authors or publishers. Text and image assets must be reviewed independently before reuse, redistribution, or commercial deployment. The reusable value is the interaction and implementation pattern, not ownership of the underlying literary works.
