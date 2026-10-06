---
name: small-changes-and-commits
description: Small, self-contained changes and Conventional Commits messages. Use when preparing commits or pull requests.
---

# Skill: Mudanças Pequenas e Commits

## Mudanças pequenas (Google)

- Uma mudança resolve **uma** coisa e é autocontida: compila e passa nos testes sozinha.
- Pequena o bastante para revisar com atenção (referência prática: ~100 linhas é bom; ~1000 é grande demais).
- Refatoração e mudança de comportamento em mudanças separadas.
- Inclua os testes na mesma mudança do código.

## Conventional Commits

```text
<tipo>(<escopo opcional>): <descrição no imperativo>

<corpo opcional: o porquê>

<rodapé opcional: BREAKING CHANGE: ..., refs>
```

- Tipos: `feat` (funcionalidade), `fix` (correção), `docs`, `refactor`, `test`, `chore`, `perf`, `ci`.
- `BREAKING CHANGE:` no rodapé (ou `!` após o tipo) marca quebra de compatibilidade.
- Descrição curta; o corpo explica o motivo, não repete o diff.

## Pull request

Título no mesmo padrão, descrição com o que mudou, por quê e como foi testado.

## Fonte

- Google Engineering Practices, "Small CLs": https://google.github.io/eng-practices/review/developer/small-cls.html
- Conventional Commits 1.0.0: https://www.conventionalcommits.org/en/v1.0.0/
