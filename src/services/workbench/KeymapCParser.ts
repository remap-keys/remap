/**
 * Parsed representation of a keymap.c file.
 */
export type ParsedKeymapLayer = {
  index: number;
  keycodeNames: string[];
  // Position of the keycode content in the original text (between LAYOUT( and ))
  sourceStart: number;
  sourceEnd: number;
};

export type ParsedKeymap = {
  originalContent: string;
  layoutMacroName: string;
  layers: ParsedKeymapLayer[];
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
 * Used only for parsing keycodes from the array content.
 */
function removeComments(text: string): string {
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
 * Preserves the original content and records positions so that only
 * keycode names can be replaced in-place.
 * Returns null if the content cannot be parsed.
 */
export function parseKeymapC(content: string): ParsedKeymap | null {
  // Find the keymaps array declaration
  const keymapsPattern =
    /keymaps\s*\[\s*\]\s*\[\s*MATRIX_ROWS\s*\]\s*\[\s*MATRIX_COLS\s*\]\s*=\s*\{/;
  const keymapsMatch = content.match(keymapsPattern);
  if (!keymapsMatch || keymapsMatch.index === undefined) {
    return null;
  }

  // Find layer patterns in the ORIGINAL content (not comment-stripped)
  // to get correct source positions.
  const layerPattern = /\[\s*(\d+)\s*\]\s*=\s*(LAYOUT\w*)\s*\(/g;
  const layers: ParsedKeymapLayer[] = [];
  let layoutMacroName = '';
  let match;

  while ((match = layerPattern.exec(content)) !== null) {
    // Only match layers that are within the keymaps array
    if (match.index < keymapsMatch.index) continue;

    const layerIndex = parseInt(match[1]);
    const macroName = match[2];
    if (!layoutMacroName) {
      layoutMacroName = macroName;
    }

    // Find matching closing paren in original content
    const openParenIndex = match.index + match[0].length - 1;
    const closeParenIndex = findMatchingParen(content, openParenIndex);
    if (closeParenIndex === -1) {
      continue;
    }

    // The keycode content is between the opening and closing parens
    const sourceStart = openParenIndex + 1;
    const sourceEnd = closeParenIndex;
    const keycodeContentRaw = content.substring(sourceStart, sourceEnd);

    // Strip comments for parsing keycodes, but keep source positions
    const cleanContent = removeComments(keycodeContentRaw);
    const keycodeNames = splitKeycodes(cleanContent);

    layers.push({
      index: layerIndex,
      keycodeNames,
      sourceStart,
      sourceEnd,
    });
  }

  if (layers.length === 0) {
    return null;
  }

  return {
    originalContent: content,
    layoutMacroName,
    layers,
  };
}
