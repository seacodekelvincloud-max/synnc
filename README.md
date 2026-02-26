# synnc

Design Token to CSS Automation System

## Overview

This repository provides an automated system that converts JSON design tokens to CSS custom properties. When you push changes to `tokens.json`, a GitHub Action automatically generates the corresponding CSS file.

## How It Works

1. **JSON Input**: Edit the `tokens.json` file with your design tokens
2. **Automatic Conversion**: A GitHub Action triggers on push and converts the JSON to CSS
3. **CSS Output**: The generated `tokens.css` file contains CSS custom properties in `:root`

## Structure

```
.
├── tokens.json              # Source design tokens (edit this)
├── tokens.css               # Generated CSS (auto-generated)
├── convert-tokens.js        # Conversion script
└── .github/
    └── workflows/
        └── convert-tokens.yml  # GitHub Action workflow
```

## JSON Format

The `tokens.json` file supports nested structures. Each path in the JSON becomes a CSS custom property name, with parts joined by `--`.

### Example

```json
{
  "Typography": {
    "Header": {
      "Font-Size": {
        "H1": "48px"
      }
    }
  }
}
```

Converts to:

```css
:root {
  --Typography--Header--Font-Size--H1: 48px;
}
```

## Usage

### Editing Tokens

1. Edit `tokens.json` with your design tokens
2. Commit and push the changes
3. The GitHub Action will automatically generate `tokens.css`

### Manual Conversion

You can also run the conversion script locally:

```bash
node convert-tokens.js tokens.json tokens.css
```

### Custom Input/Output Files

```bash
node convert-tokens.js <input.json> <output.css>
```

## GitHub Action

The workflow triggers automatically when:
- `tokens.json` is modified and pushed
- A pull request modifies `tokens.json`
- Manually triggered via workflow dispatch

The action:
1. Checks out the repository
2. Runs the conversion script
3. Commits and pushes the generated CSS (if changes detected)

## Design Tokens Included

The current `tokens.json` includes:
- Typography (Headers, Paragraphs, Labels, Captions)
- Layout Settings (Radius, Gaps, Padding)
- Frame Settings (Device, Margin, Gutter, Column)
- Font Families
- Color Palette (Backgrounds, Buttons, Typography colors)

## License

MIT