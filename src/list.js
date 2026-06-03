'use strict';

const fs   = require('fs');
const path = require('path');

const RUFLO_CATEGORIES = {
  'agent-coder':                       { title: 'Code Implementer',              icon: '💻', cat: 'Development'     },
  'agent-reviewer':                    { title: 'Code Reviewer',                 icon: '🔍', cat: 'Development'     },
  'agent-tester':                      { title: 'QA Specialist',                 icon: '🧪', cat: 'Development'     },
  'agent-researcher':                  { title: 'Deep Researcher',               icon: '🔬', cat: 'Research'        },
  'agent-planner':                     { title: 'Strategic Planner',             icon: '🗺️', cat: 'Planning'        },
  'agent-orchestrator-task':           { title: 'Task Orchestrator',             icon: '🎯', cat: 'Orchestration'   },
  'agent-sparc-coordinator':           { title: 'SPARC Coordinator',             icon: '⚡', cat: 'Orchestration'   },
  'agent-queen-coordinator':           { title: 'Queen (Hive Leader)',           icon: '👑', cat: 'Swarm'           },
  'agent-hierarchical-coordinator':    { title: 'Hierarchical Coordinator',      icon: '🏛️', cat: 'Swarm'           },
  'agent-mesh-coordinator':            { title: 'Mesh Coordinator',              icon: '🕸️', cat: 'Swarm'           },
  'agent-swarm':                       { title: 'Swarm Deployer',                icon: '🐝', cat: 'Swarm'           },
  'agent-consensus-coordinator':       { title: 'Consensus (BFT)',               icon: '🤝', cat: 'Distributed'     },
  'agent-memory-coordinator':          { title: 'Memory Coordinator',            icon: '🧠', cat: 'Memory'          },
  'agent-security-manager':            { title: 'Security Manager',              icon: '🔒', cat: 'Security'        },
  'agent-performance-optimizer':       { title: 'Performance Optimizer',         icon: '🚀', cat: 'Performance'     },
  'agent-github-pr-manager':           { title: 'GitHub PR Manager',             icon: '🐙', cat: 'GitHub'          },
  'github-code-review':                { title: 'GitHub Code Reviewer',          icon: '🔎', cat: 'GitHub'          },
  'agent-ops-cicd-github':             { title: 'CI/CD Specialist',              icon: '⚙️', cat: 'DevOps'          },
  'hive-mind':                         { title: 'Hive Mind',                     icon: '🧩', cat: 'Swarm'           },
  'pair-programming':                  { title: 'Pair Programming Partner',      icon: '👥', cat: 'Development'     },
};

const AGENTS = [
  { id: 'aiox-master',       title: 'Master Orchestrator',  icon: '🧠' },
  { id: 'dev',               title: 'Developer',            icon: '💻' },
  { id: 'architect',         title: 'Software Architect',   icon: '🏗️' },
  { id: 'pm',                title: 'Product Manager',      icon: '📋' },
  { id: 'po',                title: 'Product Owner',        icon: '🎯' },
  { id: 'qa',                title: 'Quality Assurance',    icon: '✅' },
  { id: 'sm',                title: 'Scrum Master',         icon: '🔄' },
  { id: 'devops',            title: 'DevOps Engineer',      icon: '⚙️' },
  { id: 'data-engineer',     title: 'Data Engineer',        icon: '📊' },
  { id: 'analyst',           title: 'Business Analyst',     icon: '🔍' },
  { id: 'ux-design-expert',  title: 'UX Design Expert',     icon: '🎨' },
  { id: 'squad-creator',     title: 'Squad Creator',        icon: '👥' },
];

function listRufloAgents() {
  const rufloDir = path.join(process.cwd(), '.agents', 'skills');
  if (!fs.existsSync(rufloDir)) return [];
  return fs.readdirSync(rufloDir)
    .filter(d => fs.statSync(path.join(rufloDir, d)).isDirectory())
    .map(d => {
      const meta = RUFLO_CATEGORIES[d];
      return { id: d, title: meta?.title || d, icon: meta?.icon || '🤖', cat: meta?.cat || 'Ruflo' };
    });
}

function list(args) {
  const showAll = args && args.includes('--ruflo');

  console.log('\n  skillsagents — Base Agents\n');
  for (const agent of AGENTS) {
    console.log(`  ${agent.icon}  @${agent.id.padEnd(22)} ${agent.title}`);
  }
  console.log(`\n  Total base: ${AGENTS.length} agents`);

  const ruflo = listRufloAgents();
  if (ruflo.length > 0) {
    console.log(`\n  skillsagents — Ruflo Agents (${ruflo.length} instalados)\n`);
    if (showAll) {
      const byCategory = {};
      ruflo.forEach(a => {
        byCategory[a.cat] = byCategory[a.cat] || [];
        byCategory[a.cat].push(a);
      });
      for (const [cat, agents] of Object.entries(byCategory)) {
        console.log(`  ── ${cat}`);
        agents.forEach(a => console.log(`     ${a.icon}  ${a.id.padEnd(38)} ${a.title}`));
      }
    } else {
      console.log(`  Use "npx skillsagents list --ruflo" para ver todos os ${ruflo.length} agentes Ruflo.`);
    }
  }

  console.log(`\n  Usage: @agent-name (em qualquer IDE com AI)\n`);
}

module.exports = { list };
