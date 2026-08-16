import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

// BASE задаётся только для превью на GitHub Pages: BASE=/Beauty.svit npm run build.
// Ссылки и ассеты из public/ идут через u() из src/lib/site.ts — иначе они ломаются на подпути.
const base = process.env.BASE || '/';

export default defineConfig({
  site: 'https://svit.beauty',
  base,
  trailingSlash: 'always',
  vite: { plugins: [tailwind()] },
});
