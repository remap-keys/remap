import type { QmkLayoutKey } from './QmkLayoutParser';
import type {
  RemapLayoutOptions,
  RemapLayoutVariant,
} from './types/RemapLayoutOptions';

/**
 * Parses and validates the `remap.layout_options` extension embedded in
 * a QMK `keyboard.json`. Absence of the field is not an error — it just
 * means the keyboard has no runtime layout options.
 *
 * The parser mirrors the invariants that `generate_remap_definition.py`
 * enforces server-side, so any keyboard.json that Form Editor accepts
 * will convert cleanly during the firmware build.
 */

export type ParseRemapLayoutOptionsSuccess = {
  success: true;
  /** `null` when the JSON has no `remap.layout_options` field at all. */
  data: RemapLayoutOptions | null;
};

export type ParseRemapLayoutOptionsFailure = {
  success: false;
  errors: string[];
};

export type ParseRemapLayoutOptionsResult =
  | ParseRemapLayoutOptionsSuccess
  | ParseRemapLayoutOptionsFailure;

export type ParseRemapLayoutOptionsInput = {
  /**
   * Parsed keyboard.json content. Passing `null`/`undefined` returns
   * `{ success: true, data: null }`.
   */
  keyboardJson: unknown;
  /**
   * Keys of the resolved default QMK layout, used to check that the
   * same matrix cell never appears both in `LAYOUT_default` and in
   * `variants`. When omitted, that check is skipped (useful when the
   * caller only wants to validate the `remap` section in isolation).
   */
  layoutDefaultKeys?: QmkLayoutKey[];
};

const NUMBER_KEY_FIELDS = ['w', 'h', 'r', 'rx', 'ry'] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return isInteger(value) && value >= 0;
}

function matrixKey(matrix: readonly [number, number]): string {
  return `${matrix[0]},${matrix[1]}`;
}

function validateKey(
  raw: unknown,
  path: string,
  errors: string[]
): QmkLayoutKey | null {
  if (!isPlainObject(raw)) {
    errors.push(`${path} must be an object`);
    return null;
  }

  const matrix = raw.matrix;
  if (
    !Array.isArray(matrix) ||
    matrix.length !== 2 ||
    !isNonNegativeInteger(matrix[0]) ||
    !isNonNegativeInteger(matrix[1])
  ) {
    errors.push(
      `${path}.matrix must be a two-element array of non-negative integers`
    );
    return null;
  }

  if (typeof raw.x !== 'number' || typeof raw.y !== 'number') {
    errors.push(`${path}.x and ${path}.y must be numbers`);
    return null;
  }

  const key: QmkLayoutKey = {
    matrix: [matrix[0], matrix[1]],
    x: raw.x,
    y: raw.y,
  };
  for (const field of NUMBER_KEY_FIELDS) {
    const value = raw[field];
    if (value === undefined) continue;
    if (typeof value !== 'number') {
      errors.push(`${path}.${field} must be a number when present`);
      return null;
    }
    key[field] = value;
  }
  return key;
}

function validateLabels(raw: unknown, errors: string[]): string[][] | null {
  if (!Array.isArray(raw)) {
    errors.push('remap.layout_options.labels must be an array');
    return null;
  }
  const labels: string[][] = [];
  raw.forEach((entry, index) => {
    const path = `remap.layout_options.labels[${index}]`;
    if (
      !Array.isArray(entry) ||
      entry.some((s) => typeof s !== 'string') ||
      entry.length < 1
    ) {
      errors.push(`${path} must be a non-empty array of strings`);
      return;
    }
    // The VIA `labels` format is either "just a name" (implicit Off/On)
    // or "name + at least two explicit choice labels". Two elements is
    // ambiguous — the second element would be the label of choice 0
    // with no label for choice 1, so we reject it here rather than let
    // the converter guess.
    if (entry.length === 2) {
      errors.push(
        `${path} has length 2, which is ambiguous. Use length 1 for an implicit Off/On toggle or length >= 3 for an explicit multi-choice option.`
      );
      return;
    }
    labels.push([...(entry as string[])]);
  });
  return labels;
}

function choiceCountForLabel(label: string[]): number {
  // `[name]` implies two choices (Off/On); `[name, c0, c1, ...]` uses the
  // remaining entries as explicit choice labels.
  return label.length === 1 ? 2 : label.length - 1;
}

function validateVariants(
  raw: unknown,
  labels: string[][],
  errors: string[]
): RemapLayoutVariant[] | null {
  if (!Array.isArray(raw)) {
    errors.push('remap.layout_options.variants must be an array');
    return null;
  }
  if (raw.length === 0) {
    errors.push('remap.layout_options.variants must not be empty');
    return null;
  }

  const variants: RemapLayoutVariant[] = [];
  raw.forEach((entry, index) => {
    const path = `remap.layout_options.variants[${index}]`;
    if (!isPlainObject(entry)) {
      errors.push(`${path} must be an object`);
      return;
    }

    if (!isNonNegativeInteger(entry.option)) {
      errors.push(`${path}.option must be a non-negative integer`);
      return;
    }
    if (!isNonNegativeInteger(entry.choice)) {
      errors.push(`${path}.choice must be a non-negative integer`);
      return;
    }
    if (entry.option >= labels.length) {
      errors.push(
        `${path}.option (${entry.option}) is out of range; labels has ${labels.length} entries`
      );
      return;
    }
    const maxChoice = choiceCountForLabel(labels[entry.option]) - 1;
    if (entry.choice > maxChoice) {
      errors.push(
        `${path}.choice (${entry.choice}) exceeds the max choice (${maxChoice}) for option ${entry.option}`
      );
      return;
    }

    if (!Array.isArray(entry.keys)) {
      errors.push(`${path}.keys must be an array`);
      return;
    }
    if (entry.keys.length === 0) {
      errors.push(`${path}.keys must contain at least one key`);
      return;
    }

    const keys: QmkLayoutKey[] = [];
    entry.keys.forEach((rawKey, keyIndex) => {
      const key = validateKey(rawKey, `${path}.keys[${keyIndex}]`, errors);
      if (key) keys.push(key);
    });
    if (keys.length !== entry.keys.length) {
      // A per-key error was already reported; skip the variant to avoid
      // cascading noise from later cross-cutting checks.
      return;
    }

    variants.push({
      option: entry.option,
      choice: entry.choice,
      keys,
    });
  });
  return variants;
}

function validateChoiceCoverage(
  labels: string[][],
  variants: RemapLayoutVariant[],
  errors: string[]
): void {
  labels.forEach((label, optionIndex) => {
    const expected = new Set<number>();
    for (let c = 0; c < choiceCountForLabel(label); c++) expected.add(c);
    const actual = new Set<number>();
    for (const variant of variants) {
      if (variant.option === optionIndex) actual.add(variant.choice);
    }
    const missing: number[] = [];
    for (const c of expected) {
      if (!actual.has(c)) missing.push(c);
    }
    if (missing.length > 0) {
      errors.push(
        `remap.layout_options: option ${optionIndex} (${JSON.stringify(
          label[0]
        )}) is missing variants for choice ${missing.join(', ')}`
      );
    }
  });
}

function validateMatrixUniqueness(
  variants: RemapLayoutVariant[],
  layoutDefaultKeys: QmkLayoutKey[] | undefined,
  errors: string[]
): void {
  const defaultMatrices = new Set<string>();
  if (layoutDefaultKeys) {
    for (const key of layoutDefaultKeys) {
      defaultMatrices.add(matrixKey(key.matrix));
    }
  }
  // Track (option, choice, matrix) uniqueness across variants.
  const seen = new Map<string, string>();
  variants.forEach((variant, variantIndex) => {
    variant.keys.forEach((key, keyIndex) => {
      const cell = matrixKey(key.matrix);
      if (defaultMatrices.has(cell)) {
        errors.push(
          `remap.layout_options.variants[${variantIndex}].keys[${keyIndex}]: matrix ${cell} also appears in the default layout`
        );
      }
      const dedupeKey = `${variant.option},${variant.choice},${cell}`;
      const previous = seen.get(dedupeKey);
      if (previous !== undefined) {
        errors.push(
          `remap.layout_options.variants[${variantIndex}].keys[${keyIndex}]: matrix ${cell} is duplicated for option ${variant.option} choice ${variant.choice} (previously at ${previous})`
        );
      } else {
        seen.set(dedupeKey, `variants[${variantIndex}].keys[${keyIndex}]`);
      }
    });
  });
}

export function parseRemapLayoutOptions(
  input: ParseRemapLayoutOptionsInput
): ParseRemapLayoutOptionsResult {
  const { keyboardJson, layoutDefaultKeys } = input;
  if (!isPlainObject(keyboardJson)) {
    return { success: true, data: null };
  }
  const remap = keyboardJson.remap;
  if (remap === undefined) {
    return { success: true, data: null };
  }
  if (!isPlainObject(remap)) {
    return {
      success: false,
      errors: ['remap must be an object'],
    };
  }
  const rawOptions = remap.layout_options;
  if (rawOptions === undefined) {
    return { success: true, data: null };
  }
  if (!isPlainObject(rawOptions)) {
    return {
      success: false,
      errors: ['remap.layout_options must be an object'],
    };
  }

  const errors: string[] = [];
  const labels = validateLabels(rawOptions.labels, errors);
  const variants =
    labels !== null
      ? validateVariants(rawOptions.variants, labels, errors)
      : null;

  if (labels !== null && variants !== null && errors.length === 0) {
    validateChoiceCoverage(labels, variants, errors);
    validateMatrixUniqueness(variants, layoutDefaultKeys, errors);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }
  return {
    success: true,
    data: { labels: labels!, variants: variants! },
  };
}
