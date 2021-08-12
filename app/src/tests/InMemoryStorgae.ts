export class InMemoryStorage implements Storage {
  private map = new Map<string, string>();

  get length() {
    return this.map.size;
  }

  getItem = (key: string) => this.map.get(key) ?? null;
  setItem = (key: string, value: string) => this.map.set(key, value);
  removeItem = (key: string) => this.map.delete(key);
  clear = () => this.map.clear();
  key = () => null;
}
