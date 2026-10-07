# MAESTRI TEAM — KNOWLEDGE INDEX

This workspace contains the shared knowledge library for the Maestri
multi-agent engineering team.

## Core Rule

DO NOT load the entire knowledge library.

Use progressive discovery:

ROLE
→ employee `skills.core` (small, always)
→ `skills.on_demand` only when the task needs it
→ external reference only if necessary.

Employees load skills by exact path from `maestri_ia_terminais/team.json`,
never a whole category. Categories below are for humans and for adding
new skills.

Load only the minimum knowledge required for the current task.

## Categories

### 01 — Software Architecture
Path: `skills/01-architecture/`

### 02 — AI Engineering
Path: `skills/02-ai-engineering/`

### 03 — RAG & Knowledge
Path: `skills/03-rag-knowledge/`

### 04 — Computer Vision & Document AI
Path: `skills/04-vision-document-ai/`

### 05 — Backend Engineering
Path: `skills/05-backend/`

### 06 — Frontend Engineering
Path: `skills/06-frontend/`

### 07 — Database & Data
Path: `skills/07-database-data/`

### 08 — Testing & QA
Path: `skills/08-testing-qa/`

### 09 — Security
Path: `skills/09-security/`

### 10 — DevOps & Infrastructure
Path: `skills/10-devops/`

### 11 — Cloud
Path: `skills/11-cloud/`

### 12 — Agent Tools & Automation
Path: `skills/12-agent-tools/`

### 13 — Code Quality
Path: `skills/13-code-quality/`

### 14 — Product & UX
Path: `skills/14-product-ux/`

### 15 — Documentation
Path: `skills/15-documentation/`

### 16 — Research & Evaluation
Path: `skills/16-research-evaluation/`

### 17 — Git & Collaboration
Path: `skills/17-git-collaboration/`

### 18 — Engineering Management
Path: `skills/18-engineering-management/`

## Team

Startup entry point: `maestri_ia_terminais/BOOTSTRAP.md`

Employee registry (runtime, skills, hierarchy):
`maestri_ia_terminais/team.json`

Employee instructions: file referenced by `employees[].instructions`

Context / token policy: `maestri_ia_terminais/CONTEXT_POLICY.md`

Tools and installation governance: `maestri_ia_terminais/TOOLING.md`

## External References

External repositories are cataloged in:

`references/repositories.json`

External repositories must NOT be read automatically.

Consult them only when installed Skills and project documentation
are insufficient for the current task.
