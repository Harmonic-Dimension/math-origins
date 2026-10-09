# Before the Proof

A public editorial site for the intellectual histories behind selected result families in OpenAI’s October 6, 2026 mathematics release. React, TypeScript and Vite; Markdown prose and validated JSON records. No runtime API, backend, database or account system.

## Run locally

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

The printed local URL opens the landing page. Editing content reloads the preview.

```sh
npm run validate
npm test
npm run build
npm run preview
```

Build validates content and upstream checksums, checks TypeScript, bundles assets and prerenders every public route. The generated `dist/` contains HTML for the landing page, explorer, ten problem pages, essay, about page and 404. It can be served with JavaScript disabled; filtering and timeline selection require JavaScript.

## What is included, and what is pending

All **372 families / 719 manuscripts** are imported from a pinned public upstream commit. The site selects families **004, 087, 158, 084, 102, 159, 197, 221, 268, 304**. It preserves original titles, disciplines, release summaries, overview TeX and manuscript-map metadata, abstracts and commit-pinned manuscript links.

Historical accounts for **004, 087, 158, 084, 159, 197, 221, 268 and 304** are included with sources and branching timelines. The remaining **one** account is marked **research pending**. Research limitations are recorded in `research/batch-01.md`, `research/batch-02.md`, `research/batch-03.md`, `research/batch-04.md`, `research/batch-05.md`, `research/batch-06.md` and `research/batch-07.md`. No missing historical narratives, names, early dates or causal relationships have been fabricated. Pending records contain a sourced release milestone and a provisional result classification. Their pale branching diagram is explicitly a conceptual schematic; it becomes a real sourced graph once historical events are added.

Still needed for research-pending cases: 120–200-word historical narratives; original and modern problem statements and their differences; researched conceptual origins and earliest identified formulations; attribution commentary; contributors; historical sources; dated, sourced milestones and their relationships; pattern tags; confidence assessments; scope review. The opening Markdown essay is retained as a provisional project perspective, not a finished author essay. The explorer defaults to the nine researched accounts; its collection filter exposes the upcoming one.

## Edit or add a case (two files)

1. Edit `content/cases/004.json` and `content/cases/004.md`, or copy that pair and name it with another **existing, three-digit** upstream family ID. Keep the JSON `familyId` identical to the filename. Do not edit generated catalogue files to create a history.
2. Keep `status: "research-pending"` until research is supplied. Use `"draft"` while working. Write the origin story in the Markdown file. Markdown supports links, headings, lists and inline/display LaTeX math. Raw HTML is disabled.
3. Fill the mathematical introduction fields described below, contributors and sources. `displayTitle` and `discipline` may stay `null` to use current imported metadata. All missing researched fields use `null`, not invented text or dates.
4. Add timeline events referencing source IDs. Connect a successor to zero or more earlier events using `follows`. Multiple predecessors and successors support branching and reformulation. Use `relationNote` to describe why the connection is justified.
5. Set `lastEditorialUpdate` to the actual YYYY-MM-DD editorial date. Review the result’s precise scope against the manuscripts. Mark the scope classification `"reviewed"` only after that review.
6. Run `npm run validate` and `npm run build`. Set `status: "published"` only after editorial review. Published records require a 120–200-word narrative, historical sources and events, contributors, assessed confidence and the question/attribution/date fields. Explicit unknown dates remain valid.

In GitHub’s web interface, open the JSON or Markdown file, click the pencil, edit and propose a commit or pull request. One or two files per case are all an editor needs to change. No code edits are needed to add a case to the explorer or generate its route. The build fails with actionable errors if a record is invalid. Never include private notes in content: draft records and Markdown are shipped to visitors.

### Mathematical introductions

Each published record also requires `questionPlainLanguage`, `questionFormal`, `whyItMatters` (aim for 80–150 words), `historicalHook`, `whatAIClaims` and `whatRemainsOpen`. These are separate from the preserved `originalQuestion`, `modernQuestion` and `questionDifference` fields. Formal statements, examples and significance prose support Markdown and KaTeX; plain-language questions and hooks are plain text.

Use `illustrativeExample` for an optional caption/explanation and `visualExplainer` for an optional diagram reference (`rational-solutions`, `polar-dual`, `unit-distance`, `geometric-sequence`, `arithmetic-progressions`, `spin-glass`, `direct-finiteness`, `haldane-gap`, or `hilbert-smith`), rendered by `src/components/VisualExplainer.tsx`. Extend that registry and the schema when adding another diagram. `questionSummary` and `claimSummary` provide concise card text; otherwise cards use the plain-language question and qualified scope label. No CMS or database is involved.

`explanationSourceIds` and `claimSourceIds` link these explanations to the record’s existing sources; both are required for published records and checked for dangling references. Pending records may omit the new fields (parsed as null/empty), so no research is invented for upcoming cases. Published pages read in the order question, significance, historical narrative, timeline, reported claim, attribution and sources. Native disclosure elements keep formal statements readable without JavaScript.

### Date shapes

```json
{"precision":"exact","label":"6 October 2026","year":2026,"iso":"2026-10-06"}
{"precision":"approximate","label":"c. 1950","year":1950}
{"precision":"range","label":"1950–1960","start":1950,"end":1960}
{"precision":"unknown","label":"Date not established"}
```

These examples document the schema; they are not historical claims. An exact year need not include an ISO day. Timelines use a relationship layout with equal spacing, not a numerical age calculation. Events should be listed in the desired reading order.

### Source and timeline event shapes

Add a real source to the `sources` array with a unique ID, title, HTTP(S) URL, full citation, kind (`primary`, `secondary`, `upstream`) and note. Every contributor and event must reference existing source IDs.

```json
{
  "id": "formulation",
  "date": {"precision": "unknown", "label": "Date not established"},
  "type": "formulation",
  "title": "Use the sourced formulation title",
  "description": "Explain what the source establishes.",
  "sourceIds": ["an-existing-source-id"],
  "follows": [],
  "relationNote": "",
  "uncertainty": "Explain the specific uncertainty."
}
```

Event types: `background`, `predecessor`, `formulation`, `reformulation`, `partial-result`, `ai-claim`. Duplicate IDs, dangling references, unsafe URL schemes, impossible calendar dates, reversed ranges and cycles fail validation.

Scope types: `full-resolution`, `special-case`, `quantitative-improvement`, `counterexample`, `other`, `unclassified`. A family may have more than one. Pattern tags are the controlled list in `src/schema.ts`; leave them empty until researched.

## Edit the essay

Edit `content/articles/before-the-proof.md`. It is labeled as a project perspective and editorial draft. Its title, deck and editorial date are currently in `src/pages.tsx`. The prose is authored in Markdown.

## Reproduce or refresh the catalogue

`data/catalogue.json` is imported metadata only. `data/upstream/` stores the original UTF-8 overview source, manuscript map, README, revision history and Apache 2.0 license. The JSON provenance records the full Git SHA, UTC import timestamp, release date and SHA-256 checksums of source files.

Reproduce the pinned import offline, using the exact commit in the JSON provenance:

```sh
npm run catalogue:import -- --offline --sha fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb
npm run validate
```

The import timestamp changes unless you supply `--date` with the existing ISO timestamp. For byte-identical generated JSON, supply the same SHA, date and unchanged raw source files.

Refresh from a particular upstream commit:

```sh
npm run catalogue:import -- --sha FULL_40_CHARACTER_UPSTREAM_SHA
npm run validate
npm run build
```

Omit `--sha` to resolve upstream main once, then fetch all files at that immutable SHA. This is a local maintenance command, not a visitor-facing network request. It validates the overview/map agreement and declared counts before writing. It aborts if a curated family would disappear. It **never writes `content/`**. Review the generated diff, especially revised summaries and manuscript groupings; review curated scope classifications after an upstream change.

`npm run validate` regenerates the small `data/selected-catalogue.json` used by the browser so it does not download the entire catalogue. Historical sources in curated records retain the snapshot they cited, even after a catalogue refresh.

## Deploy

Upload **the contents of `dist/`** to any static provider. No Node process, Worker, environment secret or backend is needed. The project is also connected to Sites through `.openai/hosting.json`.

- **Cloudflare Pages / Netlify:** build command `npm run build`; publish directory `dist`. Prerendered directory indexes support direct visits and refreshes.
- **GitHub Pages:** the included `.github/workflows/pages.yml` builds and deploys on pushes to main (or manually). Enable Settings → Pages → Source: GitHub Actions. It supplies the repository base path automatically. Deploying from GitHub requires this project’s source to be in a GitHub repository.
- **Subdirectory hosting:** build with `BASE_PATH=/repository-name/ npm run build`. The build uses that prefix for assets, prerendered links and client navigation.

When deploying a new edited version, rebuild first so prerendered pages and the bundle contain the same content.

## Tests

`npm test` covers schema rules, date uncertainty, sourced branches, published-account requirements, catalogue parsing and count integrity, and curated-content preservation during import.

Browser checks:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

These tests cover search/filter/reset, URL state, navigation, all initial cases and pinned manuscript links, keyboard timeline selection, mobile layout, direct static pages, per-page metadata and reading without JavaScript.

## Source reuse

Upstream materials are attributed to OpenAI and retain their Apache 2.0 license in `data/upstream/LICENSE`. Summaries are quoted catalogue claims, not this project’s proof assessments. Historical sources should remain individually credited; adding a link does not grant permission to reproduce an entire work.

## Illustrated histories

The nine completed cases use original, analytically constructed React/SVG explainers. The unit-distance patch computes every distance-one edge from triangular-lattice coordinates and offers a valid/conflicting coloring comparison. The polar example switches between an exact square–diamond pair and a self-polar unit disk, always at identical coordinate scales. The rational example distinguishes a single equation from a universal decision algorithm. The geometric-sequence example translates, shrinks and reflects the dyadic pattern, distinguishing its limit from its terms; it does not depict an avoiding set. The arithmetic-progression example highlights three or four equally spaced primes on an integer number line, distinguishing finite examples from the all-length conjecture. The spin-glass example lets readers flip each spin on an antiferromagnetic triangle, showing the unavoidable conflict, exact energy and weighted count of all eight arrangements; it does not simulate the Poisson model or its hierarchy. The mathematical examples and date-position calculations have independent checks in `tests/geometry.test.ts`, and browser checks verify the geometric example's common ratio under each transformation and the arithmetic example's prime terms and equal gaps.

The direct-finiteness illustration compares inserting zero and removing the first coordinate on a one-sided infinite sequence, displaying both operation orders. It explicitly distinguishes these operators from group-algebra elements and group cellular automata.

Each researched timeline now includes a year-scaled overview, separate from the relationship diagram and detailed event interface. Ranges are drawn from their supplied start/end dates; approximate dates retain “c.”; unknown dates remain unplaced. Range bars describe the recorded interval, never uninterrupted research activity. All milestones and sources are also available in a native disclosure for reading without JavaScript.

Optional `historicalImages` entries record `src`, `alt`, `caption`, `credit`, `sourceUrl`, `originalUrl`, `license`, and `licenseUrl`. Hilbert’s 1907 portrait is reproduced from Wikimedia Commons, which records its US public-domain status; visible attribution accompanies the image. Other cases use meaningful original geometry rather than unsourced archival images.

Browser checks run at 390, 768 and 1440 pixels and include WCAG 2.1 AA automated axe checks, keyboard interactions, 200% text enlargement and reduced motion. Screenshot captures are kept in the ignored local `screenshots/` directory, outside the production bundle.

The Haldane illustration compares the exact two-spin spectra of the Heisenberg bond and the unshifted AKLT bond. State dots show sector multiplicities on a common linear energy scale. It explains why a local gap and a gap for a related interaction do not establish the pure-model gap uniformly over chain length.

The Hilbert–Smith illustration compares a small plane rotation with all powers in its finite cyclic subgroup. Orders 16 and 32 both include a half-turn. The example distinguishes small elements from entire small subgroups, and faithful actions from free actions: the center stays fixed. It does not depict a p-adic manifold action. The first modern formulation date remains explicitly unknown.
