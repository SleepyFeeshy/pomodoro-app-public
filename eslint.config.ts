import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  tseslint.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
  // plugins: { js }, 
  // extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } },
  {
    rules: {
      "indent": ["error", 2],
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
  // pluginReact.configs.flat.recommended,
]);
