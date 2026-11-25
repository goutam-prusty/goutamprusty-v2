import type { APIRoute } from 'astro';
import {
  getAllProjectSlugs,
  getAllResearchSlugs,
  getAllWritingSlugs,
} from '../lib/sanityClient';

const SITE = 'https://goutamprusty.com';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const [projectSlugs, researchSlugs, writingSlugs] = await Promise.all([
    getAllProjectSlugs(),
    getAllResearchSlugs(),
    getAllWritingSlugs(),
  ]);

  const staticPaths = [
    '/',
    '/projects/',
    '/research/',
    '/writing/',
    '/about/',
    '/contact/',
  ];

  const dynamicPaths = [
    ...projectSlugs.map((slug) => `/projects/${slug}/`),
    ...researchSlugs.map((slug) => `/research/${slug}/`),
    ...writingSlugs.map((slug) => `/writing/${slug}/`),
  ];

  const allUrls = Array.from(new Set([...staticPaths, ...dynamicPaths])).map(
    (path) => `${SITE}${path}`
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allUrls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
