import { ParsedKeymap } from './KeymapCParser';

const SHIM_BEGIN_MARKER = '/* BEGIN Remap shim: RGB/UG compat */';
const SHIM_END_MARKER = '/* END Remap shim: RGB/UG compat */';

// Bridges modern UG_* names in the generated keymap back to the legacy
// RGB_* names that older QMK Firmware versions define. When built against
// modern QMK the UG_* names are already defined and this block is a no-op.
const RGB_UG_COMPAT_SHIM = [
  SHIM_BEGIN_MARKER,
  '#if !defined(UG_TOGG) && defined(RGB_TOG)',
  '#  define UG_TOGG  RGB_TOG',
  '#  define UG_NEXT  RGB_MODE_FORWARD',
  '#  define UG_PREV  RGB_MODE_REVERSE',
  '#  define UG_HUEU  RGB_HUI',
  '#  define UG_HUED  RGB_HUD',
  '#  define UG_SATU  RGB_SAI',
  '#  define UG_SATD  RGB_SAD',
  '#  define UG_VALU  RGB_VAI',
  '#  define UG_VALD  RGB_VAD',
  '#  define UG_SPDU  RGB_SPI',
  '#  define UG_SPDD  RGB_SPD',
  '#endif',
  SHIM_END_MARKER,
].join('\n');

const UG_NAME_PATTERN =
  /\bUG_(?:TOGG|NEXT|PREV|HUEU|HUED|SATU|SATD|VALU|VALD|SPDU|SPDD)\b/;

// Matches any UG/RGB compatibility shim block so it can be stripped and
// re-injected in a canonical form. The anchor is the `#if !defined(UG_TOGG)
// && defined(RGB_TOG)` condition — a signature unique to this shim — so
// legacy or hand-written variants without the BEGIN/END markers are also
// caught. Surrounding blank lines are consumed to prevent whitespace from
// accumulating across round-trips.
const EXISTING_SHIM_PATTERN =
  /\n*(?:\/\* BEGIN Remap shim: RGB\/UG compat \*\/\s*\n)?#if\s+!defined\(UG_TOGG\)\s*&&\s*defined\(RGB_TOG\)[\s\S]*?#endif(?:\s*\n\/\* END Remap shim: RGB\/UG compat \*\/)?\n*/g;

function hasUgKeycode(layers: ParsedKeymap['layers']): boolean {
  for (const layer of layers) {
    for (const name of layer.keycodeNames) {
      if (UG_NAME_PATTERN.test(name)) {
        return true;
      }
    }
  }
  return false;
}

function stripShim(preamble: string): string {
  // Collapse shim + its surrounding newlines into a single blank line, then
  // squash any accidental runs of blank lines so the preamble cannot grow
  // unbounded across successive parse/generate cycles.
  return preamble
    .replace(EXISTING_SHIM_PATTERN, '\n\n')
    .replace(/\n{3,}/g, '\n\n');
}

function injectShim(preamble: string): string {
  const stripped = stripShim(preamble);
  const declIdx = stripped.search(/const\s+uint16_t\s+PROGMEM\s+keymaps/);
  if (declIdx === -1) {
    return stripped.replace(/\s*$/, '') + '\n\n' + RGB_UG_COMPAT_SHIM + '\n';
  }
  const before = stripped.slice(0, declIdx).replace(/\s*$/, '');
  const after = stripped.slice(declIdx);
  return before + '\n\n' + RGB_UG_COMPAT_SHIM + '\n\n' + after;
}

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

  const preamble = hasUgKeycode(parsed.layers)
    ? injectShim(parsed.preamble)
    : stripShim(parsed.preamble);

  let result = preamble + '\n';

  parsed.layers.forEach((layer, i) => {
    result += `${indent}[${layer.index}] = ${parsed.layoutMacroName}(\n`;

    if (keysPerRow && keysPerRow.length > 0) {
      let keyIndex = 0;
      for (let row = 0; row < keysPerRow.length; row++) {
        const count = keysPerRow[row];
        const rowKeys: string[] = [];
        for (
          let j = 0;
          j < count && keyIndex < layer.keycodeNames.length;
          j++
        ) {
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

  result += '};';
  result += parsed.postamble;

  return result;
}
