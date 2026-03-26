// Parser and generator for QMK config.h files.
// Handles #define KEY VALUE and #define FLAG (boolean) patterns.

export type ConfigDefines = Map<string, string | true>;

// Strip block comments (/* ... */) from a string, handling multiline
function stripBlockComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, '');
}

// Strip inline comment (// ...) from a line
function stripInlineComment(line: string): string {
  // Naive approach: find first // not inside a string literal
  // For config.h this is sufficient since #define lines rarely have string literals
  const idx = line.indexOf('//');
  return idx >= 0 ? line.substring(0, idx) : line;
}

// Join backslash-continued lines
function joinContinuedLines(lines: string[]): string[] {
  const result: string[] = [];
  let buffer = '';
  for (const line of lines) {
    if (line.trimEnd().endsWith('\\')) {
      buffer += line.trimEnd().slice(0, -1) + ' ';
    } else {
      buffer += line;
      result.push(buffer);
      buffer = '';
    }
  }
  if (buffer) {
    result.push(buffer);
  }
  return result;
}

const DEFINE_REGEX = /^\s*#\s*define\s+(\w+)(?:\s+(.+?))?\s*$/;

/**
 * Parse config.h content and extract #define directives.
 * Returns a Map where keys are define names and values are either
 * the define value (string) or true (for flag-only defines).
 */
export function parseConfigH(content: string): ConfigDefines {
  const defines: ConfigDefines = new Map();
  const stripped = stripBlockComments(content);
  const rawLines = stripped.split('\n');
  const lines = joinContinuedLines(rawLines);

  for (const line of lines) {
    const cleaned = stripInlineComment(line).trim();
    const match = cleaned.match(DEFINE_REGEX);
    if (match) {
      const key = match[1];
      const value = match[2];
      defines.set(key, value !== undefined ? value : true);
    }
  }

  return defines;
}

/**
 * Generate config.h content by updating existing defines and adding new ones.
 * Preserves comments, blank lines, #pragma, #ifdef/#endif, and formatting.
 *
 * @param original - The original config.h content
 * @param defines - Map of defines to set (key -> value or true for flags)
 * @param removedKeys - Set of define keys to remove
 * @returns Updated config.h content
 */
export function generateConfigH(
  original: string,
  defines: ConfigDefines,
  removedKeys: Set<string>
): string {
  const lines = original.split('\n');
  const result: string[] = [];
  const processedKeys = new Set<string>();
  let inBlockComment = false;
  let skipContinuation = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track block comments
    if (inBlockComment) {
      result.push(line);
      if (line.includes('*/')) {
        inBlockComment = false;
      }
      continue;
    }
    if (line.includes('/*') && !line.includes('*/')) {
      inBlockComment = true;
      result.push(line);
      continue;
    }

    // Skip continuation lines of a removed/processed define
    if (skipContinuation) {
      if (!line.trimEnd().endsWith('\\')) {
        skipContinuation = false;
      }
      continue;
    }

    // Check if this line is a #define
    const lineWithoutBlockComment = line.replace(/\/\*.*?\*\//g, '');
    const lineWithoutComment = stripInlineComment(lineWithoutBlockComment);
    const match = lineWithoutComment.trim().match(DEFINE_REGEX);

    if (match) {
      const key = match[1];
      processedKeys.add(key);

      if (removedKeys.has(key)) {
        // Remove this define line (and any continuation lines)
        if (line.trimEnd().endsWith('\\')) {
          skipContinuation = true;
        }
        continue;
      }

      if (defines.has(key)) {
        const newValue = defines.get(key)!;
        // Extract any inline comment from the original line
        const commentIdx = line.indexOf('//');
        const inlineComment =
          commentIdx >= 0 ? ' ' + line.substring(commentIdx) : '';
        if (newValue === true) {
          result.push(`#define ${key}${inlineComment}`);
        } else {
          result.push(`#define ${key} ${newValue}${inlineComment}`);
        }
        // Skip continuation lines of the original
        if (line.trimEnd().endsWith('\\')) {
          skipContinuation = true;
        }
      } else {
        // Keep the original line as-is
        result.push(line);
      }
    } else {
      // Non-define line: preserve as-is
      result.push(line);
    }
  }

  // Append new defines that were not in the original
  const newDefines: string[] = [];
  for (const [key, value] of defines) {
    if (!processedKeys.has(key) && !removedKeys.has(key)) {
      if (value === true) {
        newDefines.push(`#define ${key}`);
      } else {
        newDefines.push(`#define ${key} ${value}`);
      }
    }
  }

  if (newDefines.length > 0) {
    // Add a blank line before new defines if the file doesn't end with one
    const lastLine = result[result.length - 1];
    if (lastLine !== undefined && lastLine.trim() !== '') {
      result.push('');
    }
    result.push(...newDefines);
  }

  return result.join('\n');
}
