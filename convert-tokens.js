#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Converts a nested JSON object to CSS custom properties
 * @param {Object} obj - The JSON object to convert
 * @param {string} prefix - The prefix for the CSS variable names
 * @returns {Array<{name: string, value: string}>} - Array of CSS custom properties
 */
function jsonToCssVariables(obj, prefix = '') {
  const variables = [];

  function traverse(current, pathParts) {
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      for (const [key, value] of Object.entries(current)) {
        traverse(value, [...pathParts, key]);
      }
    } else {
      // Leaf node - create CSS variable
      const varName = pathParts.join('--');
      variables.push({ name: varName, value: String(current) });
    }
  }

  // Handle top-level keys
  for (const [key, value] of Object.entries(obj)) {
    traverse(value, [key]);
  }

  return variables;
}

/**
 * Formats CSS custom properties into a CSS file
 * @param {Array<{name: string, value: string}>} variables - Array of CSS custom properties
 * @returns {string} - Formatted CSS string
 */
function formatCss(variables) {
  let css = ':root {\n';
  
  // Group variables by their first prefix for better organization
  const grouped = {};
  const ungrouped = [];
  
  variables.forEach(({ name, value }) => {
    const parts = name.split('--');
    if (parts.length > 1) {
      const group = parts[0];
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push({ name, value });
    } else {
      ungrouped.push({ name, value });
    }
  });
  
  // Write grouped variables with comments
  const groupKeys = Object.keys(grouped).sort();
  
  groupKeys.forEach((group, index) => {
    if (index > 0) {
      css += '\n';
    }
    css += `  /* ${group} */\n`;
    grouped[group].forEach(({ name, value }) => {
      css += `  --${name}: ${value}; \n`;
    });
  });
  
  // Write ungrouped variables
  if (ungrouped.length > 0) {
    if (groupKeys.length > 0) {
      css += '\n';
    }
    ungrouped.forEach(({ name, value }) => {
      css += `  --${name}: ${value}; \n`;
    });
  }
  
  css += '\n}\n';
  return css;
}

/**
 * Main function to convert JSON tokens to CSS
 */
function main() {
  const args = process.argv.slice(2);
  const inputFile = args[0] || 'tokens.json';
  const outputFile = args[1] || 'tokens.css';

  try {
    // Read JSON file
    const jsonContent = fs.readFileSync(inputFile, 'utf8');
    const tokens = JSON.parse(jsonContent);

    // Convert to CSS variables
    const variables = jsonToCssVariables(tokens);

    // Format as CSS
    const css = formatCss(variables);

    // Write to output file
    fs.writeFileSync(outputFile, css, 'utf8');

    console.log(`✓ Successfully converted ${inputFile} to ${outputFile}`);
    console.log(`✓ Generated ${variables.length} CSS custom properties`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run main function if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { jsonToCssVariables, formatCss };
