import { parseAnsi } from './AnsiParser';

const ESC = '\x1b';

describe('AnsiParser', () => {
  test('returns a single plain segment when no escape sequences are present', () => {
    const result = parseAnsi('hello world');
    expect(result).toEqual([{ text: 'hello world', style: {} }]);
  });

  test('returns empty array for empty input', () => {
    expect(parseAnsi('')).toEqual([]);
  });

  test('applies a basic foreground color', () => {
    const result = parseAnsi(`${ESC}[31mred${ESC}[0m`);
    expect(result).toEqual([{ text: 'red', style: { color: '#c00000' } }]);
  });

  test('resets style on ESC[0m', () => {
    const result = parseAnsi(`${ESC}[31mred${ESC}[0m plain`);
    expect(result).toEqual([
      { text: 'red', style: { color: '#c00000' } },
      { text: ' plain', style: {} },
    ]);
  });

  test('treats empty CSI m sequence as reset', () => {
    const result = parseAnsi(`${ESC}[31mred${ESC}[m plain`);
    expect(result).toEqual([
      { text: 'red', style: { color: '#c00000' } },
      { text: ' plain', style: {} },
    ]);
  });

  test('combines bold and color', () => {
    const result = parseAnsi(`${ESC}[1;31mbold red${ESC}[0m`);
    expect(result).toEqual([
      { text: 'bold red', style: { fontWeight: 'bold', color: '#c00000' } },
    ]);
  });

  test('applies bright colors (90-97)', () => {
    const result = parseAnsi(`${ESC}[91mbright red${ESC}[0m`);
    expect(result).toEqual([
      { text: 'bright red', style: { color: '#e04040' } },
    ]);
  });

  test('handles background color', () => {
    const result = parseAnsi(`${ESC}[41mbg red${ESC}[0m`);
    expect(result).toEqual([
      { text: 'bg red', style: { backgroundColor: '#c00000' } },
    ]);
  });

  test('parses 256-color foreground (38;5;N)', () => {
    const result = parseAnsi(`${ESC}[38;5;196mred256${ESC}[0m`);
    expect(result[0].text).toBe('red256');
    expect(result[0].style.color).toBe('rgb(255,0,0)');
  });

  test('parses 24-bit color foreground (38;2;R;G;B)', () => {
    const result = parseAnsi(`${ESC}[38;2;10;20;30mrgb${ESC}[0m`);
    expect(result).toEqual([
      { text: 'rgb', style: { color: 'rgb(10,20,30)' } },
    ]);
  });

  test('drops non-SGR CSI sequences like line erase', () => {
    const result = parseAnsi(`before${ESC}[Kafter`);
    const flattened = result.map((s) => s.text).join('');
    expect(flattened).toBe('beforeafter');
    expect(result.every((s) => Object.keys(s.style).length === 0)).toBe(true);
  });

  test('drops OSC sequences', () => {
    const result = parseAnsi(`before${ESC}]0;title\x07after`);
    expect(result).toEqual([{ text: 'beforeafter', style: {} }]);
  });

  test('preserves text between multiple styled segments', () => {
    const result = parseAnsi(
      `${ESC}[31merror${ESC}[0m: ${ESC}[1msomething${ESC}[0m broke`
    );
    expect(result).toEqual([
      { text: 'error', style: { color: '#c00000' } },
      { text: ': ', style: {} },
      { text: 'something', style: { fontWeight: 'bold' } },
      { text: ' broke', style: {} },
    ]);
  });

  test('carries style across implicit boundaries when reset is missing', () => {
    const result = parseAnsi(`${ESC}[32mgreen and more`);
    expect(result).toEqual([
      { text: 'green and more', style: { color: '#008000' } },
    ]);
  });

  test('accepts SYMBOL FOR ESCAPE (U+241B) as an alias for ESC', () => {
    const result = parseAnsi('␛[32;01m[OK]␛[0m');
    expect(result).toEqual([
      {
        text: '[OK]',
        style: { color: '#008000', fontWeight: 'bold' },
      },
    ]);
  });

  test('parses a QMK Cloud Compiler line using U+241B ESC', () => {
    const result = parseAnsi(
      'Compiling: src/foo.c   ␛[31;01m[ERRORS]␛[0m'
    );
    expect(result).toEqual([
      { text: 'Compiling: src/foo.c   ', style: {} },
      {
        text: '[ERRORS]',
        style: { color: '#c00000', fontWeight: 'bold' },
      },
    ]);
  });

  test('parses a realistic gcc-style diagnostic line', () => {
    const line = `${ESC}[01m${ESC}[Kfile.c:${ESC}[m${ESC}[K ${ESC}[01;31m${ESC}[Kerror:${ESC}[m${ESC}[K stray`;
    const result = parseAnsi(line);
    // Bold "file.c:"
    expect(result[0]).toEqual({
      text: 'file.c:',
      style: { fontWeight: 'bold' },
    });
    // Plain " "
    expect(result[1]).toEqual({ text: ' ', style: {} });
    // Bold red "error:"
    expect(result[2]).toEqual({
      text: 'error:',
      style: { fontWeight: 'bold', color: '#c00000' },
    });
    // Plain " stray"
    expect(result[3]).toEqual({ text: ' stray', style: {} });
  });
});

export {};
