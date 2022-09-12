import { Current, KeymapItem } from './KeyboardModel';
import { OPTION_DEFAULT } from './KeyModel';

describe('KeymapItem', () => {
  describe('encoderId', () => {
    test('encoder exists - 1', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '0,0\n\n\n\n\n\n\n\n\ne0');
      expect(subject.encoderId).toEqual(0);
    });

    test('encoder exists - 2', () => {
      const current = new Current();
      const subject = new KeymapItem(
        current,
        '0,0\n0,6\n0,2\n0,8\n0.9\n1,1\n0,3\n0,5\n0,1\ne1\n0,7\n1,0'
      );
      expect(subject.encoderId).toEqual(1);
    });

    test('encoder not exists', () => {
      const current = new Current();
      const subject = new KeymapItem(current, '0,0');
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
        '0,0\n0,6\n0,2\n1,2\n0.9\n1,1\n0,3\n0,5\n0,1\ne1\n0,7\n1,0'
      );
      expect(subject.option).toEqual('1');
      expect(subject.choice).toEqual('2');
    });
  });
});
