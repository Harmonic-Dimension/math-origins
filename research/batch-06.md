# Before the Proof — batch 06 research note

Research date: 9 October 2026. Family **268**, the spin-one Haldane gap. Eight accounts now have researched histories; two remain pending. The page uses the existing editorial layout and a new exact two-spin spectrum comparison. Local `published` status includes the account in the researched collection, without validating a reported proof.

## Evidence inspected

- [Haldane’s preserved 1981 preprint](https://arxiv.org/html/1612.00076v1): opening, prediction, original July 1981 date and transcription note inspected. The archive upload was in 2016. This is the earliest explicit formulation identified for this account; no exact circulation day is claimed.
- [Lieb–Schultz–Mattis institutional record](https://collaborate.princeton.edu/en/publications/two-soluble-models-of-an-antiferromagnetic-chain/), [Haldane’s 1983 publisher record](https://doi.org/10.1103/PhysRevLett.50.1153), [Affleck–Lieb](https://doi.org/10.1007/BF00400304), [AKLT 1987](https://doi.org/10.1103/PhysRevLett.59.799) and [AKLT 1988](https://doi.org/10.1007/BF01218021): original abstracts and bibliographic dates inspected. Full original proofs were not reviewed. The half-odd-integer obstruction allows degeneracy as an alternative and does not prove an integer-spin gap.
- [White–Huse](https://doi.org/10.1103/PhysRevB.48.3844): original abstract inspected, including the numerical estimate 0.41050(2) and effective endpoint spin-one-half degrees of freedom. Numerical evidence remains distinct from a uniform rigorous lower bound.
- [Yarotsky](https://arxiv.org/abs/math-ph/0412040): primary abstract and date inspected. Perturbative scope corroborated by the pinned introduction; original proof not reviewed. Timeline uses journal year 2006, noting the 2004 posting.
- [Pollmann–Berg–Turner–Oshikawa](https://arxiv.org/html/0909.4059v3): abstract and introduction inspected. Timeline uses journal year 2012, noting the 2009 posting.
- [Tasaki 2018](https://arxiv.org/html/1804.04337v5): abstract and index formulation inspected. [Tasaki 2024](https://arxiv.org/html/2407.17041v3): Equation (2), Assumption 2 and Theorem 3 inspected; timeline uses first posting 2024, noting journal year 2025. Generated HTML document dates are not used for historical chronology.
- Pinned periodic manuscript `build/introduction.tex`, `build/model.tex` and `build/assembly.tex` retrieved at commit `fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb`; definitions, main theorem and infinite-volume scope inspected.
- Pinned boundary companion `build/main.tex`, `build/sections/history.tex` and `build/sections/topology.tex` retrieved at that same commit; main theorem, field signs, site count and topological corollary inspected. Scope reviewed, proofs and finite certificates not assessed or executed.

## Scope and illustration

The periodic statement takes coupling one and even length N. It reports ground-state uniqueness for N ≥ 60, gap > (4/105) log(80/79) there, and gap > log(20)/784 for even N ≥ 2304. The limiting gap bound is non-strict. E₁ is the next **distinct** energy. Small-ring positivity above the full ground sector does not assert ground-state simplicity.

The companion takes **2L+1** open sites and the term −h(Sᶻ₋L + SᶻL), at **h = 3/5**. It reports gap > log(10)/392 for L ≥ 960. Its index −1 conclusion concerns every boundary-selected subsequential local limit, not convergence of the full sequence or global uniqueness among all infinite-chain states. Periodic estimates alone do not supply the separate boundary condition.

For two spin-one sites, total spin s = 0, 1, 2 gives q = S₁·S₂ = [s(s+1)−4]/2 and energies −2, −1, 1 with multiplicities 1, 3, 5. The unshifted AKLT bond q + q²/3 has energies −2/3 (four states) and 4/3 (five states). Both spectra use the same linear energy scale. Controls compare these exact local interactions; the caption and explanation explicitly distinguish either two-site gap from a uniform long-chain gap. Neighboring bonds generally do not commute.

This is a selected history. Experimental evidence, string-order developments, other indices and later gap criteria are not exhaustively covered. The conceptual-origin date is a selected mathematical precursor, not the first origin of antiferromagnetism. No independent acceptance review or proof verification is claimed. Imported catalogue metadata is unchanged.
