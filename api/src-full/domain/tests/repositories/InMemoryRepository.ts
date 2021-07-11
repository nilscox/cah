export abstract class InMemoryRepository<T extends { id: number }> {
  protected items = new Map<number, T>();

  get() {
    return [...this.items.values()];
  }

  set(items: T[]) {
    items.forEach(this.save.bind(this));
  }

  async findOne(id: number): Promise<T | undefined> {
    return this.items.get(id);
  }

  async save(item: T): Promise<void> {
    this.items.set(item.id, item);
  }
}
