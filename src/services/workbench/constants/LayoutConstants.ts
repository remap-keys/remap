import { ILayoutOption } from '../types/FileGenerationTypes';

/**
 * Available QMK keyboard layouts based on community layouts
 * These correspond to the layouts available in QMK Firmware's layouts/default/ directory
 */
export const AVAILABLE_LAYOUTS: ILayoutOption[] = [
  // Popular keyboard layouts
  {
    name: '60_ansi',
    displayName: '60% ANSI',
    description: '60% keyboard with ANSI layout (61 keys)',
    keyCount: 61,
    width: 15,
    height: 5,
  },
  {
    name: '65_ansi',
    displayName: '65% ANSI',
    description: '65% keyboard with ANSI layout (67 keys)',
    keyCount: 67,
    width: 16,
    height: 5,
  },
  {
    name: 'tkl_ansi',
    displayName: 'TKL ANSI',
    description: 'Tenkeyless keyboard with ANSI layout (87 keys)',
    keyCount: 87,
    width: 18.25,
    height: 6,
  },
  {
    name: 'fullsize_ansi',
    displayName: 'Full Size ANSI',
    description: 'Full size keyboard with ANSI layout (104 keys)',
    keyCount: 104,
    width: 21.5,
    height: 6,
  },
  // Ortholinear layouts
  {
    name: 'ortho_4x12',
    displayName: 'Ortho 4x12',
    description: 'Ortholinear 4 row by 12 column layout (48 keys)',
    keyCount: 48,
    width: 12,
    height: 4,
  },
  {
    name: 'ortho_5x12',
    displayName: 'Ortho 5x12',
    description: 'Ortholinear 5 row by 12 column layout (60 keys)',
    keyCount: 60,
    width: 12,
    height: 5,
  },
  {
    name: 'ortho_4x4',
    displayName: 'Ortho 4x4',
    description: 'Ortholinear 4x4 numpad layout (16 keys)',
    keyCount: 16,
    width: 4,
    height: 4,
  },
  // Split keyboards
  {
    name: 'split_3x6_3',
    displayName: 'Split 3x6+3',
    description: 'Split keyboard with 3x6 main area + 3 thumb keys (42 keys)',
    keyCount: 42,
    width: 14,
    height: 4,
  },
  {
    name: 'split_3x5_3',
    displayName: 'Split 3x5+3',
    description: 'Split keyboard with 3x5 main area + 3 thumb keys (36 keys)',
    keyCount: 36,
    width: 12,
    height: 4,
  },
  // Specialized layouts
  {
    name: 'alice',
    displayName: 'Alice',
    description: 'Alice layout with split spacebar (67 keys)',
    keyCount: 67,
    width: 18.5,
    height: 5,
  },
  {
    name: 'numpad_5x4',
    displayName: 'Numpad 5x4',
    description: 'Standard numpad layout (20 keys)',
    keyCount: 20,
    width: 4,
    height: 5,
  },
];

/**
 * Default layout when none is specified
 */
export const DEFAULT_LAYOUT = 'ortho_4x4';

/**
 * Get layout option by name
 */
export function getLayoutOption(name: string): ILayoutOption | undefined {
  return AVAILABLE_LAYOUTS.find((layout) => layout.name === name);
}

/**
 * Get layout options sorted by popularity (most common layouts first)
 */
export function getPopularLayouts(): ILayoutOption[] {
  const popularOrder = [
    '60_ansi',
    '65_ansi',
    'tkl_ansi',
    'ortho_4x12',
    'split_3x6_3',
    'fullsize_ansi',
    'ortho_5x12',
    'alice',
    'split_3x5_3',
    'ortho_4x4',
    'numpad_5x4',
  ];

  return popularOrder
    .map((name) => getLayoutOption(name))
    .filter((layout): layout is ILayoutOption => layout !== undefined);
}
