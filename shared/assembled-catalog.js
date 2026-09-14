import baseCatalog from './catalog.js';
import {extraEntries} from './enrichment.js';
import {popCultureEntries} from './enrichment-popculture.js';
import {youthEntries} from './enrichment-youth.js';
import {printSnackEntries} from './enrichment-print-snacks.js';
import {schoolMediaEntries} from './enrichment-school-media.js';
import {digitalLifeEntries} from './enrichment-digital-life.js';

const PRODUCT_VERSION='2.8.0';
const seen = new Set();
const entries = [];
for (const entry of [...baseCatalog.entries,...extraEntries,...popCultureEntries,...youthEntries,...printSnackEntries,...schoolMediaEntries,...digitalLifeEntries]) {
 if (seen.has(entry.id)) continue;
 seen.add(entry.id);
 entries.push(entry);
}

const catalog = {
 ...baseCatalog,
 version: PRODUCT_VERSION,
 notice: `${baseCatalog.notice} Katalog v${PRODUCT_VERSION} menggabungkan TV/kartun, permainan rakyat, musik, Ramadhan, warung, anime, benda permainan, budaya baca, makanan/minuman, personal audio, budaya sekolah, film, internet komersial, Wartel, komputasi personal, dan infrastruktur internet dengan provenance per entri serta audit editorial evidence-aware.`,
 entries
};

export default catalog;
