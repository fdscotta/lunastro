import icon from "astro-icon";
import { defineConfig } from "astro/config";
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: "https://torneos-manager-f.vercel.app/",
  integrations: [icon()],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
});
