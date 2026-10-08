import { cases, caseTitle } from './data';
export function pageMetadata(path:string) {
  const study=cases.find(s=>path.replace(/\/$/,'')==='/problems/'+s.history.familyId);
  if(study) return {title:caseTitle(study)+' — Before the Proof',description:'Family '+study.history.familyId+': the reported OpenAI result, historical timeline, sources and attribution. '+(study.history.status==='research-pending'?'Historical research pending.':'A provisional historical account.')};
  const metadata:Record<string,{title:string;description:string}>={
    '/':{title:'Before the Proof — A history of mathematical questions',description:'Explore the histories behind mathematical questions in OpenAI’s October 2026 release.'},
    '/explorer':{title:'Explore the questions — Before the Proof',description:'Search and filter ten selected mathematical result families by discipline, result scope and historical pattern.'},
    '/article':{title:'Before the proof, there is a question — Before the Proof',description:'An opening editorial essay on the intellectual inheritance behind new mathematical results.'},
    '/about':{title:'About & methodology — Before the Proof',description:'How this project handles historical sources, attribution, uncertain dates and the provenance of reported AI results.'},
  };
  return metadata[path.replace(/\/$/,'') || '/'] || {title:'Page not found — Before the Proof',description:'This page does not belong to the current collection.'};
}
