import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const bundle=pathToFileURL(resolve('.prerender/entry-server.js')).href;
const {render,routes}=await import(bundle);
const template=await readFile('dist/index.html','utf8');
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const base=(process.env.BASE_PATH || '/').replace(/\/$/,'');
for(const route of [...routes,'/404']) {
  const {html,title,description}=render(route);
  // React Router uses root-relative hrefs on the server. Add the deployment base for subdirectory hosts.
  const markup=base?html.replace(/href="\/(?!\/)([^"]*)"/g,(_:string,path:string)=>'href="'+base+'/'+path+'"'):html;
  const page=template.replace('<div id="root"></div>','<div id="root">'+markup+'</div>')
    .replace(/<title>.*?<\/title>/,'<title>'+escape(title)+'</title>')
    .replace(/<meta name="description" content="[^"]*" \/?>/,'<meta name="description" content="'+escape(description)+'" />');
  const path=route==='/404'?'dist/404.html':'dist'+(route==='/'?'':route)+'/index.html';
  await mkdir(resolve(path,'..'),{recursive:true});
  await writeFile(path,page);
}
await writeFile('dist/_redirects',routes.filter((r:string)=>r!=='/').map((r:string)=>base+r+' '+base+r+'/ 301').join('\n')+'\n');
await rm('.prerender',{recursive:true,force:true});
console.log('Prerendered '+routes.length+' pages and a 404 page. No server required.');
