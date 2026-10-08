import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { cases } from './data';
import { pageMetadata } from './metadata';
export const routes=['/','/explorer','/article','/about',...cases.map(s=>'/problems/'+s.history.familyId)];
export function render(path:string) {
  return {html:renderToString(<StaticRouter location={path}><App/></StaticRouter>),...pageMetadata(path)};
}
