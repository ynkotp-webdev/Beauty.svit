import type { APIRoute } from 'astro';
import { SERVICE_PAGES } from '../lib/site';

// Свой эндпоинт вместо @astrojs/sitemap: интеграция кладёт sitemap-index.xml,
// а детекторы и поисковики спрашивают /sitemap.xml. Один файл, без индекса.
const ORIGIN = 'https://svit.beauty';

const PAGES: { path: string; priority: string }[] = [
  { path: '/', priority: '1.0' },
  { path: '/tsiny/', priority: '0.9' },
  { path: '/roboty/', priority: '0.7' },
  { path: '/majstry/', priority: '0.8' },
  { path: '/pro-salon/', priority: '0.6' },
  { path: '/salon-krasy-sykhiv/', priority: '0.7' },
  ...SERVICE_PAGES.map((p) => ({ path: `/poslugy/${p.slug}/`, priority: '0.8' })),
];

export const GET: APIRoute = () => {
  const today = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (p) => `  <url>
    <loc>${ORIGIN}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
  </url>`,
).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
