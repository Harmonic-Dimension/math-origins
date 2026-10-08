import { createHash } from 'node:crypto';
import { catalogueSchema } from '../src/schema.ts';

export function readBraced(input: string, start: number): [string, number] {
  if(input[start] !== '{') throw new Error('Expected brace at ' + start);
  let depth=1, i=start+1;
  for(;i<input.length;i++) {
    if(input[i] === '\\') { i++; continue; }
    if(input[i]==='{') depth++;
    if(input[i]==='}' && --depth===0) return [input.slice(start+1,i),i+1];
  }
  throw new Error('Unbalanced TeX braces');
}
export function parseCatalogue(overview: string, mapping: string, sha: string, importedAt: string, fileTexts: Record<string,string>) {
  const fields=new Map<string,{discipline:string,title:string,summary:string}>();
  let discipline='', cursor=0;
  const commands=/\\(cataloguesection|resultentry)\{/g;
  let match: RegExpExecArray | null;
  while((match=commands.exec(overview))) {
    cursor=match.index + match[0].length-1;
    const args:string[]=[];
    for(let n=0;n<(match[1]==='cataloguesection'?2:4);n++) {
      const [arg,next]=readBraced(overview,cursor); args.push(arg); cursor=next;
    }
    commands.lastIndex=cursor;
    if(match[1]==='cataloguesection') discipline=args[0];
    else {
      if(fields.has(args[0]) || !discipline) throw new Error('Invalid overview entry ' + args[0]);
      fields.set(args[0],{discipline,title:args[1],summary:args[2]});
    }
  }
  const headings=[...mapping.matchAll(/^\*\*(\d{3})\. (.+?)\.\*\* (.+)$/gm)];
  const families=headings.map((m,i)=>{
    const field=fields.get(m[1]);
    if(!field) throw new Error('Missing overview discipline for ' + m[1]);
    const block=mapping.slice(m.index! + m[0].length, headings[i+1]?.index ?? mapping.length);
    const manuscripts=[...block.matchAll(/^&emsp;\[(.+)\]\((preprints\/.+\.pdf)\)[^\n]*\n\n([\s\S]*?)(?=\n\s*<\/td>)/gm)].map(p=>({
      title:p[1].trim(),
      url:'https://github.com/openai/math/blob/'+sha+'/'+p[2],
      abstract:p[3].trim(),
    }));
    return {familyId:m[1],title:m[2],releaseSummary:m[3],overviewTitleTex:field.title,overviewSummaryTex:field.summary,discipline:field.discipline,manuscripts,sourceUrl:'https://github.com/openai/math/blob/'+sha+'/CONTENTS.md'};
  });
  const expected=mapping.match(/\*\*(\d+) manuscripts covering (\d+) result families\.\*\*/);
  if(!expected || fields.size!==families.length) throw new Error('Upstream format changed; review the parser');
  return catalogueSchema.parse({
    provenance:{ repository:'https://github.com/openai/math',commitSha:sha,importedAt,releaseDate:'2026-10-06',
      familyCount:Number(expected[2]),manuscriptCount:Number(expected[1]),
      files:Object.entries(fileTexts).map(([path,content])=>({path,sha256:createHash('sha256').update(content).digest('hex')})),
    }, families,
  });
}
