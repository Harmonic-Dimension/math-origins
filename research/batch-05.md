# Before the Proof — batch 05 research note

Research date: 9 October 2026. Family **197**, Kaplansky’s direct finiteness conjecture. Seven accounts now have researched histories; three remain pending. The paired content uses the existing page layout, with an exact SVG illustration of one-sided sequence shifts. Local `published` status includes the history in the researched collection; it does not validate any reported proof.

## Evidence inspected

- [Kaplansky’s second-edition scan](https://webhomes.maths.ed.ac.uk/~v1ranick/papers/kapfield.pdf), Part II, §3, problem 2, printed pp. 122–123: downloaded and rendered with Poppler; both pages visually inspected. It states characteristic-zero direct/stable finiteness, then explicitly asks the positive-characteristic question. The title/copyright material records the 1969 first edition and 1972 second edition. The date field uses **1972**, the edition actually inspected; it does not establish earliest priority in the first edition or preceding lecture notes.
- [Elek–Szabó](https://arxiv.org/html/math/0305440v2): introduction, theorem, direct/stable distinction and finite-field convolution argument inspected. Documents Gottschalk’s formulation, Gromov’s sofic surjunctivity result, Weiss’s naming credit and the earlier residually amenable result. Timeline uses the **2004 journal year**; first posting was 2003. Rendered version metadata is inconsistent, so it is not used for a precise historical day.
- [Berlai](https://arxiv.org/html/1501.02893v1): introduction, main theorem and bibliography inspected. The extension requires a **finitely generated residually finite normal subgroup** and a sofic quotient; no claim for arbitrary group extensions.
- [Dykema–Heister–Juschenko](https://arxiv.org/abs/1112.1790): primary abstract inspected; finite cancellation patterns, universal groups and selected small-support checks. Timeline uses the first preprint year, **2011**, and notes the 2015 journal version.
- [Elek–Szabó determinant paper](https://arxiv.org/abs/math/0408400): archive abstract and posting history inspected. Timeline uses the **2005 journal year**, with the 2004 first posting distinguished. Full proof not inspected.
- [Gromov publisher issue](https://ems.press/journals/jems/issues/914) and [Weiss’s institutional record](https://cris.huji.ac.il/en/publications/sofic-groups-and-dynamical-systems/): bibliographic dates checked. Original proofs not inspected.
- All four upstream manuscript TeX introductions and main theorems fetched at commit `fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb`. Files are cited individually in the record. Review covers statements, not proofs or formalization.

## Scope distinctions

The 4 October torsion-free theorem claims scalar elements `a,b,c` over **F₂**, with `ab = 1`, `ac = 0`, `c ≠ 0`; this certifies `ba ≠ 1`. Its group is finitely presented, torsion-free and has a finite two-dimensional classifying complex. The 23 September characteristic-two theorem uses a **finite field**, not necessarily F₂, and a finitely presented group with odd-order torsion. The 26 September theorem concerns **one specified odd prime**, a field of order `p⁴` and a finitely generated group with torsion; it does not cover every odd prime. Finite-field scalar pairs give cellular automata on **all configurations**, with injectivity and failure of surjectivity.

The determinant companion uses the characteristic-two existence theorem and constructs an **integral square matrix over a separate finitely generated group**, invertible over its rational group ring. Its Fuglede–Kadison determinant is strictly between zero and one, with finite logarithmic integral. This is compatible with characteristic-zero direct finiteness: the example is already two-sided invertible. Nonsoficity follows from the earlier positive theorem if a reported direct-finiteness failure is valid.

## Illustration and limitations

On one-sided infinite sequences, `S(x) = (0,x₀,x₁,…)` and `T(x) = (x₁,x₂,…)` satisfy `TS = I`, while `ST` erases the first coordinate. The graphic draws five coordinates and an infinite continuation, retaining every supplied term during the intermediate shift. Controls switch operation order and visibly change the first coordinate. This is an elementary operator illustration with a boundary; it is explicitly distinguished from the reported group algebra and from a group-equivariant cellular automaton. Basis-vector checks include coordinates beyond the drawn window.

Montgomery, Gottschalk and Ara–O’Meara–Perera full original texts were not obtained. Their roles and scopes are documented by inspected later primary literature and the pinned introductions, with this limitation visible in source notes. Conceptual origins remain undated. No practical execution of the manuscript prescriptions, independent proof assessment or acceptance review is claimed. The imported catalogue is unchanged.
