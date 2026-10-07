# CONTEXT POLICY

Single source of the team's context and token rules. Not part of startup:
the Orchestrator applies it; specialists get the rules they need inside the
Task Context Packet (`18-engineering-management/orchestration`). Tools are
in `TOOLING.md`.

## Principle

**Minimum sufficient context**: exactly what the task needs to be done
correctly. Not the maximum available, not the minimum possible.
Token economy never overrides correctness, security, completeness or
required reasoning. When in doubt, load the required context.

Priority: not loading > compressing context > compressing output.

## Context budget

| Class | Rule |
|---|---|
| REQUIRED | goes in the Task Context Packet |
| USEFUL | loaded on demand (`skills.on_demand`, file sections, docs) |
| IRRELEVANT | never loaded |

Startup is only `START.md` → `BOOTSTRAP.md` → `team.json`.

## Reading code and docs

search → locate → inspect → read the relevant section → act.
Prefer symbol lookup > targeted search (`rg`) > file section > full file >
repository scan (last resort). Never dump the repository, every Markdown
or a whole doc "just in case".

## Terminal output

Filter and limit before running: `rg`, `head`, `tail`, `git diff --stat`,
`git diff <file>`, a single test file. No massive `cat`, full logs, huge
`git log` or the full suite when one test answers the question.

## Agent routing and review

Smallest team, shortest valid path. Risk-based routing (TRIVIAL → owner
only; NORMAL → owner + reviewer; HIGH/CRITICAL → specialists, QA,
acceptance as needed), specialist entry criteria and escalation live in
`18-engineering-management/orchestration` (single source).

## Model routing

| Task | Reasoning |
|---|---|
| docs, small edits, simple tests, CRUD, mechanical work | low / medium |
| architecture, hard debugging, security-critical, complex planning | high |
| high was not enough and risk justifies it | xhigh (exception) |

## Review

Diff-first review and diff-only re-review: `13-code-quality/code-review`.

## Handoff and output

Never pass a whole conversation; use the short format in
`18-engineering-management/handoff`. Reference files and symbols instead of
pasting code.

## Durable memory

Conversations are not memory. Read once → summarize → store in the project
(ADR, spec, research note, handoff) → reference. Before researching, check
for a valid existing note; redo only if the information changed, the
source is stale or the evidence is insufficient. When a session grows large
and its state is persisted, compact or restart it.

## Polling

No frequent polling of agents or terminals. Wait for completion, an event
or a blocker; never relay identical output twice.

## Waste signals

Same file or research read repeatedly, repository scans, giant outputs or
plans, extra reviewers, xhigh on simple tasks, irrelevant skills or MCP
tools, whole history passed on, frequent polling, duplicated
investigation. When seen: stop → reduce → summarize → reference → continue.

## `context` in team.json

`defaults.context` applies to everyone; an employee `context` overrides it.

- `strategy`: `progressive` (only value in use).
- `caveman`: official Caveman default mode. Used here: `caveman` (base
  mode) and `manual` (installed, starts inactive, `/caveman` turns it on).
  Reasoning roles use `manual`. `ultracave`/`megacave` are not used.

On Claude Code the plugin reads the mode from the `CAVEMAN_DEFAULT_MODE`
environment variable of the terminal. The global default is `manual`
(so non-Maestri sessions stay normal); set `CAVEMAN_DEFAULT_MODE` to the
employee's `context.caveman` in each Maestri terminal. On Codex the skill has no hook:
activate per session with `/caveman`.

## Fallback

Caveman is never a single point of failure. If it is unavailable,
unsupported, broken or not installed: keep progressive loading, keep
working, report the unavailability once.

## Measurement

No savings figure is claimed until measured here. Measure per task,
employee, model and tool when the runtime exposes usage; decide on
metrics, not impressions. Tools for this are tracked in `TOOLING.md`.
