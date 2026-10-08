import { useSearchParams, Link, useParams } from 'react-router-dom';
import CaseCard from './components/CaseCard';
import { cases, caseTitle, caseField, scopeLabels, patternLabels, statusLabels, provenance, filterStudies } from './data';
import { Timeline } from './components/Timeline';
import Prose from './components/Prose';
import VisualExplainer from './components/VisualExplainer';
import type { Study } from './data';
import { useClientReady } from './useClientReady';
import essay from '../content/articles/before-the-proof.md?raw';

export function Explorer() {
  const ready=useClientReady();
  const [params,setParams]=useSearchParams();
  const filters={query:ready?params.get('q') || '':'',field:ready?params.get('field') || '':'',scope:ready?params.get('scope') || '':'',tag:ready?params.get('tag') || '':'',status:ready?(params.get('status')==='all'?'':params.get('status') || 'published'):'published'};
  function change(key:string,value:string) {
    const next=new URLSearchParams(params);
    if(key==='status') next.set(key,value || 'all'); else if(value) next.set(key,value); else next.delete(key);
    setParams(next,{replace:true,preventScrollReset:true});
  }
  const results=filterStudies(cases,filters);
  const completed=cases.filter(s=>s.history.status==='published').length;
  const fields=[...new Set(cases.map(caseField))].sort();
  const active=Boolean(filters.query || filters.field || filters.scope || filters.tag || filters.status!=='published');
  return <div className="page-width explorer-page">
    <div className="page-intro"><p className="eyebrow">The explorer</p><h1>Follow the questions.</h1><p>Start with three researched histories: understand the mathematics, then follow how the questions came into existence. Seven upcoming accounts are available through the collection filter.</p></div>
    <noscript><p className="collection-note">Enable JavaScript to search, filter and select timeline events. All accounts and sources remain readable below.</p></noscript>
    <form className="explorer-controls" role="search" onSubmit={e=>e.preventDefault()}>
      <label className="search-control"><span>Search the collection</span><div className="search-input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg><input type="search" disabled={!ready} value={filters.query} onChange={e=>change('q',e.target.value)} placeholder="A question, name, field or family ID…" /></div></label>
      <div className="filter-grid">
        <label>Discipline<select disabled={!ready} aria-label="Discipline" value={filters.field} onChange={e=>change('field',e.target.value)}><option value="">All disciplines</option>{fields.map(f=><option key={f}>{f}</option>)}</select></label>
        <label>Reported result<select disabled={!ready} aria-label="Reported result" value={filters.scope} onChange={e=>change('scope',e.target.value)}><option value="">All result scopes</option>{Object.entries(scopeLabels).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label>
        <label>Historical pattern<select disabled={!ready} aria-label="Historical pattern" value={filters.tag} onChange={e=>change('tag',e.target.value)}><option value="">All patterns</option>{Object.entries(patternLabels).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label>
        <label>Collection<select disabled={!ready} aria-label="Collection" value={filters.status} onChange={e=>change('status',e.target.value)}><option value="">All selected families</option>{Object.entries(statusLabels).map(([v,label])=><option key={v} value={v}>{v==='published'?'Researched histories':v==='research-pending'?'Upcoming histories':label}</option>)}</select></label>
      </div>
    </form>
    <div className="results-heading"><p role="status" aria-live="polite">{results.length} {results.length===1?'question':'questions'}<span className="small"> · of {cases.length} selected families</span></p>{active && <button className="reset-button" onClick={()=>setParams({})}>Clear filters</button>}</div>
    {results.length?<div className="case-grid explorer-grid">{results.map(s=><CaseCard key={s.history.familyId} study={s}/>)}</div>:<div className="empty-state"><h2>No questions match these filters.</h2><p>Historical patterns are assigned only after research. Try another search or clear the filters.</p><button className="button" onClick={()=>setParams({})}>Show researched histories</button></div>}
    {filters.status==='published' && <div className="upcoming-note"><h2>More histories to come.</h2><p>{cases.length-completed} selected families await historical research.</p><button className="text-link reset-button" disabled={!ready} onClick={()=>setParams({status:'research-pending'})}>Browse upcoming histories</button></div>}
    <p className="collection-note">OpenAI reports these results; the labels do not certify the proofs. Scope classifications remain provisional. Each family can contain several related manuscripts. <Link to="/about">Read the methodology</Link>.</p>
  </div>;
}
function SourceLinks({study,ids,label='Sources for the question and its significance'}:{study:Study;ids:string[];label?:string}) {
  return ids.length>0?<div className="explanation-sources"><span className="small">{label}</span>{ids.map(id=>{const source=study.history.sources.find(s=>s.id===id)!;return <a key={id} href={source.url}>{source.title}</a>;})}</div>:null;
}
function EmptyText({children}:{children?:string|null}) { return <p className={children?'':'unknown-text'}>{children || 'Awaiting historical research.'}</p>; }
export function Problem() {
  const {id}=useParams();
  const study=cases.find(s=>s.history.familyId===id);
  if(!study) return <NotFound/>;
  const {family,history,narrative}=study;
  const collection=history.status==='published'?cases.filter(s=>s.history.status==='published'):cases;
  const index=collection.indexOf(study),next=collection[(index+1)%collection.length];
  return <>
    <div className="page-width problem-header">
      <Link className="back-link" to="/explorer">All questions</Link>
      <div className="problem-meta"><span className="eyebrow">Family {history.familyId}</span><span>{caseField(study)}</span><span className="status-chip">{statusLabels[history.status]}</span></div>
      <h1>{caseTitle(study)}</h1>
      {history.displayTitle && <p className="catalogue-title">Catalogue title: {family.title}</p>}

    </div>
    <div className="page-width problem-body">
      <nav className="article-toc" aria-label="On this page"><span className="eyebrow">On this page</span>{history.questionPlainLanguage && <a href="#question">The question</a>}{history.whyItMatters && <a href="#significance">Why mathematicians care</a>}<a href="#history">The story</a><a href="#timeline">Timeline</a><a href="#result">The 2026 claim</a><a href="#attribution">People & attribution</a><a href="#sources">Sources & notes</a></nav>
      <div className="problem-content">
        {history.questionPlainLanguage && <section id="question" className="content-section question-section" tabIndex={-1}>
          <p className="eyebrow">Understand the mathematics</p><h2>The question</h2>
          <p className="question-lead">{history.questionPlainLanguage}</p>
          {(history.visualExplainer || history.illustrativeExample) && <figure className="question-example">
            {history.visualExplainer && <VisualExplainer kind={history.visualExplainer}/>}
            {history.illustrativeExample && <figcaption><Prose>{history.illustrativeExample}</Prose></figcaption>}
          </figure>}
          {history.questionFormal && <details className="disclosure"><summary>The precise mathematical statement</summary><Prose>{history.questionFormal}</Prose></details>}
        </section>}
        {history.whyItMatters && <section id="significance" className="content-section" tabIndex={-1}><h2>Why mathematicians care</h2><Prose>{history.whyItMatters}</Prose><SourceLinks study={study} ids={history.explanationSourceIds}/></section>}
        <section id="history" className="content-section" tabIndex={-1}><p className="eyebrow">Before the result</p><h2>The story behind the question</h2>
          {history.historicalHook && <p className="historical-hook">{history.historicalHook}</p>}
          {history.status==='research-pending'?<div className="research-note"><h3>This history is still to be written.</h3><p>The catalogue entry is available below. The conceptual origins, original formulations and people behind the question will be added with supporting sources.</p></div>:narrative.trim()?<><span className="small">{history.status==='draft'?'Editorial draft · not yet reviewed':''}</span><Prose>{narrative}</Prose></>:<p className="unknown-text">The narrative has not yet been supplied.</p>}
          <dl className="date-facts"><div><dt>Conceptual origins</dt><dd>{history.conceptualOrigins?.label || 'Not yet established'}</dd></div><div><dt>First explicit formulation</dt><dd>{history.firstFormulation?.label || 'Not yet established'}</dd></div></dl>
          <details className="disclosure"><summary>Original and modern formulations</summary><div className="question-comparison"><div><h3>The original question</h3><EmptyText>{history.originalQuestion}</EmptyText></div><div><h3>The modern question</h3><EmptyText>{history.modernQuestion}</EmptyText></div></div>
          <h4 className="minor-heading">How the question changed</h4><EmptyText>{history.questionDifference}</EmptyText></details>
        </section>
        <section id="timeline" className="content-section" tabIndex={-1}><div className="section-heading"><h2>A timeline of ideas</h2><span className="small">Select a milestone to read its sources</span></div><Timeline key={history.familyId} study={study}/></section>
        <section id="result" className="content-section" tabIndex={-1}><p className="eyebrow">A reported result · October 2026</p><h2>What AI claims to have achieved</h2>
          {history.whatAIClaims && <div className="claim-panel"><p className="eyebrow">OpenAI reports · {history.scope.types.map(t=>scopeLabels[t].toLowerCase()).join(' · ')}</p><Prose>{history.whatAIClaims}</Prose></div>}
          {history.whatRemainsOpen && <div className="remaining-panel"><h3>What remains open or outside the claim</h3><Prose>{history.whatRemainsOpen}</Prose></div>}
          <p className="validation-note"><strong>Independent verification status:</strong> This project has not independently assessed the proofs or established their acceptance by independent reviewers. Inclusion in the release is evidence of a reported claim.</p>
          <SourceLinks study={study} ids={history.claimSourceIds} label="Sources for the reported claim"/>
          <details className="disclosure"><summary>Catalogue wording and scope notes</summary>
          <div className="release-summary"><span className="small">Upstream catalogue summary</span><Prose upstream>{family.releaseSummary}</Prose></div>
          <p className="scope-note">{history.scope.note}</p><p className="small">Scope classification: {history.scope.classificationStatus}. <a href={history.scope.sourceUrl}>Read the source summary</a>.</p>
          </details>
          <h3 className="manuscripts-heading">Related manuscripts</h3>
          <p className="small">Grouped as family {family.familyId} by the upstream catalogue.</p>
          <ol className="manuscript-list">{family.manuscripts.map(p=><li key={p.url}><a href={p.url}>{p.title}</a><span className="small">PDF · pinned upstream version</span><details><summary>Read the manuscript abstract</summary><Prose upstream>{p.abstract}</Prose></details></li>)}</ol>
        </section>
        <section id="attribution" className="content-section" tabIndex={-1}><h2>People & attribution</h2><EmptyText>{history.attribution}</EmptyText>
          {history.contributors.length>0?<ul className="contributors">{history.contributors.map(c=><li key={c.name}><h3>{c.name}</h3><p>{c.contribution}</p><div className="event-sources">{c.sourceIds.map(id=>{const source=history.sources.find(s=>s.id===id)!;return <a key={id} href={source.url}>{source.title}</a>})}</div></li>)}</ul>:<p className="small">Names and contributions will be listed after attribution research.</p>}
          {history.tags.length>0 && <div className="tags">{history.tags.map(t=><Link to={'/explorer?tag='+t} key={t}>{patternLabels[t]}</Link>)}</div>}
        </section>
        <section id="sources" className="content-section" tabIndex={-1}><h2>Sources & uncertainties</h2><div className="uncertainty-panel"><span className="eyebrow">Historical confidence: {history.confidence}</span><p>{history.uncertainty}</p></div>
          <ol className="source-list">{history.sources.map(s=><li key={s.id}><span className="source-kind">{s.kind==='upstream'?'Release source':s.kind+' historical source'}</span><a href={s.url}>{s.title}</a><p>{s.citation}</p>{s.note && <p className="small">{s.note}</p>}</li>)}</ol>
          <p className="small">Last editorial update: <time dateTime={history.lastEditorialUpdate}>{history.lastEditorialUpdate}</time>. Imported catalogue: {provenance.importedAt.slice(0,10)} at <a href={provenance.repository+'/commit/'+provenance.commitSha}>{provenance.commitSha.slice(0,12)}</a>.</p>
        </section>
        <div className="next-case"><span className="eyebrow">Another question</span><Link to={'/problems/'+next.history.familyId}>{caseTitle(next)}</Link></div>
      </div>
    </div>
  </>;
}
export function Article() {
  return <article className="essay-page page-width"><div className="essay-header"><p className="eyebrow">Project perspective · editorial draft</p><h1>Before the proof,<br/>there is a question.</h1><p className="essay-deck">On the intellectual inheritance behind a new mathematical result.</p><span className="small">Editorial draft · 8 October 2026</span></div><div className="essay-body"><Prose>{essay}</Prose><div className="essay-end"><p className="small">This provisional project perspective is retained as an editorial draft. A finished author essay will be written separately; the three researched histories stand on their own.</p><Link className="button" to="/explorer">Explore the collection</Link></div></div></article>;
}
export function About() {
  return <div className="page-width about-page"><div className="page-intro"><p className="eyebrow">About & methodology</p><h1>History needs evidence,<br/>too.</h1><p>Before the Proof is an independent editorial project exploring the questions behind OpenAI’s October 2026 mathematics release. It is curious about mathematical inheritance and the possibilities of new tools.</p></div>
    <div className="about-layout"><aside className="about-aside"><span className="eyebrow">Our starting point</span><p>Trace the question.<br/>Credit the people.<br/>Keep uncertainty visible.</p></aside><div className="about-content">
      <section className="content-section" tabIndex={-1}><h2>Two kinds of evidence</h2><p>The OpenAI catalogue tells us what the collection reports. Historical sources tell us how a question emerged, who formulated it and how its meaning changed. One does not stand in for the other.</p><p>Manuscripts belonging to one upstream family are shown as related outputs. A full resolution, a special-case result, a quantitative improvement and a counterexample are different claims. Our scope labels are provisional until reviewed against the precise statements.</p><p>We do not characterize the proofs as independently validated. Formalization, peer review and independent mathematical assessment are different processes; this site does not certify any of them.</p></section>
      <section className="content-section" tabIndex={-1}><h2>How an account is assembled</h2><p>Historical research begins with original papers, explicit problem statements and correspondence when accessible. Scholarly secondary sources help contextualize these documents and identify disagreements about priority or interpretation.</p><p>Each timeline event cites supporting evidence. Connections record documented predecessors or reformulations; they are not claims that every later result was inevitable. A conceptual precursor may predate an explicit conjecture without being the same problem.</p><p>Names are clues rather than automatic attributions. We distinguish naming conventions from the work of formulating, popularizing, refining and partially resolving a question. Contributors and priority claims receive source notes.</p></section>
      <section className="content-section" tabIndex={-1}><h2>Dates without false precision</h2><p>Dates can be exact, approximate, a range or unknown. “First formulation” means the earliest explicit formulation we have identified, not necessarily the earliest one that existed. Uncertain or disputed evidence remains visible.</p><p>Timelines use equal spacing to reveal relationships, not a calibrated measure of elapsed time. We do not turn uncertain dates into rankings of problem age or invented quantitative metrics.</p><p>The pale branching diagram is explicitly a schematic. Until historical research is supplied, it makes no dated or causal assertions about a particular problem.</p></section>
      <section className="content-section" tabIndex={-1}><h2>A provisional collection</h2><p>Accounts appear as research is supplied. {cases.filter(s=>s.history.status==='published').length} of the {cases.length} initial cases currently have a historical account; the others remain drafts or are marked “Research pending.” Missing dates and attribution display as unknown; upcoming accounts are available through a separate explorer filter.</p><p>Draft accounts are labeled as drafts. Publishing a historical account requires a 120–200-word narrative, cited milestones, attribution and confidence notes. Editorial review establishes the scope of each account; it does not validate a 2026 proof.</p></section>
      <section className="content-section" tabIndex={-1}><h2>Catalogue provenance</h2><dl className="provenance-list"><div><dt>Source</dt><dd><a href={provenance.repository}>openai/math</a></dd></div><div><dt>Release</dt><dd>{provenance.releaseDate}</dd></div><div><dt>Snapshot imported</dt><dd>{provenance.importedAt.slice(0,10)}</dd></div><div><dt>Upstream commit</dt><dd><a className="commit-link" href={provenance.repository+'/commit/'+provenance.commitSha}>{provenance.commitSha}</a></dd></div><div><dt>Preserved catalogue</dt><dd>{provenance.familyCount} families · {provenance.manuscriptCount} manuscripts</dd></div></dl>
        <p>The snapshot includes upstream revisions after the initial release. Original overview titles and summaries, manuscript-map titles and summaries, fields and manuscript links are preserved. Links point to this commit, so they do not silently follow later revisions.</p>
        <div className="source-document-links"><a href={provenance.repository+'/blob/'+provenance.commitSha+'/overview.pdf'}>Overview PDF</a><a href={provenance.repository+'/blob/'+provenance.commitSha+'/CONTENTS.md'}>Manuscript map</a><a href={provenance.repository+'/blob/'+provenance.commitSha+'/history.md'}>Upstream revision history</a></div>
        <p>A catalogue refresh updates imported metadata, never the curated narratives or timelines. The two source documents may frame a family differently. Both originals are retained; those differences need editorial attention.</p>
      </section>
    </div></div>
  </div>;
}
export function NotFound() {return <section className="page-width not-found"><p className="eyebrow">Page not found</p><h1>A question for another page.</h1><p>This address does not belong to the current collection.</p><Link className="button" to="/explorer">Browse the questions</Link></section>;}
