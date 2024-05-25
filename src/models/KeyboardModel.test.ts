import KeyboardModel, { Current, KeymapItem } from './KeyboardModel';
import { OPTION_DEFAULT } from './KeyModel';

describe('KeyboardModel', () => {
  describe('keyModels', () => {
    test('default layout', () => {
      const subject = new KeyboardModel([
        [
          '0,0',
          { a: 7 },
          'e0',
          { a: 4 },
          '0,1\n\n\n\n\n\n\n\n\ne1',
          '0,2\n\n\n0,0\n\n\n\n\n\ne2',
          '\n\n\n0,1\n\n\n\n\n\ne3',
          '0,3',
        ],
      ]);
      const actual = subject.keyModels;
      expect(actual.length).toEqual(6);
      expect(actual[0].location).toEqual('0,0');
      expect(actual[0].pos).toEqual('0,0');
      expect(actual[0].optionLabel).toEqual('-,-');
      expect(actual[0].option).toEqual('-');
      expect(actual[0].optionChoice).toEqual('-');
      expect(actual[0].encoderId).toBeNull();
      expect(actual[0].x).toEqual(0);
      expect(actual[0].y).toEqual(0);
      expect(actual[1].location).toEqual('e0');
      expect(actual[1].pos).toEqual('');
      expect(actual[1].optionLabel).toEqual('-,-');
      expect(actual[1].option).toEqual('-');
      expect(actual[1].optionChoice).toEqual('-');
      expect(actual[1].encoderId).toEqual(0);
      expect(actual[1].x).toEqual(1);
      expect(actual[1].y).toEqual(0);
      expect(actual[2].location).toEqual('0,1\n\n\n\n\n\n\n\n\ne1');
      expect(actual[2].pos).toEqual('0,1');
      expect(actual[2].optionLabel).toEqual('-,-');
      expect(actual[2].option).toEqual('-');
      expect(actual[2].optionChoice).toEqual('-');
      expect(actual[2].encoderId).toEqual(1);
      expect(actual[2].x).toEqual(2);
      expect(actual[2].y).toEqual(0);
      expect(actual[3].location).toEqual('0,2\n\n\n0,0\n\n\n\n\n\ne2');
      expect(actual[3].pos).toEqual('0,2');
      expect(actual[3].optionLabel).toEqual('0,0');
      expect(actual[3].option).toEqual('0');
      expect(actual[3].optionChoice).toEqual('0');
      expect(actual[3].encoderId).toEqual(2);
      expect(actual[3].x).toEqual(3);
      expect(actual[3].y).toEqual(0);
      expect(actual[4].location).toEqual('\n\n\n0,1\n\n\n\n\n\ne3');
      expect(actual[4].pos).toEqual('');
      expect(actual[4].optionLabel).toEqual('0,1');
      expect(actual[4].option).toEqual('0');
      expect(actual[4].optionChoice).toEqual('1');
      expect(actual[4].encoderId).toEqual(3);
      expect(actual[4].x).toEqual(3);
      expect(actual[4].y).toEqual(0);
      expect(actual[5].location).toEqual('0,3');
      expect(actual[5].pos).toEqual('0,3');
      expect(actual[5].optionLabel).toEqual('-,-');
      expect(actual[5].option).toEqual('-');
      expect(actual[5].optionChoice).toEqual('-');
      expect(actual[5].encoderId).toBeNull();
      expect(actual[5].x).toEqual(5);
      expect(actual[5].y).toEqual(0);
    });
  });
});

describe('KeymapItem', () => {
  describe('encoderId', () => {
    test('encoder exists - 1', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '0,0\n\n\n\n\n\n\n\n\ne3');
      expect(subject.encoderId).toEqual(3);
    });

    test('encoder exists - 2', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '\n\n\n0,1\n\n\n\n\n\ne3');
      expect(subject.encoderId).toEqual(3);
    });

    test('encoder exists - 3', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '0,1\n\n\n0,2\n\n\n\n\n\ne3');
      expect(subject.encoderId).toEqual(3);
    });

    test('encoder exists - 4', () => {
      const current = new Current();
      current.a = 7;
      const subject = new KeymapItem(current, 'e3');
      expect(subject.encoderId).toEqual(3);
    });

    test('encoder exists - 5', () => {
      const current = new Current();
      current.a = 3;
      const subject = new KeymapItem(current, 'e3');
      expect(subject.encoderId).toEqual(3);
    });

    test('encoder not exists - 1', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '0,0');
      expect(subject.encoderId).toBeNull();
    });

    test('encoder not exists - 2', () => {
      const current = new Current();
      current.a = 4;
      const subject = new KeymapItem(current, 'e0');
      expect(subject.encoderId).toBeNull();
    });
  });

  describe('option and choice', () => {
    test('option not found - 1', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '0,0');
      expect(subject.option).toEqual(OPTION_DEFAULT);
      expect(subject.choice).toEqual(OPTION_DEFAULT);
    });

    test('option not found - 2', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '0,0\n\n\n\n\n\n\n\n\ne0');
      expect(subject.option).toEqual(OPTION_DEFAULT);
      expect(subject.choice).toEqual(OPTION_DEFAULT);
    });

    test('option found - 1', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '0,0\n\n\n1,2');
      expect(subject.option).toEqual('1');
      expect(subject.choice).toEqual('2');
    });

    test('option found - 2', () => {
      const current = new Current();
      const subject = new KeymapItem(
        current,
        '0,0\n0,6\n0,2\n1,2\n0.9\n1,1\n0,3\n0,5\n0,1\ne1\n0,7\n1,0',
      );
      expect(subject.option).toEqual('1');
      expect(subject.choice).toEqual('2');
    });
  });
});
