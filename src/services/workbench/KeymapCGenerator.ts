import { ParsedKeymap } from './KeymapCParser';

/**
 * Generate a keymap.c file content from a ParsedKeymap structure.
 * Produces well-formatted C code with consistent indentation.
 */
export function generateKeymapC(
  parsed: ParsedKeymap,
  keysPerRow?: number
): string {
  let result = parsed.preamble + '\n';

  parsed.layers.forEach((layer, i) => {
    const indent = '    ';
    result += `${indent}[${layer.index}] = ${parsed.layoutMacroName}(\n`;

    if (keysPerRow && keysPerRow > 0) {
      // Format with specified keys per row
      const rows: string[][] = [];
      for (let j = 0; j < layer.keycodeNames.length; j += keysPerRow) {
        rows.push(layer.keycodeNames.slice(j, j + keysPerRow));
      }
      rows.forEach((row, rowIdx) => {
        const isLastRow = rowIdx === rows.length - 1;
        const line = row.join(', ');
        result += `${indent}${indent}${line}${isLastRow ? '' : ','}\n`;
      });
    } else {
      // Single line with all keycodes, wrapped for readability
      const line = layer.keycodeNames.join(', ');
      result += `${indent}${indent}${line}\n`;
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
