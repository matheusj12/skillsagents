# TOOLING

Single source of the team's tools. Referenced, never copied into agents.
One machine, one engineering environment, many roles: a tool is installed
once, never once per agent.

## Levels

| Level | What | Managed by |
|---|---|---|
| 1 — Machine | runtimes, CLIs, agent runtimes, optimization tools | this file, installed once |
| 2 — Project | dependencies of the product (`package.json`, `pyproject.toml`, `Gemfile`...) | the project's own files |
| 3 — Agent capability | which role may use a tool (`team.json` responsibilities) | no new installation |

## Installation governance

No agent installs a tool on its own initiative (`apt`, `brew`, `npm -g`,
`pip`/`gem` global, MCP servers, hooks, proxies). Flow:

need → check this file and existing tools → justify → token benefit vs
overhead (MCP definitions, prompts, dependencies, maintenance, security
surface) → **user approval** → install once → record here.

A token-saving tool enters only when savings > overhead, measured.
Never two tools for exactly the same problem without a measured reason.

## Machine inventory (level 1)

| Tool | Status | Notes |
|---|---|---|
| git, gh, Node.js 22, npm, uv | INSTALLED | base toolchain |
| `claude` (Claude Code) | INSTALLED | runtime `claude-code` |
| `codex` | INSTALLED | runtime `codex` |
| `agy` | INSTALLED | runtime `antigravity` |
| `opencode` (`opencode-ai`) | INSTALLED | runtime `opencode` |
| Caveman skill (Codex) | INSTALLED | per session `/caveman` |
| Caveman plugin (Claude Code) | INSTALLED | global default `manual` |

## Token-economy tools

| Tool | What it does | Status | Reason |
|---|---|---|---|
| Caveman skill/plugin | shorter agent output | INSTALLED | see `CONTEXT_POLICY.md` |
| Caveman proxy / `caveman shrink` | compresses tool output and context | REQUIRES BENCHMARK | overlaps RTK; telemetry on by default; changes `ANTHROPIC_BASE_URL` |
| [RTK](https://github.com/rtk-ai/rtk) (Apache-2.0) | CLI proxy that compresses dev-command output | REQUIRES BENCHMARK | mature; same problem as `caveman shrink`, keep only the winner |
| [Serena](https://github.com/oraios/serena) | semantic symbol navigation via MCP (LSP) | PLANNED | helps large codebases; adds MCP tool definitions to every session; benchmark on a real large project first |
| [context-compress](https://github.com/Open330/context-compress) (MIT) | MCP + hooks compressing tool output | REJECTED | same problem as RTK/Caveman, very young project |
| [icm](https://github.com/rtk-ai/icm) (Apache-2.0) | permanent agent memory via MCP | NOT NEEDED | durable memory already lives in project files (`CONTEXT_POLICY.md`) |
| [grit](https://github.com/rtk-ai/grit) (Apache-2.0) | git for parallel agents | NOT NEEDED | one GitHub owner pushes; Maestri floors isolate parallel work |

Benchmark rule: same real task, baseline vs tool, comparing tokens,
terminal output, correctness and stability. No figure is claimed before.

## Caveman install per runtime

Source: https://github.com/JuliusBrussee/caveman (INSTALL.md, tag v3.1.0).

| Runtime | Method | Command |
|---------|--------|---------|
| Codex | skill (per session `/caveman`) | `npx skills add JuliusBrussee/caveman -a codex -g -s caveman` |
| Claude Code | plugin + hooks | first `~/.config/caveman/config.json` = `{"defaultMode": "manual"}`, then `claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman` |
| OpenCode | native plugin + AGENTS.md | `npx -y github:JuliusBrussee/caveman -- --only opencode` |
| Antigravity | skill copy (soft probe) | `npx -y github:JuliusBrussee/caveman -- --only antigravity` (IDE) or `--only antigravity-2` |

Uninstall: `npx -y github:JuliusBrussee/caveman -- --uninstall`; skills
added with `npx skills add` are removed with `npx skills remove caveman`.

## Reconstruction

New machine: follow `INSTALL.md`, then install the level-1 tools above
marked INSTALLED. Credentials are configured per tool, never stored here.
