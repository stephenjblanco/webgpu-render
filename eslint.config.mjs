import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";


export default defineConfig([
    tseslint.configs.recommended,
    {
        files: [ "**/*.{js,mjs,cjs,ts,mts,cts}" ],
        plugins: {
            js,
            tseslint,
            "@stylistic": stylistic,
        },
        extends: [ "js/recommended" ],
        rules: {
            "no-undef": "off",
            "@typescript-eslint/consistent-type-assertions": [
                "error",
                { "assertionStyle": "angle-bracket" },
            ],
            "@stylistic/indent": [ "error", 4 ],
            "@stylistic/semi": [
                "error",
                "always",
                {
                    "omitLastInOneLineBlock": true,
                    "omitLastInOneLineClassBody": true,
                },
            ],
            "@stylistic/function-paren-newline": [
                "error",
                "multiline-arguments",
            ],
            "@stylistic/function-call-argument-newline": [
                "error",
                "consistent",
            ],
            "@stylistic/quotes": [
                "error",
                "double",
                {
                    "avoidEscape": true,
                    "allowTemplateLiterals": true,
                },
            ],
            "@stylistic/brace-style": [
                "error",
                "1tbs",
                { "allowSingleLine": true },
            ],
            "@stylistic/comma-spacing": [ "error" ],
            "@stylistic/key-spacing": [ "error" ],
            "@stylistic/no-trailing-spaces": [ "error" ],
            "@stylistic/no-whitespace-before-property": [ "error" ],
            "@stylistic/array-bracket-spacing": [
                "error",
                "always",
            ],
            "@stylistic/object-curly-newline": [
                "error",
                { "consistent": true },
            ],
            "@stylistic/object-curly-spacing": [
                "error",
                "always",
            ],
            "@stylistic/space-before-blocks": [
                "error",
                "always",
            ],
            "@stylistic/operator-linebreak": [
                "error",
                "before",
            ],
            "@stylistic/object-property-newline": [
                "error",
                { "allowAllPropertiesOnSameLine": true },
            ],
            "@stylistic/no-tabs": [ "error" ],
            "@stylistic/no-mixed-operators": [ "error" ],
            "@stylistic/no-multiple-empty-lines": [ "error" ],
            "@stylistic/no-multi-spaces": [
                "error",
                {
                    "ignoreEOLComments": true,
                    "exceptions": { "ArrayExpression": true },
                },
            ],
            "@stylistic/lines-between-class-members": [
                "error",
                {
                    "enforce": [
                        {
                            "blankLine": "always",
                            "prev": "method",
                            "next": "method",
                        },
                        {
                            "blankLine": "always",
                            "prev": "method",
                            "next": "field",
                        },
                        {
                            "blankLine": "always",
                            "prev": "field",
                            "next": "method",
                        },
                    ],
                },
            ],
            "@stylistic/max-len": [
                "error",
                {
                    "code": 100,
                    "ignoreComments": false,
                    "ignoreStrings": false,
                },
            ],
            "@stylistic/comma-dangle": [
                "error",
                "always-multiline",
            ],
            "@stylistic/comma-style": [
                "error",
                "last",
            ],
            "@stylistic/dot-location": [
                "error",
                "property",
            ],
            "@stylistic/arrow-parens": [
                "error",
                "always",
            ],
            "@stylistic/type-annotation-spacing": [
                "error",
                {
                    "before": false,
                    "after": true,
                },
            ],
        },
    },
    globalIgnores(
        [
            "dist/**",
            "node_modules/**",
        ],
    ),
]);