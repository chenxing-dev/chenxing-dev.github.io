import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/tissue-pack-os/",
  plugins: [vue(), UnoCSS()]
});
