export interface PortableTextChild {
  _type?: string;
  text?: string;
  [key: string]: unknown;
}

export interface PortableTextBlock {
  _type?: string;
  children?: PortableTextChild[];
  [key: string]: unknown;
}

export interface ReadingTimeSource {
  readingTimeOverride?: string | number | null;
  readingTimeMinutes?: number | null;
  body?: PortableTextBlock[] | null;
}

/**
 * Calculates estimated reading time for articles.
 *
 * Precedence:
 * 1. readingTimeOverride (when present)
 * 2. readingTimeMinutes (when present)
 * 3. Word-count estimate from Portable Text blocks at 200 words/min, rounded up
 * 4. Safe fallback: '1 min read'
 */
export function getArticleReadingTime(doc?: ReadingTimeSource | null): string {
  const explicit = doc?.readingTimeOverride ?? doc?.readingTimeMinutes;
  if (explicit !== undefined && explicit !== null && explicit !== '') {
    return typeof explicit === 'string' && explicit.toLowerCase().includes('min')
      ? explicit
      : `${explicit} min read`;
  }

  const blocks = doc?.body;
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return '1 min read';
  }

  let totalWords = 0;
  for (const block of blocks) {
    if (block?._type === 'block' && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child?.text === 'string') {
          const words = child.text.trim().split(/\s+/).filter(Boolean).length;
          totalWords += words;
        }
      }
    }
  }

  if (totalWords === 0) {
    return '1 min read';
  }

  const minutes = Math.ceil(totalWords / 200);
  return `${minutes} min read`;
}
