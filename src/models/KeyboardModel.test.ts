import { Current, KeymapItem } from './KeyboardModel';

describe('KeymapItem', () => {
  test('encoder exists', () => {
    const current = new Current();
    const subject = new KeymapItem(current, '0,0\n\n\n\n\n\n\n\n\ne0');
    expect(subject.encoderId).toEqual(0);
  });

  test('encoder exists', () => {
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
