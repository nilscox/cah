export type AppState = {
  network: NetworkStatus;
  server: NetworkStatus;
  ready: boolean;
  notification?: string;
};

export enum NetworkStatus {
  up = 'up',
  down = 'down',
}
