import { MapSet } from './map-set';

describe('MapSet', () => {
  it('creates an empty map of sets', () => {
    const map = new MapSet<string, number>();

    expect(map.get('a')).toBeUndefined();
  });

  it('adds values to a map of sets', () => {
    const map = new MapSet<string, number>();

    map.set('a', 1);
    map.set('a', 2);

    expect(map.get('a')).toEqual(new Set([1, 2]));
  });

  it('sets a key', () => {
    const map = new MapSet<string, number>();

    map.set('a', 1);
    map.set('a', new Set([2]));

    expect(map.get('a')).toEqual(new Set([2]));
  });

  it('removes a value from a map of sets', () => {
    const map = new MapSet<string, number>();

    map.set('a', 1);
    map.set('a', 2);
    map.delete('a', 1);

    expect(map.get('a')).toEqual(new Set([2]));
  });

  it('removes the key when the last items is removed', () => {
    const map = new MapSet<string, number>();

    map.set('a', 1);
    map.delete('a', 1);

    expect(map.get('a')).toBeUndefined();
  });

  it('removes a key', () => {
    const map = new MapSet<string, number>();

    map.set('a', 1);
    map.set('a', 2);
    map.delete('a');

    expect(map.get('a')).toBeUndefined();
  });
});
