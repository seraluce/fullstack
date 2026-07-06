import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Prisma 7 generated client
    "src/generated/**",
    // Playwright
    "playwright-report/**",
    "test-results/**",
    "blob-report/**",
    "playwright/.cache/**",
  ]),
  {
    rules: {
      // Allow unused vars prefixed with _ (common in callbacks / server actions).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
