/**
 * Typing Practice Text Categories and Preset Sentences
 *
 * This module defines various categories of practice texts for typing practice.
 * Each category contains 10 sentences designed to help users practice specific
 * character types or coding patterns.
 */

export type PracticeCategoryId =
  | 'alphabet-lowercase'
  | 'alphabet-uppercase'
  | 'alphabet-mixed'
  | 'numbers'
  | 'symbols-basic'
  | 'symbols-programming'
  | 'programming-js'
  | 'programming-python';

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
    id: 'alphabet-lowercase',
    name: 'Alphabet (Lowercase)',
    description: 'Practice lowercase letters only',
    sentences: [
      'the quick brown fox jumps over the lazy dog',
      'pack my box with five dozen liquor jugs',
      'how vexingly quick daft zebras jump',
      'sphinx of black quartz judge my vow',
      'waltz bad nymph for quick jigs vex',
      'glib jocks quiz nymph to vex dwarf',
      'bright vixens jump dozy fowl quack',
      'quick wafting zephyrs vex bold jim',
      'quick zephyrs blow vexing daft jim',
      'two driven jocks help fax my big quiz',
    ],
  },
  {
    id: 'alphabet-uppercase',
    name: 'Alphabet (Uppercase)',
    description: 'Practice uppercase letters only',
    sentences: [
      'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
      'PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS',
      'HOW VEXINGLY QUICK DAFT ZEBRAS JUMP',
      'SPHINX OF BLACK QUARTZ JUDGE MY VOW',
      'WALTZ BAD NYMPH FOR QUICK JIGS VEX',
      'GLIB JOCKS QUIZ NYMPH TO VEX DWARF',
      'BRIGHT VIXENS JUMP DOZY FOWL QUACK',
      'QUICK WAFTING ZEPHYRS VEX BOLD JIM',
      'QUICK ZEPHYRS BLOW VEXING DAFT JIM',
      'TWO DRIVEN JOCKS HELP FAX MY BIG QUIZ',
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
    id: 'symbols-basic',
    name: 'Symbols (Basic)',
    description: 'Practice common symbols and punctuation',
    sentences: [
      'Hello, World! How are you?',
      "I can't wait to see you again!",
      'The price is $19.99 (plus tax).',
      'She said, "That\'s amazing!"',
      'Email me at user@example.com today.',
      'The result is: 50% correct & 50% incorrect.',
      'A/B testing: Group A vs. Group B',
      'Use #hashtags and @mentions wisely!',
      'The ratio is 3:1, or approximately 75%.',
      'Check items: [x] Done, [ ] Pending',
    ],
  },
  {
    id: 'symbols-programming',
    name: 'Symbols (Programming)',
    description: 'Practice programming-specific symbols',
    sentences: [
      '{ } [ ] ( ) < >',
      'array[0] = { key: value };',
      'if (x > 0 && y < 10) { return true; }',
      'const arr = [1, 2, 3, 4, 5];',
      'function add(a, b) { return a + b; }',
      'let result = (x * y) / (a + b);',
      'obj?.prop ?? defaultValue',
      'arr.map(x => x * 2).filter(x => x > 5);',
      'const {name, age} = person;',
      "str.replace(/[0-9]/g, '*');",
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
  return PRACTICE_CATEGORIES.find((cat) => cat.id === 'alphabet-mixed')!;
}
