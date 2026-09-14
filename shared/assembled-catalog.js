import baseCatalog from './catalog.js';
import {extraEntries} from './enrichment.js';
import {popCultureEntries} from './enrichment-popculture.js';
import {youthEntries} from './enrichment-youth.js';
import {printSnackEntries,printSnackVersion} from './enrichment-print-snacks.js';

const seen = new Set();
const entries = [];
for (const entry of [...baseCatalog.entries,...extraEntries,...popCultureEntries,...youthEntries,...printSnackEntries]) {
 if (seen.has(entry.id)) continue;
 seen.add(entry.id);
 entries.push(entry);
}

const catalog = {
 ...baseCatalog,
 version: printSnackVersion,
 notice: `${baseCatalog.notice} Katalog v${printSnackVersion} menggabungkan TV/kartun, permainan rakyat, musik, Ramadhan, warung, anime, benda permainan, budaya baca, makanan/minuman, dan personal audio dengan provenance per entri.`,
 entries
};

export default catalog;
