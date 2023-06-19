export interface RtcPort {
  join(room: string, playerId: string): Promise<void>;
  leave(room: string, playerId: string): Promise<void>;
  send(to: string, message: unknown): Promise<void>;
}
