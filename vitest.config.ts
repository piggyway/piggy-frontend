import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      "@": dirname,
      // `import "server-only"` throws outside the react-server condition, which
      // Vitest does not set. Resolve it to the package's own no-op entry so
      // server modules stay testable without weakening the guard in the app.
      "server-only": path.join(dirname, "node_modules/server-only/empty.js"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: [
            "lib/**/*.test.ts",
            "hooks/**/*.test.{ts,tsx}",
            "contexts/**/*.test.tsx",
            "app/api/**/*.test.ts",
            "components/**/*.test.tsx",
            "middleware.test.ts",
          ],
        },
      },
    ],
  },
});
