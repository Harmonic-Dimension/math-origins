import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('one-sided inverses show the changed coordinate when operation order is reversed',async({page},testInfo)=>{
  await page.goto('/problems/197');
  const output=()=>page.locator('.inverse-graphic [data-row="2"]').evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('data-value'))));
  expect(await output()).toEqual([1,0,1,1,0]);
  const reverse=page.getByRole('button',{name:'Remove, then insert',exact:true});
  await reverse.focus();await page.keyboard.press('Enter');
  await expect(reverse).toHaveAttribute('aria-pressed','true');
  expect(await output()).toEqual([0,0,1,1,0]);
  await expect(page.locator('.figure-feedback')).toContainText('lost entry cannot be recovered');
  await expect(page.locator('.figure-insight')).toContainText('one-sided sequence space');
  await page.getByRole('button',{name:'Insert, then remove',exact:true}).click();
  expect(await output()).toEqual([1,0,1,1,0]);
  await page.locator('#question summary').click();
  await expect(page.locator('#question .katex-error')).toHaveCount(0);
  await page.locator('.time-row').last().click();
  await expect(page.locator('.event-detail .event-sources a')).toHaveCount(5);
  await expect(page.locator('.claim-panel')).toContainText('one specified odd prime');
  await page.screenshot({path:'screenshots/direct-finiteness-'+testInfo.project.name+'.png',fullPage:true});
});

test('spin controls show every assignment and keep the energy and bonds consistent',async({page},testInfo)=>{
  await page.goto('/problems/221');
  let previous=[1,-1,1];
  for(const bits of [0,1,2,3,4,5,6,7]){
    const spins=Array.from({length:3},(_,i)=>bits&(1<<i)?1:-1);
    for(let i=0;i<3;i++)if(spins[i]!==previous[i]){
      const button=page.getByRole('button',{name:new RegExp('^Spin '+['A','B','C'][i]+':')});
      await button.focus();await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed',String(spins[i]===1));
    }
    previous=spins;
    const drawn=await page.locator('.spin-graphic [data-spin]').evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('data-spin'))));
    expect(drawn).toEqual(spins);
    const satisfied=Number(spins[0]!==spins[1])+Number(spins[1]!==spins[2])+Number(spins[2]!==spins[0]);
    const energy=3-2*satisfied;
    await expect(page.locator('.spin-bond[data-satisfied="true"]')).toHaveCount(satisfied);
    await expect(page.locator('.spin-bond.conflict-edge')).toHaveCount(3-satisfied);
    await expect(page.locator('.spin-graphic')).toContainText(`${satisfied}/3 bonds satisfied · H = ${energy}`);
  }
  await page.locator('#question summary').click();
  await expect(page.locator('#question .katex-error')).toHaveCount(0);
  await expect(page.locator('#question .katex-display')).toHaveCount(2);
  await page.locator('.time-row').last().click();
  await expect(page.locator('.event-detail')).toContainText('Poisson even-arity');
  await expect(page.locator('.event-detail .event-sources a')).toHaveCount(2);
  await page.screenshot({path:'screenshots/spin-glass-'+testInfo.project.name+'.png',fullPage:true});
});

test('prime progressions keep equal integer gaps and explain their finite scope',async({page},testInfo)=>{
  await page.goto('/problems/159');
  const drawn=await page.locator('.progression-graphic circle').evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('data-value'))));
  const primes=Array.from({length:23},(_,i)=>i+2).filter(n=>!Array.from({length:Math.floor(Math.sqrt(n))-1},(_,i)=>i+2).some(d=>n%d===0));
  expect(drawn).toEqual(primes);
  for(const {label,terms,gap} of [{label:'Three terms',terms:[3,5,7],gap:2},{label:'Four terms',terms:[5,11,17,23],gap:6}]){
    const button=page.getByRole('button',{name:label,exact:true});
    await button.focus();await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed','true');
    const points=await page.locator('.progression-term').evaluateAll(nodes=>nodes.map(n=>({value:Number(n.getAttribute('data-value')),x:Number(n.getAttribute('cx'))})));
    expect(points.map(p=>p.value)).toEqual(terms);
    for(let i=1;i<points.length;i++){
      expect(points[i].value-points[i-1].value).toBe(gap);
      expect(points[i].x-points[i-1].x).toBe(17*gap);
    }
  }
  await expect(page.locator('.figure-feedback')).toContainText('add 6 each time');
  await expect(page.locator('.figure-insight')).toContainText('A finite drawing cannot establish');
  await page.locator('#question summary').click();
  await expect(page.locator('#question .katex-error')).toHaveCount(0);
  await expect(page.locator('#question .katex-display')).toHaveCount(2);
  await page.locator('.time-row').last().click();
  await expect(page.locator('.event-detail')).toContainText('every fixed length');
  await expect(page.locator('.event-detail .event-sources a')).toHaveCount(2);
  await page.screenshot({path:'screenshots/erdos-reciprocal-'+testInfo.project.name+'.png',fullPage:true});
});

test('geometric copies preserve a common ratio under translation and reflection',async({page},testInfo)=>{
  await page.goto('/problems/084');
  const placements=[{label:'Original sequence',limit:0,first:0.5},{label:'Move & shrink',limit:0.25,first:0.5},{label:'Reflect',limit:0.75,first:0.5}];
  for(const placement of placements){
    const button=page.getByRole('button',{name:placement.label,exact:true});
    await button.focus();await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed','true');
    const points=await page.locator('.geometric-graphic circle').evaluateAll(nodes=>nodes.map(n=>(Number(n.getAttribute('cx'))-48)/384));
    expect(points).toHaveLength(5);
    expect(points[0]).toBe(placement.first);
    for(let i=1;i<points.length;i++) expect((points[i]-placement.limit)/(points[i-1]-placement.limit)).toBeCloseTo(0.5);
    const limit=page.locator('.geometric-graphic .sequence-limit');
    expect((Number(await limit.getAttribute('x'))+3-48)/384).toBe(placement.limit);
  }
  await expect(page.locator('.figure-feedback')).toContainText('negative scale reflects');
  await page.getByRole('button',{name:'Original sequence',exact:true}).click();
  await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();});
  await page.screenshot({path:'screenshots/erdos-similarity-'+testInfo.project.name+'.png',fullPage:true});
});

test('exact examples are operable by keyboard and chronology reveals sources',async({page})=>{
  await page.goto('/problems/158');
  const conflict=page.getByRole('button',{name:'Introduce a conflict',exact:true});
  await conflict.focus();await page.keyboard.press('Enter');
  await expect(conflict).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.conflict-edge')).not.toHaveCount(0);
  await expect(page.locator('.figure-feedback')).toContainText('break the rule');
  await page.getByRole('button',{name:'Valid coloring',exact:true}).click();
  await expect(page.locator('.conflict-edge')).toHaveCount(0);
  const claim=page.locator('.time-row').last();
  await claim.focus();await page.keyboard.press('Space');
  await expect(claim).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.event-detail')).toContainText('Supporting sources');
  await expect(page.locator('.event-detail .eyebrow')).toHaveText('2026 AI claim');
  await expect(page.locator('.time-approximate')).toHaveCount(1);
  await page.goto('/problems/087');
  const disk=page.getByRole('button',{name:'Unit disk',exact:true});
  await disk.focus();await page.keyboard.press('Space');
  await expect(page.locator('.area-product')).toContainText('π × π = π²');
  await expect(page.locator('circle.visual-body')).toHaveCount(1);
  await page.getByRole('button',{name:'Square & diamond',exact:true}).click();
  await expect(page.locator('.area-product')).toContainText('4 × 2 = 8');
  await expect(page.locator('polygon.visual-polar')).toHaveCount(1);
  await page.goto('/problems/004');
  await expect(page.locator('.domain-comparison')).toContainText('No solution');
  await expect(page.locator('.historical-figure img')).toHaveAttribute('alt',/David Hilbert/);
  await expect(page.locator('.historical-figure .image-credit')).toContainText('Public domain');
});

test('main pages and expanded explanations pass automated accessibility checks',async({page})=>{
  test.setTimeout(90000);
  for(const route of ['/','/explorer','/problems/158','/problems/087','/problems/004','/problems/084','/problems/159','/problems/197','/problems/221','/about','/article']){
    await page.goto(route);await page.evaluate(()=>document.fonts.ready);
    if(route.startsWith('/problems/')){
      await page.locator('#question summary').click();
      await page.locator('.relationship-disclosure summary').click();
    }
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),route).toEqual([]);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBeTruthy();
  }
});

test('enlarged text and reduced motion remain usable',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const route of ['/','/explorer','/problems/158','/problems/087','/problems/004','/problems/084','/problems/159','/problems/197','/problems/221']){
    await page.goto(route);
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBeTruthy();
    await expect(page.locator('h1')).toBeVisible();
  }
  await page.goto('/');
  expect(await page.locator('.case-card').first().evaluate(n=>getComputedStyle(n).transitionDuration)).toBe('0s');
});
