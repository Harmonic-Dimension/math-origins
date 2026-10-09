// Finitely supported sequences model infinite coordinates; trailing zeros are
// implicit. Keeping every supplied coordinate avoids a truncation at the right.
export function insertZero(sequence: readonly number[]) {
  return [0, ...sequence];
}
export function removeFirst(sequence: readonly number[]) {
  return sequence.slice(1);
}
const input = [1, 0, 1, 1];

export function DirectFinitenessGraphic({reverse=false,thumbnail=false}:{reverse?:boolean;thumbnail?:boolean}) {
  const intermediate = reverse ? removeFirst(input) : insertZero(input);
  const output = reverse ? insertZero(intermediate) : removeFirst(intermediate);
  const rows = [input, intermediate, output];
  const labels = ['Start', reverse ? 'Remove first' : 'Insert zero', reverse ? 'Insert zero' : 'Remove first'];
  return <svg className="visual-explainer inverse-graphic" viewBox="0 0 480 310" role={thumbnail?undefined:'img'} aria-hidden={thumbnail||undefined} aria-label={thumbnail?undefined:reverse?'An infinite sequence starts 1, 0, 1, 1. Removing the first entry then inserting zero leaves 0, 0, 1, 1. The original first entry is lost.':'An infinite sequence starts 1, 0, 1, 1. Inserting zero then removing the first entry returns the original sequence. Infinitely many coordinates continue beyond the drawing.'}>
    <text x="240" y="34" textAnchor="middle" className="visual-equation">{reverse?'ST ≠ I · the first entry is lost':'TS = I · the sequence returns'}</text>
    {rows.map((row,i)=><g key={i}>
      <text x="20" y={87+i*82} className="visual-label">{labels[i]}</text>
      {Array.from({length:5},(_,j)=>{
        const changed = reverse && i===2 && j===0;
        return <g key={j}><rect x={171+j*51} y={61+i*82} width="39" height="39" rx="2" fill={changed?'#f5e5da':row[j]?'#d9e6f2':'#f5f7f9'} stroke={changed?'#a34e25':'#8aa0b4'} strokeWidth={changed?2:1}/><text x={190.5+j*51} y={87+i*82} textAnchor="middle" className="visual-label" data-row={i} data-coordinate={j} data-value={row[j]||0}>{row[j]||0}</text></g>;
      })}
      <text x="443" y={87+i*82} className="visual-label">…</text>
      {i<2&&<path d={`M240 ${109+i*82}v23m-5-5 5 5 5-5`} className="visual-line"/>}
    </g>)}
    <text x="240" y="298" textAnchor="middle" className="visual-label">Five coordinates shown · infinitely many continue</text>
  </svg>;
}
