/**
 * Parsed representation of a keymap.c file.
 */
export type ParsedKeymapLayer = {
  index: number;
  keycodeNames: string[];
};

export type ParsedKeymap = {
  preamble: string;
  layoutMacroName: string;
  layers: ParsedKeymapLayer[];
  postamble: string;
};

/**
 * Split a comma-separated keycode string, respecting nested parentheses.
 * e.g., "KC_A, LT(1, KC_SPC), MO(1)" → ["KC_A", "LT(1, KC_SPC)", "MO(1)"]
 */
function splitKeycodes(content: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;

  for (const ch of content) {
    if (ch === '(') {
      depth++;
      current += ch;
    } else if (ch === ')') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        result.push(trimmed);
      }
      current = '';
    } else {
      current += ch;
    }
  }

  const trimmed = current.trim();
  if (trimmed.length > 0) {
    result.push(trimmed);
  }

  return result;
}

/**
 * Find the matching closing parenthesis for an opening parenthesis,
 * handling nested parentheses.
 */
function findMatchingParen(text: string, startIndex: number): number {
  let depth = 0;
  for (let i = startIndex; i < text.length; i++) {
    if (text[i] === '(') {
      depth++;
    } else if (text[i] === ')') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Remove C-style single-line and multi-line comments from text.
 * Used only for the keycode array area to avoid breaking preamble/postamble.
 */
function removeCommentsFromKeycodeArea(text: string): string {
  let result = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '/' && i + 1 < text.length && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n') {
        i++;
      }
    } else if (text[i] === '/' && i + 1 < text.length && text[i + 1] === '*') {
      i += 2;
      while (i < text.length - 1 && !(text[i] === '*' && text[i + 1] === '/')) {
        i++;
      }
      i += 2;
    } else {
      result += text[i];
      i++;
    }
  }
  return result;
}

/**
 * Parse a keymap.c file content into a structured representation.
 * Returns null if the content cannot be parsed.
 */
export function parseKeymapC(content: string): ParsedKeymap | null {
  const keymapsPattern =
    /keymaps\s*\[\s*\]\s*\[\s*MATRIX_ROWS\s*\]\s*\[\s*MATRIX_COLS\s*\]\s*=\s*\{/;
  const keymapsMatch = content.match(keymapsPattern);
  if (!keymapsMatch || keymapsMatch.index === undefined) {
    return null;
  }

  const preambleEnd = keymapsMatch.index + keymapsMatch[0].length;
  const preamble = content.substring(0, preambleEnd);

  const afterPreamble = content.substring(preambleEnd);
  let braceDepth = 1;
  let arrayEndIndex = -1;
  for (let i = 0; i < afterPreamble.length; i++) {
    if (afterPreamble[i] === '{') {
      braceDepth++;
    } else if (afterPreamble[i] === '}') {
      braceDepth--;
      if (braceDepth === 0) {
        arrayEndIndex = i;
        break;
      }
    }
  }

  if (arrayEndIndex === -1) {
    return null;
  }

  const arrayContent = afterPreamble.substring(0, arrayEndIndex);
  const postambleStart = preambleEnd + arrayEndIndex;
  let postambleOffset = postambleStart;
  const rest = content.substring(postambleStart);
  const closingMatch = rest.match(/^\}\s*;/);
  if (closingMatch) {
    postambleOffset += closingMatch[0].length;
  }
  const postamble = content.substring(postambleOffset);

  const cleanContent = removeCommentsFromKeycodeArea(arrayContent);

  const layerPattern = /\[\s*(\d+)\s*\]\s*=\s*(LAYOUT\w*)\s*\(/g;
  const layers: ParsedKeymapLayer[] = [];
  let layoutMacroName = '';
  let match;

  while ((match = layerPattern.exec(cleanContent)) !== null) {
    const layerIndex = parseInt(match[1]);
    const macroName = match[2];
    if (!layoutMacroName) {
      layoutMacroName = macroName;
    }

    const openParenIndex = match.index + match[0].length - 1;
    const closeParenIndex = findMatchingParen(cleanContent, openParenIndex);
    if (closeParenIndex === -1) {
      continue;
    }

    const keycodeContent = cleanContent.substring(
      openParenIndex + 1,
      closeParenIndex
    );
    const keycodeNames = splitKeycodes(keycodeContent);

    layers.push({
      index: layerIndex,
      keycodeNames,
    });
  }

  if (layers.length === 0) {
    return null;
  }

  return {
    preamble,
    layoutMacroName,
    layers,
    postamble,
  };
}
