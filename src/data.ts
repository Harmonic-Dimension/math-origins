import snapshot from '../data/selected-catalogue.json';
import { caseSchema, familySchema, provenanceSchema, validateNarrative, type CaseRecord, type Family } from './schema';
const catalogue = { provenance: provenanceSchema.parse(snapshot.provenance), families: snapshot.families.map(f => familySchema.parse(f)) };
const records = import.meta.glob<CaseRecord>('../content/cases/*.json', { eager: true, import: 'default' });
const prose = import.meta.glob<string>('../content/cases/*.md', { eager: true, query: '?raw', import: 'default' });
export const provenance = catalogue.provenance;
export const cases = Object.entries(records).map(([path, record]) => {
  const history = caseSchema.parse(record);
  const family = catalogue.families.find(f => f.familyId === history.familyId);
  if (!family) throw new Error('Unknown catalogue family: ' + history.familyId);
  const narrative = prose[path.replace('.json', '.md')];
  if (narrative === undefined) throw new Error('Missing Markdown narrative for ' + history.familyId);
  validateNarrative(history, narrative);
  return { history, family, narrative };
}).sort((a,b) => a.history.familyId.localeCompare(b.history.familyId));
export type Study = { history: CaseRecord; family: Family; narrative: string };
export function caseTitle(study: Study) { return study.history.displayTitle || study.family.title; }
export function caseField(study: Study) { return study.history.discipline || study.family.discipline; }
export const scopeLabels: Record<string,string> = {
  'full-resolution': 'Full resolution', 'special-case': 'Special case',
  'quantitative-improvement': 'Quantitative improvement', counterexample:'Counterexample', other:'Other result', unclassified:'Unclassified',
};
export const eventLabels: Record<string,string> = {
  background:'Foundational background', predecessor:'Direct predecessor', formulation:'Explicit formulation',
  reformulation:'Reformulation', 'partial-result':'Partial result', 'ai-claim':'2026 AI claim',
};
export const statusLabels: Record<string,string> = { 'research-pending':'Research pending', draft:'Editorial draft', published:'Historical account available' };
export const patternLabels: Record<string,string> = {
  'conceptual-development':'Conceptual development', 'changing-formulations':'Changing formulations', 'multiple-origins':'Multiple origins',
  'cross-disciplinary':'Cross-disciplinary', 'stronger-bounds':'Stronger bounds', counterexample:'Counterexample', 'named-conjecture':'Named conjecture',
};
export function filterStudies(studies:Study[], filters:{query:string;field:string;scope:string;tag:string;status:string}) {
  const query=filters.query.trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  return studies.filter(s=>{
    const haystack=[s.history.familyId,caseTitle(s),caseField(s),s.family.releaseSummary,...s.history.contributors.map(p=>p.name),...s.history.tags.map(t=>patternLabels[t])].join(' ').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    return haystack.includes(query) && (!filters.field || caseField(s)===filters.field) && (!filters.scope || s.history.scope.types.includes(filters.scope as typeof s.history.scope.types[number])) && (!filters.tag || s.history.tags.includes(filters.tag as typeof s.history.tags[number])) && (!filters.status || s.history.status===filters.status);
  });
}
