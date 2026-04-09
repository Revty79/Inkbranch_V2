import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url))
});

const UI_IMPORT_GUARDS = [
  {
    group: ["@/data/db/**", "@/data/queries/**", "@/data/mutations/**"],
    message: "UI must not import data-layer modules directly."
  },
  {
    group: [
      "@/core/planner/services/**",
      "@/core/runtime/services/**",
      "@/core/generator/adapters/**"
    ],
    message: "UI must not import planner/runtime/generator service internals."
  }
];

const CORE_IMPORT_GUARDS = [
  {
    group: ["@/app/**", "@/ui/**", "@/data/**"],
    message: "Core must remain framework- and persistence-independent."
  }
];

const DATA_IMPORT_GUARDS = [
  {
    group: ["@/app/**", "@/ui/**"],
    message: "Data layer must not depend on app or ui layers."
  }
];

const APP_PAGE_IMPORT_GUARDS = [
  {
    group: [
      "@/core/planner/services/**",
      "@/core/runtime/services/**",
      "@/core/generator/adapters/**"
    ],
    message:
      "App pages/layouts must not directly own planner/runtime/generator service logic."
  }
];

const LIB_IMPORT_GUARDS = [
  {
    group: [
      "@/app/**",
      "@/ui/**",
      "@/data/**",
      "@/core/planner/**",
      "@/core/runtime/**",
      "@/core/generator/**"
    ],
    message:
      "Lib must stay small and must not become a cross-layer dependency sink."
  }
];

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "out/**",
      "dist/**",
      "next-env.d.ts"
    ]
  },
  {
    files: ["src/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: UI_IMPORT_GUARDS }]
    }
  },
  {
    files: ["src/core/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: CORE_IMPORT_GUARDS }]
    }
  },
  {
    files: ["src/data/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: DATA_IMPORT_GUARDS }]
    }
  },
  {
    files: ["src/app/**/page.tsx", "src/app/**/layout.tsx"],
    rules: {
      "no-restricted-imports": ["error", { patterns: APP_PAGE_IMPORT_GUARDS }]
    }
  },
  {
    files: ["src/lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: LIB_IMPORT_GUARDS }]
    }
  }
];

export default config;
