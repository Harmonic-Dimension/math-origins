import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { provenance } from '../data';
export function upstreamMarkdown(value:string) {
  return value.replace(/\$\`([\s\S]*?)\`\$/g, '$$$1$$')
    .replace(/\]\((lean\/[^)]+)\)/g, ']('+provenance.repository+'/blob/'+provenance.commitSha+'/$1)')
    .replace(/<\/?i>/g,'*').replace(/<sub>(.*?)<\/sub>/g,'_($1)')
    .replace(/<sup>(.*?)<\/sup>/g,'^($1)').replace(/&gt;/g,'>').replace(/&lt;/g,'<')
    .replace(/&amp;/g,'&').replace(/&nbsp;/g,' ');
}
export default function Prose({children,upstream=false}:{children:string;upstream?:boolean}) {
  return <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm,remarkMath]} rehypePlugins={[[rehypeKatex,{strict:'ignore'}]]}>{upstream?upstreamMarkdown(children):children}</ReactMarkdown></div>;
}
