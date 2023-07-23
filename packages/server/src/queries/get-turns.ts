import * as shared from '@cah/shared';
import { injectableClass } from 'ditox';

import { QueryHandler } from 'src/interfaces';
import { TurnRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export type GetTurnsQuery = {
  gameId: string;
};

export class GetTurnsHandler implements QueryHandler<GetTurnsQuery, shared.Turn[]> {
  static inject = injectableClass(this, TOKENS.repositories.turn);

  constructor(private readonly turnRepository: TurnRepository) {}

  async execute({ gameId }: GetTurnsQuery): Promise<shared.Turn[]> {
    return this.turnRepository.queryForGame(gameId);
  }
}
