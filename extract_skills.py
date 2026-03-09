import os, re, json

base = '/home/matheus/.gemini/antigravity/skills'
skills = []

for d in sorted(os.listdir(base)):
    path = os.path.join(base, d)
    if not os.path.isdir(path): continue
    skill_md = os.path.join(path, 'SKILL.md')
    if not os.path.exists(skill_md): continue
    try:
        content = open(skill_md, encoding='utf-8', errors='ignore').read(3000)
        desc = ''
        # Try YAML frontmatter description
        fm = re.search(r'---\s*(.*?)\s*---', content, re.DOTALL)
        if fm:
            m = re.search(r'description:\s*(.+)', fm.group(1))
            if m:
                desc = m.group(1).strip().strip('"').strip("'")
        if not desc:
            # Try first paragraph after H1
            lines = [l.strip() for l in content.split('\n')]
            skip = True
            for l in lines:
                if l.startswith('# ') and skip:
                    skip = False
                    continue
                if not skip and l and not l.startswith('#') and not l.startswith('---') and not l.startswith('name:') and not l.startswith('description:') and len(l) > 20:
                    desc = l[:200]
                    break
        # Category from badge or name
        cat = 'General'
        name_lower = d.lower()
        if any(x in name_lower for x in ['security','pentest','xss','sql-inj','vuln','cve','hack','burp','metasploit','owasp','audit-skill']):
            cat = 'Security'
        elif any(x in name_lower for x in ['react','vue','angular','css','tailwind','next','frontend','ui-','ux-','html','three','animation','svelte']):
            cat = 'Frontend'
        elif any(x in name_lower for x in ['python','rust','golang','java','ruby','php','csharp','swift','kotlin','typescript','javascript','bash']):
            cat = 'Language'
        elif any(x in name_lower for x in ['aws','azure','gcp','docker','k8s','kube','terraform','devops','deploy','cicd','cloud','infra']):
            cat = 'DevOps/Cloud'
        elif any(x in name_lower for x in ['ai','llm','rag','agent','prompt','langchain','langgraph','ml','embedding','vector','openai','gemini']):
            cat = 'AI/ML'
        elif any(x in name_lower for x in ['test','tdd','qa','e2e','playwright','jest','vitest','coverage']):
            cat = 'Testing'
        elif any(x in name_lower for x in ['database','sql','postgres','mongo','redis','dynamo','prisma','drizzle','orm','nosql']):
            cat = 'Database'
        elif any(x in name_lower for x in ['api','rest','graphql','grpc','webhook','openapi','fastapi','express','nest','django']):
            cat = 'Backend/API'
        elif any(x in name_lower for x in ['seo','marketing','content','copy','email','social','growth','ads','crm']):
            cat = 'Marketing'
        elif any(x in name_lower for x in ['product','pm','roadmap','sprint','agile','scrum','backlog','okr','metric']):
            cat = 'Product'
        elif any(x in name_lower for x in ['automation','slack','github','jira','notion','zapier','n8n','airtable']):
            cat = 'Automation'
        elif any(x in name_lower for x in ['architecture','design-pattern','microservice','ddd','event','cqrs','clean']):
            cat = 'Architecture'
        
        skills.append({'name': d, 'desc': desc[:180] if desc else 'Skill especializada para desenvolvimento e produtividade.', 'cat': cat})
    except Exception as e:
        skills.append({'name': d, 'desc': 'Skill especializada.', 'cat': 'General'})

# Write JSON
with open('/home/matheus/skillsagents/skills_data.json', 'w', encoding='utf-8') as f:
    json.dump(skills, f, ensure_ascii=False)

print(f'Total skills extracted: {len(skills)}')

# Print category summary
from collections import Counter
cats = Counter(s['cat'] for s in skills)
for cat, count in cats.most_common():
    print(f'  {cat}: {count}')
