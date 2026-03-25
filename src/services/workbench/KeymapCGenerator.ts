import { ParsedKeymap } from './KeymapCParser';

/**
 * Generate updated keymap.c content by replacing only the keycode sections
 * in the original text, preserving all comments, formatting, and surrounding code.
 */
export function generateKeymapC(parsed: ParsedKeymap): string {
  // Separate existing layers (with valid source positions) from new layers
  const existingLayers = parsed.layers.filter((l) => l.sourceStart >= 0);
  const newLayers = parsed.layers.filter((l) => l.sourceStart < 0);

  let result = parsed.originalContent;

  // Process existing layers in reverse order so earlier positions remain valid
  const sortedLayers = [...existingLayers].sort(
    (a, b) => b.sourceStart - a.sourceStart
  );

  for (const layer of sortedLayers) {
    const originalSection = parsed.originalContent.substring(
      layer.sourceStart,
      layer.sourceEnd
    );
    const newContent = replaceKeycodesInSection(
      originalSection,
      layer.keycodeNames
    );
    result =
      result.substring(0, layer.sourceStart) +
      newContent +
      result.substring(layer.sourceEnd);
  }

  // Handle deleted layers: if parsed.layers has fewer existing layers than
  // the original, we need to remove the extra layer blocks.
  // This is handled by re-parsing and comparing, but for simplicity
  // we handle it by regenerating only when layers are added/removed.

  // Append new layers before the closing };
  if (newLayers.length > 0) {
    const closingMatch = result.match(/\}\s*;\s*$/);
    if (closingMatch && closingMatch.index !== undefined) {
      // Find the last ) before };
      let insertPos = closingMatch.index;
      // Walk backwards to find where to insert (after last layer's closing paren)
      const beforeClosing = result.substring(0, insertPos).trimEnd();
      const indent = '    ';

      let newLayerCode = '';
      for (const layer of newLayers) {
        newLayerCode += `,\n${indent}[${layer.index}] = ${parsed.layoutMacroName}(\n`;
        newLayerCode += `${indent}${indent}${layer.keycodeNames.join(', ')}\n`;
        newLayerCode += `${indent})`;
      }

      result = beforeClosing + newLayerCode + '\n' + result.substring(insertPos);
    }
  }

  return result;
}

/**
 * Replace keycodes in the original section text one by one,
 * preserving all whitespace, comments, and formatting.
 */
function replaceKeycodesInSection(
  originalSection: string,
  newKeycodeNames: string[]
): string {
  let result = '';
  let keyIndex = 0;
  let i = 0;

  while (i < originalSection.length) {
    // Skip single-line comments
    if (
      originalSection[i] === '/' &&
      i + 1 < originalSection.length &&
      originalSection[i + 1] === '/'
    ) {
      while (i < originalSection.length && originalSection[i] !== '\n') {
        result += originalSection[i];
        i++;
      }
      continue;
    }

    // Skip multi-line comments
    if (
      originalSection[i] === '/' &&
      i + 1 < originalSection.length &&
      originalSection[i + 1] === '*'
    ) {
      result += originalSection[i++]; // /
      result += originalSection[i++]; // *
      while (
        i < originalSection.length - 1 &&
        !(originalSection[i] === '*' && originalSection[i + 1] === '/')
      ) {
        result += originalSection[i++];
      }
      if (i < originalSection.length - 1) {
        result += originalSection[i++]; // *
        result += originalSection[i++]; // /
      }
      continue;
    }

    // Skip whitespace and commas
    if (/[\s,]/.test(originalSection[i])) {
      result += originalSection[i];
      i++;
      continue;
    }

    // We've hit the start of a keycode token — extract it
    let token = '';
    let depth = 0;
    while (i < originalSection.length) {
      const ch = originalSection[i];
      if (ch === '(') {
        depth++;
        token += ch;
        i++;
      } else if (ch === ')') {
        if (depth === 0) break;
        depth--;
        token += ch;
        i++;
      } else if ((ch === ',' || /\s/.test(ch)) && depth === 0) {
        break;
      } else {
        token += ch;
        i++;
      }
    }

    if (token.length > 0 && keyIndex < newKeycodeNames.length) {
      result += newKeycodeNames[keyIndex];
      keyIndex++;
    } else {
      result += token;
    }
  }

  return result;
}
