import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * Reloads the browser whenever a skin file changes. The skins are loaded via
 * plain <link> tags (so they behave exactly like AO3 loads them), which means
 * they live outside Vite's module graph and need a manual watch.
 */
function skinReload() {
  const skins = ["skin.css", "DO_NOT_EDIT-original-skin.css"];
  let skinPaths = [];
  return {
    name: "skin-reload",
    configResolved(config) {
      skinPaths = skins.map((f) => resolve(config.root, f));
    },
    handleHotUpdate({ file, server }) {
      if (skinPaths.includes(file)) {
        // Skins load via plain <link> tags, so Vite's default CSS HMR can't
        // see them. Force a full reload; the toolbar re-injects the skin with
        // a fresh cache-busting query on load.
        server.config.logger.info(
          `\x1b[35m[skin-reload]\x1b[0m ${file.split("/").pop()} changed \u2192 reloading preview`,
        );
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

export default defineConfig({
  // Repo root is the Vite root so the skin files (and the AO3 default
  // stylesheets under preview/assets) are all served as-is.
  root: ".",
  publicDir: "public",
  server: {
    open: "/preview/home.html",
  },
  plugins: [skinReload()],
});
