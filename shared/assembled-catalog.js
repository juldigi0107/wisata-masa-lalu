import baseCatalog from './catalog.js';
import {extraEntries} from './enrichment.js';
import {popCultureEntries} from './enrichment-popculture.js';
import {youthEntries,youthVersion} from './enrichment-youth.js';

const seen = new Set();
const entries = [];
for (const entry of [...baseCatalog.entries,...extraEntries,...popCultureEntries,...youthEntries]) {
 if (seen.has(entry.id)) continue;
 seen.add(entry.id);
 entries.push(entry);
}

const catalog = {
 ...baseCatalog,
 version: youthVersion,
 notice: `${baseCatalog.notice} Katalog v${youthVersion} menggabungkan TV/kartun, permainan rakyat, musik, Ramadhan, warung, anime, dan benda permainan dengan provenance per entri.`,
 entries
};

export default catalog;
