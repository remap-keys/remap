/**
 * A minimal ANSI SGR (Select Graphic Rendition) parser.
 *
 * Parses text containing ANSI escape sequences into a list of styled
 * segments that can be rendered as React nodes. Only the SGR subset is
 * interpreted; other control sequences (cursor movement, screen erase,
 * etc.) are stripped so they do not appear as literal text.
 *
 * Colors are chosen to remain legible on a light background, since the
 * Workbench build-log panel renders on the default white surface.
 */

export type AnsiStyle = {
  color?: string;
  backgroundColor?: string;
  fontWeight?: 'bold';
  fontStyle?: 'italic';
  textDecoration?: 'underline' | 'line-through';
};

export type AnsiSegment = {
  text: string;
  style: AnsiStyle;
};

const FG_COLORS: Record<number, string> = {
  30: '#000000', // black
  31: '#c00000', // red
  32: '#008000', // green
  33: '#b58900', // yellow
  34: '#0056b3', // blue
  35: '#a000a0', // magenta
  36: '#008080', // cyan
  37: '#808080', // white → gray on light bg
  90: '#606060', // bright black → gray
  91: '#e04040', // bright red
  92: '#20a020', // bright green
  93: '#c07500', // bright yellow → orange
  94: '#3080ff', // bright blue
  95: '#c040c0', // bright magenta
  96: '#00b0b0', // bright cyan
  97: '#a0a0a0', // bright white → light gray
};

const BG_COLORS: Record<number, string> = {
  40: '#000000',
  41: '#c00000',
  42: '#008000',
  43: '#b58900',
  44: '#0056b3',
  45: '#a000a0',
  46: '#008080',
  47: '#c0c0c0',
  100: '#606060',
  101: '#e04040',
  102: '#20a020',
  103: '#c07500',
  104: '#3080ff',
  105: '#c040c0',
  106: '#00b0b0',
  107: '#e0e0e0',
};

function xterm256ToHex(index: number): string | undefined {
  if (index < 0 || index > 255) return undefined;
  if (index < 16) {
    const map = [
      '#000000',
      '#c00000',
      '#008000',
      '#b58900',
      '#0056b3',
      '#a000a0',
      '#008080',
      '#c0c0c0',
      '#606060',
      '#e04040',
      '#20a020',
      '#c07500',
      '#3080ff',
      '#c040c0',
      '#00b0b0',
      '#e0e0e0',
    ];
    return map[index];
  }
  if (index < 232) {
    const levels = [0, 95, 135, 175, 215, 255];
    const i = index - 16;
    const r = levels[Math.floor(i / 36)];
    const g = levels[Math.floor((i / 6) % 6)];
    const b = levels[i % 6];
    return `rgb(${r},${g},${b})`;
  }
  const gray = (index - 232) * 10 + 8;
  return `rgb(${gray},${gray},${gray})`;
}

function applyCodes(base: AnsiStyle, codes: number[]): AnsiStyle {
  let style: AnsiStyle = { ...base };
  let i = 0;
  while (i < codes.length) {
    const code = codes[i];
    if (code === 0) {
      style = {};
    } else if (code === 1) {
      style.fontWeight = 'bold';
    } else if (code === 3) {
      style.fontStyle = 'italic';
    } else if (code === 4) {
      style.textDecoration = 'underline';
    } else if (code === 9) {
      style.textDecoration = 'line-through';
    } else if (code === 22) {
      delete style.fontWeight;
    } else if (code === 23) {
      delete style.fontStyle;
    } else if (code === 24 || code === 29) {
      delete style.textDecoration;
    } else if (code === 39) {
      delete style.color;
    } else if (code === 49) {
      delete style.backgroundColor;
    } else if (code === 38 && codes[i + 1] === 5) {
      const c = xterm256ToHex(codes[i + 2]);
      if (c) style.color = c;
      i += 2;
    } else if (code === 48 && codes[i + 1] === 5) {
      const c = xterm256ToHex(codes[i + 2]);
      if (c) style.backgroundColor = c;
      i += 2;
    } else if (code === 38 && codes[i + 1] === 2) {
      const r = codes[i + 2];
      const g = codes[i + 3];
      const b = codes[i + 4];
      if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
        style.color = `rgb(${r},${g},${b})`;
      }
      i += 4;
    } else if (code === 48 && codes[i + 1] === 2) {
      const r = codes[i + 2];
      const g = codes[i + 3];
      const b = codes[i + 4];
      if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
        style.backgroundColor = `rgb(${r},${g},${b})`;
      }
      i += 4;
    } else if (FG_COLORS[code]) {
      style.color = FG_COLORS[code];
    } else if (BG_COLORS[code]) {
      style.backgroundColor = BG_COLORS[code];
    }
    i++;
  }
  return style;
}

// Matches any ANSI CSI sequence: ESC [ ... final-byte. We capture the
// parameter bytes for SGR (`m`) and drop everything else.
// eslint-disable-next-line no-control-regex
const CSI_REGEX = /\x1b\[([0-9;]*)([A-Za-z])/g;

// Strips OSC (Operating System Command) sequences like ESC ] ... BEL or ESC ] ... ESC \
// eslint-disable-next-line no-control-regex
const OSC_REGEX = /\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g;

export function parseAnsi(text: string): AnsiSegment[] {
  if (!text) return [];

  // Some pipelines (e.g. the QMK Cloud Compiler) deliver escape sequences
  // with the visible SYMBOL FOR ESCAPE character (U+241B) in place of the
  // real ESC byte (U+001B). Normalize both to the same byte so the CSI/OSC
  // regexes below match either form.
  const normalized = text.replace(/␛/g, '\x1b');

  const cleaned = normalized.replace(OSC_REGEX, '');

  const segments: AnsiSegment[] = [];
  let currentStyle: AnsiStyle = {};
  let lastIndex = 0;

  CSI_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = CSI_REGEX.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      const chunk = cleaned.slice(lastIndex, match.index);
      if (chunk) segments.push({ text: chunk, style: currentStyle });
    }
    const finalByte = match[2];
    if (finalByte === 'm') {
      const params = match[1];
      const codes =
        params === ''
          ? [0]
          : params.split(';').map((s) => (s === '' ? 0 : parseInt(s, 10)));
      currentStyle = applyCodes(currentStyle, codes);
    }
    // Any other CSI sequence (cursor move, erase, etc.) is dropped.
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleaned.length) {
    segments.push({ text: cleaned.slice(lastIndex), style: currentStyle });
  }

  return segments;
}
