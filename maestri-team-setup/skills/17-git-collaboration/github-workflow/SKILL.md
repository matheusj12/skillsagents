---
name: github-workflow
description: GitHub flow for the team - short-lived branches, pull requests, branch protection, Actions security, semver releases. Use when pushing, opening PRs, configuring a repository or publishing a release.
---

# Skill: GitHub Workflow

## Branches e PRs

- `main` sempre implantável. Trabalho em branches curtas a partir dela: `feat/...`, `fix/...`, `chore/...`.
- Uma mudança pequena por PR (ver `17-git-collaboration/small-changes-and-commits`).
- PR com título no padrão Conventional Commits e descrição: o que mudou, por quê, como foi testado.
- Merge só com revisão aprovada e checks verdes. Apague a branch depois do merge.

## Proteção da `main`

- Exigir PR, pelo menos 1 aprovação e status checks obrigatórios (build, testes).
- Bloquear force push e exclusão da branch.
- `CODEOWNERS` para exigir revisão de quem é dono de cada área.

## GitHub Actions

- `permissions:` mínimas no workflow (ex.: `contents: read`); amplie só no job que precisar.
- Fixe actions de terceiros por SHA do commit, não por tag móvel.
- Secrets em GitHub Secrets ou environments; nunca em código, logs ou artefatos.
- Workflows de `pull_request` vindos de forks não recebem secrets: não use `pull_request_target` com checkout do código do PR.

## Releases

- Versão semântica `MAJOR.MINOR.PATCH`: MAJOR quebra compatibilidade, MINOR adiciona funcionalidade compatível, PATCH corrige.
- Tag `vX.Y.Z` no commit liberado + release com notas geradas a partir dos commits.
- Release só depois do veredito PRONTO do checklist `10-devops/release-readiness`.

## Antes de todo push

- [ ] `git status` e diff revisados
- [ ] Nenhum secret, `.env`, cache ou temporário
- [ ] Branch certa; nada direto na `main` protegida

## Fonte

- GitHub Docs, "About protected branches": https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub Docs, "Security hardening for GitHub Actions": https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
- Semantic Versioning 2.0.0: https://semver.org/
