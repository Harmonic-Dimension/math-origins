import { useState } from 'react';
import { useClientReady } from '../useClientReady';

export function rotationOrbit(order:number) {
  return Array.from({length:order},(_,step)=>{
    const angle=2*Math.PI*step/order;
    return {step,x:Math.cos(angle),y:Math.sin(angle)};
  });
}

export default function HilbertSmithGraphic({thumbnail=false}:{thumbnail?:boolean}) {
  const ready=useClientReady();
  const [order,setOrder]=useState(16),[wholeGroup,setWholeGroup]=useState(false);
  const orbit=rotationOrbit(order);
  const shown=wholeGroup?orbit:orbit.slice(0,2);
  const x=(v:number)=>240+110*v,y=(v:number)=>163-110*v;
  const graphic=<svg className="visual-explainer hilbert-smith-graphic" viewBox="0 0 480 330" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:`A plane rotation through ${360/order} degrees. ${wholeGroup?`All ${order} powers carry a marked point around a unit circle, including a half-turn.`:'The marked point moves a short distance from its original position.'} The center stays fixed. The rotation group acts faithfully, but not freely, on the plane.`}>
    <text x="240" y="30" textAnchor="middle" className="visual-equation">{wholeGroup?'All powers of r':`r · a ${360/order}° rotation`}</text>
    <circle cx="240" cy="163" r="110" className="visual-grid"/>
    <path d="M104 163H376 M240 42V285" className="visual-axis"/>
    <circle cx="240" cy="163" r="5" className="visual-integer"/>
    <text x="240" y="193" textAnchor="middle" className="visual-label">Fixed center</text>
    <path d={`M350 163 A110 110 0 0 0 ${x(orbit[1].x)} ${y(orbit[1].y)}`} className="visual-line"/>
    {shown.map(p=><circle key={p.step} cx={x(p.x)} cy={y(p.y)} r={p.step===0||p.step===1||p.step===order/2?7:4} className={p.step===order/2?'rotation-half-turn':p.step===0?'visual-integer':'visual-solution'} data-step={p.step} data-x={p.x} data-y={p.y}/>)}
    <text x="370" y="185" textAnchor="middle" className="visual-label">Start</text>
    {wholeGroup&&<text x="100" y="185" textAnchor="middle" className="visual-label">180°</text>}
    <text x="240" y="318" textAnchor="middle" className="visual-label">{wholeGroup?`r${order===16?'¹⁶':'³²'} = identity · half-turn included`:'A small step can generate a large journey.'}</text>
  </svg>;
  if(thumbnail)return <div className="visual-thumbnail motif-hilbert-smith">{graphic}</div>;
  return <div className="explainer motif-hilbert-smith">
    <div className="figure-heading"><span className="eyebrow">One motion. A whole group.</span><span className="small">Exact plane rotations</span></div>
    {graphic}
    <div className="figure-controls" role="group" aria-label="Compare a rotation with its subgroup">
      <button disabled={!ready} aria-pressed={!wholeGroup} onClick={()=>setWholeGroup(false)}>One small rotation</button>
      <button disabled={!ready} aria-pressed={wholeGroup} onClick={()=>setWholeGroup(true)}>The generated subgroup</button>
      <button disabled={!ready} aria-pressed={order===32} onClick={()=>setOrder(current=>current===16?32:16)}>Halve the step</button>
    </div>
    <p className="figure-feedback" aria-live="polite">{wholeGroup?`All ${order} powers are shown. After ${order/2} steps the point is on the opposite side; after ${order} it returns. Making the generator smaller does not keep the entire subgroup close to the identity.`:`One step turns the point by ${360/order}°. Its powers must also belong to the generated subgroup. Select the subgroup to see where repeated steps take it.`}</p>
    <div className="figure-insight"><strong>Small elements are different from small subgroups</strong><p>The circle group of plane rotations is a Lie group. It has rotations arbitrarily close to the identity, but a sufficiently small neighborhood of the identity contains no entire nontrivial subgroup.</p><p>The additive p-adic integers have a different structure: each neighborhood of zero contains a nontrivial subgroup pᵏℤₚ. The drawing shows an ordinary Lie-group example; it does not depict a p-adic action on a manifold.</p><p>These rotations also fix the center. Faithful means only the identity fixes every point; it allows individual points to have stabilizers.</p></div>
  </div>;
}
