import type { CaseRecord } from '../schema';

const descriptions = {
  'rational-solutions': 'On a number line, one half lies between the integers zero and one. It solves 2x minus 1 equals zero over the rationals, but no integer does.',
  'polar-dual': 'A square of side two and area four has a polar diamond with diagonals of length two and area two. Their area product is eight.',
  'unit-distance': 'An equilateral triangle with all sides one unit long. Its three vertices have different colors, illustrating a finite constraint rather than a coloring of the entire plane.',
};

export default function VisualExplainer({kind, thumbnail=false}:{kind:NonNullable<CaseRecord['visualExplainer']>;thumbnail?:boolean}) {
  return <svg className={'visual-explainer'+(thumbnail?' visual-thumbnail':'')} viewBox="0 0 480 220" role={thumbnail?undefined:'img'} aria-label={thumbnail?undefined:descriptions[kind]} aria-hidden={thumbnail?true:undefined}>
    {kind==='rational-solutions' && <>
      <text x="240" y="40" textAnchor="middle" className="visual-equation">2x − 1 = 0</text>
      <path d="M65 116H415M85 106V126M395 106V126" className="visual-line"/>
      <circle cx="85" cy="116" r="5" className="visual-integer"/><circle cx="395" cy="116" r="5" className="visual-integer"/>
      <circle cx="240" cy="116" r="9" className="visual-solution"/>
      <text x="85" y="151" textAnchor="middle">0</text><text x="395" y="151" textAnchor="middle">1</text><text x="240" y="151" textAnchor="middle">½</text>
      <text x="240" y="194" textAnchor="middle" className="visual-label">A rational solution between two integers</text>
    </>}
    {kind==='polar-dual' && <>
      <path d="M60 108H190M125 43V173M290 108H420M355 43V173" className="visual-axis"/>
      <path d="M75 58H175V158H75Z" className="visual-body"/>
      <path d="M355 58L405 108L355 158L305 108Z" className="visual-polar"/>
      <path d="M220 108H260M252 102L260 108L252 114" className="visual-line"/>
      <text x="125" y="30" textAnchor="middle">K</text><text x="355" y="30" textAnchor="middle">K°</text>
      <text x="125" y="193" textAnchor="middle" className="visual-label">Area 4</text><text x="355" y="193" textAnchor="middle" className="visual-label">Area 2</text>
    </>}
    {kind==='unit-distance' && <>
      <path d="M155 170L325 170L240 22.776Z" className="visual-line"/>
      <circle cx="155" cy="170" r="12" fill="#18528a"/><circle cx="325" cy="170" r="12" fill="#b65d28"/><circle cx="240" cy="22.776" r="12" fill="#507554"/>
      <text x="178" y="93" textAnchor="middle">1</text><text x="302" y="93" textAnchor="middle">1</text><text x="240" y="200" textAnchor="middle">1</text>
    </>}
  </svg>;
}
