type PlayerConnected = {
  type: 'PlayerConnected';
  player: string;
};

type PlayerDisconnected = {
  type: 'PlayerDisconnected';
  player: string;
};

export type RTCMessage = PlayerConnected | PlayerDisconnected;

export type RTCListener = (message: RTCMessage) => void;

export interface RTCGateway {
  connect(): Promise<void>;
  onMessage(listener: RTCListener): void;
}
