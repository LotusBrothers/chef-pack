import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';
const checker=fileURLToPath(new URL('../../scripts/check-frontend-report.mjs',import.meta.url));
function fixture(){
 const cwd=mkdtempSync(resolve('../handoff-report-test-'));
 const git=(...args)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 git('init');git('config','user.name','Report fixture');git('config','user.email','fixture@example.invalid');
 writeFileSync(resolve(cwd,'app.html'),'base');git('add','.');git('commit','-m','base');
 const base=git('rev-parse','HEAD');
 writeFileSync(resolve(cwd,'app.html'),'UI update');git('add','.');git('commit','-m','code');
 const tested=git('rev-parse','HEAD');
 const report={schema_version:1,scope:'visual',readiness:'ready',base_commit:base,tested_commit:tested,
 preview_url:'https://preview.example.invalid',summary:'Visual-only evaluation',
 cases:['CATALOG','SIGNIN','OPEN','RETRY','WALLET','ISOLATION','ERROR','MOCK-SAFETY','VISUAL'].map(id=>({
 id,status:['MOCK-SAFETY','VISUAL'].includes(id)?'pass':'not_run',
 evidence:['MOCK-SAFETY','VISUAL'].includes(id)?['sanitized screenshot in PR']:[],
 notes:'API behavior unchanged by visual update.'}))};
 function save(){mkdirSync(resolve(cwd,'reports/frontend'),{recursive:true});writeFileSync(resolve(cwd,'reports/frontend/current.json'),JSON.stringify(report));writeFileSync(resolve(cwd,'feedback.md'),'Verified visual-only handoff. '.repeat(8));git('add','.');git('commit','-m','report');}
 return {cwd,git,base,report,save,check:()=>spawnSync(process.execPath,[checker,base,'HEAD'],{cwd,encoding:'utf8'})};
}
test('accepts a visual report tied to its tested code',()=>{const f=fixture();f.save();assert.equal(f.check().status,0);});
test('rejects code changes after recorded evaluation',()=>{const f=fixture();f.save();writeFileSync(resolve(f.cwd,'app.html'),'untested code');f.git('add','.');f.git('commit','-m','new code');const r=f.check();assert.notEqual(r.status,0);assert.match(r.stderr,/Code changed after evaluation/);});
test('integration cannot claim ready with missing browser cases',()=>{const f=fixture();f.report.scope='integration';f.save();const r=f.check();assert.notEqual(r.status,0);assert.match(r.stderr,/Required case needs PASS/);});
test('rejects blocked handoffs',()=>{const f=fixture();f.report.readiness='blocked';f.save();assert.notEqual(f.check().status,0);});
