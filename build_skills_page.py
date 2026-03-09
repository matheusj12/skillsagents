import json, os

skills = json.load(open('/home/matheus/skillsagents/skills_data.json', encoding='utf-8'))

CAT_COLORS = {
    'Security':     ('#fca5a5','rgba(239,68,68,.15)'),
    'AI/ML':        ('#6ee7b7','rgba(16,185,129,.15)'),
    'Frontend':     ('#93c5fd','rgba(59,130,246,.15)'),
    'Language':     ('#c4b5fd','rgba(139,92,246,.15)'),
    'DevOps/Cloud': ('#fcd34d','rgba(245,158,11,.15)'),
    'Testing':      ('#67e8f9','rgba(6,182,212,.15)'),
    'Database':     ('#a5f3fc','rgba(20,184,166,.15)'),
    'Backend/API':  ('#86efac','rgba(34,197,94,.15)'),
    'Marketing':    ('#f9a8d4','rgba(236,72,153,.15)'),
    'Product':      ('#fdba74','rgba(249,115,22,.15)'),
    'Automation':   ('#e2e8f0','rgba(148,163,184,.15)'),
    'Architecture': ('#fde68a','rgba(234,179,8,.15)'),
    'General':      ('#94a3b8','rgba(100,116,139,.12)'),
}

CATEGORIES = [
    'General','AI/ML','DevOps/Cloud','Automation','Language','Frontend',
    'Security','Backend/API','Database','Testing','Marketing','Product','Architecture'
]

# Build category groups
from collections import defaultdict
groups = defaultdict(list)
for s in skills:
    groups[s['cat']].append(s)

cards_html = []
for cat in CATEGORIES:
    items = groups.get(cat, [])
    if not items: continue
    color, bg = CAT_COLORS.get(cat, ('#94a3b8','rgba(100,116,139,.12)'))
    for s in items:
        desc = s['desc'].replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')
        name = s['name']
        cards_html.append(
            f'<div class="sc" data-cat="{cat}" data-name="{name}">'
            f'<div class="st" >@{name}</div>'
            f'<div class="sd">{desc}</div>'
            f'<span class="sb" style="color:{color};background:{bg}">{cat}</span>'
            f'</div>'
        )

all_cards = '\n'.join(cards_html)

cat_buttons = []
cat_buttons.append('<button class="fb active" onclick="filter(\'ALL\')">All (1262)</button>')
for cat in CATEGORIES:
    c = len(groups.get(cat,[]))
    if c:
        cat_buttons.append(f'<button class="fb" onclick="filter(\'{cat}\')">{cat} ({c})</button>')
filters_html = '\n'.join(cat_buttons)

html = f"""<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>1.262 Skills — Antigravity Awesome Skills</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
:root{{--cyan:#00f0ff;--bg:#0e1117;--surface:#1a1d27;--border:#2a2d3a;--muted:#6b7280;--text:#e2e8f0;}}
*{{margin:0;padding:0;box-sizing:border-box;}}
body{{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;}}
header{{position:sticky;top:0;z-index:50;background:rgba(14,17,23,.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}}
.logo{{font-weight:800;font-size:1rem;display:flex;gap:8px;align-items:center;}}
.logo span{{color:var(--cyan);}}
.back{{color:var(--cyan);text-decoration:none;font-size:.85rem;font-weight:600;}}
.back:hover{{text-decoration:underline;}}
.hero{{max-width:1400px;margin:0 auto;padding:40px 24px 0;}}
.hero h1{{font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;margin-bottom:8px;}}
.hero h1 span{{background:linear-gradient(135deg,var(--cyan),#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}}
.hero p{{color:var(--muted);margin-bottom:24px;font-size:.95rem;}}
.search-row{{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;}}
#search{{flex:1;min-width:200px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:.9rem;outline:none;}}
#search:focus{{border-color:var(--cyan);}}
#count{{color:var(--muted);font-size:.85rem;align-self:center;white-space:nowrap;}}
.filters{{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px;}}
.fb{{padding:5px 12px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:.75rem;font-weight:600;cursor:pointer;transition:.15s;}}
.fb:hover,.fb.active{{border-color:var(--cyan);color:var(--cyan);background:rgba(0,240,255,.08);}}
.grid{{max-width:1400px;margin:0 auto;padding:0 24px 60px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;}}
.sc{{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px;transition:.2s;cursor:default;}}
.sc:hover{{border-color:rgba(0,240,255,.4);transform:translateY(-1px);}}
.sc.hidden{{display:none;}}
.st{{font-family:'JetBrains Mono',monospace;font-size:.82rem;color:var(--cyan);font-weight:500;margin-bottom:5px;word-break:break-all;}}
.sd{{font-size:.78rem;color:var(--muted);line-height:1.5;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}}
.sb{{font-size:.62rem;font-weight:700;text-transform:uppercase;padding:2px 7px;border-radius:4px;letter-spacing:.04em;}}
</style>
</head>
<body>
<header>
  <div class="logo">🌌 AIOX Skills <span>v7.3.0</span></div>
  <a class="back" href="/tutorial.html">← Voltar ao Tutorial</a>
</header>
<div class="hero">
  <h1>Todas as <span>1.262 Skills</span> Instaladas</h1>
  <p>Biblioteca completa Antigravity Awesome Skills. Use <code style="color:var(--cyan)">Use @nome-da-skill</code> em qualquer mensagem no Antigravity.</p>
  <div class="search-row">
    <input id="search" placeholder="🔍  buscar skill... ex: react, security, python" oninput="filterAll()" type="text"/>
    <span id="count">1.262 skills</span>
  </div>
  <div class="filters">
    {filters_html}
  </div>
</div>
<div class="grid" id="grid">
{all_cards}
</div>
<script>
let activeCat='ALL';
function filter(cat){{
  activeCat=cat;
  document.querySelectorAll('.fb').forEach(b=>b.classList.toggle('active',b.textContent.split(' (')[0]===cat||(cat==='ALL'&&b.textContent.startsWith('All'))));
  filterAll();
}}
function filterAll(){{
  const q=document.getElementById('search').value.toLowerCase().trim();
  let vis=0;
  document.querySelectorAll('.sc').forEach(c=>{{
    const catOk=activeCat==='ALL'||c.dataset.cat===activeCat;
    const nameOk=!q||c.dataset.name.includes(q)||c.querySelector('.sd').textContent.toLowerCase().includes(q);
    const show=catOk&&nameOk;
    c.classList.toggle('hidden',!show);
    if(show)vis++;
  }});
  document.getElementById('count').textContent=vis+' skills';
}}
</script>
</body>
</html>"""

with open('/home/matheus/skillsagents/skills.html', 'w', encoding='utf-8') as f:
    f.write(html)
print(f'skills.html gerado com {len(skills)} cards!')
print(f'Tamanho: {os.path.getsize("/home/matheus/skillsagents/skills.html")//1024} KB')
