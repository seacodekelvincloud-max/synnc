#!/usr/bin/env node
/**
 * Converts a nested JSON design tokens file into a CSS file
 * with custom properties declared in :root.
 *
 * Usage: node scripts/json-to-css.js [input.json] [output.css]
 *   Defaults: tokens.json -> styles/variables.css
 */

const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2] || path.join(__dirname, '..', 'tokens.json');
const outputFile = process.argv[3] || path.join(__dirname, '..', 'styles', 'variables.css');

/**
 * Recursively flattens a nested object into CSS custom property declarations.
 * Keys at each level are joined with '--'.
 */
function flatten(obj, prefix) {
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}--${key}` : `--${key}`;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      lines.push(...flatten(value, varName));
    } else {
      lines.push(`  ${varName}: ${value};`);
    }
  }
  return lines;
}

const tokens = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const declarations = flatten(tokens, '');

const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const css = `:root {\n${declarations.join('\n')}\n}\n`;
fs.writeFileSync(outputFile, css, 'utf8');

console.log(`Generated ${outputFile} with ${declarations.length} custom properties.`);
