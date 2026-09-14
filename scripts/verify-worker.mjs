import catalog from '../shared/assembled-catalog.js';
import {auditCatalog} from '../shared/editorial-audit.js';

const expectedAudit=auditCatalog(catalog);
const base=(process.env.WORKER_BASE_URL||'https://wisata-masa-lalu.juldigi.workers.dev').replace(/\/$/,'');
const origin=process.env.ALLOWED_ORIGIN||'https://juldigi0107.github.io';
const attempts=Math.max(1,Number.parseInt(process.env.VERIFY_ATTEMPTS||'6',10));
const delayMs=Math.max(0,Number.parseInt(process.env.VERIFY_DELAY_MS||'5000',10));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function getJson(path){
 const response=await fetch(base+path,{
  headers:{Origin:origin,'Cache-Control':'no-cache'},
  signal:AbortSignal.timeout(20000)
 });
 const allowOrigin=response.headers.get('access-control-allow-origin');
 let body;
 try{body=await response.json()}catch{throw new Error(`${path} returned non-JSON HTTP ${response.status}`)}
 if(!response.ok)throw new Error(`${path} HTTP ${response.status}: ${JSON.stringify(body)}`);
 if(allowOrigin!==origin)throw new Error(`${path} CORS mismatch: expected ${origin}, got ${allowOrigin||'none'}`);
 return body;
}

function validate(health,remote,audit){
 const problems=[];
 if(health.ok!==true)problems.push('health.ok !== true');
 if(health.mode!=='curated-static-v2')problems.push(`mode ${health.mode??'missing'} != curated-static-v2`);
 if(health.version!==catalog.version)problems.push(`health version ${health.version??'missing'} != ${catalog.version}`);
 if(health.entries!==catalog.entries.length)problems.push(`health entries ${health.entries??'missing'} != ${catalog.entries.length}`);
 if(remote.version!==catalog.version)problems.push(`catalog version ${remote.version??'missing'} != ${catalog.version}`);
 if(!Array.isArray(remote.entries))problems.push('catalog.entries is not an array');
 else if(remote.entries.length!==catalog.entries.length)problems.push(`catalog entries ${remote.entries.length} != ${catalog.entries.length}`);
 if(Array.isArray(remote.entries)){
  const localIds=new Set(catalog.entries.map(entry=>entry.id));
  const remoteIds=new Set(remote.entries.map(entry=>entry.id));
  if(remoteIds.size!==remote.entries.length)problems.push('remote catalog contains duplicate entry IDs');
  const missing=[...localIds].filter(id=>!remoteIds.has(id));
  const unexpected=[...remoteIds].filter(id=>!localIds.has(id));
  if(missing.length)problems.push(`remote missing IDs: ${missing.slice(0,8).join(', ')}${missing.length>8?'…':''}`);
  if(unexpected.length)problems.push(`remote unexpected IDs: ${unexpected.slice(0,8).join(', ')}${unexpected.length>8?'…':''}`);
 }
 if(!audit||typeof audit!=='object')problems.push('audit endpoint missing/invalid');
 else{
  if(audit.version!==catalog.version)problems.push(`audit version ${audit.version??'missing'} != ${catalog.version}`);
  if(audit.total!==catalog.entries.length)problems.push(`audit total ${audit.total??'missing'} != ${catalog.entries.length}`);
  if(audit.meanScore!==expectedAudit.meanScore)problems.push(`audit mean ${audit.meanScore??'missing'} != ${expectedAudit.meanScore}`);
  if(audit.medianScore!==expectedAudit.medianScore)problems.push(`audit median ${audit.medianScore??'missing'} != ${expectedAudit.medianScore}`);
  if(!audit.byReadiness||Object.values(audit.byReadiness).reduce((sum,count)=>sum+count,0)!==catalog.entries.length)problems.push('audit readiness totals do not cover SSOT');
  if(typeof audit.disclaimer!=='string'||!audit.disclaimer.toLowerCase().includes('bukan menjamin kebenaran historis'))problems.push('audit disclaimer missing');
 }
 return problems;
}

let lastError;
for(let attempt=1;attempt<=attempts;attempt++){
 try{
  const nonce=Date.now();
  const [health,remote,audit]=await Promise.all([
   getJson('/api/health?verify='+nonce),
   getJson('/api/catalog?verify='+nonce),
   getJson('/api/audit?limit=1&verify='+nonce)
  ]);
  const problems=validate(health,remote,audit);
  console.log(`Verification ${attempt}/${attempts}: live v${health.version??'?'} · ${health.entries??'?'} entries · mode=${health.mode??'?'} · audit mean=${audit?.meanScore??'?'}; expected v${catalog.version} · ${catalog.entries.length} entries · audit mean=${expectedAudit.meanScore}.`);
  if(!problems.length){
   console.log('Live Worker exactly matches the assembled SSOT, entry IDs, editorial audit, mode, and CORS contract.');
   process.exit(0);
  }
  lastError=new Error(problems.join('; '));
  console.warn(`Live Worker not synchronized yet: ${lastError.message}`);
 }catch(error){
  lastError=error;
  console.warn(`Verification ${attempt}/${attempts} failed: ${error.message}`);
 }
 if(attempt<attempts)await sleep(delayMs);
}
throw new Error(`Worker live verification failed after ${attempts} attempts: ${lastError?.message||'unknown mismatch'}`);
