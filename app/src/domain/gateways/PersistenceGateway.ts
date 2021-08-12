export interface PersistenceGateway {
  getItem<T>(key: string): T;
  setItem<T>(key: string, value: T): void;
}
