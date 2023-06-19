import { Game as GameDto, Player as PlayerDto } from '@cah/shared';

import { Game, Player } from 'src/entities';

export const gameToDto = (game: Game): GameDto => {
  return game;
};

export const playerToDto = (player: Player): PlayerDto => {
  return player;
};
