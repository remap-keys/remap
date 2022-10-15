import { KeyOp } from '../gen/types/KeyboardDefinition';
import { getEncoderIdList } from './utils';

describe('getEncoderIdList', () => {
  test('no encoder', () => {
    const keymapDefinition: ((string | KeyOp)[] | { name: string })[] = [];
    const actual = getEncoderIdList(keymapDefinition);
    expect(actual.length).toEqual(0);
  });

  test('normal', () => {
    const keymapDefinition: ((string | KeyOp)[] | { name: string })[] = [
      [
        '0,0',
        { a: 7 },
        'e0',
        { a: 4 },
        '0,1\n\n\n\n\n\n\n\n\ne1',
        '0,2\n\n\n0,0\n\n\n\n\n\ne2',
        '\n\n\n0,1\n\n\n\n\n\ne4',
        '0,3',
      ],
    ];
    const actual = getEncoderIdList(keymapDefinition);
    expect(actual.length).toEqual(4);
    expect(actual[0]).toEqual(0);
    expect(actual[1]).toEqual(1);
    expect(actual[2]).toEqual(2);
    expect(actual[3]).toEqual(4);
  });
});
