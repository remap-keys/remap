/**
 * Typing Practice Text Categories and Preset Sentences
 *
 * This module defines various categories of practice texts for typing practice.
 * Each category contains 10 sentences designed to help users practice specific
 * character types or coding patterns.
 */

export type PracticeCategoryId =
  | 'alphabet-lowercase-easy'
  | 'alphabet-lowercase-hard'
  | 'alphabet-mixed'
  | 'numbers'
  | 'symbols'
  | 'alphanumeric-symbols'
  | 'programming-js'
  | 'programming-ts-types'
  | 'programming-python'
  | 'remap-ui-text';

export type PracticeCategory = {
  id: PracticeCategoryId;
  name: string;
  description: string;
  sentences: string[];
};

/**
 * All available practice categories
 */
export const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    id: 'alphabet-lowercase-easy',
    name: 'Alphabet (Lowercase - Easy)',
    description: 'Practice with simple, common words',
    sentences: [
      'a big black bug bit a big black dog on his big black nose.',
      'my friend gave me a very nice gift for my birthday.',
      'we quickly jumped over the fence to catch the ball.',
      'the lazy fox and the clever cat are sitting on a mat.',
      'i have just finished my homework for the next week.',
      'the queen is visiting the zoo to see the amazing animals.',
      'a gentle breeze is blowing from the west to the east.',
      'my brother enjoys playing soccer with his friends.',
      'please pack my box with five dozen liquor jugs.',
      'the quick brown fox jumps over the lazy dog.',
    ],
  },
  {
    id: 'alphabet-lowercase-hard',
    name: 'Alphabet (Lowercase - Hard)',
    description: 'Practice with complex words and sentences',
    sentences: [
      'the five boxing wizards jump quickly.',
      'a quick brown fox jumps over the lazy dog.',
      'pack my box with five dozen liquor jugs.',
      'amazingly, the jukebox provides exquisite sound for the lazy queen.',
      'by jove, a quick-witted sphinx judge vexed my lazy foe.',
      'we juxtapose amazing, flavorful liquids to vex and quiz each boy.',
      "a wizard's job is to vex and quiz the lazy, quick-witted dragon.",
      'the jovial taxman collected a hefty sum from the buzzing marketplace.',
      'exquisite jewels from the mysterious cavern puzzle the brave voyagers.',
      'a flock of dazzling pigeons quietly surveyed the majestic xenolith.',
    ],
  },
  {
    id: 'alphabet-mixed',
    name: 'Alphabet (Mixed Case)',
    description: 'Practice both uppercase and lowercase letters',
    sentences: [
      'The Quick Brown Fox Jumps Over The Lazy Dog',
      'Pack My Box With Five Dozen Liquor Jugs',
      'How Vexingly Quick Daft Zebras Jump',
      'Sphinx Of Black Quartz Judge My Vow',
      'Waltz Bad Nymph For Quick Jigs Vex',
      'Glib Jocks Quiz Nymph To Vex Dwarf',
      'Bright Vixens Jump Dozy Fowl Quack',
      'Quick Wafting Zephyrs Vex Bold Jim',
      'Quick Zephyrs Blow Vexing Daft Jim',
      'Two Driven Jocks Help Fax My Big Quiz',
    ],
  },
  {
    id: 'numbers',
    name: 'Numbers',
    description: 'Practice typing numbers and digits',
    sentences: [
      '1234567890',
      '0987654321',
      '1357924680',
      '2468013579',
      '9876543210 1234567890',
      '1111 2222 3333 4444 5555',
      '10 20 30 40 50 60 70 80 90 100',
      '123 456 789 012 345 678 901 234',
      '999 888 777 666 555 444 333 222 111',
      '1000 2000 3000 4000 5000 6000 7000 8000 9000',
    ],
  },
  {
    id: 'symbols',
    name: 'Symbols',
    description: 'Practice with various symbols only, no letters or numbers',
    sentences: [
      '!@#$%^&*()_+-=`~',
      '{}[]|\\;:\'",.<>/?',
      '~!@#$%^&*(){}[];',
      '[]{}<>/?:\'".,+-*/',
      '()...---///\\\\\\',
      '"""\'\'\'```~~~',
      '$#@!%^&*()_+-=[]{};:\'\\',
      '==!= ===!== >=<=',
      '<=> -> => <- <->',
      '&#@%^*+=-_~`',
    ],
  },
  {
    id: 'alphanumeric-symbols',
    name: 'Alphanumeric & Symbols',
    description: 'Practice with a mix of letters, numbers, and symbols',
    sentences: [
      'My password is "P@ssw0rd123!" - do not use this.',
      'Access code: 8A6B-C9D4-E7F2. Expires on 2026/01/19.',
      'The formula is (x^2 + y^2) = z^2, where z > 0.',
      'Email me at user+test@example.com?subject=Hello!&body=Hi.',
      '"Part #123-ABC" costs $45.67 (tax included).',
      'Version 2.0.1-alpha is now available for download.',
      'Find it at C:\\Users\\John_Doe\\My Documents\\file_001.txt',
      'const API_KEY = "abc-123-xyz-789";',
      'HTTP/1.1 200 OK Content-Type: application/json',
      'User_ID: 12345, Session_ID: \'a0b1c2d3-e4f5-g6h7\'',
    ],
  },
  {
    id: 'programming-js',
    name: 'Programming (JavaScript)',
    description: 'Practice typing JavaScript code',
    sentences: [
      'const sum = (a, b) => a + b;',
      'const result = arr.map(x => x * 2);',
      'if (value !== null && value !== undefined) {',
      'const {name, age, ...rest} = person;',
      'async function fetchData() { return await api.get(); }',
      "const isValid = str.length > 0 && str.trim() !== '';",
      'export default class Component extends React.Component {',
      "const obj = { id: 1, name: 'John', active: true };",
      'arr.filter(x => x > 10).reduce((a, b) => a + b, 0);',
      'try { JSON.parse(data); } catch (e) { console.error(e); }',
    ],
  },
  {
    id: 'programming-ts-types',
    name: 'Programming (TypeScript Types)',
    description: 'Practice typing TypeScript type definitions',
    sentences: [
      'type User = { id: number; name: string; };',
      'interface Product { id: string; price: number; }',
      'function identity<T>(arg: T): T { return arg; }',
      'const arr: Array<number> = [1, 2, 3];',
      'let tuple: [string, number] = ["hello", 123];',
      'enum Status { Pending, Success, Error };',
      'type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };',
      'declare module "my-module" { export const value: number; }',
      'type Keys = "id" | "name" | "age";',
      'type Pick<T, K extends keyof T> = { [P in K]: T[P]; };',
    ],
  },
  {
    id: 'programming-python',
    name: 'Programming (Python)',
    description: 'Practice typing Python code',
    sentences: [
      'def add(a, b): return a + b',
      'result = [x * 2 for x in arr]',
      'if value is not None and len(value) > 0:',
      'class Person: def __init__(self, name): self.name = name',
      'async def fetch_data(): return await api.get()',
      "with open('file.txt', 'r') as f: data = f.read()",
      'try: result = int(value) except ValueError: result = 0',
      'import numpy as np; arr = np.array([1, 2, 3])',
      "data = {'id': 1, 'name': 'John', 'active': True}",
      '@decorator def func(x, y): return x + y',
    ],
  },
  {
    id: 'remap-ui-text',
    name: 'Remap UI Text',
    description: 'Practice with sentences and phrases from the Remap UI',
    sentences: [
      'Customize Your Keyboard',
      'Find a favorite keyboard supporting Remap.',
      'Flash a firmware to microcomputer unit directly.',
      'Easily assign complex keycodes including Hold,Tap, and more.',
      'Apply one of your saved key mappings, on demand, anytime and easily.',
      'Simple UI for controlling Backlight and Underglow LED lighting.',
      'Intuitive customization according to the physical key layout.',
      'Connect your keyboard supporting the VIA feature to this PC.',
      'Get your own firmware by writing it from source code.',
      'Let\'s customize your keyboard to make it more user-friendly.',
    ],
  },
];

/**
 * Get a specific category by ID
 */
export function getCategoryById(
  id: PracticeCategoryId
): PracticeCategory | undefined {
  return PRACTICE_CATEGORIES.find((category) => category.id === id);
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): PracticeCategoryId[] {
  return PRACTICE_CATEGORIES.map((category) => category.id);
}

/**
 * Get default category (alphabet-mixed)
 */
export function getDefaultCategory(): PracticeCategory {
  return PRACTICE_CATEGORIES.find((cat) => cat.id === 'alphabet-lowercase-easy')!;
}
