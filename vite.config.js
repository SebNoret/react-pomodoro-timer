import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import { createHtmlPlugin } from "vite-plugin-html";
const isProduction = process.env.NODE_ENV === "production";
const localPortfolioUrl = "http://localhost:1313/pomodoro/demo/";
const prodPortfolioUrl =
  "https://sebnoret-portfolio.netlify.app/pomodoro/demo/";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  /**
   *
   *
   * Change the base url to the local portfolio url if you want to test the app locally
   */
  base: isProduction ? prodPortfolioUrl : "/",
  build: {
    minify: "esbuild",
  },
});
