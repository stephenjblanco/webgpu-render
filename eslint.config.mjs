import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin'


export default defineConfig([
  tseslint.configs.recommended,
  { 
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { 
      js, 
      "@stylistic": stylistic 
    }, 
    extends: ["js/recommended"],
    rules: {
      "no-undef": "off",
      "@stylistic/indent": ["error", 4],
      "@stylistic/semi": [
        "error", 
        "always",
        { 
          "omitLastInOneLineBlock": true,
          "omitLastInOneLineClassBody": true,
        }
      ]
    }
  },
  globalIgnores(
    [
      "dist/**", 
      "node_modules/**"
    ]
  ),
]);