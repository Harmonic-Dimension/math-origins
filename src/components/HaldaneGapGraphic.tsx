import { useState } from 'react';
import { useClientReady } from '../useClientReady';

// q = S₁·S₂ = (S_total² − S₁² − S₂²)/2, in units J = 1.
export const spinOneBondLevels = [
  { spin: 0, energy: -2, multiplicity: 1 },
  { spin: 1, energy: -1, multiplicity: 3 },
  { spin: 2, energy: 1, multiplicity: 5 },
];

export default function HaldaneGapGraphic({thumbnail=false}:{thumbnail?:boolean}) {
  const ready=useClientReady();
  const [aklt,setAklt]=useState(false);
  const levels=aklt
    ? [{ energy:-2/3, label:'−2/3', sector:'s = 0, 1 · 4 states', multiplicity:4 },{ energy:4/3, label:'4/3', sector:'s = 2 · 5 states', multiplicity:5 }]
    : spinOneBondLevels.map(l=>({...l,label:String(l.energy).replace('-','−'),sector:`s = ${l.spin} · ${l.multiplicity} ${l.multiplicity===1?'state':'states'}`}));
  const y=(energy:number)=>280-60*(energy+2);
  const low=y(levels[0].energy),high=y(levels[1].energy);
  const graphic=<svg className="visual-explainer haldane-graphic" viewBox="0 0 480 330" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:aklt?'Exact two-spin AKLT bond spectrum, without an added constant: energy minus two thirds has total spin zero or one and four states; energy four thirds has total spin two and five states. The local gap is two.':'Exact two-spin Heisenberg bond spectrum: energies minus two, minus one and one have total spin zero, one and two, with one, three and five states respectively. The local gap is one. This is not the long-chain spectrum.'}>
    <text x="48" y="30" className="visual-label">E / J</text>
    <text x="280" y="30" textAnchor="middle" className="visual-equation">{aklt?'AKLT: q + q²/3':'Heisenberg: q'}</text>
    <path d="M54 50V310" className="visual-axis"/>
    {levels.map(level=><g key={level.energy} data-energy={level.energy} data-multiplicity={level.multiplicity}>
      <text x="95" y={y(level.energy)-12} className="haldane-sector">{level.sector}</text>
      <path d={`M95 ${y(level.energy)}H305`} className="haldane-level"/>
      <text x="321" y={y(level.energy)+6} className="visual-label">{level.label}</text>
      {Array.from({length:level.multiplicity},(_,i)=><circle key={i} cx={113+25*i} cy={y(level.energy)+15} r="4" className="haldane-state"/>)}
    </g>)}
    <rect x="395" y={high} width="12" height={low-high} className="haldane-gap-band"/>
    <path d={`M391 ${high}H411 M401 ${high}V${low} M391 ${low}H411`} className="haldane-gap-bracket"/>
    <text x="420" y={(low+high)/2-5} className="haldane-sector">Δ / J</text>
    <text x="440" y={(low+high)/2+20} textAnchor="middle" className="visual-equation">{aklt?'2':'1'}</text>
  </svg>;
  if(thumbnail)return <div className="visual-thumbnail motif-haldane-gap">{graphic}</div>;
  return <div className="explainer motif-haldane-gap">
    <div className="figure-heading"><span className="eyebrow">The interaction changes the spectrum</span><span className="small">An exact two-spin example</span></div>
    {graphic}
    <div className="figure-controls" role="group" aria-label="Compare two-spin interactions">
      <button disabled={!ready} aria-pressed={!aklt} onClick={()=>setAklt(false)}>Heisenberg bond</button>
      <button disabled={!ready} aria-pressed={aklt} onClick={()=>setAklt(true)}>AKLT bond</button>
    </div>
    <p className="figure-feedback" aria-live="polite">{aklt?'The squared term brings the spin-zero and spin-one sectors to the same energy, −2/3. Four ground states sit two energy units below the five excited states.':'The three total-spin sectors have energies −2, −1 and 1. The single ground state sits one energy unit below the next three states.'} Each dot counts one state; both spectra use the same scale.</p>
    <div className="figure-insight"><strong>A local gap leaves a global question</strong><p>A chain adds bonds that share spins. Their interactions do not generally commute, so its spectrum cannot be found by adding these two-spin levels.</p><p>The AKLT chain has a rigorous gap, but its bond contains an extra squared term. Haldane’s pure-model question asks whether the gap survives arbitrarily large chains with the Heisenberg interaction itself.</p></div>
  </div>;
}
