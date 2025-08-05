import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Custom plugin to copy WK theme assets
    {
      name: 'copy-wk-theme-assets',
      buildStart() {
        // Create assets directories if they don't exist
        const publicDir = resolve(__dirname, 'public');
        const assetsDir = resolve(publicDir, 'assets');
        const fontsDir = resolve(assetsDir, 'fonts');
        const iconsDir = resolve(assetsDir, 'icons'); 
        const imagesDir = resolve(assetsDir, 'images');
        
        [publicDir, assetsDir, fontsDir, iconsDir, imagesDir].forEach(dir => {
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
          }
        });
      }
    }
  ],
  publicDir: "./public",
  base: "./",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules'],
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}));
