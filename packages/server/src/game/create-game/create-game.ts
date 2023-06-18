import { Game, GameState } from '@cah/shared';

import { GeneratorPort } from '../../generator/generator.port';
import { CommandHandler } from '../../interfaces/command-handler';
import { GameRepository } from '../../persistence/repositories/game/game.repository';

type CreateGameCommand = {
  code?: string;
};

export class CreateGameHandler implements CommandHandler<CreateGameCommand> {
  constructor(private generator: GeneratorPort, private gameRepository: GameRepository) {}

  async execute(command: CreateGameCommand): Promise<void> {
    const game: Game = {
      id: this.generator.generateId(),
      code: command.code ?? this.generator.generateGameCode(),
      state: GameState.idle,
    };

    await this.gameRepository.save(game);
  }
}
