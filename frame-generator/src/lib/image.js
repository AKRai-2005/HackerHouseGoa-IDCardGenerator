const MAX_BYTES = 25 * 1024 * 1024;
const HEIC_NAME = /\.(heic|heif)$/i;

// iPhones hand us HEIC with an empty or non-standard MIME type often enough
// that the filename is the more reliable signal.
const isHeic = (file) =>
  /image\/hei[cf]/i.test(file.type) || HEIC_NAME.test(file.name);

// Safari <16.4 rejects the imageOrientation option, so fall back to an <img>,
// which applies EXIF rotation natively.
function decodeViaElement(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image.'));
    };
    img.src = url;
  });
}

/**
 * Turns a user-selected file into something drawImage() can paint directly.
 * Decoding happens once here rather than on every canvas redraw.
 */
export async function decodeImageFile(file) {
  if (file.size > MAX_BYTES) {
    throw new Error('Image is over 25MB — try a smaller one.');
  }

  let blob = file;

  if (isHeic(file)) {
    try {
      // Decoder is only downloaded by the people who actually need it.
      const { default: heic2any } = await import('heic2any');
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.92,
      });
      blob = Array.isArray(converted) ? converted[0] : converted;
    } catch {
      throw new Error("Couldn't read that HEIC — try sharing it as JPG.");
    }
  } else if (!file.type.startsWith('image/')) {
    throw new Error('That file is not an image.');
  }

  try {
    return await createImageBitmap(blob, { imageOrientation: 'from-image' });
  } catch {
    return decodeViaElement(blob);
  }
}
