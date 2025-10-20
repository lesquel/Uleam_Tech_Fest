// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-ignore - tailwindcss plugin type differs between Astro's bundled Vite and project Vite version
    plugins: tailwindcss(),
  },
});
