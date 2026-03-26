import { describe, it, expect } from 'vitest';
import { parseConfigH, generateConfigH, ConfigDefines } from './ConfigHParser';

describe('ConfigHParser', () => {
  describe('parseConfigH', () => {
    it('parses #define with numeric value', () => {
      const content = '#define TAPPING_TERM 200';
      const defines = parseConfigH(content);
      expect(defines.get('TAPPING_TERM')).toBe('200');
    });

    it('parses #define flag without value', () => {
      const content = '#define PERMISSIVE_HOLD';
      const defines = parseConfigH(content);
      expect(defines.get('PERMISSIVE_HOLD')).toBe(true);
    });

    it('parses multiple defines', () => {
      const content = [
        '#define TAPPING_TERM 200',
        '#define PERMISSIVE_HOLD',
        '#define MOUSEKEY_DELAY 10',
      ].join('\n');
      const defines = parseConfigH(content);
      expect(defines.size).toBe(3);
      expect(defines.get('TAPPING_TERM')).toBe('200');
      expect(defines.get('PERMISSIVE_HOLD')).toBe(true);
      expect(defines.get('MOUSEKEY_DELAY')).toBe('10');
    });

    it('ignores inline comments', () => {
      const content = '#define TAPPING_TERM 200 // milliseconds';
      const defines = parseConfigH(content);
      expect(defines.get('TAPPING_TERM')).toBe('200');
    });

    it('ignores block comments', () => {
      const content = [
        '/* This is a comment',
        '#define SHOULD_BE_IGNORED 999',
        '*/',
        '#define TAPPING_TERM 200',
      ].join('\n');
      const defines = parseConfigH(content);
      expect(defines.has('SHOULD_BE_IGNORED')).toBe(false);
      expect(defines.get('TAPPING_TERM')).toBe('200');
    });

    it('ignores #pragma and #ifdef directives', () => {
      const content = [
        '#pragma once',
        '#ifdef KEYBOARD_my_keyboard',
        '#define TAPPING_TERM 200',
        '#endif',
      ].join('\n');
      const defines = parseConfigH(content);
      expect(defines.size).toBe(1);
      expect(defines.get('TAPPING_TERM')).toBe('200');
    });

    it('handles backslash-continued lines', () => {
      const content = ['#define LONG_VALUE \\', '  42'].join('\n');
      const defines = parseConfigH(content);
      expect(defines.get('LONG_VALUE')).toBe('42');
    });

    it('handles empty content', () => {
      const defines = parseConfigH('');
      expect(defines.size).toBe(0);
    });

    it('handles content with only comments', () => {
      const content = ['// Just a comment', '/* Block comment */'].join('\n');
      const defines = parseConfigH(content);
      expect(defines.size).toBe(0);
    });

    it('parses defines with extra whitespace', () => {
      const content = '  #  define   TAPPING_TERM   200  ';
      const defines = parseConfigH(content);
      expect(defines.get('TAPPING_TERM')).toBe('200');
    });
  });

  describe('generateConfigH', () => {
    it('updates an existing define value', () => {
      const original = '#define TAPPING_TERM 200';
      const defines: ConfigDefines = new Map([['TAPPING_TERM', '300']]);
      const result = generateConfigH(original, defines, new Set());
      expect(result).toBe('#define TAPPING_TERM 300');
    });

    it('adds a new define', () => {
      const original = '#define TAPPING_TERM 200';
      const defines: ConfigDefines = new Map<string, string | true>([
        ['TAPPING_TERM', '200'],
        ['PERMISSIVE_HOLD', true],
      ]);
      const result = generateConfigH(original, defines, new Set());
      expect(result).toContain('#define TAPPING_TERM 200');
      expect(result).toContain('#define PERMISSIVE_HOLD');
    });

    it('removes a define', () => {
      const original = [
        '#define TAPPING_TERM 200',
        '#define PERMISSIVE_HOLD',
      ].join('\n');
      const defines: ConfigDefines = new Map([['TAPPING_TERM', '200']]);
      const result = generateConfigH(
        original,
        defines,
        new Set(['PERMISSIVE_HOLD'])
      );
      expect(result).toContain('#define TAPPING_TERM 200');
      expect(result).not.toContain('PERMISSIVE_HOLD');
    });

    it('preserves comments and blank lines', () => {
      const original = [
        '// Config file',
        '',
        '#define TAPPING_TERM 200',
        '',
        '// End of file',
      ].join('\n');
      const defines: ConfigDefines = new Map([['TAPPING_TERM', '300']]);
      const result = generateConfigH(original, defines, new Set());
      const lines = result.split('\n');
      expect(lines[0]).toBe('// Config file');
      expect(lines[1]).toBe('');
      expect(lines[2]).toBe('#define TAPPING_TERM 300');
      expect(lines[3]).toBe('');
      expect(lines[4]).toBe('// End of file');
    });

    it('preserves inline comments when updating', () => {
      const original = '#define TAPPING_TERM 200 // in milliseconds';
      const defines: ConfigDefines = new Map([['TAPPING_TERM', '300']]);
      const result = generateConfigH(original, defines, new Set());
      expect(result).toBe('#define TAPPING_TERM 300 // in milliseconds');
    });

    it('preserves #pragma and #ifdef directives', () => {
      const original = [
        '#pragma once',
        '#ifndef CONFIG_H',
        '#define CONFIG_H',
        '',
        '#define TAPPING_TERM 200',
        '',
        '#endif',
      ].join('\n');
      const defines: ConfigDefines = new Map<string, string | true>([
        ['CONFIG_H', true],
        ['TAPPING_TERM', '300'],
      ]);
      const result = generateConfigH(original, defines, new Set());
      expect(result).toContain('#pragma once');
      expect(result).toContain('#ifndef CONFIG_H');
      expect(result).toContain('#define CONFIG_H');
      expect(result).toContain('#define TAPPING_TERM 300');
      expect(result).toContain('#endif');
    });

    it('converts flag to value define', () => {
      const original = '#define PERMISSIVE_HOLD';
      const defines: ConfigDefines = new Map([['PERMISSIVE_HOLD', '1']]);
      const result = generateConfigH(original, defines, new Set());
      expect(result).toBe('#define PERMISSIVE_HOLD 1');
    });

    it('converts value define to flag', () => {
      const original = '#define TAPPING_TERM 200';
      const defines: ConfigDefines = new Map<string, string | true>([
        ['TAPPING_TERM', true],
      ]);
      const result = generateConfigH(original, defines, new Set());
      expect(result).toBe('#define TAPPING_TERM');
    });

    it('round-trips parse then generate', () => {
      const original = [
        '#pragma once',
        '',
        '#define TAPPING_TERM 200',
        '#define PERMISSIVE_HOLD',
        '#define MOUSEKEY_DELAY 10',
      ].join('\n');
      const defines = parseConfigH(original);
      const result = generateConfigH(original, defines, new Set());
      expect(result).toBe(original);
    });
  });
});
