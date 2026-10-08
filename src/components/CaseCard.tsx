import { Link } from 'react-router-dom';
import { caseTitle, caseField, scopeLabels, type Study } from '../data';
export default function CaseCard({study}:{study:Study}) {
  return <Link to={'/problems/'+study.history.familyId} className="case-card">
    <div className="card-top"><span className="family-number">№ {study.history.familyId}</span><span>{caseField(study)}</span></div>
    <h3>{caseTitle(study)}</h3>
    <div className="card-bottom"><span>{study.history.scope.types.map(t=>scopeLabels[t]).join(' · ')}</span><span className="pending-label">{study.history.status==='published'?'Read the history':study.history.status==='draft'?'Editorial draft':'History pending'}</span></div>
  </Link>;
}
