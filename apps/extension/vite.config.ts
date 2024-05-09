import fs from "fs";
import { resolve } from "path";
import type { ManifestV3Export } from "@crxjs/vite-plugin";
import type { Plugin } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";

import devManifest from "./manifest.dev.json";
import manifest from "./manifest.json";
import pkg from "./package.json";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

const isDev = process.env.__DEV__ === "true";

const chromeExtensionManifest = {
  ...manifest,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ...(isDev ? devManifest : ({} as ManifestV3Export)),
  name: isDev ? `DEV: ${manifest.name}` : manifest.name,
  version: pkg.version,
};

// plugin to remove dev icons from prod build
function stripDevIcons(apply: boolean): Plugin | null {
  if (apply) return null;

  return {
    name: "strip-dev-icons",
    resolveId(source: string) {
      return source === "virtual-module" ? source : null;
    },
    renderStart(outputOptions, _) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const outDir = outputOptions.dir!;
      fs.rm(resolve(outDir, "dev-icon-32.png"), () =>
        console.log(`Deleted dev-icon-32.png frm prod build`),
      );
      fs.rm(resolve(outDir, "dev-icon-128.png"), () =>
        console.log(`Deleted dev-icon-128.png frm prod build`),
      );
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir,
    },
  },
  plugins: [
    react(),
    Unfonts({
      custom: {
        families: [
          {
            name: "Geist-Sans",
            src: "src/assets/fonts/geist/sans/*.{woff,woff2}",
          },
          {
            name: "Geist-Mono",
            src: "src/assets/fonts/geist/mono/*.{woff,woff2}",
          },
        ],
      },
    }),
    crx({
      manifest: chromeExtensionManifest as ManifestV3Export,
      contentScripts: {
        injectCss: true,
      },
    }),
    stripDevIcons(isDev),
  ],
  publicDir,
  build: {
    outDir,
    sourcemap: isDev,
    emptyOutDir: !isDev,
  },
});
