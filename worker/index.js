import catalog from "../shared/assembled-catalog.js";

const clampInt = (raw, fallback, min, max) => {
 const value = Number.parseInt(raw ?? "", 10);
 if (!Number.isFinite(value)) return fallback;
 return Math.min(max, Math.max(min, value));
};

const normalized = value => String(value ?? "").trim().toLocaleLowerCase("id");

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
   const q=normalized(url.searchParams.get("q"));
   const type=normalized(url.searchParams.get("type"));
   const station=normalized(url.searchParams.get("station"));
   const status=normalized(url.searchParams.get("status"));
   const region=normalized(url.searchParams.get("region"));
   const limit=clampInt(url.searchParams.get("limit"),24,1,100);
   const offset=clampInt(url.searchParams.get("offset"),0,0,1000000);

   const filtered=catalog.entries.filter(entry=>{
    const matchesType=!type||normalized(entry.type)===type;
    const matchesStation=!station||normalized(entry.details?.station)===station;
    const matchesStatus=!status||normalized(entry.status)===status;
    const matchesRegion=!region||normalized(entry.details?.region).includes(region)||(entry.tags||[]).some(tag=>normalized(tag).includes(region));
    const haystack=normalized([
     entry.title,
     entry.summary,
     ...(entry.tags||[]),
     entry.details?.station,
     entry.details?.region,
     entry.details?.genre,
     entry.details?.context,
     entry.details?.people
    ].filter(Boolean).join(" "));
    return matchesType&&matchesStation&&matchesStatus&&matchesRegion&&(!q||haystack.includes(q));
   });

   const entries=filtered.slice(offset,offset+limit);
   const nextOffset=offset+entries.length<filtered.length?offset+entries.length:null;
   return reply({entries,total:filtered.length,offset,limit,nextOffset,version:catalog.version});
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
  if (url.pathname === "/api/facets") {
   const byType={};
   const byStatus={};
   const byStation={};
   const byRegion={};
   for(const entry of catalog.entries){
    byType[entry.type]=(byType[entry.type]||0)+1;
    byStatus[entry.status]=(byStatus[entry.status]||0)+1;
    if(entry.details?.station) byStation[entry.details.station]=(byStation[entry.details.station]||0)+1;
    if(entry.details?.region) byRegion[entry.details.region]=(byRegion[entry.details.region]||0)+1;
   }
   return reply({version:catalog.version,total:catalog.entries.length,byType,byStatus,byStation,byRegion});
  }
  return reply({error:"Endpoint tidak ditemukan"},404,{"Cache-Control":"no-store"});
 }
};
