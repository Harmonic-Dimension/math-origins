import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { cases, caseTitle, caseField } from './data';
import VisualExplainer from './components/VisualExplainer';
import HistoryHero from './components/HistoryHero';
import { Explorer, Problem, Article, About, NotFound } from './pages';
import { pageMetadata } from './metadata';
import { useClientReady } from './useClientReady';

const originStories = [
  { id: '158', origin: 'A failed approach', title: 'From map coloring to the plane.', text: 'Nelson later recalled trying to bring map-coloring questions into one infinite graph. The attempt left him with a different puzzle: how many colors does the plane need if points one unit apart must differ?', caption: 'A finite unit-distance lattice: connected points have different colors.' },
  { id: '268', origin: 'A prediction from physics', title: 'A physical prediction becomes a conjecture.', text: 'In a 1981 preprint, Haldane predicted a distinction between integer and half-integer spin chains. For spin one, the challenge became proving that an energy gap survives as the chain grows.', caption: 'The exact spectrum of two spin-one sites; a chain-wide gap is a separate question.' },
  { id: '004', origin: 'A question changes its terms', title: 'What if the unknowns were fractions?', text: 'Hilbert asked for a procedure to decide whether polynomial equations have integer solutions. Work by Davis, Putnam, Robinson and Matiyasevich established that no such procedure exists. The corresponding question over the rationals requires a different argument.', caption: 'One half solves this equation over the rationals; no integer does.' },
];
function Home() {
  const published = cases.filter(study => study.history.status === 'published');
  const collectionOrder = ['084', '159', '197', '221', '304', '087', '158', '268', '004'];
  const collection = [...published].sort((a,b) => {
    const rank = (id:string) => { const index=collectionOrder.indexOf(id); return index < 0 ? collectionOrder.length : index; };
    return rank(a.history.familyId)-rank(b.history.familyId);
  });
  return <>
    <section className="hero landing-hero page-width">
      <div className="hero-copy"><p className="eyebrow">Mathematics · An intellectual history</p>
        <h1><span>The histories </span><span>behind the <em>questions.</em></span></h1>
        <p className="hero-intro">In October 2026, OpenAI reported new mathematical results produced with AI. This project traces the questions behind them: how they were formulated, why they mattered, and how they changed over decades or centuries.</p>
        <div className="hero-links"><Link className="button" to="/explorer">Explore the questions <span aria-hidden="true">↗</span></Link><a className="text-link" href="#origins">How the questions began</a></div>
      </div>
      <HistoryHero/>
    </section>
    <section className="page-width origin-section" id="origins" aria-labelledby="origins-heading">
      <div className="section-heading"><div><p className="eyebrow">Origins and reformulations</p><h2 id="origins-heading">Where does a question come from?</h2></div><p className="origin-deck">Questions can emerge from failed approaches,<br/>physical predictions or changes in formulation.</p></div>
      <div className="origin-stories">{originStories.map(story => {
        const study=published.find(s=>s.history.familyId===story.id);
        if(!study)return null;
        return <article className="origin-story" key={story.id}>
          <figure><VisualExplainer kind={study.history.visualExplainer!} thumbnail/><figcaption>{story.caption}</figcaption></figure>
          <div className="origin-copy"><p className="eyebrow">{story.origin}</p><h3>{story.title}</h3><p>{story.text}</p><Link className="text-link" to={'/problems/'+story.id}>Read the {story.id==='158'?'Hadwiger–Nelson':story.id==='268'?'Haldane gap':'Hilbert’s tenth'} story <span aria-hidden="true">↗</span></Link></div>
        </article>;
      })}</div>
    </section>
    <section className="editorial-band motivation"><div className="page-width motivation-inner"><div><p className="eyebrow">The work of asking</p><h2>The questions had to be invented, too.</h2></div><div className="motivation-prose">
      <p>Formulating a mathematical question takes work. A pattern has to be distinguished from a coincidence; an intuition needs definitions before it can become a conjecture. Sometimes a useful question appears when an approach fails, or when a result stops holding under slightly different assumptions.</p>
      <p>These questions develop within research traditions. Papers, correspondence, examples and counterexamples give mathematicians a language for stating what they do not yet understand. A problem may carry one person’s name while its formulation draws on many people’s work. Later researchers can change its assumptions or find connections that alter what an answer would mean.</p>
      <p>OpenAI’s October 2026 release provides an occasion to examine these histories alongside new uses of AI in mathematics. The reported results raise questions about what these tools can do. The historical accounts ask how the problems came to be asked in the first place. Reading the two together helps explain both the scope of a new claim and the ideas that made it possible.</p>
    </div></div></section>
    <section className="page-width collection-section" aria-labelledby="collection-heading">
      <div className="section-heading"><div><p className="eyebrow">{published.length} published histories</p><h2 id="collection-heading">The researched collection.</h2></div><Link className="text-link" to="/explorer">Open the complete explorer <span aria-hidden="true">↗</span></Link></div>
      <p className="section-intro">Historical accounts from geometry, number theory, algebra, topology and mathematical physics. Each includes an explanation of the question, a timeline and sources.</p>
      <div className="collection-grid">{collection.map(study=><Link className="collection-story" key={study.history.familyId} to={'/problems/'+study.history.familyId}>
        <div className="collection-image">{study.history.visualExplainer&&<VisualExplainer kind={study.history.visualExplainer} thumbnail/>}</div>
        <div className="collection-meta"><span>{caseField(study)}</span><span>№ {study.history.familyId}</span></div><h3>{caseTitle(study)}</h3><p>{study.history.historicalHook}</p><span className="text-link">Read the account <span aria-hidden="true">↗</span></span>
      </Link>)}</div>
      <p className="release-note"><strong>A note on the results.</strong> These histories distinguish the original questions from the precise claims in OpenAI’s published manuscripts, including special cases and improvements. Reported results are not the same as independently verified proofs; this project does not certify proof claims. <Link to="/about">Read our methodology.</Link></p>
    </section>
    <section className="page-width participation"><div><p className="eyebrow">Corrections and additions</p><h2>These accounts are open to revision.</h2><p>This is an evolving, best-effort historical collection. Corrections, overlooked contributors and historical anecdotes are welcome. Please include a source or reference where possible.</p></div><div className="participation-links"><a className="button" href="https://github.com/Harmonic-Dimension/math-origins/issues/new">Suggest a correction or addition <span aria-hidden="true">↗</span></a><Link className="text-link" to="/about">How we research the histories</Link></div></section>
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
