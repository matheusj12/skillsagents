# Changelog

## SkillsAgents v1.3.0

**Smarter orchestration with less context, fewer agents and lower token usage.**
Smallest team + shortest valid path + minimum sufficient context + proportional review.

### Added
- Risk-based routing (LOW / NORMAL / HIGH / CRITICAL) and on-demand specialist criteria in the `orchestration` skill.
- Task Context Packet for every delegation, with escalation centralized in the Orchestrator.
- `TOOLING.md`: single source for tools, installation governance and token-economy tool status.

### Changed
- Requirements, architecture, QA, review and acceptance are capabilities, not a fixed pipeline.
- Specialists escalate to the Orchestrator instead of calling other specialists.
- Data & API Architect only for new or structural contracts; existing contracts stay with the owner.

### Improved
- `CONTEXT_POLICY.md` is the single source for context rules: minimum sufficient context, targeted reads, filtered terminal output, model routing, durable memory, no polling.
- Diff-first review and diff-only re-review; short handoff format.
- Duplicated token rules removed from `CLAUDE.md` and replaced by references.

### Fixed
- Removed mandatory rules: acceptance on every delivery, full cycle on every task, Data & API Architect on every endpoint, specialist-to-specialist delegation.

RTK × Caveman `shrink` benchmark and Serena evaluation are tracked in `TOOLING.md`; no tool was installed.
