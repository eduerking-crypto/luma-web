import assert from 'node:assert/strict';
const host='http://127.0.0.1:4261', base=host+'/api/';
async function testProgress(){
  const read=await fetch(base+'progress');const cookie=read.headers.get('set-cookie').split(';')[0];assert.deepEqual(await read.json(),{values:{}});
  const init={method:'PUT',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({key:'level',value:'B2'})};
  assert.equal((await fetch(base+'progress',init)).status,200);
  assert.deepEqual(await (await fetch(base+'progress',{headers:{Cookie:cookie}})).json(),{values:{level:'B2'}});
  assert.deepEqual(await (await fetch(base+'progress')).json(),{values:{}});
  assert.equal((await fetch(base+'progress',{...init,headers:{...init.headers,Origin:'https://other.example'}})).status,403);
  assert.equal((await fetch(base+'progress',{...init,headers:{'Content-Type':'application/json'}})).status,401);
  console.log('SQLite: durable per-profile read/write and origin isolation passed.');
}
async function testApi(){
  const status=await (await fetch(base+'status')).json();assert.equal(status.tutor,'ollama');assert.equal(status.progress,true);
  const youtube=await (await fetch(base+'social')).json();assert.equal(youtube.mode,'atom');assert.ok(youtube.items.length);console.log('YouTube public feed:',youtube.items[0].id,youtube.items[0].date);
  assert.equal((await fetch(base+'news?journal=bad')).status,400);
  assert.equal((await fetch(base+'tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,400);
  console.log('Status, channels, invalid journal and invalid conversation passed.');
}
async function testLiveNews(){
 const res=await fetch(base+'news?journal=0028-0836');const feed=await res.json();
 assert.equal(res.status,200,JSON.stringify(feed));assert.ok(feed.items?.length);assert.ok(feed.items.every(i=>i.title && i.doi && i.date));
 console.log('Crossref:',feed.items.length,feed.items[0].journal,feed.items[0].date,feed.items[0].doi);
}
async function testTutor(){
 const res=await fetch(base+'tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({level:'A1',context:'',history:[{role:'user',content:'¿Qué significa glow en la frase Some fish glow?'}]})});
 const reply=await res.json();assert.equal(reply.provider,'ollama',JSON.stringify(reply));assert.ok(reply.reply.length>15);console.log('Real Ollama reply:',reply.reply);
}
await Promise.all([testProgress(),testApi(),testLiveNews(),testTutor()]);
