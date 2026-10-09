import { useState } from 'react';
import type { CaseRecord } from '../schema';
import { useClientReady } from '../useClientReady';
import { latticePoints, unitEdges, squareVertices, polarVertices, spinBonds, triangleEnergy } from './geometry';
import { DirectFinitenessGraphic } from './DirectFinitenessGraphic';
type Kind=NonNullable<CaseRecord['visualExplainer']>;
const colors=['#18528a','#a34e25','#47694d'];
const names=['A','B','C'];
function ColoringGraphic({conflict=false,thumbnail=false}) {
  const point=(i:number)=>({x:105+latticePoints[i].x*90,y:210-latticePoints[i].y*90});
  const color=(i:number)=>conflict&&i===1?0:latticePoints[i].color;
  return <svg className="visual-explainer" viewBox="0 0 480 285" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:`Nine points on a triangular lattice. Every drawn edge is exactly one unit long. ${conflict?'Dashed edges join matching A colors and violate the rule.':'Letters A, B and C identify three colors; connected endpoints always differ.'} This finite example does not color the entire plane.`}>
    <path d="M65 244H423M65 244V28" className="visual-axis"/>
    {unitEdges.map(([i,j])=>{const a=point(i),b=point(j),bad=color(i)===color(j);return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={bad?'visual-edge conflict-edge':'visual-edge'}/>;})}
    {latticePoints.map((_,i)=>{const p=point(i);return <g key={i}><circle cx={p.x} cy={p.y} r="17" fill={colors[color(i)]}/><text x={p.x} y={p.y+6} textAnchor="middle" className="point-letter">{names[color(i)]}</text></g>;})}
    <path d="M105 259H195M105 253V265M195 253V265" className="visual-line"/><text x="150" y="282" textAnchor="middle" className="visual-label">1 unit</text>
  </svg>;
}
function PolarGraphic({disk=false,thumbnail=false}) {
  const shape=(cx:number,polar:boolean)=>disk?<circle cx={cx} cy="133" r="62" className={polar?'visual-polar':'visual-body'}/>:<polygon points={(polar?polarVertices:squareVertices).map(([x,y])=>`${cx+x*62},${133-y*62}`).join(' ')} className={polar?'visual-polar':'visual-body'}/>;
  return <svg className="visual-explainer polar-graphic" viewBox="0 0 480 270" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:disk?'Two unit disks on identically scaled coordinate axes. The unit disk is its own polar. Both areas are pi; the area product is pi squared.':'A centered square from minus one to one in each coordinate, and its exact polar diamond, whose vertices are plus or minus one on the coordinate axes. Both use the same scale. Their areas are four and two, with product eight.'}>
    {[122,358].map((cx,i)=><g key={cx}>
      <text x={cx} y="30" textAnchor="middle" className="visual-equation">{i?'K° · the polar':'K · the body'}</text>
      {[-1,0,1].map(v=><path key={v} d={`M${cx-80} ${133-v*62}H${cx+80} M${cx+v*62} 53V213`} className="visual-grid"/>)}
      {shape(cx,Boolean(i))}<path d={`M${cx-86} 133H${cx+86} M${cx} 47V219`} className="visual-axis"/>
      <text x={cx-62} y="156" textAnchor="middle" className="coordinate-label">−1</text><text x={cx+62} y="156" textAnchor="middle" className="coordinate-label">1</text><text x={cx+10} y="69" className="coordinate-label">1</text><text x={cx+10} y="207" className="coordinate-label">−1</text>
      <text x={cx} y="249" textAnchor="middle" className="visual-label">Area {disk?'π':i?'2':'4'}</text>
    </g>)}
  </svg>;
}
function RationalGraphic({thumbnail=false}) {
  return <svg className="visual-explainer rational-graphic" viewBox="0 0 480 250" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:'The equation 2x minus 1 equals zero has exactly one solution: x equals one half. The number line shows one half between zero and one. No integer solves it, but a rational number does.'}>
    <text x="240" y="65" textAnchor="middle" className="rational-equation">2x − 1 = 0</text><path d="M42 151H438" className="visual-line"/>
    {[60,180,300,420].map((x,i)=><g key={x}><path d={`M${x} 142V160`} className="visual-line"/><circle cx={x} cy="151" r="5" className="visual-integer"/><text x={x} y="193" textAnchor="middle" className="visual-label">{i-1}</text></g>)}
    <circle cx="240" cy="151" r="11" className="visual-solution"/><path d="M240 96V134" className="visual-axis"/><text x="258" y="115" className="visual-label">x = ½</text><text x="240" y="233" textAnchor="middle" className="visual-label">Fractions add a solution.</text>
  </svg>;
}
function GeometricGraphic({placement=0,thumbnail=false}:{placement?:number;thumbnail?:boolean}) {
  const center=placement===0?0:placement===1?0.25:0.75;
  const scale=placement===0?1:placement===1?0.5:-0.5;
  const x=(value:number)=>48+384*value;
  const limit=x(center);
  return <svg className="visual-explainer geometric-graphic" viewBox="0 0 480 250" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:`The dyadic sequence one half, one quarter, one eighth, and so on, ${placement===0?'approaches zero':placement===1?'is moved and shrunk to approach one quarter from the right':'is reflected and shrunk to approach three quarters from the left'}. Five terms are drawn; the sequence continues forever. The hollow square marks the limit, which is not a term.`}>
    <text x="240" y="42" textAnchor="middle" className="visual-equation">{placement===0?'½, ¼, ⅛, …':placement===1?'¼ + ½ × 2⁻ⁿ':'¾ − ½ × 2⁻ⁿ'}</text>
    <path d="M48 155H432" className="visual-line"/>
    {[0,0.25,0.5,0.75,1].map(value=><g key={value}><path d={`M${x(value)} 148V162`} className="visual-axis"/><text x={x(value)} y="190" textAnchor="middle" className="visual-label">{value===0?'0':value===0.25?'¼':value===0.5?'½':value===0.75?'¾':'1'}</text></g>)}
    <path d={`M${limit} 97V140`} className="visual-axis"/><text x={limit} y="85" textAnchor="middle" className="visual-label">limit</text>
    <rect x={limit-3} y="152" width="6" height="6" className="sequence-limit"/>
    {Array.from({length:5},(_,i)=>{const n=i+1;return <circle key={n} cx={x(center+scale*2**-n)} cy="155" r={n<3?6:n===3?4:n===4?2.5:1.5} className="visual-solution"/>;})}
    <text x="240" y="231" textAnchor="middle" className="visual-label">One translation. One scale. Infinitely many terms.</text>
  </svg>;
}
function ProgressionGraphic({longer=false,thumbnail=false}) {
  const primes=[2,3,5,7,11,13,17,19,23];
  const terms=longer?[5,11,17,23]:[3,5,7];
  const gap=longer?6:2;
  const x=(n:number)=>36+(n-1)*17;
  return <svg className="visual-explainer progression-graphic" viewBox="0 0 480 250" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:`The primes up to 24 are marked on a number line. Highlighted terms ${terms.join(', ')} form a ${longer?'four':'three'}-term arithmetic progression with common difference ${gap}. Other primes may lie between the terms. This finite example does not establish a theorem for every length.`}>
    <text x="240" y="37" textAnchor="middle" className="visual-equation">{terms.join(', ')} · equal gaps</text>
    <path d="M36 144H427" className="visual-line"/>
    {Array.from({length:24},(_,i)=>i+1).map(n=><path key={n} d={`M${x(n)} 139V149`} className="visual-axis"/>)}
    {primes.map(n=><circle key={n} cx={x(n)} cy="144" r={terms.includes(n)?8:4} className={terms.includes(n)?'progression-term visual-solution':'visual-integer'} data-value={n}/>)}
    {terms.map(n=><text key={n} x={x(n)} y="122" textAnchor="middle" className="visual-label">{n}</text>)}
    {terms.slice(1).map((n,i)=><g key={n}><path d={`M${x(terms[i])} 174V184H${x(n)}V174`} className="visual-line"/><text x={(x(terms[i])+x(n))/2} y="210" textAnchor="middle" className="visual-label">+{gap}</text></g>)}
    <text x="36" y="166" textAnchor="middle" className="coordinate-label">1</text><text x="427" y="166" textAnchor="middle" className="coordinate-label">24</text>
    <text x="240" y="239" textAnchor="middle" className="visual-label">Primes up to 24 · a finite example</text>
  </svg>;
}
function SpinGraphic({spins,thumbnail=false}:{spins:readonly number[];thumbnail?:boolean}) {
  const points=[{x:240,y:63},{x:91,y:218},{x:389,y:218}];
  const satisfied=spinBonds.filter(([i,j])=>spins[i]!==spins[j]).length;
  return <svg className="visual-explainer spin-graphic" viewBox="0 0 480 310" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:`Three spins A, B, C have values ${spins.join(', ')}. Each bond prefers opposite signs. ${satisfied} of three bonds are satisfied. Solid bonds are satisfied; dashed bonds are frustrated. Energy H equals ${triangleEnergy(spins)}.`}>
    {spinBonds.map(([i,j])=>{const a=points[i],b=points[j],ok=spins[i]!==spins[j];return <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={ok?'visual-edge spin-bond':'visual-edge spin-bond conflict-edge'} data-satisfied={ok}/>;})}
    {points.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="25" fill={spins[i]===1?colors[0]:colors[1]}/><text x={p.x} y={p.y+7} textAnchor="middle" className="point-letter" data-spin={spins[i]}>{spins[i]===1?'+1':'−1'}</text><text x={p.x} y={p.y+(i===0?-36:48)} textAnchor="middle" className="visual-label">{names[i]}</text></g>)}
    <text x="240" y="299" textAnchor="middle" className="visual-label">{satisfied}/3 bonds satisfied · H = {triangleEnergy(spins)}</text>
  </svg>;
}
export default function VisualExplainer({kind,thumbnail=false}:{kind:Kind;thumbnail?:boolean}) {
  const ready=useClientReady();
  const [conflict,setConflict]=useState(false),[disk,setDisk]=useState(false),[placement,setPlacement]=useState(0),[longer,setLonger]=useState(true);
  const [spins,setSpins]=useState([1,-1,1]);
  const [reverse,setReverse]=useState(false);
  const graphic=kind==='direct-finiteness'?<DirectFinitenessGraphic reverse={reverse} thumbnail={thumbnail}/>:kind==='unit-distance'?<ColoringGraphic conflict={conflict} thumbnail={thumbnail}/>:kind==='polar-dual'?<PolarGraphic disk={disk} thumbnail={thumbnail}/>:kind==='geometric-sequence'?<GeometricGraphic placement={placement} thumbnail={thumbnail}/>:kind==='arithmetic-progressions'?<ProgressionGraphic longer={longer} thumbnail={thumbnail}/>:kind==='spin-glass'?<SpinGraphic spins={spins} thumbnail={thumbnail}/>:<RationalGraphic thumbnail={thumbnail}/>;
  if(thumbnail)return <div className={`visual-thumbnail motif-${kind}`}>{graphic}</div>;
  return <div className={`explainer motif-${kind}`}>
    <div className="figure-heading"><span className="eyebrow">{kind==='direct-finiteness'?'An inverse with a direction':kind==='unit-distance'?'One rule. The whole plane.':kind==='polar-dual'?'A shape and its dual':kind==='geometric-sequence'?'A pattern that never ends':kind==='arithmetic-progressions'?'Equal spacing in an irregular set':kind==='spin-glass'?'Competing local preferences':'Same equation. Different domain.'}</span><span className="small">An exact example</span></div>{graphic}
    {kind==='direct-finiteness'&&<>
      <div className="figure-controls" role="group" aria-label="Compare operation order"><button disabled={!ready} aria-pressed={!reverse} onClick={()=>setReverse(false)}>Insert, then remove</button><button disabled={!ready} aria-pressed={reverse} onClick={()=>setReverse(true)}>Remove, then insert</button></div>
      <p className="figure-feedback" aria-live="polite">{reverse?'T removes the first entry, 1. S puts a zero in its place. The highlighted coordinate has changed: the lost entry cannot be recovered.':'S inserts a zero at the beginning. T removes that zero. Every original entry returns to its place.'} Products act from right to left.</p>
      <div className="figure-insight"><strong>Undoing one direction can leave the other broken</strong><p>On an infinite sequence, inserting zero has a left inverse: remove the first entry. Reversing the order loses information. The formulas give TS = I, but ST ≠ I.</p><p>These are linear operators on a one-sided sequence space. Its boundary matters. Kaplansky’s question asks whether finite sums of group symmetries can exhibit this behavior; that requires a separate construction.</p></div>
    </>}
    {kind==='spin-glass'&&<>
      <div className="figure-controls" role="group" aria-label="Change individual spins">{names.map((name,i)=><button key={name} disabled={!ready} aria-pressed={spins[i]===1} onClick={()=>setSpins(current=>current.map((value,j)=>j===i?-value:value))}>Spin {name}: {spins[i]===1?'+1':'−1'}</button>)}</div>
      <p className="figure-feedback" aria-live="polite">{triangleEnergy(spins)===-1?'Two bonds are satisfied; one is frustrated. Flipping a spin can move the conflict, but no assignment satisfies all three.':'All three bonds are frustrated. Flipping any one spin satisfies two bonds and lowers the energy from 3 to −1.'} Solid lines connect opposite signs; dashed lines connect equal signs.</p>
      <div className="figure-insight"><strong>Count the competing arrangements</strong><p>Six of the eight assignments have energy −1; two have energy 3. At inverse temperature β, the partition function is Z = 6eᵝ + 2e⁻³ᵝ. It counts every assignment, weighted by its energy.</p><p>The full problem takes the expected log of this weighted count per spin as a random sparse system grows. Cavity messages describe local spin preferences; a hierarchy describes how those preferences vary between competing states. This triangle illustrates frustration, without modeling that hierarchy or the random graph limit.</p></div>
    </>}
    {kind==='arithmetic-progressions'&&<>
      <div className="figure-controls" role="group" aria-label="Compare finite arithmetic progressions"><button disabled={!ready} aria-pressed={!longer} onClick={()=>setLonger(false)}>Three terms</button><button disabled={!ready} aria-pressed={longer} onClick={()=>setLonger(true)}>Four terms</button></div>
      <p className="figure-feedback" aria-live="polite">{longer?'5, 11, 17, 23: add 6 each time. The intervening primes do not need to belong to this progression.':'3, 5, 7: add 2 each time. An arithmetic progression preserves one common difference.'}</p>
      <div className="figure-insight"><strong>A different progression for each length</strong><p>The conjecture asks for equally spaced terms of every finite length. The starting point and gap can change when the length changes.</p><p>These examples show the rule. A finite drawing cannot establish that an infinite set has a divergent reciprocal sum, or that it contains progressions of every length.</p></div>
    </>}
    {kind==='geometric-sequence'&&<>
      <div className="figure-controls" role="group" aria-label="Move the same infinite pattern">{['Original sequence','Move & shrink','Reflect'].map((label,i)=><button key={label} disabled={!ready} aria-pressed={placement===i} onClick={()=>setPlacement(i)}>{label}</button>)}</div>
      <p className="figure-feedback" aria-live="polite">{placement===0?'Each term is half the previous one. The hollow square marks 0, the limit; 0 is not part of this sequence.':placement===1?'Every term moves by the same rule: x ↦ ¼ + ½x. The sequence now approaches ¼.': 'Every term moves by the same rule: x ↦ ¾ − ½x. A negative scale reflects the pattern; its limit is now ¾.'}</p>
      <div className="figure-insight"><strong>Every finite piece fits. Must the whole pattern?</strong><p>Every measurable set of positive measure contains a scaled, translated copy of any finite selection of these points. The infinite question demands one placement that works for all terms at once.</p><p>This drawing shows the pattern and its transformations. The reported construction of a set avoiding every placement requires infinitely many scales; it is not pictured here.</p></div>
    </>}
    {kind==='unit-distance'&&<>
      <div className="figure-controls" role="group" aria-label="Compare color assignments"><button disabled={!ready} aria-pressed={!conflict} onClick={()=>setConflict(false)}>Valid coloring</button><button disabled={!ready} aria-pressed={conflict} onClick={()=>setConflict(true)}>Introduce a conflict</button></div>
      <p className="figure-feedback" aria-live="polite">{conflict?'The dashed edges join two A points. Equal colors one unit apart break the rule.':'Every edge has length 1. Its endpoints have different colors, also marked A, B and C.'}</p>
      <div className="figure-insight"><strong>From a patch to a plane</strong><p>Here, three colors work. The real question asks for a coloring of <em>every point</em> in the plane: every pair exactly one unit apart must differ. This patch does not determine how many colors the whole plane needs.</p></div>
    </>}
    {kind==='polar-dual'&&<>
      <div className="figure-controls" role="group" aria-label="Compare exact polar pairs"><button disabled={!ready} aria-pressed={!disk} onClick={()=>setDisk(false)}>Square & diamond</button><button disabled={!ready} aria-pressed={disk} onClick={()=>setDisk(true)}>Unit disk</button></div>
      <div className="area-product" aria-live="polite"><span>Area(K) × Area(K°)</span><strong>{disk?'π × π = π² ≈ 9.87':'4 × 2 = 8'}</strong></div>
      <div className="figure-insight"><strong>What makes this the polar?</strong><p>{disk?'A vector belongs to the polar if its dot product with every point of the body is at most 1. For the unit disk, this is exactly another unit disk.':'For a vector (u, v), the largest dot product with the square is |u| + |v|. Requiring it to be at most 1 gives the diamond: |u| + |v| ≤ 1.'} Both drawings use the same coordinate scale.</p><p>In higher dimensions, replace area with volume. How small can the product be for an origin-symmetric convex body?</p></div>
    </>}
    {kind==='rational-solutions'&&<>
      <div className="domain-comparison"><div><span className="eyebrow">Integer unknowns · ℤ</span><strong>No solution</strong><p>½ is not an integer.</p></div><div><span className="eyebrow">Rational unknowns · ℚ</span><strong>One solution: ½</strong><p>2 × ½ − 1 = 0.</p></div></div>
      <div className="figure-insight"><strong>One easy equation → a universal decision question</strong><p>Could one algorithm always finish with “yes” or “no” for <em>any</em> integer-coefficient polynomial, in any number of variables? This example only shows why the domain matters.</p></div>
      <p className="domain-history">1900: Hilbert asks about integers. 1970: that problem is proved undecidable. The rational descendant asks a separate question.</p>
    </>}
  </div>;
}
