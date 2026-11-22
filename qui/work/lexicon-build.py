from pathlib import Path
import json
from collections import defaultdict
root=Path('work/luma-release')
rows=defaultdict(list)
word_keys=set()
for line in Path('work/lexicon-catalog.txt').read_text('utf8').splitlines():
    if not line.strip(): continue
    if line.startswith('# '):
        theme,kind=line[2:].split('|')
        continue
    word,translation,example=line.split('|')
    if word=='therefore': example='The readings differ. Therefore, we should repeat the test.'
    if word=='million': example='The town has one million residents.'
    k=kind
    if word=='twice': k='Adverbio'
    if word=='people': k='Sustantivo'
    assert word.lower() not in word_keys,word
    word_keys.add(word.lower())
    rows[theme].append([word,translation,example,k])
out='// Original bilingual examples written for Luma. Each entry is a term, meaning, example and word class.\nwindow.LumaVocabularyExtra = {\n'
for theme,items in rows.items():
    out+='  '+json.dumps(theme,ensure_ascii=False)+': [\n'
    out+=''.join('    '+json.dumps(w,ensure_ascii=False)+',\n' for w in items)
    out+='  ],\n'
out+='};\n'
(root/'public/vocab-extra.js').write_text(out,'utf8')
print(len(word_keys),len(rows))
