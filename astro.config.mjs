import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL ?? "https://yyzucommunity.netlify.app";

export default defineConfig({
  site,
  output: "static",
  integrations: [sitemap()],
});
