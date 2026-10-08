import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
  for(const route of ['/','/explorer','/problems/158','/problems/087','/problems/004','/about','/article']){
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
  for(const route of ['/','/explorer','/problems/158','/problems/087','/problems/004']){
    await page.goto(route);
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBeTruthy();
    await expect(page.locator('h1')).toBeVisible();
  }
  await page.goto('/');
  expect(await page.locator('.case-card').first().evaluate(n=>getComputedStyle(n).transitionDuration)).toBe('0s');
});
