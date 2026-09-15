import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker from '../worker/index.js';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('memory wall has a real D1 schema with moderation and per-device voting',async()=>{
 const sql=await text('migrations/0001_social_memory.sql');
 assert.match(sql,/CREATE TABLE IF NOT EXISTS memory_posts/);
 assert.match(sql,/status TEXT NOT NULL DEFAULT 'pending'/);
 assert.match(sql,/CREATE TABLE IF NOT EXISTS memory_votes/);
 assert.match(sql,/PRIMARY KEY \(post_id, client_id\)/);
 assert.match(sql,/CREATE TABLE IF NOT EXISTS moderation_log/);
});

test('social API degrades explicitly when D1 is not bound instead of pretending public sync worked',async()=>{
 const response=await worker.fetch(new Request('https://example.test/api/memories',{headers:{Origin:'https://juldigi0107.github.io'}}),{ALLOWED_ORIGIN:'https://juldigi0107.github.io'});
 assert.equal(response.status,503);
 const body=await response.json();
 assert.equal(body.code,'D1_NOT_CONFIGURED');
});

test('social API includes moderation guard privacy limits and non-PII device identity',async()=>{
 const source=await text('worker/social.js');
 assert.match(source,/ADMIN_TOKEN/);
 assert.match(source,/menunggu moderasi/i);
 assert.match(source,/Batas kirim memori perangkat ini/);
 assert.match(source,/client_id/);
 assert.equal(/ip_address|email|phone_number/i.test(source),false);
});

test('frontend memory experience is functional offline and supports a private photo capsule in IndexedDB',async()=>{
 const panel=await text('src/world/SocialMemoryPanel.jsx');
 const shell=await text('src/world/WorldExperienceShell.jsx');
 assert.match(shell,/SocialMemoryPanel/);
 assert.match(panel,/indexedDB\.open\('wml-memory-capsule'/);
 assert.match(panel,/Kapsul tersimpan lokal|disimpan di IndexedDB/i);
 assert.match(panel,/api\/memories/);
 assert.match(panel,/Dulu kamu juga begini\?/);
 assert.match(panel,/vote\(item,'yes'\)/);
 assert.match(panel,/type="file" accept="image\/\*"/);
 assert.match(panel,/remoteIds/);
});

test('memory card studio generates local 1:1 9:16 and 16:9 high-resolution PNG share assets',async()=>{
 const [panel,studio,css]=await Promise.all([text('src/world/SocialMemoryPanel.jsx'),text('src/world/MemoryCardStudio.jsx'),text('src/world/memory-card.css')]);
 assert.match(panel,/MemoryCardStudio/);
 assert.match(panel,/Kartu Nostalgia/);
 for(const dimensions of ['1080,height:1080','1080,height:1920','1600,height:900'])assert.ok(studio.includes(dimensions));
 assert.match(studio,/canvas\.toBlob\(resolve,'image\/png'/);
 assert.match(studio,/\.png`/);
 assert.match(studio,/assets\/world\/raster\/\$\{sceneId\}-sore\.webp/);
 assert.match(studio,/navigator\.share/);
 assert.match(studio,/navigator\.clipboard\.writeText/);
 assert.equal(studio.includes('image/svg+xml'),false,'memory card output must be raster PNG');
 assert.equal(studio.includes('fetch('),false,'memory card generation must remain local');
 assert.match(css,/memory-card-studio/);
});

test('private moderation console is explicit and never stores the admin token',async()=>{
 const [shell,panel]=await Promise.all([text('src/world/WorldExperienceShell.jsx'),text('src/world/ModerationPanel.jsx')]);
 assert.match(shell,/adminRoute/);
 assert.match(panel,/Authorization:`Bearer \$\{token\.trim\(\)\}`/);
 assert.match(panel,/type="password"/);
 assert.equal(/localStorage.*token|sessionStorage.*token/.test(panel),false);
});

test('memory and social surfaces keep a premium non-dashboard responsive composition',async()=>{
 const css=await text('src/world/social-memory.css');
 assert.match(css,/memory-wall-orb/);
 assert.match(css,/memory-wall-layout/);
 assert.match(css,/capsule-layout/);
 assert.match(css,/season-list/);
 assert.match(css,/moderation-shell/);
 assert.match(css,/@media\(max-width:760px\)/);
});
