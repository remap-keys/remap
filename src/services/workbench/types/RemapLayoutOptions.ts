import type { QmkLayoutKey } from '../QmkLayoutParser';

/**
 * Remap-only extension field embedded in a QMK `keyboard.json`:
 *
 * ```json
 * {
 *   "remap": {
 *     "layout_options": {
 *       "labels": [...],
 *       "variants": [...]
 *     }
 *   }
 * }
 * ```
 *
 * The `remap-qmk-module` build tool converts this into VIA-style
 * `layouts.labels` + KLE-encoded `layouts.keymap`. QMK ignores the
 * `remap` field, so the same `keyboard.json` still compiles without any
 * changes to the QMK toolchain.
 *
 * Design details are captured in the spec exchange with the
 * `remap-qmk-module` and `remap-build-server` sessions.
 */
export type RemapLayoutOptions = {
  /**
   * Each entry describes one layout option the user can toggle at runtime.
   * The first element is the option name; the remaining elements are
   * choice labels. A one-element entry (name only) means an implicit
   * two-choice Off/On toggle and the converter downgrades it to a bare
   * string in the produced VIA JSON, matching VIA's idiom.
   *
   * Examples:
   * - `["Split Backspace"]`               — implicit Off/On
   * - `["ISO Enter", "ANSI", "ISO"]`      — explicit 2-choice
   * - `["Bottom Row", "Std", "Split", "Wide"]` — 3-choice
   *
   * A two-element array (`[name, one_label]`) is ambiguous and rejected
   * by the parser.
   */
  labels: string[][];

  /**
   * Keys that appear only when a specific option is at a specific choice.
   * The parser validates that:
   * - every `variant.option` is a valid index into `labels`
   * - every `variant.choice` is within the choice range of its option
   * - every `(option, choice)` pair required by the labels is covered
   * - matrix positions do not collide between `LAYOUT_default` and
   *   `variants`, and do not repeat within the same `(option, choice)`
   */
  variants: RemapLayoutVariant[];
};

export type RemapLayoutVariant = {
  /** Index into `RemapLayoutOptions.labels`. */
  option: number;
  /**
   * Index into the choice list of `labels[option]`. `0` is the default
   * choice; higher values correspond to `labels[option][choice + 1]`
   * (because `labels[option][0]` is the option name).
   */
  choice: number;
  /** Keys visible when this `(option, choice)` combination is active. */
  keys: QmkLayoutKey[];
};
