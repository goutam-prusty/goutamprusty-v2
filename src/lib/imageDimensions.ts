import { normalizeAssetPath } from './pathNormalizer';

export interface ImageDimensions {
  width: number;
  height: number;
}

const proc = (globalThis as any).process;
const fsModule: any = proc?.getBuiltinModule ? proc.getBuiltinModule('fs') : null;
const pathModule: any = proc?.getBuiltinModule ? proc.getBuiltinModule('path') : null;

const dimensionCache = new Map<string, ImageDimensions | null>();
const PUBLIC_ROOT: string = pathModule && proc?.cwd ? pathModule.resolve(proc.cwd(), 'public') : '';

function asciiAt(bytes: Uint8Array, start: number, len: number): string {
  let out = '';
  for (let i = 0; i < len && start + i < bytes.length; i++) {
    out += String.fromCharCode(bytes[start + i]);
  }
  return out;
}

function readUInt16LE(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUInt16BE(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function readUInt24LE(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16);
}

function readUInt32LE(bytes: Uint8Array, offset: number): number {
  return (
    (bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24)) >>>
    0
  );
}

function readUInt32BE(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  );
}

function parseWebpDimensions(bytes: Uint8Array): ImageDimensions | null {
  if (bytes.length < 30) return null;
  if (asciiAt(bytes, 0, 4) !== 'RIFF' || asciiAt(bytes, 8, 4) !== 'WEBP') {
    return null;
  }

  const chunkHeader = asciiAt(bytes, 12, 4);

  // Extended WebP (VP8X)
  if (chunkHeader === 'VP8X' && bytes.length >= 30) {
    const width = 1 + readUInt24LE(bytes, 24);
    const height = 1 + readUInt24LE(bytes, 27);
    return { width, height };
  }

  // Lossy WebP (VP8 )
  if (chunkHeader === 'VP8 ' && bytes.length >= 30) {
    if (bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
      const width = readUInt16LE(bytes, 26) & 0x3fff;
      const height = readUInt16LE(bytes, 28) & 0x3fff;
      return { width, height };
    }
  }

  // Lossless WebP (VP8L)
  if (chunkHeader === 'VP8L' && bytes.length >= 25) {
    if (bytes[20] === 0x2f) {
      const bits = readUInt32LE(bytes, 21);
      const width = (bits & 0x3fff) + 1;
      const height = ((bits >> 14) & 0x3fff) + 1;
      return { width, height };
    }
  }

  return null;
}

function parsePngDimensions(bytes: Uint8Array): ImageDimensions | null {
  if (bytes.length < 24) return null;
  if (bytes[0] !== 0x89 || asciiAt(bytes, 1, 3) !== 'PNG') return null;
  return {
    width: readUInt32BE(bytes, 16),
    height: readUInt32BE(bytes, 20),
  };
}

function parseGifDimensions(bytes: Uint8Array): ImageDimensions | null {
  if (bytes.length < 10) return null;
  const sig = asciiAt(bytes, 0, 6);
  if (sig !== 'GIF87a' && sig !== 'GIF89a') return null;
  return {
    width: readUInt16LE(bytes, 6),
    height: readUInt16LE(bytes, 8),
  };
}

function parseJpegDimensions(bytes: Uint8Array): ImageDimensions | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = bytes[offset + 1];
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      return {
        height: readUInt16BE(bytes, offset + 5),
        width: readUInt16BE(bytes, offset + 7),
      };
    }
    if (offset + 3 >= bytes.length) break;
    const segLen = readUInt16BE(bytes, offset + 2);
    if (segLen < 2) break;
    offset += 2 + segLen;
  }
  return null;
}

/**
 * Reads intrinsic pixel dimensions from a local static image under `public/`.
 * Returns null for remote URLs, missing files, or unsupported formats.
 */
export function getImageDimensions(assetPath?: string | null): ImageDimensions | null {
  if (!fsModule || !pathModule || !PUBLIC_ROOT) return null;

  const normalized = normalizeAssetPath(assetPath);
  if (!normalized || !normalized.startsWith('/')) return null;

  const cleanRel = normalized.split(/[?#]/)[0].slice(1);
  if (!cleanRel) return null;

  if (dimensionCache.has(cleanRel)) {
    return dimensionCache.get(cleanRel) ?? null;
  }

  const resolved: string = pathModule.resolve(PUBLIC_ROOT, cleanRel);
  if (!resolved.startsWith(PUBLIC_ROOT + pathModule.sep)) {
    dimensionCache.set(cleanRel, null);
    return null;
  }

  try {
    if (!fsModule.existsSync(resolved)) {
      dimensionCache.set(cleanRel, null);
      return null;
    }

    const raw = fsModule.readFileSync(resolved);
    const bytes = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength);
    const dims =
      parseWebpDimensions(bytes) ||
      parsePngDimensions(bytes) ||
      parseJpegDimensions(bytes) ||
      parseGifDimensions(bytes);

    dimensionCache.set(cleanRel, dims);
    return dims;
  } catch {
    dimensionCache.set(cleanRel, null);
    return null;
  }
}
