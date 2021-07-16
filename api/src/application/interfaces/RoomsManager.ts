import { Player } from '../../domain/models/Player';

export interface RoomsManager {
  join(room: string, player: Player): void;
  leave(room: string, player: Player): void;
}
