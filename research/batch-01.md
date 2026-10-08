# Before the Proof — batch 01 research note

Research date: 8 October 2026. Families: **004, 087, 158**. Subsequent batches remain pending.

The records use the website's existing strict schema in `src/schema.ts`: JSON holds questions, attribution, contributors, sources, timeline and uncertainties; the paired Markdown file holds the short narrative. Their local `published` status means a historical account is available to the site, not that the mathematical claims have been verified. Historical confidence is **moderate**, and scope classification remains **provisional**.

OpenAI references are pinned to catalogue snapshot [fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb](https://github.com/openai/math/tree/fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb), which includes updates after the initial 6 October release. The corresponding introductions and bibliographies were read, together with the separate symplectic history section and the elliptic-curve companion introduction relevant to 004. This was a history and claim-scope investigation, not a proof review.

## Most interesting finding

The strongest editorial hook is Nelson's failed attempt to encompass map-coloring questions within a single infinite graph. The motivation is documented through his 1991 letter reproduced in [Soifer's scholarly history](https://www.wfnmc.org/Journal%202003%201.pdf), not a 1950 manuscript. The interpretation that an unsuccessful shortcut became a lasting problem is editorial; the failed motivation itself is documented.

Two other useful details are that Hilbert's expression “rational integers” means ordinary integers, and that Mahler's original polygon paper explicitly leaves equality for arbitrary planar convex regions unsettled. These prevent deceptively tidy origin stories.

## Case notes

| Family | Historical classification | Most consequential distinction |
| --- | --- | --- |
| 004 | Inherited problem; gradual crystallization | The integer question, full rational first-order arithmetic and rational polynomial solvability are different decision problems. |
| 087 | Gradual crystallization; unexpected connections | Modern Hanner equality, functional inequalities and symplectic width go beyond the original sharp symmetric bound. |
| 158 | Multiple origins; failed motivating connection | The unrestricted question, measurable variant and polygonal-region variants require different assumptions. |

**004 — priority remains open.** [Cornelissen–Zahidi (2000)](https://arxiv.org/html/math/0006140v1) explicitly discuss the rational existential-decision question, and [Poonen (2003)](https://arxiv.org/html/math/0306277v1) states its polynomial version. These are the earliest explicit formulations located in this limited search, not the origin of the question. Robinson's 1949 paper is a precursor rather than an identified first statement of precisely this problem. An earlier explicit rational formulation and its proposer should be sought in mid-century logic literature. Mazur's obstruction concerns proposed definitions/models, not undecidability by every possible method.

**087 — dates and equality deserve care.** The [polygon scan](https://carmamaths.org/resources/mahler/docs/059.pdf) ends “Montana, August 1938”; bibliography and archive grouping disagree between 1938 and 1939. The [1939 transference paper](https://carmamaths.org/resources/mahler/docs/057.pdf), received in August 1938, explicitly prints the symmetric conjecture on p. 96. The first all-dimensional nonsymmetric formulation and first full Hanner equality conjecture were not established here. The unrestricted Viterbo conjecture was [disproved](https://annals.math.princeton.edu/2026/203-2/p05); its historical implication for Mahler must remain conditional. OpenAI also cites a [2026 three-dimensional Mahler preprint](https://arxiv.org/abs/2605.09334v3), whose proof and status were not assessed in this batch.

**158 — recollections differ.** Nelson's modest recollection of his own progress conflicts with Isbell's memory of Nelson proving the four-color lower bound. Hadwiger's possible independent proposal is not settled by the available correspondence. Gardner's October 1960 column is the earliest printed formulation identified by the scholarly account used here. The corrected [de Grey manuscript](https://arxiv.org/html/1804.02385v3) uses 1,581 vertices, rather than the initial 1,585. The 2026 claim leaves six versus seven open.

## Sources not fully obtained

- No contemporaneous 1950 Nelson manuscript or earlier first statement of the rational Hilbert problem was located.
- Gardner's complete 1960 column and Hadwiger's original 1945/1961 papers were not retrieved. Their historical roles were checked through scholarly accounts; the 1961 archive presented a verification barrier.
- Falconer's 1981 full text was not obtained. The citation was checked against his institutional record and the theorem/method against [Payne's primary 2009 paper](https://arxiv.org/pdf/0707.1177).
- Hanner's complete paper, the full Fradelizi–Meyer 2008 article and the Bourgain–Milman archive scan were not obtained. Publisher/bibliographic records and the [scholarly volume-product survey](https://arxiv.org/html/2301.06131v1) supplied the relevant context.
- The manuscript-cited [13 January 2026 width question by Alejandro Vicente](https://symplectic-topology.blogspot.com/2026/01/questions-related-to-mahler-and-viterbo.html) returned a rate-limit error. Its attribution is therefore recorded as manuscript-reported, not independently confirmed.

The branching timeline links represent mathematical relationships explained in the records. They should not be read as evidence that each later contributor directly relied on each earlier paper. No claim of smooth, inevitable progress or exhaustive historical priority is intended.

