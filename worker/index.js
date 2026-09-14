import catalog from "../shared/catalog.js";
export default {
 async fetch(request, env = {}) {
  const url = new URL(request.url);
  const allowed = env.ALLOWED_ORIGIN || "https://juldigi0107.github.io";
  const origin = request.headers.get("Origin");
  const headers = {"Content-Type":"application/json; charset=utf-8","X-Content-Type-Options":"nosniff","Vary":"Origin"};
  if (origin === allowed) headers["Access-Control-Allow-Origin"] = allowed;
  const reply = (body,status=200) => new Response(JSON.stringify(body),{status,headers});
  if (request.method === "OPTIONS") {
   if (origin !== allowed) return reply({error:"Origin tidak diizinkan"},403);
   return new Response(null,{status:204,headers:{...headers,"Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Max-Age":"86400"}});
  }
  if (request.method !== "GET") return new Response(JSON.stringify({error:"Method tidak didukung"}),{status:405,headers:{...headers,Allow:"GET, OPTIONS"}});
  if (url.pathname === "/api/health") return reply({ok:true,version:catalog.version,mode:"static-editorial-batch-1"});
  if (url.pathname === "/api/catalog") return reply(catalog);
  if (url.pathname === "/api/entries") {
   const q=(url.searchParams.get("q")||"").toLocaleLowerCase("id");
   const type=url.searchParams.get("type");
   const entries=catalog.entries.filter(e=>(!type||e.type===type)&&(e.title+" "+e.summary).toLocaleLowerCase("id").includes(q));
   return reply({entries,total:entries.length});
  }
  if (url.pathname === "/api/schedules") {
   const day=url.searchParams.get("day");
   return reply({schedules:catalog.schedules.filter(s=>!day||s.day===day),notice:catalog.notice});
  }
  return reply({error:"Endpoint tidak ditemukan"},404);
 }
};