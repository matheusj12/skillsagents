# MAESTRI TEAM SETUP — PROJECT RULES

## PURPOSE

This repository is the centralized knowledge, Skills and Agent
configuration library for the Maestri engineering team.

Whenever the user provides a new:

- Skill
- GitHub repository
- prompt
- agent
- engineering methodology
- documentation
- reference
- tool

you MUST organize it according to this repository architecture.

---

## ARCHITECTURE

| Area | Responsibility |
|------|----------------|
| `maestri_ia_terminais/team.json` | employee registry: identity, title, runtime (terminal + model), instructions, skills, hierarchy, enabled |
| `maestri_ia_terminais/BOOTSTRAP.md` | startup entry point of the Orchestrator |
| `maestri_ia_terminais/INSTALL.md` | how to rebuild the team on a new machine |
| `agents/` | employee behavior (file referenced by `employees[].instructions`) |
| `skills/` | operational knowledge |
| `references/repositories.json` | external discovery, consulted on demand |
| `INDEX.md` | human/agent discovery map |
| `CLAUDE.md` | repository governance |

Single source of truth: each piece of information lives in exactly
one of the files above. Reference it; do not copy it elsewhere.

An employee is NOT a terminal, a model or a Skill. The same employee
may change terminal or model without changing identity.

`team.json` is a manifest: references only. No full prompts, no
Skill content, no long role descriptions.

Adding an employee: identity → title → terminal → model →
instructions → Skills (`core`, `on_demand`, `owns`) → hierarchy → register in `team.json` →
validate. Do not change other employees without need. Unknown
values stay `null`; never invent names or models.

---

## TOKEN / CONTEXT ECONOMY

Startup must be cheap; knowledge is loaded on demand. Token economy never
overrides correctness, security, completeness or required reasoning.

- Context and token rules (single source): `maestri_ia_terminais/CONTEXT_POLICY.md`
- Tools, installation governance and optimization tools (single source):
  `maestri_ia_terminais/TOOLING.md`

Reference them; never copy their rules into agents or skills.

---

## SECRETS

Never store API keys, passwords, access/refresh tokens, cookies,
authenticated sessions, private keys, credentials or any other
secret in this repository.

The repository rebuilds CONFIGURATION only. Credentials are
configured separately on each machine. A `.env.example` without
real values is allowed; a `.env` with real values is not.

---

## FIRST ACTION

Before adding or changing anything:

1. Read `INDEX.md`.
2. Inspect only the directories relevant to the current task.
3. Determine what the provided resource actually is.
4. Classify it before installing or storing it.
5. Check whether an equivalent resource already exists.

DO NOT scan or read the entire repository unnecessarily.

---

## CLASSIFICATION

Every incoming resource must first be classified as one of:

### SKILL

Reusable operational knowledge/instructions that an agent can
load when performing a specific task.

Store under:

`skills/<category>/<skill-name>/`

A valid Skill should follow the expected Skill structure and use
`SKILL.md` when appropriate.

---

### REFERENCE

External repository, documentation, research project or example
used only when additional knowledge is required.

Register under:

`references/repositories.json`

Do NOT automatically clone a repository merely because it was
provided.

---

### AGENT

Role definition for a member of the Maestri engineering team.

Store under:

`agents/<agent-id>/`

and register the employee in `maestri_ia_terminais/team.json`,
pointing `instructions` to its instructions file.

Agents define WHO performs work.

Skills define WHAT KNOWLEDGE they can use.

Never confuse Agent with Skill.

---

### TOOL

Executable capability, CLI, MCP, service or integration.

Do not classify a tool as a Skill merely because an agent uses it.

Document or configure it only where appropriate.

---

### FRAMEWORK / LIBRARY / RESEARCH / EXAMPLES

Usually registered as references in `references/repositories.json`
with the matching `type`.

A GitHub repository is NOT automatically a Skill.

---

## SKILL CATEGORIES

Use the existing taxonomy:

01-architecture
02-ai-engineering
03-rag-knowledge
04-vision-document-ai
05-backend
06-frontend
07-database-data
08-testing-qa
09-security
10-devops
11-cloud
12-agent-tools
13-code-quality
14-product-ux
15-documentation
16-research-evaluation
17-git-collaboration
18-engineering-management

Employees reference skills by exact path in `team.json`, never by
whole category:

- `skills.core`: at most 2 skills, each at most ~500 words, loaded when
  the employee is activated. Long detail goes to a reference file next
  to the SKILL.md.
- `skills.on_demand`: loaded only when the task needs it.
- `owns`: who maintains the skill. Owning never implies loading.
- Every skill has exactly one owner. Domain skills are owned by the
  domain expert; process skills by the methodology engineer.
- REFERENCE = `references/repositories.json`, never loaded automatically.

Do NOT create a new category if an existing category adequately
represents the resource.

---

## WHEN USER PROVIDES A GITHUB REPOSITORY

Do NOT immediately install or clone it.

First determine:

1. What does this repository do?
2. Is it a Skill, Tool, Reference, Agent framework, or something else?
3. Who maintains it?
4. Is it official or third-party?
5. Is it actively maintained?
6. What problem does it solve?
7. Does the library already contain something equivalent?
8. Which category does it belong to?
9. Should it become an installed Skill or remain a Reference?
10. Is adding it actually useful?
11. Does it contain real reusable Skills, only examples, or an
    executable tool?

Then perform only the necessary organization.

If it contains Skills: do not copy everything. Analyze each relevant
Skill, compare with existing ones, keep only the useful ones in the
correct category, and preserve authorship/origin. A collection of
100 Skills does NOT mean installing 100 Skills.

Never invent information about a repository. If something could not
be verified, say so.

---

## DUPLICATION POLICY

Before adding a Skill:

Search the relevant category for equivalent functionality.

Prefer:

official
> mature/trusted
> specialized
> community
> experimental

Quality and fit for the task take priority over quantity.
Complementary Skills may coexist.

Do not accumulate multiple Skills that provide essentially the
same instructions without a concrete reason.

If a new resource is clearly superior to an existing one,
report the overlap before replacing anything.

Never delete or replace an existing resource silently.

---

## CONTEXT EFFICIENCY

This repository MUST use progressive disclosure:

Agent → `instructions` + `skills.core` → `skills.on_demand` only when the
task needs it → one reference only when necessary.

Never: an agent loading all Skills, all references or the whole
repository. `INDEX.md` must remain a lightweight discovery map.

---

## EXTERNAL REPOSITORIES

`references/repositories.json` is a registry, not a reading list.

Repositories must be consulted only when relevant to the current
problem.

Do not clone all registered repositories.

Do not load their contents into permanent context.

---

## EXTERNAL REFERENCE POLICY

External repositories MUST NOT be cloned into this workspace.

All approved repositories are registered in:

`references/repositories.json`

When the user provides a repository:

1. Inspect the repository sufficiently to identify its purpose.
2. Do NOT clone it.
3. Determine its category and type.
4. Check for duplicates in `repositories.json`.
5. Add or update its metadata.
6. Keep the description concise and factual.
7. Add specific `use_for` discovery terms.
8. Access the repository again only when a future task actually
   requires it.

Entry format:

```json
{
  "id": "repository-id",
  "name": "Repository Name",
  "url": "https://github.com/owner/repository",
  "owner": "owner",
  "type": "reference",
  "category": "02-ai-engineering",
  "description": "Short factual description.",
  "use_for": ["specific use case"],
  "priority": "trusted"
}
```

`type`: skills | framework | library | tool | agent-framework |
reference | research | examples

`priority`: official | trusted | community | experimental

`id` and `url` must be unique in the registry.

Source priority when consulting knowledge:

1. Existing project code and architecture
2. User requirements
3. Official documentation
4. Official vendor repositories
5. Mature open-source repositories
6. Research repositories
7. Experimental repositories

The JSON registry is the discovery layer.

GitHub repositories are the knowledge source.

Do not turn external repositories into permanent context.

---

## CHANGE POLICY

Make the smallest necessary change.

Do not:

- reorganize unrelated categories
- rename unrelated resources
- install unrelated dependencies
- create speculative abstractions
- duplicate existing Skills
- expand scope without reason

Preserve the established architecture.

---

## USER COMMAND INTERPRETATION

When the user says:

"adicione esse repo"
"organize isso"
"coloque esse"
"instale essa skill"
"use esse projeto"
"adicione essa referência"

automatically apply this classification process:

analyze → classify → detect duplication → choose category →
decide Skill or Reference → organize → validate → report

The user does NOT need to explain the repository structure again.

---

## REPORT FORMAT

After organizing something, report concisely:

### CLASSIFICATION
Skill / Reference / Agent / Tool / Framework / Library / Research / Examples

### CATEGORY
Selected category.

### LOCATION
Where it was registered or installed.

### REASON
Why it belongs there.

### DUPLICATION
Whether equivalent functionality already existed.

### CHANGES
Exactly what was changed.

### STATUS
ADDED / UPDATED / REFERENCE ONLY / SKIPPED / NEEDS DECISION

---

## GOLDEN RULE

Do not collect resources.

Curate them.

The objective of this repository is NOT to contain the largest
number of Skills or GitHub repositories.

The objective is to provide the Maestri agents with the smallest,
highest-quality and most relevant engineering knowledge library
possible.
