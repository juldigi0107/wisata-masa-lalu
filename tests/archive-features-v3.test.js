import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('archive implementation is lazy loaded instead of inflating the initial world bundle',async()=>{
 const wrapper=await text('src/App.jsx');
 assert.match(wrapper,/lazy\(\(\)=>import\('\.\/ArchiveAppFull\.jsx'\)\)/);
 assert.match(wrapper,/Suspense/);
 assert.match(wrapper,/archive-loading/);
});

test('nostalgia meter produces a local downloadable and shareable boarding pass without server submission',async()=>{
 const extras=await text('src/ArchiveFeatureExtras.jsx');
 assert.match(extras,/boardingSvg/);
 assert.match(extras,/new Blob/);
 assert.match(extras,/new File/);
 assert.match(extras,/navigator\.share/);
 assert.match(extras,/navigator\.clipboard/);
 assert.match(extras,/HASIL LOKAL/);
 assert.equal(/fetch\(|XMLHttpRequest|axios/i.test(extras),false);
});

test('archive exposes explicit reset for combined query category and provenance filters',async()=>{
 const [app,extras]=await Promise.all([text('src/ArchiveAppFull.jsx'),text('src/ArchiveFeatureExtras.jsx')]);
 assert.match(app,/function resetFilters\(\)/);
 assert.match(app,/setQuery\(''\)/);
 assert.match(app,/setTypeFilter\('semua'\)/);
 assert.match(app,/setStatusFilter\('semua'\)/);
 assert.match(app,/ArchiveFilterTools/);
 assert.match(extras,/Reset pencarian & filter/);
});

test('focus story stays inside current filtered result set and supports previous next reading',async()=>{
 const [app,extras]=await Promise.all([text('src/ArchiveAppFull.jsx'),text('src/ArchiveFeatureExtras.jsx')]);
 assert.match(app,/filtered\.length&&!filtered\.some/);
 assert.match(app,/setActive\(filtered\[0\]\)/);
 assert.match(app,/StoryPager entries=\{filtered\}/);
 assert.match(extras,/findIndex/);
 assert.match(extras,/Sebelumnya/);
 assert.match(extras,/Berikutnya/);
});

test('archive completion styling remains in async archive chunk instead of critical world CSS',async()=>{
 const [archiveStyles,main]=await Promise.all([text('src/world/archive-styles.js'),text('src/main.jsx')]);
 assert.match(archiveStyles,/archive-features-v3\.css/);
 assert.equal(main.includes('archive-features-v3.css'),false);
});
