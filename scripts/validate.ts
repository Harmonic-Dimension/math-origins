import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { caseSchema, catalogueSchema, validateNarrative } from '../src/schema.ts';
const root=new URL('../',import.meta.url);
const catalogue=catalogueSchema.parse(JSON.parse(await readFile(new URL('data/catalogue.json',root),'utf8')));
const files=await readdir(new URL('content/cases/',root));
const jsonFiles=files.filter(f=>f.endsWith('.json'));
const families=new Map(catalogue.families.map(f=>[f.familyId,f]));
const selected=[];
for(const file of jsonFiles) {
  const record=caseSchema.parse(JSON.parse(await readFile(new URL('content/cases/'+file,root),'utf8')));
  if(file !== record.familyId+'.json') throw new Error('Filename must match family ID: '+file);
  if(!families.has(record.familyId)) throw new Error('Unknown family ID: '+record.familyId);
  const narrative=await readFile(new URL('content/cases/'+record.familyId+'.md',root),'utf8');
  validateNarrative(record,narrative);
  selected.push(families.get(record.familyId)!);
}
for(const file of files.filter(f=>f.endsWith('.md'))) if(!files.includes(file.replace('.md','.json'))) throw new Error('Orphan narrative: '+file);
for(const file of catalogue.provenance.files) {
  const content=await readFile(new URL('data/upstream/'+file.path,root),'utf8');
  if(createHash('sha256').update(content).digest('hex') !== file.sha256) throw new Error('Upstream snapshot checksum mismatch: '+file.path);
}
selected.sort((a,b)=>a.familyId.localeCompare(b.familyId));
await writeFile(new URL('data/selected-catalogue.json',root),JSON.stringify({provenance:catalogue.provenance,families:selected},null,2)+'\n');
console.log('Validated '+jsonFiles.length+' case records, narrative pairs, timeline references and upstream checksums.');
