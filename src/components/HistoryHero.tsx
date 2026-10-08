import { Link } from 'react-router-dom';
import { cases } from '../data';
import VisualExplainer from './VisualExplainer';
import { dateExtent, datePosition } from './date-scale';

export default function HistoryHero() {
  const stories=[{id:'004',event:'hilbert',label:'Integers, then fractions',date:'1900 · integer ancestor'},{id:'087',event:'mahler',label:'A body and its polar',date:'1938–1939 · formulation'},{id:'158',event:'nelson',label:'One distance. How many colors?',date:'c. 1950 · personal formulation'}];
  return <div className="history-hero">
    <div className="figure-heading"><span className="eyebrow">Three questions, long histories</span><span className="small">1900–2026</span></div>
    <div className="hero-history-axis" aria-hidden="true">{[1900,1950,2000,2026].map(y=><span key={y} style={{left:`${datePosition(y,1900,2026)}%`}}>{y}</span>)}</div>
    {stories.map(story=>{const study=cases.find(s=>s.history.familyId===story.id)!;const event=study.history.events.find(e=>e.id===story.event)!;const extent=dateExtent(event.date)!;return <Link key={story.id} className="hero-history-story" to={`/problems/${story.id}#timeline`}>
      <VisualExplainer kind={study.history.visualExplainer!} thumbnail/>
      <div><span className="hero-story-title">{story.label}</span><span className="small">{story.date}</span><div className="hero-time-track" aria-hidden="true"><i className={event.date.precision==='approximate'?'approximate':''} style={{left:`${datePosition(extent[0],1900,2026)}%`,width:extent[0]===extent[1]?undefined:`${100*(extent[1]-extent[0])/126}%`}}/><b/></div></div>
    </Link>;})}
    <p className="small hero-history-caption">Dates mark selected formulations, not uninterrupted activity. Each meets a reported AI claim in October 2026.</p>
    <Link className="hero-first-story" to="/problems/158"><span className="eyebrow">Begin with the plane</span><strong>Can every point obey one simple color rule?</strong><span className="text-link">Read the Hadwiger–Nelson story</span></Link>
  </div>;
}
