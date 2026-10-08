import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { cases } from './data';
import CaseCard from './components/CaseCard';
import { Schematic, HistoryPreview } from './components/Timeline';
import { Explorer, Problem, Article, About, NotFound } from './pages';
import { pageMetadata } from './metadata';
import { useClientReady } from './useClientReady';

function Home() {
  const featured=['004','087','158','197'].map(id=>cases.find(s=>s.history.familyId===id)!);
  const example=cases.find(s=>s.history.status==='published' && s.history.events.some(e=>e.type!=='ai-claim'));
  return <>
    <section className="hero page-width">
      <div className="hero-copy"><p className="eyebrow">The histories behind mathematical questions</p>
        <h1>Every proof has<br/>a <em>before.</em></h1>
        <p className="hero-intro">A result can arrive in hours. The question behind it belongs to a much longer conversation.</p>
        <p>Before the Proof explores the ideas, people and changing formulations behind problems in OpenAI’s October 2026 mathematics release.</p>
        <div className="hero-links"><Link className="button" to="/explorer">Explore the questions</Link><Link className="text-link" to="/about">How we trace a history</Link></div>
      </div>
      <div className="hero-diagram">{example?<HistoryPreview study={example}/>:<Schematic/>}<div className="diagram-caption"><span className="eyebrow">{example?example.family.title:'The shape of an inquiry'}</span><p>{example?'A question inherited, reformulated and approached along different paths.':'Ideas branch. Questions change. A new result joins an existing conversation.'}</p></div></div>
    </section>
    <section className="feature-strip"><div className="page-width feature-strip-inner"><span className="eyebrow">Start with a question</span><Link to="/problems/004">Hilbert’s tenth problem over ℚ</Link><span className="small">Family 004 · {cases.find(s=>s.history.familyId==='004')?.history.status==='published'?'a historical account':'historical research pending'}</span></div></section>
    <section className="page-width featured-section">
      <div className="section-heading"><div><p className="eyebrow">An initial collection</p><h2>Questions worth looking back at.</h2></div><Link className="text-link" to="/explorer">View all ten cases</Link></div>
      <p className="section-intro">Ten entry points into the release. Explore the available histories and questions awaiting further research.</p>
      <div className="case-grid">{featured.map(s=><CaseCard key={s.history.familyId} study={s}/>)}</div>
    </section>
    <section className="editorial-band"><div className="page-width editorial-inner"><span className="eyebrow">A note on perspective</span><div><h2>The result is a milestone.<br/>The question has a life of its own.</h2><p>This is an invitation to look more closely at mathematical inheritance: the work of asking, refining and passing on a question.</p><Link className="text-link" to="/article">Read the opening essay</Link></div></div></section>
  </>;
}
export default function App() {
  const ready=useClientReady();
  const location=useLocation();
  useEffect(()=>{const meta=pageMetadata(location.pathname);document.title=meta.title;document.querySelector('meta[name=description]')?.setAttribute('content',meta.description);const target=document.getElementById(location.hash.slice(1) || 'main-content');if(location.hash)target?.scrollIntoView();else window.scrollTo(0,0);target?.focus({preventScroll:true});},[location.pathname,location.hash]);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header page-width"><Link to="/" className="wordmark"><span className="brand-mark">B<span>p</span></span>Before the Proof</Link><nav aria-label="Main navigation"><NavLink to="/explorer">Explorer</NavLink><NavLink to="/article">Essay</NavLink><NavLink to="/about">About & methodology</NavLink></nav></header>
    <main id="main-content" tabIndex={-1} data-interactive={ready}><Routes><Route path="/" element={<Home/>}/><Route path="/explorer" element={<Explorer/>}/><Route path="/problems/:id" element={<Problem/>}/><Route path="/article" element={<Article/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Routes></main>
    <footer className="site-footer page-width"><div><Link to="/" className="footer-brand">Before the Proof</Link><p>An independent editorial project.<br/>Mathematical histories, carefully attributed.</p></div><div><a href="https://github.com/openai/math">OpenAI source collection</a><Link to="/about">Sources & uncertainties</Link><span className="small">October 2026 · Histories in progress</span></div></footer>
  </>;
}
