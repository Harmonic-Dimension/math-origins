import { Link } from 'react-router-dom';
import { caseTitle, caseField, scopeLabels, type Study } from '../data';
import VisualExplainer from './VisualExplainer';
export default function CaseCard({study}:{study:Study}) {
  return <Link to={'/problems/'+study.history.familyId} className={'case-card '+(study.history.visualExplainer?'story-card motif-'+study.history.visualExplainer:'pending-card')}>
    <div className="card-top"><span className="family-number">№ {study.history.familyId}</span><span>{caseField(study)}</span></div>
    {study.history.visualExplainer && <VisualExplainer kind={study.history.visualExplainer} thumbnail/>}
    <h3>{caseTitle(study)}</h3>
    {study.history.questionPlainLanguage && <p className="card-question">{study.history.questionSummary || study.history.questionPlainLanguage}</p>}
    {study.history.historicalHook && <p className="card-hook">{study.history.historicalHook}</p>}
    <div className="card-bottom"><span>OpenAI reports: {study.history.claimSummary || study.history.scope.types.map(t=>scopeLabels[t].toLowerCase()).join(' · ')}</span><span className="pending-label">{study.history.status==='published'?'Read the history':study.history.status==='draft'?'Editorial draft':'History pending'}</span></div>
  </Link>;
}
