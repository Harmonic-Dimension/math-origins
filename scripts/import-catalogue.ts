import { readFile, writeFile, mkdir, rename, readdir } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { parseCatalogue } from './catalogue-parser.ts';
const { values }=parseArgs({options:{sha:{type:'string'},offline:{type:'boolean'},date:{type:'string'}}});
const root=new URL('../',import.meta.url);
const upstream=new URL('data/upstream/',root);
const paths=['overview.tex','CONTENTS.md','README.md','history.md','LICENSE'];
async function get(url:string) {
  const response=await fetch(url,{headers:{'User-Agent':'Before-the-Proof-catalogue-import','Accept':'application/vnd.github+json'},signal:AbortSignal.timeout(30000)});
  if(!response.ok) throw new Error(url + ': HTTP ' + response.status);
  return response;
}
let sha=values.sha;
if(!sha) {
  if(values.offline) throw new Error('--offline requires --sha');
  const ref=await (await get('https://api.github.com/repos/openai/math/git/ref/heads/main')).json();
  sha=ref.object.sha;
}
if(!sha || !/^[a-f0-9]{40}$/.test(sha)) throw new Error('A full upstream commit SHA is required');
const files:Record<string,string>={};
for(const path of paths) files[path]=values.offline
  ? await readFile(new URL(path,upstream),'utf8')
  : await (await get('https://raw.githubusercontent.com/openai/math/'+sha+'/'+path)).text();
const catalogue=parseCatalogue(files['overview.tex'],files['CONTENTS.md'],sha,values.date || new Date().toISOString(),files);
const ids=new Set(catalogue.families.map(f=>f.familyId));
for(const file of await readdir(new URL('content/cases/',root))) {
  if(!file.endsWith('.json')) continue;
  const curated=JSON.parse(await readFile(new URL('content/cases/'+file,root),'utf8'));
  if(!ids.has(curated.familyId)) throw new Error('Refresh would orphan curated case ' + curated.familyId + '; no files changed');
}
// Validate every response before replacing generated data. Never write content/cases.
await mkdir(upstream,{recursive:true});
for(const path of paths) {
  await writeFile(new URL(path+'.tmp',upstream),files[path]);
  await rename(new URL(path+'.tmp',upstream),new URL(path,upstream));
}
const target=new URL('data/catalogue.json',root);
await writeFile(new URL('data/catalogue.json.tmp',root),JSON.stringify(catalogue,null,2)+'\n');
await rename(new URL('data/catalogue.json.tmp',root),target);
console.log('Imported '+catalogue.provenance.familyCount+' families / '+catalogue.provenance.manuscriptCount+' manuscripts at '+sha+'. Curated history untouched.');
