export interface RtcPort {
  join(gameId: string, playerId: string): Promise<void>;
  leave(gameId: string, playerId: string): Promise<void>;
  send(room: string, message: unknown): Promise<void>;
}
