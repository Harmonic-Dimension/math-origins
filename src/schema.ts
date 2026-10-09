import { z } from 'zod';

export const scopeTypes = ['full-resolution', 'special-case', 'quantitative-improvement', 'counterexample', 'other', 'unclassified'] as const;
export const eventTypes = ['background', 'predecessor', 'formulation', 'reformulation', 'partial-result', 'ai-claim'] as const;
export const patternTags = ['conceptual-development', 'changing-formulations', 'multiple-origins', 'cross-disciplinary', 'stronger-bounds', 'counterexample', 'named-conjecture'] as const;
const id = z.string().regex(/^\d{3}$/);
const text = z.string().trim().min(1);
const url = z.url().refine(s => /^https?:\/\//.test(s), 'Use an HTTP(S) source URL');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => {
  const date = new Date(s);
  return !isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === s;
}, 'Invalid calendar date');
export const sourceSchema = z.object({ id: text, title: text, url, citation: text, kind: z.enum(['primary', 'secondary', 'upstream']), note: z.string() }).strict();
export const dateSchema = z.discriminatedUnion('precision', [
  z.object({ precision: z.literal('exact'), label: text, year: z.number().int(), iso: isoDate.optional() }).strict(),
  z.object({ precision: z.literal('approximate'), label: text, year: z.number().int() }).strict(),
  z.object({ precision: z.literal('range'), label: text, start: z.number().int(), end: z.number().int() }).strict().refine(d => d.start <= d.end, 'Date range is reversed'),
  z.object({ precision: z.literal('unknown'), label: text }).strict(),
]).superRefine((d, ctx) => {
  if (d.precision === 'exact' && d.iso && Number(d.iso.slice(0, 4)) !== d.year) ctx.addIssue({code:'custom', message:'ISO date and year disagree'});
});
export const eventSchema = z.object({
  id: text, date: dateSchema, type: z.enum(eventTypes), title: text,
  description: text, sourceIds: z.array(text).min(1), follows: z.array(text),
  relationNote: z.string(), uncertainty: z.string(),
}).strict();
export const caseSchema = z.object({
  familyId: id, status: z.enum(['research-pending', 'draft', 'published']),
  displayTitle: text.nullable(), discipline: text.nullable(),
  scope: z.object({ types: z.array(z.enum(scopeTypes)).min(1), note: text, sourceUrl: url, classificationStatus: z.enum(['provisional', 'reviewed']) }).strict(),
  originalQuestion: text.nullable(), modernQuestion: text.nullable(), questionDifference: text.nullable(),
  questionPlainLanguage: text.nullable().default(null), questionFormal: text.nullable().default(null),
  questionSummary: text.nullable().default(null), claimSummary: text.nullable().default(null),
  whyItMatters: text.nullable().default(null), illustrativeExample: text.nullable().default(null),
  historicalHook: text.nullable().default(null), whatAIClaims: text.nullable().default(null), whatRemainsOpen: text.nullable().default(null),
  visualExplainer: z.enum(['rational-solutions', 'polar-dual', 'unit-distance', 'geometric-sequence', 'arithmetic-progressions', 'spin-glass', 'direct-finiteness']).nullable().default(null),
  historicalImages: z.array(z.object({src:text,alt:text,caption:text,credit:text,sourceUrl:url,originalUrl:url,license:text,licenseUrl:url}).strict()).default([]),
  explanationSourceIds: z.array(text).default([]), claimSourceIds: z.array(text).default([]),
  conceptualOrigins: dateSchema.nullable(), firstFormulation: dateSchema.nullable(),
  attribution: text.nullable(), contributors: z.array(z.object({ name: text, contribution: text, sourceIds: z.array(text).min(1) }).strict()),
  tags: z.array(z.enum(patternTags)), confidence: z.enum(['unresearched', 'low', 'moderate', 'high']),
  uncertainty: text, sources: z.array(sourceSchema), events: z.array(eventSchema),
  lastEditorialUpdate: isoDate,
}).strict().superRefine((c, ctx) => {
  const sources = new Set(c.sources.map(s => s.id));
  const events = new Map(c.events.map(e => [e.id, e]));
  const fail = (message: string) => ctx.addIssue({code:'custom', message});
  if (sources.size !== c.sources.length) fail('Duplicate source IDs');
  if (events.size !== c.events.length) fail('Duplicate event IDs');
  for (const event of c.events) {
    for (const source of event.sourceIds) if (!sources.has(source)) fail('Unknown source ' + source + ' on ' + event.id);
    for (const parent of event.follows) if (!events.has(parent) || parent === event.id) fail('Invalid predecessor ' + parent);
  }
  for (const p of c.contributors) for (const source of p.sourceIds) if (!sources.has(source)) fail('Unknown contributor source ' + source);
  for (const source of [...c.explanationSourceIds, ...c.claimSourceIds]) if (!sources.has(source)) fail('Unknown explanation or claim source ' + source);
  const visiting = new Set<string>(), visited = new Set<string>();
  function visit(eventId: string) {
    if (visiting.has(eventId)) { fail('Timeline contains a cycle'); return; }
    if (visited.has(eventId)) return;
    visiting.add(eventId);
    for (const parent of events.get(eventId)?.follows || []) visit(parent);
    visiting.delete(eventId); visited.add(eventId);
  }
  for (const e of c.events) visit(e.id);
  if (c.status === 'published') {
    for (const key of ['originalQuestion', 'modernQuestion', 'questionDifference', 'attribution', 'conceptualOrigins', 'firstFormulation', 'questionPlainLanguage', 'questionFormal', 'whyItMatters', 'historicalHook', 'whatAIClaims', 'whatRemainsOpen'] as const) if (!c[key]) fail('Published cases require ' + key);
    if (!c.explanationSourceIds.length || !c.claimSourceIds.length) fail('Published cases require sources for explanations and AI claims');
    if (!c.sources.some(s => s.kind !== 'upstream')) fail('Published cases need historical sources');
    if (!c.events.some(e => e.type !== 'ai-claim')) fail('Published cases need historical events');
    if (!c.contributors.length || c.confidence === 'unresearched') fail('Published cases need attribution and assessed confidence');
  }
});
export const familySchema = z.object({
  familyId: id, title: text, overviewTitleTex: text, discipline: text,
  releaseSummary: text, overviewSummaryTex: text, sourceUrl: url,
  manuscripts: z.array(z.object({ title: text, url, abstract: z.string() }).strict()).min(1),
}).strict();
export const provenanceSchema = z.object({
  repository: z.literal('https://github.com/openai/math'), commitSha: z.string().regex(/^[a-f0-9]{40}$/),
  importedAt: z.iso.datetime(), releaseDate: isoDate,
  files: z.array(z.object({path:text, sha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict()).min(2),
  familyCount: z.number().int().positive(), manuscriptCount: z.number().int().positive(),
}).strict();
export const catalogueSchema = z.object({ provenance: provenanceSchema, families: z.array(familySchema) }).strict().superRefine((c, ctx) => {
  const fail = (message:string) => ctx.addIssue({code:'custom',message});
  if (new Set(c.families.map(f=>f.familyId)).size !== c.families.length) fail('Duplicate family IDs');
  if(c.families.length !== c.provenance.familyCount) fail('Family count mismatch');
  if(c.families.reduce((n,f)=>n+f.manuscripts.length,0) !== c.provenance.manuscriptCount) fail('Manuscript count mismatch');
});
export type CaseRecord = z.infer<typeof caseSchema>;
export type Family = z.infer<typeof familySchema>;
export type TimelineEvent = z.infer<typeof eventSchema>;
export type HistoricalDate = z.infer<typeof dateSchema>;
export function validateNarrative(record: CaseRecord, narrative: string) {
  if(record.status === 'published') {
    const words = narrative.trim().split(/\s+/).filter(Boolean).length;
    if(words < 120 || words > 200) throw new Error(record.familyId + ': published narrative must contain 120–200 words (found ' + words + ')');
  }
}
