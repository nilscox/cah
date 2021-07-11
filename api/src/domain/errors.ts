import { CustomError } from 'ts-custom-error';

import { GameState } from './enums/GameState';
import { PlayState } from './enums/PlayState';
import { Player } from './models/Player';

class DomainError extends CustomError {}

export class GameNotFoundError extends DomainError {}

export class PlayerNotFoundError extends DomainError {}

export class InvalidGameStateError extends DomainError {
  constructor(public readonly expected: GameState, public readonly actual: GameState) {
    super(`Invalid game state: expected the game state to be ${expected}, but it is ${actual}`);
  }
}

export class InvalidPlayStateError extends DomainError {
  constructor(public readonly expected: PlayState, public readonly actual: PlayState) {
    super(`Invalid play state: expected the play state to be ${expected}, but it is ${actual}`);
  }
}

export class NotEnoughPlayersError extends DomainError {
  constructor(public readonly minimumNumberOfPlayers: number, public readonly actualNumberOfPlayers: number) {
    super(`Not enough players to start the game: ${minimumNumberOfPlayers} players are required`);
  }
}

export class InvalidChoicesSelectionError extends DomainError {
  constructor(public readonly player: Player, public readonly choicesIds: string[]) {
    super('Invalid choices selection: player does not own some of the choices');
  }
}

export class InvalidNumberOfChoicesError extends DomainError {
  constructor(public readonly expected: number, public readonly actual: number) {
    super(`Invalid number of choices: expected ${expected}, got ${actual}`);
  }
}

export class PlayerIsQuestionMasterError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player is the question master');
  }
}

export class PlayerAlreadyAnsweredError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player has already answered');
  }
}

export class NoMoreChoiceError extends DomainError {
  constructor() {
    super('No more choices');
  }
}
