import {readdir,stat} from 'node:fs/promises';
import {join,relative} from 'node:path';

const root='dist';
const budgets={
 js:500*1024,
 css:180*1024,
 singleScene:100*1024,
 totalCore:850*1024
};

async function walk(dir){
 const result=[];
 for(const name of await readdir(dir)){
  const path=join(dir,name);const info=await stat(path);
  if(info.isDirectory())result.push(...await walk(path));else result.push({path,size:info.size});
 }
 return result;
}

const files=await walk(root);
const js=files.filter(file=>file.path.endsWith('.js'));
const css=files.filter(file=>file.path.endsWith('.css'));
const core=[...js,...css];
const scenes=files.filter(file=>file.path.includes(`${join('assets','world','scenes')}`));
const failures=[];
for(const file of js)if(file.size>budgets.js)failures.push(`JS chunk ${relative(root,file.path)} ${(file.size/1024).toFixed(1)} kB > ${budgets.js/1024} kB`);
for(const file of css)if(file.size>budgets.css)failures.push(`CSS ${relative(root,file.path)} ${(file.size/1024).toFixed(1)} kB > ${budgets.css/1024} kB`);
for(const file of scenes)if(file.size>budgets.singleScene)failures.push(`Scene ${relative(root,file.path)} ${(file.size/1024).toFixed(1)} kB > ${budgets.singleScene/1024} kB`);
const coreTotal=core.reduce((sum,file)=>sum+file.size,0);
if(coreTotal>budgets.totalCore)failures.push(`Core JS+CSS ${(coreTotal/1024).toFixed(1)} kB > ${budgets.totalCore/1024} kB`);

console.log('Production performance budget');
console.log(`- JS chunks: ${js.map(file=>`${relative(root,file.path)} ${(file.size/1024).toFixed(1)} kB`).join(', ')}`);
console.log(`- CSS: ${css.map(file=>`${relative(root,file.path)} ${(file.size/1024).toFixed(1)} kB`).join(', ')}`);
console.log(`- Core total: ${(coreTotal/1024).toFixed(1)} kB / ${budgets.totalCore/1024} kB budget`);
console.log(`- Scene assets: ${scenes.length}; largest ${Math.max(0,...scenes.map(file=>file.size))/1024} kB`);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('Budget passed.');
