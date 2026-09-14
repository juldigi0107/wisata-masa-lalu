import baseCatalog from './catalog.js';
import {extraEntries,enrichmentVersion} from './enrichment.js';

const ids = new Set(baseCatalog.entries.map(entry=>entry.id));
const additions = extraEntries.filter(entry=>!ids.has(entry.id));

const catalog = {
 ...baseCatalog,
 version: enrichmentVersion,
 notice: `${baseCatalog.notice} Batch permainan rakyat resmi ditambahkan pada katalog v${enrichmentVersion}.`,
 entries: [...baseCatalog.entries,...additions]
};

export default catalog;
