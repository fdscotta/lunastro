import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://torneos-manager-f.vercel.app/",
  integrations: [icon()],
  output: 'static',
});
