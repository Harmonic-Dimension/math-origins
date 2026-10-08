import type { CSSProperties } from 'react';
import type { Study } from '../data';
import type { TimelineEvent } from '../schema';
import { dateExtent, datePosition } from './date-scale';
function category(event:TimelineEvent,study:Study) {
  const origin=study.history.conceptualOrigins;
  if(origin && JSON.stringify(dateExtent(origin))===JSON.stringify(dateExtent(event.date)) && event.type!=='ai-claim')return 'origins';
  return event.type==='ai-claim'?'claim':event.type==='formulation'?'formulation':event.type==='background'||event.type==='predecessor'?'origins':'progress';
}
export function Chronology({study,selectedId,onSelect}:{study:Study;selectedId:string;onSelect?:(id:string)=>void}) {
  const events=study.history.events;
  const dated=events.filter(e=>dateExtent(e.date));
  if(!dated.length)return null;
  const extents=dated.flatMap(e=>dateExtent(e.date)!);
  const min=Math.min(...extents),max=Math.max(...extents);
  const middle=Math.round((min+max)/50)*25;
  const ticks=[min,...(middle>min+(max-min)*.3&&middle<max-(max-min)*.3?[middle]:[]),...(max!==min?[max]:[])];
  return <div className="chronology">
    <div className="chronology-heading"><h3>The scale of the history</h3><span className="small">Positioned by year</span></div>
    <p className="small chronology-note">Each row is one sourced milestone. Bars show date ranges; “c.” marks approximate dates. Gaps do not imply continuous work, and rows are not a chain of causes.</p>
    <div className="chronology-legend" aria-label="Milestone types"><span><i className="time-symbol time-origins"/>Conceptual origins</span><span><i className="time-symbol time-formulation"/>Formulations</span><span><i className="time-symbol time-progress"/>Progress & reformulations</span><span><i className="time-symbol time-claim"/>2026 AI claim</span></div>
    <div className="time-axis" aria-hidden="true">{ticks.map(year=><span key={year} style={{left:`${datePosition(year,min,max)}%`}}>{year}</span>)}</div>
    <div className="time-events">{dated.map(event=>{
      const [start,end]=dateExtent(event.date)!;
      const style={'--date-start':`${datePosition(start,min,max)}%`,'--date-length':`${datePosition(end,min,max)-datePosition(start,min,max)}%`} as CSSProperties;
      const content=<><span className="time-row-label"><span className="event-date">{event.date.precision==='approximate'?'c. ':''}{start}{end!==start?`–${end}`:''}</span><span>{event.title}</span></span><span className="time-track" aria-hidden="true"><span className={`time-mark time-${category(event,study)} ${start===end?'':'time-range'} ${event.date.precision==='approximate'?'time-approximate':''}`} style={style}/></span></>;
      return onSelect?<button key={event.id} className="time-row" aria-pressed={event.id===selectedId} onClick={()=>onSelect(event.id)}>{content}<span className="sr-only">Inspect sources. {event.date.label}.</span></button>:<a className="time-row" key={event.id} href={`#event-${event.id}`}>{content}</a>;
    })}</div>
    {study.history.firstFormulation?.precision==='unknown'&&<p className="undated-note"><strong>First formulation remains unlocated.</strong> {study.history.firstFormulation.label}</p>}
    {events.filter(e=>e.date.precision==='unknown').map(e=><p key={e.id} className="undated-note">Undated: <a href={`#event-${e.id}`}>{e.title}</a> · {e.date.label}</p>)}
    <p className="small chronology-foot">Inspect a row for its evidence. The relationship diagram below traces the different branches.</p>
  </div>;
}
