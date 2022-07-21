import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://app.nation3.org',
    supportFile: false
  }
});
