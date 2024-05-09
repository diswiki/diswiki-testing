import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://diswiki.com',
    integrations: [sitemap()],
    redirects: {
        '/server': '/', // Makes users provide an ID
        '/user': '/'
    }
});
