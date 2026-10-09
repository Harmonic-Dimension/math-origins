import test from 'node:test';
import assert from 'node:assert/strict';
import {latticePoints,unitEdges,squareVertices,polarVertices,triangleEnergy} from '../src/components/geometry.ts';
import {dateExtent,datePosition} from '../src/components/date-scale.ts';
import {insertZero,removeFirst} from '../src/components/DirectFinitenessGraphic.tsx';
import {spinOneBondLevels} from '../src/components/HaldaneGapGraphic.tsx';

test('the two-spin spectrum matches the independent spin-one matrix interaction',()=>{
  const basis=Array.from({length:9},(_,i)=>[Math.floor(i/3)-1,i%3-1]);
  // In the Sᶻ basis, the ladder contribution to an allowed exchange is 1.
  const q=basis.map(([m,n],i)=>basis.map(([a,b],j)=>i===j?m*n:
    Math.abs(a-m)===1 && a-m===n-b?1:0));
  const multiply=(a:number[][],b:number[][])=>a.map(row=>b[0].map((_,j)=>row.reduce((sum,x,k)=>sum+x*b[k][j],0)));
  const identity=basis.map((_,i)=>basis.map((_,j)=>Number(i===j)));
  const shift=(offset:number)=>q.map((row,i)=>row.map((v,j)=>v+offset*Number(i===j)));
  const polynomial=multiply(multiply(shift(2),shift(1)),shift(-1));
  assert.ok(polynomial.every(row=>row.every(x=>x===0)));
  let power=identity;
  for(let k=0;k<=4;k++){
    const trace=power.reduce((sum,row,i)=>sum+row[i],0);
    assert.equal(trace,spinOneBondLevels.reduce((sum,l)=>sum+l.multiplicity*l.energy**k,0));
    power=multiply(power,q);
  }
});

test('infinite sequence shifts have a left inverse and a reverse defect on the first basis vector',()=>{
  // Test basis vectors at different positions, including beyond the five drawn
  // coordinates. Trailing zeros represent the rest of the infinite sequence.
  for(let k=0;k<12;k++){
    const basis=Array.from({length:k+1},(_,i)=>Number(i===k));
    const ts=removeFirst(insertZero(basis));
    const st=insertZero(removeFirst(basis));
    for(let i=0;i<14;i++){
      assert.equal(ts[i]||0,Number(i===k));
      assert.equal(st[i]||0,Number(k>0&&i===k));
    }
  }
});

test('the frustrated triangle has six low-energy states and the displayed partition function',()=>{
  const energies=Array.from({length:8},(_,bits)=>{
    const spins=Array.from({length:3},(_,i)=>bits&(1<<i)?1:-1);
    const conflicts=Number(spins[0]===spins[1])+Number(spins[1]===spins[2])+Number(spins[2]===spins[0]);
    assert.ok(conflicts>=1); // An odd cycle cannot have every pair opposite.
    assert.equal(triangleEnergy(spins),2*conflicts-3);
    return triangleEnergy(spins);
  });
  assert.equal(energies.filter(h=>h===-1).length,6);
  assert.equal(energies.filter(h=>h===3).length,2);
  for(const beta of [0,0.5,1,2]){
    const enumerated=energies.reduce((z,h)=>z+Math.exp(-beta*h),0);
    assert.ok(Math.abs(enumerated-(6*Math.exp(beta)+2*Math.exp(-3*beta)))<1e-10);
  }
});

test('all and only unit-distance pairs are drawn, and the displayed coloring is valid',()=>{
  for(let i=0;i<latticePoints.length;i++)for(let j=i+1;j<latticePoints.length;j++){
    const a=latticePoints[i],b=latticePoints[j];
    const unit=Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-1)<1e-10;
    assert.equal(unitEdges.some(([u,v])=>u===i&&v===j),unit);
    if(unit)assert.notEqual(a.color,b.color);
  }
  assert.ok(unitEdges.some(([a,b])=>a===0&&b===1));
  assert.equal(latticePoints[0].color,0); // Giving point 1 color 0 creates a real conflict.
});

test('the diamond is the exact polar of the centered square and the area product is eight',()=>{
  for(const [u,v] of polarVertices){
    const supports=squareVertices.map(([x,y])=>u*x+v*y);
    assert.equal(Math.max(...supports),1);
    assert.equal(Math.abs(u)+Math.abs(v),1);
  }
  // Shoelace formula, independently evaluated from the drawn vertices.
  const area=(points:readonly (readonly [number,number])[])=>Math.abs(points.reduce((sum,[x,y],i)=>{const [u,v]=points[(i+1)%points.length];return sum+x*v-y*u;},0))/2;
  assert.equal(area(squareVertices),4);assert.equal(area(polarVertices),2);
  assert.equal(area(squareVertices)*area(polarVertices),8);
});

test('time positions preserve elapsed time, date ranges, approximate dates and unknowns',()=>{
  assert.equal(datePosition(1950,1900,2026),100*50/126);
  assert.equal(datePosition(2026,1900,2026),100);
  assert.deepEqual(dateExtent({precision:'range',start:1961,end:1970,label:'1961–1970'}),[1961,1970]);
  assert.deepEqual(dateExtent({precision:'approximate',year:1950,label:'c. 1950'}),[1950,1950]);
  assert.equal(dateExtent({precision:'unknown',label:'Unlocated'}),null);
  assert.equal(datePosition(2026,2026,2026),50);
});
