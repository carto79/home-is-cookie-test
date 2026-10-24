import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://www.homeiscookie.com', output: 'static', devToolbar: { enabled: false }, vite: { server: { allowedHosts: ['terminal.local'] } } });
