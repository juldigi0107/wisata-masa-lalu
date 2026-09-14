import catalog from '../shared/assembled-catalog.js';

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

function validate(health,remote){
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
 return problems;
}

let lastError;
for(let attempt=1;attempt<=attempts;attempt++){
 try{
  const [health,remote]=await Promise.all([getJson('/api/health?verify='+Date.now()),getJson('/api/catalog?verify='+Date.now())]);
  const problems=validate(health,remote);
  console.log(`Verification ${attempt}/${attempts}: live v${health.version??'?'} · ${health.entries??'?'} entries · mode=${health.mode??'?'}; expected v${catalog.version} · ${catalog.entries.length} entries.`);
  if(!problems.length){
   console.log('Live Worker exactly matches the assembled SSOT, entry IDs, mode, and CORS contract.');
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
