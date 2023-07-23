export interface RandomPort {
  randomize<T>(array: T[]): T[];
  randomItem<T>(array: T[]): T;
  randomString(length: number): string;
}
