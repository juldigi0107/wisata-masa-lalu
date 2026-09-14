import baseCatalog from './catalog.js';
import {extraEntries} from './enrichment.js';
import {popCultureEntries,popCultureVersion} from './enrichment-popculture.js';

const seen = new Set();
const entries = [];
for (const entry of [...baseCatalog.entries,...extraEntries,...popCultureEntries]) {
 if (seen.has(entry.id)) continue;
 seen.add(entry.id);
 entries.push(entry);
}

const catalog = {
 ...baseCatalog,
 version: popCultureVersion,
 notice: `${baseCatalog.notice} Katalog v${popCultureVersion} menggabungkan batch TV/kartun, permainan rakyat, musik, Ramadhan, dan budaya warung dengan provenance per entri.`,
 entries
};

export default catalog;
