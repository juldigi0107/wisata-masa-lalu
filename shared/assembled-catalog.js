import baseCatalog from './catalog.js';
import {extraEntries} from './enrichment.js';
import {popCultureEntries} from './enrichment-popculture.js';
import {youthEntries} from './enrichment-youth.js';
import {printSnackEntries} from './enrichment-print-snacks.js';
import {schoolMediaEntries} from './enrichment-school-media.js';

const PRODUCT_VERSION='2.7.0';
const seen = new Set();
const entries = [];
for (const entry of [...baseCatalog.entries,...extraEntries,...popCultureEntries,...youthEntries,...printSnackEntries,...schoolMediaEntries]) {
 if (seen.has(entry.id)) continue;
 seen.add(entry.id);
 entries.push(entry);
}

const catalog = {
 ...baseCatalog,
 version: PRODUCT_VERSION,
 notice: `${baseCatalog.notice} Katalog v${PRODUCT_VERSION} menggabungkan TV/kartun, permainan rakyat, musik, Ramadhan, warung, anime, benda permainan, budaya baca, makanan/minuman, personal audio, budaya sekolah, teknologi komunikasi, dan film dengan provenance per entri serta audit editorial non-historis untuk menjaga kualitas saat katalog diperluas.`,
 entries
};

export default catalog;
