import { EventDto } from '../../../../shared/events';

export type RTCMessage = EventDto;

export type RTCListener = (message: RTCMessage) => void;

export interface RTCGateway {
  connect(): Promise<void>;
  onMessage(listener: RTCListener): void;
}
