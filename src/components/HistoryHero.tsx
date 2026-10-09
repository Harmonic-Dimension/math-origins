import { latticePoints, unitEdges } from './geometry';

/** Editorial composition, not a diagram of a theorem or a historical document. */
export default function HistoryHero() {
  const point=(i:number)=>({x:290+latticePoints[i].x*63,y:280-latticePoints[i].y*63});
  return <figure className="mathematical-atlas">
    <svg viewBox="0 0 600 530" role="img" aria-labelledby="atlas-title" aria-describedby="atlas-description">
      <title id="atlas-title">An atlas of mathematical questions</title>
      <desc id="atlas-description">An original blue mathematical illustration: nested curves sweep around a square and its polar diamond, a colored unit-distance lattice, and a circular family of rotations. Geometric sequences of points and linked spin-like nodes connect the composition. Inspired by the collection; not a proof or historical artifact.</desc>
      <defs>
        <radialGradient id="atlas-wash"><stop stopColor="#dde9f4"/><stop offset="1" stopColor="#edf2f6" stopOpacity="0"/></radialGradient>
        <linearGradient id="atlas-body" x2="1" y2="1"><stop stopColor="#c0d7ea" stopOpacity=".85"/><stop offset="1" stopColor="#e5eef5" stopOpacity=".2"/></linearGradient>
        <clipPath id="atlas-clip"><rect width="600" height="530" rx="180"/></clipPath>
      </defs>
      <g clipPath="url(#atlas-clip)">
        <ellipse cx="310" cy="260" rx="300" ry="260" fill="url(#atlas-wash)"/>
        <g fill="none" stroke="#18528a" strokeWidth=".8" opacity=".38">
          {Array.from({length:17},(_,i)=><path key={i} d={`M${-80+i*15} 465 C${110+i*5} ${430-i*13}, ${90+i*13} ${125-i*3}, ${320+i*10} ${65+i*3} S${510+i*11} ${250+i*7}, 650 ${120+i*15}`}/>)}
        </g>
        <g transform="translate(164 167) rotate(-18)">
          <circle r="106" fill="none" stroke="#92adc5" strokeDasharray="2 7"/>
          <path d="M-79 -79H79V79H-79Z" fill="url(#atlas-body)" stroke="#527c9f" strokeWidth="1.2"/>
          <path d="M0 -79L79 0L0 79L-79 0Z" fill="#f6f7f8" fillOpacity=".8" stroke="#18528a" strokeWidth="1.5"/>
          <path d="M-112 0H112M0 -112V112" stroke="#527c9f" strokeWidth=".6"/>
          <circle r="4" fill="#18528a"/>
        </g>
        <g>{unitEdges.map(([i,j])=>{const a=point(i),b=point(j);return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#527c9f" strokeWidth="1.5"/>;})}
          {latticePoints.map((p,i)=>{const a=point(i);return <circle key={i} cx={a.x} cy={a.y} r="9" fill={['#18528a','#789bb9','#f6f7f8'][p.color]} stroke="#18528a" strokeWidth="1.5"/>;})}
        </g>
        <g transform="translate(370 380)">
          <circle r="87" fill="#f6f7f8" fillOpacity=".65" stroke="#527c9f" strokeWidth="1"/>
          {Array.from({length:16},(_,i)=>{const angle=i*Math.PI/8;return <g key={i}><path d={`M0 0L${87*Math.cos(angle)} ${87*Math.sin(angle)}`} stroke="#92adc5" strokeWidth=".7"/><circle cx={87*Math.cos(angle)} cy={87*Math.sin(angle)} r={i%4===0?4:2} fill="#18528a"/></g>;})}
          <ellipse rx="87" ry="34" fill="none" stroke="#18528a" strokeWidth="1.2" transform="rotate(-35)"/>
          <ellipse rx="34" ry="87" fill="none" stroke="#18528a" strokeWidth="1.2" transform="rotate(-35)"/>
          <circle r="5" fill="#18528a"/>
        </g>
        <path d="M55 366C128 282 198 327 213 393S158 485 97 433" fill="none" stroke="#18528a" strokeWidth="1.2"/>
        {[0,1,2,3,4,5,6].map(i=><circle key={i} cx={68+130*(1-2**-i)} cy="367" r={Math.max(1,5-i*.7)} fill="#18528a"/>)}
        <path d="M68 367H225" stroke="#92adc5" strokeWidth=".8"/>
        <g stroke="#18528a" strokeWidth="1.3"><path d="M462 72L518 111L493 174L462 72" fill="none"/>
          {[[462,72],[518,111],[493,174]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="12" fill={i===1?'#18528a':'#f6f7f8'}/><path d={`M${x-4} ${y}h8${i===1?` M${x} ${y-4}v8`:''}`} stroke={i===1?'#fff':'#18528a'}/></g>)}
        </g>
      </g>
    </svg>
    <figcaption><span className="eyebrow">A mathematical atlas</span><span>An illustration inspired by<br/>the questions in this collection.</span></figcaption>
  </figure>;
}
