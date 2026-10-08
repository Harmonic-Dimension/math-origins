import test from 'node:test';
import assert from 'node:assert/strict';
import {latticePoints,unitEdges,squareVertices,polarVertices} from '../src/components/geometry.ts';
import {dateExtent,datePosition} from '../src/components/date-scale.ts';

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
