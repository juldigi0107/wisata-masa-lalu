const text=value=>String(value??'').trim();
const lower=value=>text(value).toLocaleLowerCase('id');
const clamp=(raw,fallback,min,max)=>{const n=Number.parseInt(raw??'',10);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback};
const clean=(value,max)=>text(value).replace(/[\u0000-\u001F\u007F]/g,' ').replace(/\s+/g,' ').slice(0,max);
const allowedCategories=new Set(['sekolah','jajanan','televisi','musik','rental','warnet','lebaran','ramadan','kampung','keluarga','permainan','teknologi','lainnya']);
const idPattern=/^[a-zA-Z0-9_-]{16,80}$/;

function dbUnavailable(reply){return reply({error:'Memory Wall belum terhubung ke Cloudflare D1 pada deployment ini.',code:'D1_NOT_CONFIGURED'},503,{'Cache-Control':'no-store'})}
function requireDb(env,reply){return env?.DB?null:dbUnavailable(reply)}
function adminAllowed(request,env){const expected=text(env?.ADMIN_TOKEN);if(!expected)return false;const provided=text(request.headers.get('Authorization')).replace(/^Bearer\s+/i,'');return provided.length>0&&provided===expected}
async function jsonBody(request){try{return await request.json()}catch{return null}}
function validateClientId(value){const id=text(value);return idPattern.test(id)?id:null}
function rowToPublic(row){return {
 id:row.id,nickname:row.nickname,city:row.city,memoryYear:row.memory_year,category:row.category,story:row.story,createdAt:row.created_at,
 votes:{yes:Number(row.yes_votes||0),no:Number(row.no_votes||0),total:Number(row.yes_votes||0)+Number(row.no_votes||0)}
}}

export async function handleSocialRequest({request,env,url,reply}){
 const path=url.pathname;
 const isSocial=path==='/api/memories'||path.startsWith('/api/memories/')||path==='/api/admin/memories'||path.startsWith('/api/admin/memories/');
 if(!isSocial)return null;
 const noDb=requireDb(env,reply);if(noDb)return noDb;

 if(path==='/api/memories'&&request.method==='GET'){
  const limit=clamp(url.searchParams.get('limit'),24,1,50),offset=clamp(url.searchParams.get('offset'),0,0,100000);
  const category=lower(url.searchParams.get('category')),city=lower(url.searchParams.get('city'));
  const where=['p.status = ?1'];const binds=['approved'];
  if(category){binds.push(category);where.push(`lower(p.category) = ?${binds.length}`)}
  if(city){binds.push(`%${city}%`);where.push(`lower(p.city) LIKE ?${binds.length}`)}
  binds.push(limit,offset);const limitPos=binds.length-1,offsetPos=binds.length;
  const sql=`SELECT p.id,p.nickname,p.city,p.memory_year,p.category,p.story,p.created_at,
   SUM(CASE WHEN v.vote='yes' THEN 1 ELSE 0 END) AS yes_votes,
   SUM(CASE WHEN v.vote='no' THEN 1 ELSE 0 END) AS no_votes
   FROM memory_posts p LEFT JOIN memory_votes v ON v.post_id=p.id
   WHERE ${where.join(' AND ')} GROUP BY p.id ORDER BY p.created_at DESC LIMIT ?${limitPos} OFFSET ?${offsetPos}`;
  const result=await env.DB.prepare(sql).bind(...binds).all();
  const countBinds=binds.slice(0,binds.length-2);
  const count=await env.DB.prepare(`SELECT COUNT(*) AS total FROM memory_posts p WHERE ${where.join(' AND ')}`).bind(...countBinds).first();
  const entries=(result.results||[]).map(rowToPublic);
  return reply({entries,total:Number(count?.total||0),offset,limit,nextOffset:offset+entries.length<Number(count?.total||0)?offset+entries.length:null,moderated:true});
 }

 if(path==='/api/memories'&&request.method==='POST'){
  const body=await jsonBody(request);if(!body)return reply({error:'Payload JSON tidak valid.'},400,{'Cache-Control':'no-store'});
  const clientId=validateClientId(body.clientId);if(!clientId)return reply({error:'Identitas perangkat lokal tidak valid.'},400,{'Cache-Control':'no-store'});
  const story=clean(body.story,800),nickname=clean(body.nickname||'Anonim 90-an',40)||'Anonim 90-an',city=clean(body.city,50);
  const category=allowedCategories.has(lower(body.category))?lower(body.category):'lainnya';
  const memoryYear=Number.isFinite(Number(body.memoryYear))&&Number(body.memoryYear)>=1990&&Number(body.memoryYear)<=1999?Number(body.memoryYear):null;
  if(story.length<12)return reply({error:'Cerita terlalu pendek. Tulis minimal 12 karakter.'},400,{'Cache-Control':'no-store'});
  const recent=await env.DB.prepare("SELECT COUNT(*) AS total FROM memory_posts WHERE client_id=?1 AND created_at >= datetime('now','-1 day')").bind(clientId).first();
  if(Number(recent?.total||0)>=3)return reply({error:'Batas kirim memori perangkat ini tercapai. Coba lagi besok.'},429,{'Cache-Control':'no-store','Retry-After':'3600'});
  const id=crypto.randomUUID();
  await env.DB.prepare('INSERT INTO memory_posts (id,client_id,nickname,city,memory_year,category,story,status) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)').bind(id,clientId,nickname,city,memoryYear,category,story,'pending').run();
  return reply({ok:true,id,status:'pending',message:'Memori diterima dan menunggu moderasi sebelum tampil publik.'},202,{'Cache-Control':'no-store'});
 }

 const voteMatch=path.match(/^\/api\/memories\/([^/]+)\/vote$/);
 if(voteMatch&&request.method==='POST'){
  const postId=clean(voteMatch[1],80);const body=await jsonBody(request);const clientId=validateClientId(body?.clientId);const vote=lower(body?.vote);
  if(!clientId||!['yes','no'].includes(vote))return reply({error:'Vote tidak valid.'},400,{'Cache-Control':'no-store'});
  const post=await env.DB.prepare("SELECT id FROM memory_posts WHERE id=?1 AND status='approved'").bind(postId).first();
  if(!post)return reply({error:'Memori tidak ditemukan atau belum dipublikasikan.'},404,{'Cache-Control':'no-store'});
  await env.DB.prepare("INSERT INTO memory_votes (post_id,client_id,vote) VALUES (?1,?2,?3) ON CONFLICT(post_id,client_id) DO UPDATE SET vote=excluded.vote,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')").bind(postId,clientId,vote).run();
  const totals=await env.DB.prepare("SELECT SUM(CASE WHEN vote='yes' THEN 1 ELSE 0 END) AS yes_votes,SUM(CASE WHEN vote='no' THEN 1 ELSE 0 END) AS no_votes FROM memory_votes WHERE post_id=?1").bind(postId).first();
  return reply({ok:true,postId,vote,votes:{yes:Number(totals?.yes_votes||0),no:Number(totals?.no_votes||0)}},200,{'Cache-Control':'no-store'});
 }

 if(path==='/api/admin/memories'&&request.method==='GET'){
  if(!adminAllowed(request,env))return reply({error:'Unauthorized'},401,{'Cache-Control':'no-store'});
  const status=['pending','approved','rejected'].includes(lower(url.searchParams.get('status')))?lower(url.searchParams.get('status')):'pending';
  const limit=clamp(url.searchParams.get('limit'),50,1,100);
  const result=await env.DB.prepare('SELECT id,nickname,city,memory_year,category,story,status,moderation_note,created_at,updated_at FROM memory_posts WHERE status=?1 ORDER BY created_at ASC LIMIT ?2').bind(status,limit).all();
  return reply({entries:result.results||[],status,total:(result.results||[]).length},200,{'Cache-Control':'no-store'});
 }

 const modMatch=path.match(/^\/api\/admin\/memories\/([^/]+)$/);
 if(modMatch&&request.method==='PATCH'){
  if(!adminAllowed(request,env))return reply({error:'Unauthorized'},401,{'Cache-Control':'no-store'});
  const body=await jsonBody(request);const status=lower(body?.status);const note=clean(body?.note,240);const id=clean(modMatch[1],80);
  if(!['approved','rejected','pending'].includes(status))return reply({error:'Status moderasi tidak valid.'},400,{'Cache-Control':'no-store'});
  const exists=await env.DB.prepare('SELECT id FROM memory_posts WHERE id=?1').bind(id).first();if(!exists)return reply({error:'Memori tidak ditemukan.'},404,{'Cache-Control':'no-store'});
  await env.DB.prepare("UPDATE memory_posts SET status=?2,moderation_note=?3,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=?1").bind(id,status,note).run();
  const action=status==='pending'?'restored':status;
  await env.DB.prepare('INSERT INTO moderation_log (post_id,action,note) VALUES (?1,?2,?3)').bind(id,action,note).run();
  return reply({ok:true,id,status},200,{'Cache-Control':'no-store'});
 }

 return reply({error:'Endpoint social tidak ditemukan'},404,{'Cache-Control':'no-store'});
}
