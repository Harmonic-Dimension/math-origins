// Exact triangular lattice; distances are evaluated in mathematical units.
export const latticePoints = Array.from({length:9}, (_,k) => {
  const i=k%3,j=Math.floor(k/3);
  return {x:i+j/2,y:j*Math.sqrt(3)/2,color:(i+2*j)%3};
});
export const unitEdges=latticePoints.flatMap((a,i)=>latticePoints.flatMap((b,j)=>j>i && Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-1)<1e-10?[[i,j] as const]:[]));
export const squareVertices=[[-1,-1],[1,-1],[1,1],[-1,1]] as const;
export const polarVertices=[[0,-1],[1,0],[0,1],[-1,0]] as const;

// Three antiferromagnetic bonds, J=-1; H=-Σ Jᵢⱼσᵢσⱼ.
export const spinBonds=[[0,1],[1,2],[2,0]] as const;
export function triangleEnergy(spins: readonly number[]) {
  return spinBonds.reduce((energy,[i,j])=>energy+spins[i]*spins[j],0);
}
