import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Set VITE_SITE_URL to the final address (https://example.com/) before the
// production build so WhatsApp and other apps can find the preview image.
export default defineConfig(({ mode }) => {
  const siteUrl = (loadEnv(mode, process.cwd(), '').VITE_SITE_URL ?? '').replace(/\/?$/, '/')
  const base = siteUrl === '/' ? '' : siteUrl

  return {
    base: './',
    optimizeDeps: {
      entries: ['index.html'],
    },
    plugins: [
      react(),
      viteSingleFile(),
      {
        name: 'site-url',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', base),
      },
    ],
  }
})
