export interface RouterGateway {
  pathname: string;
  push(to: string): void;
}
