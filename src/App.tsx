import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { cases } from './data';
import CaseCard from './components/CaseCard';
import HistoryHero from './components/HistoryHero';
import { Explorer, Problem, Article, About, NotFound } from './pages';
import { pageMetadata } from './metadata';
import { useClientReady } from './useClientReady';

function Home() {
  const featured=['004','087','158'].map(id=>cases.find(s=>s.history.familyId===id)!);
  return <>
    <section className="hero page-width">
      <div className="hero-copy"><p className="eyebrow">The histories behind mathematical questions</p>
        <h1><span>Every proof</span><span>has a <em>before.</em></span></h1>
        <p className="hero-intro">A result can arrive in hours. The question behind it belongs to a much longer conversation.</p>
        <div className="hero-links"><Link className="button" to="/problems/158">Read the first story</Link><Link className="text-link" to="/explorer">Explore the questions</Link></div>
      </div>
      <div className="hero-diagram"><HistoryHero/></div>
    </section>
    <div className="page-width opening-note"><p>OpenAI’s 6 October 2026 release reports new mathematical results. Follow the questions behind three of them, from a rule about colors to the limits of computation. A manuscript’s claim and an independently confirmed solution are different kinds of evidence.</p></div>
    <section className="page-width history-findings" aria-labelledby="findings-heading">
      <p className="eyebrow">Three discoveries from the histories</p><h2 id="findings-heading">The question has a past.</h2>
      <div className="findings-grid">{featured.map(study=><Link key={study.history.familyId} to={'/problems/'+study.history.familyId+'#history'}><span className="eyebrow">Family {study.history.familyId}</span><h3>{study.history.historicalHook}</h3><span className="text-link">Follow the story</span></Link>)}</div>
    </section>
    <section className="page-width featured-section">
      <div className="section-heading"><div><p className="eyebrow">Three researched histories</p><h2>Questions worth looking back at.</h2></div><Link className="text-link" to="/explorer">Explore the histories</Link></div>
      <p className="section-intro">Start with the mathematical question. Discover why it mattered, how it changed, and exactly what the new manuscript claims.</p>
      <div className="case-grid">{featured.map(s=><CaseCard key={s.history.familyId} study={s}/>)}</div>
    </section>
    <section className="editorial-band"><div className="page-width editorial-inner"><span className="eyebrow">A note on perspective</span><div><h2>The result is a milestone.<br/>The question has a life of its own.</h2><p>This is an invitation to look more closely at mathematical inheritance: the work of asking, refining and passing on a question.</p><Link className="text-link" to="/article">Read the project perspective · draft</Link></div></div></section>
  </>;
}
export default function App() {
  const ready=useClientReady();
  const location=useLocation();
  useEffect(()=>{const meta=pageMetadata(location.pathname);document.title=meta.title;document.querySelector('meta[name=description]')?.setAttribute('content',meta.description);const target=document.getElementById(location.hash.slice(1) || 'main-content');if(location.hash)target?.scrollIntoView();else window.scrollTo(0,0);target?.focus({preventScroll:true});},[location.pathname,location.hash]);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header page-width"><Link to="/" className="wordmark"><span className="brand-mark">B<span>p</span></span>Before the Proof</Link><nav aria-label="Main navigation"><NavLink to="/explorer">Explorer</NavLink><NavLink to="/article">Perspective</NavLink><NavLink to="/about">About & methodology</NavLink></nav></header>
    <main id="main-content" tabIndex={-1} data-interactive={ready}><Routes><Route path="/" element={<Home/>}/><Route path="/explorer" element={<Explorer/>}/><Route path="/problems/:id" element={<Problem/>}/><Route path="/article" element={<Article/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Routes></main>
    <footer className="site-footer page-width"><div><Link to="/" className="footer-brand">Before the Proof</Link><p>An independent editorial project.<br/>Mathematical histories, carefully attributed.</p></div><div><a href="https://github.com/openai/math">OpenAI source collection</a><Link to="/about">Sources & uncertainties</Link><span className="small">October 2026 · Histories in progress</span></div></footer>
  </>;
}
