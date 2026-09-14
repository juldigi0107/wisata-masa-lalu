import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";
import catalog from "../shared/catalog.js";

const ORIGIN="https://juldigi0107.github.io";
const call=(path,options={})=>worker.fetch(new Request("https://example.com"+path,options),{ALLOWED_ORIGIN:ORIGIN});

test("catalog entries, sources, station coverage and schedule references are valid",()=>{
 const ids=new Set(catalog.entries.map(e=>e.id));
 assert.equal(ids.size,catalog.entries.length,"entry ids must be unique");
 assert.ok(catalog.entries.length>=10,"curated v2 catalog unexpectedly small");
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

test("health reports curated v2 and same catalog size",async()=>{
 const health=await (await call("/api/health")).json();
 const body=await (await call("/api/catalog")).json();
 assert.equal(health.ok,true);assert.equal(health.mode,"curated-static-v2");assert.equal(health.version,catalog.version);assert.equal(health.entries,catalog.entries.length);assert.equal(body.entries.length,catalog.entries.length);assert.equal(body.version,catalog.version);
});

test("search supports query, type and station filters",async()=>{
 const doraemon=await(await call("/api/entries?q=doraemon&type=kartun")).json();assert.equal(doraemon.total,1);assert.equal(doraemon.entries[0].id,"doraemon");
 const sctv=await(await call("/api/entries?station=SCTV&type=tv")).json();assert.ok(sctv.total>=1);assert.ok(sctv.entries.every(e=>e.type==="tv"&&e.details?.station==="SCTV"));
});

test("archive schedules and source ledger are exposed separately",async()=>{
 const archive=await(await call("/api/archive-schedules?date=1995-06-04&station=RCTI")).json();assert.equal(archive.total,1);assert.equal(archive.schedules[0].items[0].title,"Doraemon");
 const sources=await(await call("/api/sources")).json();assert.ok(sources.total>=8);assert.equal(sources.total,sources.sources.length);assert.equal(new Set(sources.sources.map(s=>s.id)).size,sources.total);
});

test("CORS only trusts configured frontend",async()=>{
 assert.equal((await call("/api/catalog",{headers:{Origin:ORIGIN}})).headers.get("Access-Control-Allow-Origin"),ORIGIN);assert.equal((await call("/api/catalog",{headers:{Origin:"https://evil.example"}})).headers.get("Access-Control-Allow-Origin"),null);assert.equal((await call("/api/catalog",{method:"OPTIONS",headers:{Origin:"https://evil.example"}})).status,403);
});

test("method and path errors",async()=>{assert.equal((await call("/unknown")).status,404);assert.equal((await call("/api/catalog",{method:"POST"})).status,405)});
