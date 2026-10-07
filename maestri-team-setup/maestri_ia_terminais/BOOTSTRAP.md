# MAESTRI TEAM BOOTSTRAP

This is the startup entry point for the Maestri AI team.

## Startup

Read only:

1. `team.json` (same folder as this file)

Identify:

- orchestrator (`team.orchestrator`);
- enabled employees (`enabled: true`);
- IDs, names, titles, responsibilities;
- hierarchy (`reports_to`, `coordinates`);
- runtime assignments (`runtime.terminal`, `runtime.model`).

Do NOT load agent instructions, Skills or external references during startup.

After reading the manifest, stop loading files and wait for a task.

## On Task

1. classify the task;
2. select the minimum required employee(s);
3. load only the selected employee's `instructions` and its `skills.core`;
4. load a skill from its `skills.on_demand` only when the task needs it;
5. `owns` means maintenance responsibility, never loading;
6. consult `../references/repositories.json` only when local knowledge is insufficient, then only ONE relevant reference;
7. apply the employee's `context` (default in `defaults.context`); if Caveman is unavailable, keep working and report it.

Never preload the entire knowledge library.

Never preload every employee prompt.

Never preload external repositories.

`null` fields are unassigned: report them, do not guess.
