-- SkillsAgents — Database Schema

CREATE TABLE IF NOT EXISTS generations (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  type        TEXT        NOT NULL CHECK (type IN ('prompt', 'agent', 'skill')),
  input       TEXT        NOT NULL,
  output      TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_views (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name  TEXT        NOT NULL,
  viewed_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generations_type ON generations(type);
CREATE INDEX IF NOT EXISTS idx_generations_created ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_views_name ON skill_views(skill_name);
