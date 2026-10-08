import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { caseSchema, dateSchema, catalogueSchema, validateNarrative } from '../src/schema.ts';
import { parseCatalogue, readBraced } from '../scripts/catalogue-parser.ts';
const cat=JSON.parse(readFileSync('data/catalogue.json','utf8'));
const record=JSON.parse(readFileSync('tests/fixtures/pending-case.json','utf8'));
test('all ten requested families and source links exist',()=>{
  catalogueSchema.parse(cat);
  const ids=readdirSync('content/cases').filter(f=>f.endsWith('.json')).map(f=>f.slice(0,3)).sort();
  for(const id of ['004','084','087','102','158','159','197','221','268','304']) assert.ok(ids.includes(id));
  for(const id of ids) {
    const r=caseSchema.parse(JSON.parse(readFileSync('content/cases/'+id+'.json','utf8')));
    validateNarrative(r,readFileSync('content/cases/'+id+'.md','utf8'));
    if(r.status==='research-pending') assert.equal(r.events.filter(e=>e.type!=='ai-claim').length,0);
    for(const p of cat.families.find((f:any)=>f.familyId===id).manuscripts) assert.ok(p.url.includes(cat.provenance.commitSha));
  }
});
test('dates support approximate, range and unknown precision without manufactured years',()=>{
  dateSchema.parse({precision:'unknown',label:'Date not established'});
  dateSchema.parse({precision:'approximate',label:'c. 1900',year:1900});
  dateSchema.parse({precision:'range',label:'1900–1910',start:1900,end:1910});
  assert.throws(()=>dateSchema.parse({precision:'unknown',label:'Unknown',year:1900}));
  assert.throws(()=>dateSchema.parse({precision:'range',label:'Reversed',start:1910,end:1900}));
  assert.throws(()=>dateSchema.parse({precision:'exact',label:'Impossible',year:2026,iso:'2026-02-30'}));
  assert.throws(()=>dateSchema.parse({precision:'exact',label:'Mismatch',year:2025,iso:'2026-10-06'}));
});
test('sourced branching timelines work; dangling references, duplicate IDs and cycles fail',()=>{
  const r=structuredClone(record);
  const event=(id:string,follows:string[]=[])=>({...r.events[0],id,type:'background',date:{precision:'unknown',label:'Unknown date'},follows});
  r.events=[event('root'),event('left',['root']),event('right',['root']),event('merge',['left','right'])];
  caseSchema.parse(r);
  const badSource=structuredClone(r);badSource.events[0].sourceIds=['absent'];assert.throws(()=>caseSchema.parse(badSource));
  const badParent=structuredClone(r);badParent.events[0].follows=['absent'];assert.throws(()=>caseSchema.parse(badParent));
  const duplicate=structuredClone(r);duplicate.events[1].id='root';assert.throws(()=>caseSchema.parse(duplicate));
  const cycle=structuredClone(r);cycle.events[0].follows=['merge'];assert.throws(()=>caseSchema.parse(cycle));
  const unsafe=structuredClone(r);unsafe.sources[0].url='javascript:alert(1)';assert.throws(()=>caseSchema.parse(unsafe));
});
test('published status cannot silently publish an empty or unsourced historical account',()=>{
  const r=structuredClone(record);r.status='published';
  assert.throws(()=>caseSchema.parse(r));
  assert.throws(()=>validateNarrative(r,'Not enough words.'));
  assert.throws(()=>validateNarrative(r,Array(201).fill('word').join(' ')));
  validateNarrative(r,Array(120).fill('word').join(' '));
});
test('the snapshot parser reproduces 372 families and 719 manuscripts, including parentheses in PDF paths',()=>{
  const fileTexts=Object.fromEntries(cat.provenance.files.map((f:any)=>[f.path,readFileSync('data/upstream/'+f.path,'utf8')]));
  const parsed=parseCatalogue(fileTexts['overview.tex'],fileTexts['CONTENTS.md'],cat.provenance.commitSha,cat.provenance.importedAt,fileTexts);
  assert.deepEqual(parsed,cat);
  assert.ok(parsed.families.flatMap(f=>f.manuscripts).some(p=>p.url.includes('CAT(0)')));
  assert.throws(()=>parseCatalogue(fileTexts['overview.tex'],fileTexts['CONTENTS.md'].replace('719 manuscripts','720 manuscripts'),cat.provenance.commitSha,cat.provenance.importedAt,fileTexts));
});
test('nested TeX arguments are read as whole groups',()=>{
  assert.deepEqual(readBraced('{a {nested} \\{escaped\\}} tail',0),['a {nested} \\{escaped\\}',24]);
  assert.throws(()=>readBraced('{unfinished',0));
});
test('an offline refresh is reproducible and never overwrites curated content',()=>{
  const digest=(file:string)=>createHash('sha256').update(readFileSync(file)).digest('hex');
  const paths=readdirSync('content/cases').map(f=>'content/cases/'+f);
  const before=paths.map(digest);
  const result=spawnSync(process.execPath,['--import','tsx','scripts/import-catalogue.ts','--offline','--sha',cat.provenance.commitSha,'--date',cat.provenance.importedAt],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(paths.map(digest),before);
  assert.deepEqual(JSON.parse(readFileSync('data/catalogue.json','utf8')),cat);
});

test('published introductions require sourced explanations and valid diagram references',()=>{
  for(const id of ['004','087','158']){
    const r=JSON.parse(readFileSync('content/cases/'+id+'.json','utf8'));
    assert.ok(r.whyItMatters.split(/\s+/).length>=80 && r.whyItMatters.split(/\s+/).length<=150);
    const missing=structuredClone(r); delete missing.questionPlainLanguage; assert.throws(()=>caseSchema.parse(missing));
    const bad=structuredClone(r); bad.explanationSourceIds=['missing-source']; assert.throws(()=>caseSchema.parse(bad));
    const badVisual=structuredClone(r); badVisual.visualExplainer='nonexistent'; assert.throws(()=>caseSchema.parse(badVisual));
  }
});
