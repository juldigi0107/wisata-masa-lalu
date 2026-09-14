import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";
import catalog from "../shared/assembled-catalog.js";

const ORIGIN="https://juldigi0107.github.io";
const call=(path,options={})=>worker.fetch(new Request("https://example.com"+path,options),{ALLOWED_ORIGIN:ORIGIN});

test("assembled catalog entries, sources, station coverage and schedule references are valid",()=>{
 const ids=new Set(catalog.entries.map(e=>e.id));
 assert.equal(ids.size,catalog.entries.length,"entry ids must be unique");
 assert.ok(catalog.entries.length>=32,"assembled v2.3 catalog unexpectedly small");
 assert.ok(catalog.entries.filter(e=>e.type==="mainan").length>=9,"traditional-game / object batch missing");
 assert.ok(catalog.entries.filter(e=>e.type==="kartun").length>=5,"anime batch missing");
 assert.ok(catalog.entries.filter(e=>e.type==="musik").length>=4,"music batch missing");
 assert.ok(catalog.entries.some(e=>e.type==="ramadhan"),"Ramadan batch missing");
 assert.ok(catalog.entries.some(e=>e.type==="jajanan"),"food/beverage culture batch missing");
 for(const entry of catalog.entries){
  assert.ok(entry.id&&entry.title&&entry.type&&entry.summary,`core fields missing: ${entry.id||entry.title}`);
  assert.ok(entry.factBox?.text&&entry.quoteBox?.text&&entry.priceTag&&entry.details,`editorial blocks missing: ${entry.id}`);
  assert.ok(Array.isArray(entry.tags),`tags missing: ${entry.id}`);
  const sourceIds=new Set((entry.sources||[]).map(s=>s.id));
  for(const sourceId of entry.factBox?.sourceIds||[]) assert.ok(sourceIds.has(sourceId),`unresolved source ${sourceId} in ${entry.id}`);
  if(entry.status==="verified") assert.ok((entry.sources||[]).length>0,`verified entry without source: ${entry.id}`);
 }
 const covered=new Set(catalog.entries.filter(e=>e.type==="tv").map(e=>e.details?.station));
 for(const station of catalog.stations) assert.ok(covered.has(station),`station without curated TV entry: ${station}`);
 for(const s of catalog.schedules){assert.ok(ids.has(s.entryId),`schedule points to missing entry: ${s.entryId}`);assert.ok(s.startMinute<s.endMinute,`invalid schedule range: ${s.id}`)}
 assert.ok(Array.isArray(catalog.archiveSchedules)&&catalog.archiveSchedules.length>=1,"archive schedule sample missing");
});

test("health reports assembled catalog version and size",async()=>{
 const health=await (await call("/api/health")).json();
 const body=await (await call("/api/catalog")).json();
 assert.equal(health.ok,true);assert.equal(health.mode,"curated-static-v2");assert.equal(health.version,catalog.version);assert.equal(health.entries,catalog.entries.length);assert.equal(body.entries.length,catalog.entries.length);assert.equal(body.version,catalog.version);
});

test("search supports query, type, station, status and region filters",async()=>{
 const doraemon=await(await call("/api/entries?q=doraemon&type=kartun")).json();assert.equal(doraemon.total,1);assert.equal(doraemon.entries[0].id,"doraemon");
 const conan=await(await call("/api/entries?q=conan&type=kartun")).json();assert.equal(conan.total,1);assert.equal(conan.entries[0].id,"detective-conan");
 const sctv=await(await call("/api/entries?station=SCTV&type=tv")).json();assert.ok(sctv.total>=1);assert.ok(sctv.entries.every(e=>e.type==="tv"&&e.details?.station==="SCTV"));
 const verified=await(await call("/api/entries?status=verified&limit=100")).json();assert.ok(verified.total>=1);assert.ok(verified.entries.every(e=>e.status==="verified"));
 const betawi=await(await call("/api/entries?region=betawi&limit=100")).json();assert.ok(betawi.total>=1);assert.ok(betawi.entries.some(e=>e.id==="galasin-betawi"));
 const games=await(await call("/api/entries?type=mainan&limit=100")).json();assert.ok(games.total>=9);assert.ok(games.entries.every(e=>e.type==="mainan"));
 const tamagotchi=await(await call("/api/entries?q=tamagotchi&type=mainan")).json();assert.equal(tamagotchi.total,1);assert.equal(tamagotchi.entries[0].id,"tamagotchi");
 const music=await(await call("/api/entries?type=musik&limit=100")).json();assert.ok(music.total>=4);assert.ok(music.entries.every(e=>e.type==="musik"));
 const sosro=await(await call("/api/entries?q=sosro&type=jajanan")).json();assert.equal(sosro.total,1);assert.equal(sosro.entries[0].id,"tehbotol-sosro");
});

test("entries endpoint paginates safely for a 500+ entry catalog",async()=>{
 const first=await(await call("/api/entries?type=mainan&limit=3&offset=0")).json();
 assert.equal(first.entries.length,3);assert.ok(first.total>=9);assert.equal(first.offset,0);assert.equal(first.limit,3);assert.equal(first.nextOffset,3);
 const second=await(await call(`/api/entries?type=mainan&limit=3&offset=${first.nextOffset}`)).json();
 assert.equal(second.entries.length,3);assert.equal(second.offset,3);assert.equal(new Set([...first.entries,...second.entries].map(e=>e.id)).size,6);
 const clamped=await(await call("/api/entries?limit=9999&offset=-9")).json();
 assert.equal(clamped.limit,100);assert.equal(clamped.offset,0);assert.ok(clamped.entries.length<=100);
});

test("archive schedules, source ledger, stats and facets are exposed",async()=>{
 const archive=await(await call("/api/archive-schedules?date=1995-06-04&station=RCTI")).json();assert.equal(archive.total,1);assert.equal(archive.schedules[0].items[0].title,"Doraemon");
 const sources=await(await call("/api/sources")).json();assert.ok(sources.total>=28);assert.equal(sources.total,sources.sources.length);assert.equal(new Set(sources.sources.map(s=>s.id)).size,sources.total);
 const stats=await(await call("/api/stats")).json();assert.equal(stats.version,catalog.version);assert.equal(stats.total,catalog.entries.length);assert.ok(stats.byType.mainan>=9);assert.ok(stats.byType.kartun>=5);assert.ok(stats.byType.musik>=4);assert.ok(stats.byStatus.verified>=1);
 const facets=await(await call("/api/facets")).json();assert.equal(facets.version,catalog.version);assert.equal(facets.total,catalog.entries.length);assert.equal(facets.byType.mainan,stats.byType.mainan);assert.ok(facets.byStation.RCTI>=1);assert.ok(Object.keys(facets.byRegion).length>=1);
});

test("CORS only trusts configured frontend",async()=>{
 assert.equal((await call("/api/catalog",{headers:{Origin:ORIGIN}})).headers.get("Access-Control-Allow-Origin"),ORIGIN);assert.equal((await call("/api/catalog",{headers:{Origin:"https://evil.example"}})).headers.get("Access-Control-Allow-Origin"),null);assert.equal((await call("/api/catalog",{method:"OPTIONS",headers:{Origin:"https://evil.example"}})).status,403);
});

test("method and path errors",async()=>{assert.equal((await call("/unknown")).status,404);assert.equal((await call("/api/catalog",{method:"POST"})).status,405)});
