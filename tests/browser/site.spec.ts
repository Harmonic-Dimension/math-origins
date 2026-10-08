import { readFileSync, readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
const records=readdirSync('content/cases').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync('content/cases/'+f,'utf8')));
const catalogue=JSON.parse(readFileSync('data/catalogue.json','utf8'));
const total=records.length;
const combinatoricsCount=records.filter(r=>(r.discipline||catalogue.families.find((f:any)=>f.familyId===r.familyId).discipline)==='Combinatorics').length;
test('explorer searches, combines filters, preserves URL state and resets',async({page})=>{
  await page.goto('/explorer');
  await expect(page.locator('main')).toHaveAttribute('data-interactive','true');
  await expect(page.locator('.case-card')).toHaveCount(total);
  await page.getByLabel('Search the collection').fill('reciprocal-sum');
  await expect(page.locator('.case-card')).toHaveCount(1);
  await page.getByLabel('Reported result').selectOption('quantitative-improvement');
  await expect(page.locator('.case-card')).toHaveCount(1);
  await expect(page).toHaveURL(/scope=quantitative-improvement/);
  await page.reload();
  await expect(page.locator('.case-card')).toHaveCount(1);
  await page.getByRole('button',{name:'Clear filters'}).click();
  await expect(page.locator('.case-card')).toHaveCount(total);
  await expect(page.getByLabel('Search the collection')).toHaveValue('');
  await page.getByLabel('Discipline',{exact:true}).selectOption('Combinatorics');
  await expect(page.locator('.case-card')).toHaveCount(combinatoricsCount);
  await page.getByLabel('Search the collection').fill('no-such-question-9f308a');
  await expect(page.getByRole('heading',{name:'No questions match these filters.'})).toBeVisible();
  await page.getByRole('button',{name:'Show all questions'}).click();
  await expect(page.locator('.case-card')).toHaveCount(total);
  await page.getByLabel('Historical pattern').selectOption('changing-formulations');
  await expect(page.locator('.case-card').filter({hasText:'№ 004'})).toHaveCount(1);
  await page.getByLabel('Editorial status').selectOption('published');
  await expect(page.locator('.case-card').filter({hasText:'History pending'})).toHaveCount(0);
});
test('all requested cases have usable timelines, provenance and manuscript links',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(const id of ['004','087','158','084','102','159','197','221','268','304']){
    await page.goto('/problems/'+id);
    await expect(page.locator('main')).toHaveAttribute('data-interactive','true');
    await expect(page.locator('h1')).toHaveCount(1);
    const record=JSON.parse(readFileSync('content/cases/'+id+'.json','utf8'));
    await expect(page.locator('.status-chip')).toHaveText(record.status==='published'?'Historical account available':record.status==='draft'?'Editorial draft':'Research pending');
    await expect(page.locator('.manuscript-list a').first()).toHaveAttribute('href',new RegExp('blob/'+catalogue.provenance.commitSha+'/preprints/'));
    const claimIndex=record.events.findIndex((e:any)=>e.type==='ai-claim');
    const event=page.locator('.event-list button').nth(claimIndex);
    await event.focus();await page.keyboard.press('Enter');
    await expect(event).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('.event-detail h3')).toHaveText(record.events[claimIndex].title);
    await expect(page.locator('.event-detail .event-sources a')).toHaveCount(record.events[claimIndex].sourceIds.length);
    await expect(page).toHaveTitle(/Before the Proof/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
  }
  expect(errors).toEqual([]);
});
test('navigation, essay and unknown routes work',async({page})=>{
  await page.goto('/');
  await page.getByRole('link',{name:'Explore the questions',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Follow the questions.'})).toBeVisible();
  await page.getByRole('link',{name:'Essay',exact:true}).click();
  await expect(page.getByRole('heading',{name:'A question is not a fixed object'})).toBeVisible();
  await page.getByRole('link',{name:'About & methodology',exact:true}).click();
  await expect(page.locator('.provenance-list')).toContainText('372 families');
  await page.goto('/problems/999');
  await expect(page.getByRole('heading',{name:'A question for another page.'})).toBeVisible();
});
test('static pages have individual metadata and remain readable without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/problems/004/');
  const record=JSON.parse(readFileSync('content/cases/004.json','utf8'));
  await expect(page.getByRole('heading',{name:record.displayTitle||'Hilbert’s tenth problem over ℚ',exact:true})).toBeVisible();
  await expect(page).toHaveTitle((record.displayTitle||'Hilbert’s tenth problem over ℚ')+' — Before the Proof');
  await expect(page.locator('.manuscript-list a').first()).toBeVisible();
  await page.goto('http://127.0.0.1:4173/article/');
  await expect(page.getByRole('heading',{name:'The work of asking'})).toBeVisible();
  await context.close();
});
test('the main surfaces fit the viewport',async({page},testInfo)=>{
  for(const route of ['/','/explorer','/article','/about']){
    await page.goto(route);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),route).toBeTruthy();
  }
  await page.goto('/');
  await page.screenshot({path:'test-results/landing-'+testInfo.project.name+'.png',fullPage:true});
});
