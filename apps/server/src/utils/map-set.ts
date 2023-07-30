export class MapSet<K, V> extends Map<K, Set<V>> {
  override set(key: K, value: V | Set<V>): this {
    if (value instanceof Set) {
      return super.set(key, value);
    }

    return this.add(key, value);
  }

  add(key: K, value: V): this {
    if (!this.has(key)) {
      this.set(key, new Set());
    }

    this.get(key)?.add(value);

    return this;
  }

  override delete(key: K, value?: V): boolean {
    if (value === undefined) {
      return super.delete(key);
    }

    return this.remove(key, value);
  }

  remove(key: K, value: V): boolean {
    const set = this.get(key);

    if (!set || !set.has(value)) {
      return false;
    }

    set.delete(value);

    if (set.size === 0) {
      this.delete(key);
    }

    return true;
  }
}
