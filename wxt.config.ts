import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || ''),
    },
  }),
  manifest: {
    name: 'HoldOn - Circular Shopping Assistant',
    description: 'Think before you click buy. True Cost analysis, repairability scores, decision tree, local options, and 30-day pause list.',
    version: '1.0.0',
    permissions: ['storage', 'tabs', 'activeTab'],
    host_permissions: [
      '*://*.amazon.in/*',
      '*://*.amazon.com/*',
      '*://*.flipkart.com/*',
      'https://generativelanguage.googleapis.com/*',
      'https://api.x.ai/*'
    ],
  },
});
