from pathlib import Path
p=Path('work/luma-release/public/styles.css')
s=p.read_text('utf8')
a=s.index('.dots {');b=s.index('.tutor-card {',a)
s=s[:a]+'''
.topic-trigger{display:inline-flex;align-items:center;gap:.4rem;background:#11162e7d;border:1px solid #ffffff75;color:#fff;padding:.43rem .7rem;font-size:.79rem;border-radius:999px;backdrop-filter:blur(6px)}
.topic-trigger:hover{background:#25213da6}
.session-indicator{display:flex;gap:5px;align-items:center}
.session-indicator i{display:block;background:#ffffff6e;border-radius:3px;height:4px;width:19px}
.session-indicator .selected{background:#eee9ff}
#topics{padding:23px;border:1px solid #dedce9;background:#fcfbff;color:var(--ink);border-radius:19px;box-shadow:0 18px 70px #25233835;width:min(93vw,440px)}
#topics::backdrop{background:#15132c70}
#topics>p{color:var(--muted);font-size:.94rem;line-height:1.5;margin-bottom:17px}
.topic-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.topic-options button{background:white;display:flex;align-items:center;gap:7px;text-align:left;min-height:48px;padding:8px 10px;border:1px solid var(--line);border-radius:9px;font-weight:560;font-size:.87rem}
.topic-options button span{flex:1}.topic-options button[aria-pressed=true]{color:#52418e;border-color:#a594c9;background:#f0ecfc}
.install-panel{max-width:930px;margin-top:22px}.install-heading{display:flex;align-items:center;gap:13px}.install-heading img{width:44px;height:44px;border-radius:12px}.install-heading h2{font-size:1.24rem}.install-heading p,.install-help p{color:var(--muted);margin-top:5px;font-size:.9rem;line-height:1.55}.install-panel .outline-button{margin-top:13px}.install-help{margin-top:8px}
@media(max-width:420px){#topics{padding:16px}.topic-options button{font-size:.8rem}.topic-trigger{font-size:.74rem}}
'''+s[b:]
p.write_text(s,'utf8')
p=Path('work/luma-release/public/library.js')
s=p.read_text('utf8').replace('  function bookmark(id, api) {','''  function catalog() {
    const extra = ["physics","chemistry","math","earth"].map(id => {
      const topic = window.LumaDailyData.topics[id];
      return [id, { ...topic, description:topic.prompt, isSession:true }];
    });
    return {...books, ...Object.fromEntries(extra)};
  }
  function bookmark(id, api) {''')
s=s.replace('      books[id].title;', '      catalog()[id].title;').replace('const list = Object.entries(books).filter(', 'const list = Object.entries(catalog()).filter(')
s=s.replace('Leer artículo</button></div>', '${book.isSession?"Estudiar lectura":"Leer artículo"}</button></div>')
s=s.replace('.forEach((btn) => (btn.onclick = () => api.go(btn.dataset.open)));','''.forEach((btn) => (btn.onclick = () => {
        const id=btn.dataset.open;
        if(catalog()[id].isSession){
          api.set("daily.selection."+localDate(),id);
          api.go("daily");
        }else api.go(id);
      }));''')
s=s.replace('  function catalog() {','''  const localDate=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
  function catalog() {''')
p.write_text(s,'utf8')
p=Path('work/luma-release/public/daily.js')
s=p.read_text('utf8').replace('interest=api.get("interest","all")','interest=api.get("daily.selection."+date,null)||api.get("interest","all")')
p.write_text(s,'utf8')
p=Path('work/luma-release/public/app.js')
s=p.read_text('utf8').replace('const choice=get("interest","all");','const choice=get("daily.selection."+dayId(),null)||get("interest","all");')
s=s.replace('set("interest",btn.dataset.interest);','set("daily.selection."+dayId(),btn.dataset.interest);')
s=s.replace('set("interest", f.get("interest"));','if (get("interest","all")!==f.get("interest")) set("daily.selection."+dayId(),null);\n    set("interest",f.get("interest"));')
p.write_text(s,'utf8')

