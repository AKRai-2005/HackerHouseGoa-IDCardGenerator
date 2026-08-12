// Code 128 bar/space width patterns, indexed by symbol value.
// Each digit is a module count, alternating bar, space, bar, space…
const PATTERNS = `212222 222122 222221 121223 121322 131222 122213 122312 132212 221213
221312 231212 112232 122132 122231 113222 123122 123221 223211 221132
221231 213212 223112 312131 311222 321122 321221 312212 322112 322211
212123 212321 232121 111323 131123 131321 112313 132113 132311 211313
231113 231311 112133 112331 132131 113123 113321 133121 313121 211331
231131 213113 213311 213131 311123 311321 331121 312113 312311 332111
314111 221411 431111 111224 111422 121124 121421 141122 141221 112214
112412 122114 122411 142112 142211 241211 221114 413111 241112 134111
111242 121142 121241 114212 124112 124211 411212 421112 421211 212141
214121 412121 111143 111341 131141 114113 114311 411113 411311 113141
114131 311141 411131 211412 211214 211232 2331112`.split(/\s+/);

const START_B = 104;
const STOP = 106;

/**
 * Encodes text as Code 128 subset B and returns the bar/space run lengths in
 * modules, starting with a bar. Callers scale a module to whatever width fits.
 */
export function code128(text) {
  const chars = [...text].filter((c) => {
    const code = c.charCodeAt(0);
    return code >= 32 && code <= 126; // subset B's printable range
  });

  const values = chars.map((c) => c.charCodeAt(0) - 32);

  // Checksum is the start value plus each symbol weighted by its position.
  let sum = START_B;
  values.forEach((v, i) => {
    sum += v * (i + 1);
  });

  const symbols = [START_B, ...values, sum % 103, STOP];
  return symbols.flatMap((s) => [...PATTERNS[s]].map(Number));
}

/** Draws the barcode into the given box, centred, with quiet zones. */
export function drawBarcode(ctx, text, x, y, width, height, color) {
  const runs = code128(text);
  const total = runs.reduce((a, b) => a + b, 0);
  const module = width / total;

  ctx.save();
  ctx.fillStyle = color;
  let cursor = x;
  runs.forEach((run, i) => {
    if (i % 2 === 0) ctx.fillRect(cursor, y, run * module, height); // even = bar
    cursor += run * module;
  });
  ctx.restore();
}
