import { RoomsManager } from '../../application/interfaces/RoomsManager';
import { Player } from '../../domain/models/Player';

export class StubRoomsManager implements RoomsManager {
  private rooms = new Map<string, Player[]>();

  private get(room: string) {
    return this.rooms.get(room) ?? [];
  }

  has(room: string, player: Player) {
    return this.get(room).some((p) => p.equals(player));
  }

  join(room: string, player: Player): void {
    this.rooms.set(room, [...this.get(room), player]);
  }

  leave(room: string, player: Player): void {
    this.rooms.set(room, [...this.get(room).filter((p) => !p.equals(player))]);
  }
}
