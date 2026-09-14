import {appendFileSync} from 'node:fs';
import catalog from '../shared/assembled-catalog.js';
import {auditCatalog} from '../shared/editorial-audit.js';

const audit=auditCatalog(catalog);
const topIssues=Object.entries(audit.byIssue).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'id')).slice(0,10);
const sourceKinds=Object.entries(audit.bySourceKind).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'id'));
const years=Array.from({length:10},(_,i)=>1990+i).map(year=>[year,audit.byYear[year]||0]);
const priority=audit.priorityQueue.slice(0,12);
const readinessOrder=['release-ready','solid','needs-research','incomplete'];

const lines=[
 '# Editorial Intelligence Report',
 '',
 `**SSOT:** v${catalog.version} · **${catalog.entries.length} entries**`,
 '',
 `- Mean completeness: **${audit.meanScore}/100**`,
 `- Median completeness: **${audit.medianScore}/100**`,
 `- Release-ready: **${audit.releaseReady}**`,
 `- Solid but still improvable: **${audit.solidButIncomplete}**`,
 `- Needs research / incomplete: **${audit.needsAttention}**`,
 `- Verified entries with one or more editorial gaps: **${audit.verifiedWithIssues}**`,
 `- Verified entries that still need a strong source: **${audit.verifiedNeedingStrongerEvidence}**`,
 '',
 '> Completeness is a documentation-readiness metric, not a historical truth score. Release-ready also requires zero detected issues; verified entries without a strong source cannot be release-ready.',
 '',
 '## Readiness',
 ...readinessOrder.map(key=>`- ${key}: **${audit.byReadiness[key]||0}**`),
 '',
 '## Top editorial gaps',
 ...(topIssues.length?topIssues.map(([issue,count])=>`- ${issue}: **${count}**`):['- none']),
 '',
 '## Source-kind coverage',
 ...(sourceKinds.length?sourceKinds.map(([kind,count])=>`- ${kind}: **${count} entries**`):['- none']),
 '',
 '## Explicit 1990s year signals',
 `| Year | Entries |`,
 `| ---: | ---: |`,
 ...years.map(([year,count])=>`| ${year} | ${count} |`),
 '',
 '## Research priority queue',
 '| # | Entry | Type | Status | Score | Readiness | Strong sources | Main gaps |',
 '| ---: | --- | --- | --- | ---: | --- | ---: | --- |',
 ...priority.map((item,index)=>`| ${index+1} | ${item.title.replaceAll('|','/')} | ${item.type} | ${item.status} | ${item.completenessScore} | ${item.readiness} | ${item.strongSourceCount} | ${(item.issues.slice(0,3).join(', ')||'none').replaceAll('|','/')} |`),
 ''
];

const markdown=lines.join('\n');
console.log(markdown);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdown+'\n');
