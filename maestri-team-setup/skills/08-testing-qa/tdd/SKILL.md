---
name: tdd
description: Test-driven development rules - red before green, vertical slices, tests at agreed seams, anti-patterns. Use when building features or fixing bugs test-first.
---

> **Adaptação Maestri:** os seams vêm da spec/plano ou são combinados com quem planejou (Tech Lead); na dúvida, pergunte a quem te acionou. Refatoração fica para a revisão (`13-code-quality/code-review`). Complementa `08-testing-qa/testing-strategy` (tamanhos de teste).

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle: consult them before and during the loop, not after.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you're touching.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything, so agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?" Give each proposed seam a one-line note on what it catches and what it misses.

When the shape of that interface is itself in question (how deep the module is, where the seam belongs, what the interface should expose), read `01-architecture/codebase-design` for the vocabulary. It is the shared source of the module, interface, depth, seam, adapter, leverage and locality terms, and it is a reference to consult, not a session to run.

## Anti-patterns

Implementation-coupled, tautological and horizontal-slicing tests: see [anti-patterns.md](anti-patterns.md) when reviewing or writing tests.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage (see `13-code-quality/code-review`), not the red → green implementation cycle.

---

Adaptado de [mattpocock/skills](https://github.com/mattpocock/skills/tree/f3fc5632f401/skills/engineering/tdd) (commit `f3fc5632f401`), © 2026 Matt Pocock, licença MIT. Ver `skills/THIRD_PARTY_LICENSES.md`.
