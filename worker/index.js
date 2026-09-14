import catalog from "../shared/assembled-catalog.js";

export default {
 async fetch(request, env = {}) {
  const url = new URL(request.url);
  const allowed = env.ALLOWED_ORIGIN || "https://juldigi0107.github.io";
  const origin = request.headers.get("Origin");
  const headers = {
   "Content-Type":"application/json; charset=utf-8",
   "X-Content-Type-Options":"nosniff",
   "Cache-Control":"public, max-age=120, stale-while-revalidate=600",
   "Vary":"Origin"
  };
  if (origin === allowed) headers["Access-Control-Allow-Origin"] = allowed;
  const reply = (body,status=200,extra={}) => new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
  if (request.method === "OPTIONS") {
   if (origin !== allowed) return reply({error:"Origin tidak diizinkan"},403,{"Cache-Control":"no-store"});
   return new Response(null,{status:204,headers:{...headers,"Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Max-Age":"86400"}});
  }
  if (request.method !== "GET") return reply({error:"Method tidak didukung"},405,{Allow:"GET, OPTIONS","Cache-Control":"no-store"});

  if (url.pathname === "/api/health") return reply({ok:true,version:catalog.version,mode:"curated-static-v2",entries:catalog.entries.length,verified:catalog.entries.filter(e=>e.status==="verified").length,archiveSchedules:catalog.archiveSchedules?.length||0},200,{"Cache-Control":"no-store"});
  if (url.pathname === "/api/catalog") return reply(catalog);
  if (url.pathname === "/api/entries") {
   const q=(url.searchParams.get("q")||"").toLocaleLowerCase("id");
   const type=url.searchParams.get("type");
   const station=url.searchParams.get("station");
   const entries=catalog.entries.filter(e=>(!type||e.type===type)&&(!station||e.details?.station===station)&&(e.title+" "+e.summary+" "+(e.tags||[]).join(" ")).toLocaleLowerCase("id").includes(q));
   return reply({entries,total:entries.length,version:catalog.version});
  }
  if (url.pathname === "/api/schedules") {
   const day=url.searchParams.get("day");
   return reply({schedules:catalog.schedules.filter(s=>!day||s.day===day),notice:catalog.notice});
  }
  if (url.pathname === "/api/archive-schedules") {
   const date=url.searchParams.get("date");
   const station=url.searchParams.get("station");
   const schedules=(catalog.archiveSchedules||[]).filter(s=>(!date||s.date===date)&&(!station||s.station===station));
   return reply({schedules,total:schedules.length,notice:"Arsip komunitas dipisahkan dari jadwal simulasi. Periksa sumber pada setiap rekaman."});
  }
  if (url.pathname === "/api/sources") {
   const seen=new Map();
   for (const entry of catalog.entries) for (const source of entry.sources||[]) seen.set(source.id,source);
   return reply({sources:[...seen.values()],total:seen.size});
  }
  if (url.pathname === "/api/stats") {
   const byType={};
   const byStatus={};
   for(const entry of catalog.entries){byType[entry.type]=(byType[entry.type]||0)+1;byStatus[entry.status]=(byStatus[entry.status]||0)+1;}
   return reply({version:catalog.version,total:catalog.entries.length,byType,byStatus,stations:catalog.stations.length,archiveSchedules:catalog.archiveSchedules?.length||0});
  }
  return reply({error:"Endpoint tidak ditemukan"},404,{"Cache-Control":"no-store"});
 }
};
