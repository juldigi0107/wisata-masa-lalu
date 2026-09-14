import baseCatalog from './catalog.js';
import {extraEntries} from './enrichment.js';
import {popCultureEntries} from './enrichment-popculture.js';
import {youthEntries} from './enrichment-youth.js';
import {printSnackEntries} from './enrichment-print-snacks.js';
import {schoolMediaEntries,schoolMediaVersion} from './enrichment-school-media.js';

const seen = new Set();
const entries = [];
for (const entry of [...baseCatalog.entries,...extraEntries,...popCultureEntries,...youthEntries,...printSnackEntries,...schoolMediaEntries]) {
 if (seen.has(entry.id)) continue;
 seen.add(entry.id);
 entries.push(entry);
}

const catalog = {
 ...baseCatalog,
 version: schoolMediaVersion,
 notice: `${baseCatalog.notice} Katalog v${schoolMediaVersion} menggabungkan TV/kartun, permainan rakyat, musik, Ramadhan, warung, anime, benda permainan, budaya baca, makanan/minuman, personal audio, budaya sekolah, teknologi komunikasi, dan film dengan provenance per entri.`,
 entries
};

export default catalog;
