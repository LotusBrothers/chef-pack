import {execFileSync} from 'node:child_process';
const [base,head]=process.argv.slice(2);
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'});
function fail(message){throw new Error(message);}
if(!base||!head)fail('Usage: node scripts/check-frontend-report.mjs <base> <head>');
const r=JSON.parse(git('show',head+':reports/frontend/current.json'));
const feedback=git('show',head+':feedback.md').trim();
const ids=['CATALOG','SIGNIN','OPEN','RETRY','WALLET','ISOLATION','ERROR','MOCK-SAFETY','VISUAL'];
if(r.schema_version!==1||!['integration','visual'].includes(r.scope))fail('Invalid report version/scope');
if(r.readiness!=='ready')fail('Frontend handoff is blocked; record the blocker and keep the PR draft');
if(!/^[a-f0-9]{40}$/.test(r.tested_commit||''))fail('tested_commit must be a full commit SHA');
if(r.base_commit!==git('rev-parse',base).trim())fail('Report does not include current main');
git('merge-base','--is-ancestor',base,r.tested_commit);
git('merge-base','--is-ancestor',r.tested_commit,head);
const changed=git('diff','--name-only',r.tested_commit,head).trim().split('\n').filter(Boolean);
if(changed.some(p=>p!=='feedback.md'&&!p.startsWith('reports/frontend/')))fail('Code changed after evaluation; rerun tests and update tested_commit');
if(!/^https:\/\//.test(r.preview_url||'')||!r.summary?.trim()||feedback.length<100)fail('Missing preview, summary, or feedback');
if(!Array.isArray(r.cases)||r.cases.length!==ids.length||new Set(r.cases.map(c=>c.id)).size!==ids.length)fail('Report must contain every acceptance case exactly once');
for(const id of ids){
 const c=r.cases.find(c=>c.id===id);
 if(!c||!['pass','fail','blocked','not_run'].includes(c.status)||!Array.isArray(c.evidence)||c.evidence.some(e=>typeof e!=='string'||!e.trim()))fail('Invalid case '+id);
 const required=r.scope==='integration'||['VISUAL','MOCK-SAFETY'].includes(id);
 if(required&&(c.status!=='pass'||!c.evidence.length))fail('Required case needs PASS with evidence: '+id);
 if(!required&&c.status!=='pass'&&!c.notes?.trim())fail('Explain unchanged/not-run case '+id);
}
console.log('Frontend report is complete and tied to the tested code. Review its evidence before merging.');
