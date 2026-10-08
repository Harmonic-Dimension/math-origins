import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Study } from '../data';
import { eventLabels } from '../data';
import type { TimelineEvent } from '../schema';
import { useClientReady } from '../useClientReady';
import { Chronology } from './Chronology';

export function HistoryPreview({study}:{study:Study}) {
  const events=study.history.events;
  const depths=new Map<string,number>();
  function depth(e:TimelineEvent):number {
    if(depths.has(e.id)) return depths.get(e.id)!;
    const d=e.follows.length?1+Math.max(...e.follows.map(id=>depth(events.find(p=>p.id===id)!))):0;
    depths.set(e.id,d);return d;
  }
  events.forEach(depth);
  const maxDepth=Math.max(1,...depths.values());
  const maxRows=Math.max(1,...Array.from({length:maxDepth+1},(_,d)=>events.filter(e=>depths.get(e.id)===d).length));
  const height=Math.max(290,maxRows*88+50);
  const positions=new Map(events.map(e=>{
    const peers=events.filter(p=>depths.get(p.id)===depths.get(e.id));
    return [e.id,{x:50+depths.get(e.id)!*560/maxDepth,y:peers.length===1?height/2:60+peers.findIndex(p=>p.id===e.id)*(height-120)/(peers.length-1)}];
  }));
  const dateLabel=(e:TimelineEvent)=>e.date.precision==='exact'||e.date.precision==='approximate'?(e.date.precision==='approximate'?'c. ':'')+e.date.year:e.date.precision==='range'?e.date.start+'–'+e.date.end:'Date unknown';
  return <div className="schematic history-preview"><div className="schematic-label"><span className="eyebrow">Family {study.history.familyId} · a question changes</span><span className="small">Sourced milestones · equal spacing</span></div>
    <svg viewBox={'0 0 660 '+height} role="img" aria-label={'Historical relationships for '+study.family.title}>
      {events.flatMap(e=>e.follows.map(id=>{
        const a=positions.get(id)!,b=positions.get(e.id)!;
        return <path key={id+'-'+e.id} d={'M'+a.x+','+a.y+' C'+(a.x+85)+','+a.y+' '+(b.x-85)+','+b.y+' '+b.x+','+b.y} fill="none" stroke={e.type==='ai-claim'?'#18528a':'#8399ad'} strokeWidth={e.type==='ai-claim'?2:1.5}/>;
      }))}
      {events.map(e=>{const p=positions.get(e.id)!;return <g key={e.id}><title>{e.date.label+': '+e.title}</title>{e.type==='ai-claim'&&<circle cx={p.x} cy={p.y} r="17" className="claim-halo"/>}<circle cx={p.x} cy={p.y} r="6" fill={e.type==='ai-claim'?'#18528a':'#edf2f7'} stroke="#52708d" strokeWidth="1.5"/><text x={p.x} y={p.y-18} textAnchor="middle" className="preview-date">{dateLabel(e)}</text><text x={p.x} y={p.y+26} textAnchor="middle" className="preview-type">{e.type==='ai-claim'?'AI claim':e.type==='partial-result'?'Partial result':e.type==='predecessor'?'Predecessor':e.type==='formulation'?'Formulation':e.type==='reformulation'?'Reformulation':'Background'}</text></g>})}
    </svg><div className="schematic-foot"><span>Dates describe milestones, not a time scale.</span><Link to={'/problems/'+study.history.familyId+'#timeline'}>Read the sourced timeline</Link></div>
  </div>;
}

export function Schematic({compact=false}:{compact?:boolean}) {
  return <div className={'schematic '+(compact?'compact':'')}>
    <div className="schematic-label"><span className="eyebrow">A history to investigate</span><span className="small">Schematic · not dated evidence</span></div>
    <svg viewBox="0 0 660 290" role="img" aria-labelledby="schematic-title schematic-description">
      <title id="schematic-title">Questions can develop along several paths</title>
      <desc id="schematic-description">A conceptual illustration: foundational ideas lead to an original question, which may branch into reformulations and partial results. The historical events and dates are awaiting research. Only the October 2026 release is dated.</desc>
      <path className="ghost-line" d="M48 138H185 Q215 138 240 88H340 Q390 88 430 138H594 M185 138 Q215 138 240 206H350 Q410 206 430 138" />
      <path className="solid-line" d="M430 138H594"/>
      <g className="ghost-node"><circle cx="48" cy="138" r="6"/><circle cx="185" cy="138" r="6"/><circle cx="295" cy="88" r="6"/><circle cx="295" cy="206" r="6"/><circle cx="430" cy="138" r="6"/></g>
      <circle className="claim-halo" cx="594" cy="138" r="17"/><circle className="claim-node" cx="594" cy="138" r="7"/>
      <g className="diagram-text">
        <text x="30" y="110">Ideas</text><text x="156" y="174">Question</text>
        <text x="250" y="60">Reformulation</text><text x="250" y="239">Partial results</text>
        <text x="407" y="174">New tools</text><text x="553" y="99" className="claim-text">2026</text>
      </g>
    </svg>
    <div className="schematic-foot"><span><i className="line-key"/> Historical paths awaiting research</span><span><i className="dot-key"/> Reported AI result</span></div>
  </div>;
}

export function Timeline({study}:{study:Study}) {
  const ready=useClientReady();
  const events=study.history.events;
  const [selectedId,setSelectedId]=useState(events[0]?.id || '');
  const selected=events.find(e=>e.id===selectedId);
  const hasHistory=events.some(e=>e.type!=='ai-claim');
  // Topological layout uses equal columns for generations, never inferred elapsed time.
  const depths=new Map<string,number>();
  function depth(e:TimelineEvent):number {
    if(depths.has(e.id)) return depths.get(e.id)!;
    const d=e.follows.length ? 1+Math.max(...e.follows.map(id=>depth(events.find(p=>p.id===id)!))) : 0;
    depths.set(e.id,d);return d;
  }
  events.forEach(depth);
  const maxDepth=Math.max(0,...depths.values());
  const maxRows=Math.max(1,...Array.from({length:maxDepth+1},(_,d)=>events.filter(e=>depths.get(e.id)===d).length));
  const rowHeight=Math.max(150,...events.map(e=>90+Math.ceil(e.title.length/25)*20));
  const width=Math.max(700,(maxDepth+1)*230), height=maxRows*rowHeight+64;
  const positions=new Map(events.map(e=>{
    const peers=events.filter(p=>depths.get(p.id)===depths.get(e.id));
    return [e.id,{x:110+(depths.get(e.id)!)*230,y:48+peers.findIndex(p=>p.id===e.id)*rowHeight}];
  }));
  return <div className="timeline">
    {!hasHistory && <><Schematic compact/><p className="empty-note">Earlier milestones have not been researched yet. The schematic above illustrates possible relationships, without asserting a history for this problem.</p></>}
    {hasHistory && <><Chronology study={study} selectedId={selectedId} onSelect={ready?setSelectedId:undefined}/><details className="disclosure relationship-disclosure"><summary>Explore the branches and relationships</summary><p className="small">Connections show documented relationships. Equal spacing does not represent elapsed time. Use Tab and Enter to select an event; on touch screens, scroll within the diagram.</p><div className="graph-scroll" tabIndex={0} role="region" aria-label="Scrollable historical relationship diagram"><svg viewBox={'0 0 '+width+' '+height} style={{minWidth:width}} role="group" aria-label="Historical relationships">
      {events.flatMap(e=>e.follows.map(parent=>{
        const a=positions.get(parent)!,b=positions.get(e.id)!;
        return <path key={parent+'-'+e.id} d={'M'+a.x+','+a.y+' C'+(a.x+100)+','+a.y+' '+(b.x-100)+','+b.y+' '+b.x+','+b.y} fill="none" stroke="#97a8b9" strokeWidth="2"/>;
      }))}
      {events.map(e=>{const p=positions.get(e.id)!;return <g key={e.id} role="button" tabIndex={ready?0:-1} aria-disabled={!ready} aria-label={e.date.label+': '+e.title} aria-pressed={selectedId===e.id} onClick={()=>{if(ready)setSelectedId(e.id)}} onKeyDown={k=>{if(ready&&(k.key==='Enter'||k.key===' ')){k.preventDefault();setSelectedId(e.id)}}} className="graph-node">
        <circle cx={p.x} cy={p.y} r={selectedId===e.id?10:7} fill={e.type==='ai-claim'?'#18528a':'#fff'} stroke="#18528a" strokeWidth="2"/>
        <text x={p.x} y={p.y+30} textAnchor="middle">{e.date.precision==='exact'||e.date.precision==='approximate'?(e.date.precision==='approximate'?'c. ':'')+e.date.year:e.date.precision==='range'?e.date.start+'–'+e.date.end:e.date.label}</text><foreignObject x={p.x-98} y={p.y+40} width="196" height={rowHeight-64}><div className="graph-title">{e.title}</div></foreignObject>
      </g>})}
    </svg></div></details></>}
    <div className="timeline-detail-layout">
      <div className="event-list" aria-label="Select a timeline event">
        {events.map(e=><button id={'event-'+e.id} disabled={!ready} key={e.id} aria-pressed={e.id===selectedId} onClick={()=>{if(ready)setSelectedId(e.id)}} className={e.id===selectedId?'selected':''}><span className="event-date">{e.date.label}</span><span>{e.title}</span><span className="small">{eventLabels[e.type]}</span></button>)}
        {!events.length && <p>No sourced milestones yet.</p>}
      </div>
      {selected && <article className="event-detail" aria-live="polite">
        <span className="eyebrow">{eventLabels[selected.type]}</span><h3>{selected.title}</h3><p>{selected.description}</p>
        {selected.relationNote && <p className="small">{selected.relationNote}</p>}
        {selected.uncertainty && <p className="uncertainty">{selected.uncertainty}</p>}
        <div className="event-sources"><span className="small">Supporting sources</span>{selected.sourceIds.map(id=>{const s=study.history.sources.find(s=>s.id===id)!;return <a key={id} href={s.url}>{s.title}</a>})}</div>
      </article>}
    </div>
    <details className="disclosure"><summary>Read all milestones and their sources</summary>{events.map(e=><article className="static-milestone" key={e.id}><span className="event-date">{e.date.label} · {eventLabels[e.type]}</span><h3>{e.title}</h3><p>{e.description}</p>{e.relationNote&&<p className="small">{e.relationNote}</p>}{e.uncertainty&&<p className="uncertainty">{e.uncertainty}</p>}<div className="event-sources">{e.sourceIds.map(id=>{const s=study.history.sources.find(s=>s.id===id)!;return <a key={id} href={s.url}>{s.title}</a>})}</div></article>)}</details>
  </div>;
}
