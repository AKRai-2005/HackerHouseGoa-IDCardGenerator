// FNV-1a: tiny, fast, and well spread for short strings.
const hash = (str, seed = 0x811c9dc5) => {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

const CLASSES = [
  'TERMINAL WIZARD',
  'PIXEL PIRATE',
  'NIGHT SHIPPER',
  'BEACH ARCHITECT',
  'SYNTAX SURFER',
  'COCONUT COMPILER',
  'ROGUE DEBUGGER',
  'SUNSET STACKER',
  'MONSOON HACKER',
  'CHAI OVERCLOCKER',
  'DEMO DAY MENACE',
  'LATENCY SLAYER',
];

/**
 * Everything on the card that is derived rather than typed. Keyed off the name
 * so the same person always gets the same identity — an ID that changes every
 * render would not feel like an ID.
 */
export function builderMeta(name) {
  const key = (name || '').trim().toUpperCase() || 'SOLO BUILDER';

  const number = String(hash(key) % 10000).padStart(4, '0');

  return {
    id: `HH-GOA-${number}`,
    // Barcodes drop the punctuation: fewer symbols means wider bars in the
    // same space, which is what makes it scan reliably.
    code: `HHGOA${number}`,
    cls: CLASSES[hash(key + '#class') % CLASSES.length],
  };
}
