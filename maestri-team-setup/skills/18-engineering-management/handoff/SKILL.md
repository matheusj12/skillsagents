---
name: handoff
description: Compact the current work into a handoff document so another employee can continue with minimal context. Use when passing work between employees or sessions.
---

> **Adaptação Maestri:** em "suggested skills", cite skills deste repositório no formato `<categoria>/<skill>`. O destino do handoff é decidido pelo Orchestrator.

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows) - not the current workspace.

Include a "suggested skills" section in the document, naming which skills (`<category>/<skill>`) the next agent should load.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

---

Adaptado de [mattpocock/skills](https://github.com/mattpocock/skills/tree/f3fc5632f401/skills/productivity/handoff) (commit `f3fc5632f401`), © 2026 Matt Pocock, licença MIT. Ver `skills/THIRD_PARTY_LICENSES.md`.
