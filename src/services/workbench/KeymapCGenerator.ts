import { ParsedKeymap } from './KeymapCParser';

/**
 * Generate keymap.c content from a ParsedKeymap.
 * Preserves preamble and postamble exactly. Regenerates the keymaps array
 * with proper formatting based on keysPerRow layout info.
 *
 * @param parsed - The parsed keymap structure
 * @param keysPerRow - Array of key counts per row (e.g., [12, 12, 12, 6] for split_3x6_3).
 *                     If not provided, all keycodes are placed on a single line.
 */
export function generateKeymapC(
  parsed: ParsedKeymap,
  keysPerRow?: number[]
): string {
  const indent = '    ';
  const keyIndent = indent + indent;

  let result = parsed.preamble + '\n';

  parsed.layers.forEach((layer, i) => {
    result += `${indent}[${layer.index}] = ${parsed.layoutMacroName}(\n`;

    if (keysPerRow && keysPerRow.length > 0) {
      let keyIndex = 0;
      for (let row = 0; row < keysPerRow.length; row++) {
        const count = keysPerRow[row];
        const rowKeys: string[] = [];
        for (let j = 0; j < count && keyIndex < layer.keycodeNames.length; j++) {
          rowKeys.push(layer.keycodeNames[keyIndex]);
          keyIndex++;
        }
        const isLastRow = keyIndex >= layer.keycodeNames.length;
        result += keyIndent + rowKeys.join(', ');
        if (!isLastRow) {
          result += ',';
        }
        result += '\n';
      }
      // Handle any remaining keycodes beyond keysPerRow total
      if (keyIndex < layer.keycodeNames.length) {
        const remaining = layer.keycodeNames.slice(keyIndex);
        result += keyIndent + remaining.join(', ') + '\n';
      }
    } else {
      result += keyIndent + layer.keycodeNames.join(', ') + '\n';
    }

    result += `${indent})`;
    if (i < parsed.layers.length - 1) {
      result += ',';
    }
    result += '\n';
  });

  result += '};\n';
  result += parsed.postamble;

  return result;
}
