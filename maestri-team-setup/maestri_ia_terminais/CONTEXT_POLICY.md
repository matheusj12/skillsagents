# CONTEXT POLICY

Read only when `team.json` `context` values are unclear. Not part of startup.

## Rules

1. Load minimum context.
2. Load employee instructions only when the employee is activated.
3. Load Skills on demand.
4. Load external references only when required.
5. Prefer concise tool output.
6. Use Caveman where supported.
7. Never sacrifice correctness merely to save tokens.

Priority: progressive loading > context compression > output compression.
Not loading 10,000 tokens beats loading and compressing them.

Token optimization must never override correctness, security,
completeness or required reasoning (debugging, architecture, evaluation).

## Layers

| Layer | What | Status |
|-------|------|--------|
| 1 | `BOOTSTRAP.md` + progressive loading | active |
| 2 | Caveman skill: shorter agent output | see runtime table |
| 3 | Caveman proxy: compresses logs, diffs, JSON, tool output | not configured |

## `context` in team.json

`defaults.context` applies to everyone; an employee `context` overrides it.

- `strategy`: `progressive` (only value in use).
- `caveman`: official Caveman default mode. Used here: `caveman` (base
  mode) and `manual` (installed, starts inactive, `/caveman` turns it on).
  Reasoning roles use `manual`. `ultracave`/`megacave` are not used.

On Claude Code the plugin reads the mode from the `CAVEMAN_DEFAULT_MODE`
environment variable of the terminal. On Codex the skill has no hook:
activate per session with `/caveman`.

## Runtime support

Source: https://github.com/JuliusBrussee/caveman (INSTALL.md, tag v3.1.0).

| Runtime | Method | Command |
|---------|--------|---------|
| Codex | skill (per session `/caveman`) | `npx skills add JuliusBrussee/caveman -a codex -g -s caveman` |
| Claude Code | plugin + hooks (auto-on) | `claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman` |
| OpenCode | native plugin + AGENTS.md | `npx -y github:JuliusBrussee/caveman -- --only opencode` |
| Antigravity | skill copy (soft probe) | `npx -y github:JuliusBrussee/caveman -- --only antigravity` (IDE) or `--only antigravity-2` |

Uninstall: `npx -y github:JuliusBrussee/caveman -- --uninstall`; skills
added with `npx skills add` are removed with `npx skills remove caveman`.

## Fallback

Caveman is never a single point of failure. If it is unavailable,
unsupported, broken or not installed: keep progressive loading, keep
working, report the unavailability once.

## Measurement

No savings figure is claimed until measured here. The official A/B
tool is `caveman trial -- <agent>` (needs the Caveman CLI, not installed).
Compare baseline vs Caveman on: context usage, tool output, task
correctness, response quality, execution stability.
